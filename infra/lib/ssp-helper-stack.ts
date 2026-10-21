import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as ses from 'aws-cdk-lib/aws-ses';
import { Construct } from 'constructs';

const SITE_BUCKET = 'louay-morsi.me';
const SITE_PREFIX = 'ssp_helper';
const SENDER_EMAIL = 'louay.hesham@gmail.com';
const SITE_ORIGIN = 'https://louay-morsi.me';
const ALLOWED_HEADERS = [
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Credentials',
  'Access-Control-Allow-Headers',
  'Access-Control-Allow-Methods',
  'Content-Type',
  'Bylaw-Year',
].join(',');

/**
 * Converts the SAM-built `SSPHelper` stack to CDK. Logical IDs of the
 * resources that already exist are pinned so CloudFormation updates them in
 * place; the table is retained so it can never be deleted or replaced away.
 *
 * The Lambda log groups and the SES sender identity existed before CDK and were
 * adopted with `cdk import`; they are retained on delete.
 *
 * Run `ng build` first: the front-end deployment reads ../dist.
 */
export class SspHelperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'BylawsTable', {
      tableName: 'Bylaws',
      partitionKey: { name: 'Year', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 1,
      writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });
    pinLogicalId(table, 'BylawsTable');

    const lambdaRole = new iam.Role(this, 'LambdaRole', {
      roleName: 'LambdaRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSESFullAccess'),
      ],
      inlinePolicies: {
        lambda: new iam.PolicyDocument({
          statements: [new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['logs:CreateLogGroup', 'logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: ['BylawsInfoReaderLambda', 'BylawUploaderLambda'].map(name =>
              this.formatArn({
                service: 'logs',
                resource: 'log-group',
                resourceName: `/aws/lambda/${name}:*`,
                arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
              })),
          })],
        }),
      },
    });
    pinLogicalId(lambdaRole, 'LambdaRole');

    const readerFn = this.pythonFunction('BylawsInfoReaderLambda', 'bylaws_info_reader', lambdaRole, 3);
    const uploaderFn = this.pythonFunction('BylawUploaderLambda', 'bylaw_submitter', lambdaRole, 30);

    const api = new apigateway.SpecRestApi(this, 'SspHelperApi', {
      restApiName: 'SspHelperApi',
      cloudWatchRole: false,
      deployOptions: { stageName: 'prod' },
      apiDefinition: apigateway.ApiDefinition.fromInline({
        swagger: '2.0',
        info: { version: '1.0', title: cdk.Aws.STACK_NAME },
        paths: {
          '/SubmitBylaw': this.path(uploaderFn),
          '/GetBylaws': this.path(readerFn),
        },
      }),
    });
    pinLogicalId(api, 'SspHelperApi');
    pinLogicalId(api.deploymentStage, 'SspHelperApiprodStage');

    for (const [fn, route] of [[readerFn, 'GetBylaws'], [uploaderFn, 'SubmitBylaw']] as const) {
      fn.addPermission(`${route}ApiInvoke`, {
        principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
        sourceArn: this.formatArn({
          service: 'execute-api',
          resource: api.restApiId,
          resourceName: `*/*/${route}`,
          arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
        }),
      });
    }

    // The front-end lives in the personal site's bucket (owned by the
    // PersonalWebsite stack). Pruning is confined to the ssp_helper/ prefix, so
    // nothing outside it can ever be deleted.
    new s3deploy.BucketDeployment(this, 'DeploySite', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../dist'))],
      destinationBucket: s3.Bucket.fromBucketName(this, 'SiteBucket', SITE_BUCKET),
      destinationKeyPrefix: SITE_PREFIX,
      prune: true,
      // The distribution lives in the PersonalWebsite stack.
      distribution: cloudfront.Distribution.fromDistributionAttributes(this, 'SiteDistribution', {
        distributionId: cdk.Fn.importValue('PersonalWebsiteDistributionId'),
        domainName: cdk.Fn.importValue('PersonalWebsiteDistributionDomain'),
      }),
      distributionPaths: [`/${SITE_PREFIX}/*`],
    });

    this.adoptedResources();
  }

  private pythonFunction(name: string, dir: string, role: iam.IRole, timeoutSeconds: number): lambda.Function {
    const fn = new lambda.Function(this, name, {
      functionName: name,
      runtime: lambda.Runtime.PYTHON_3_14,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda', dir), { exclude: ['__pycache__', '*.pyc'] }),
      role,
      timeout: cdk.Duration.seconds(timeoutSeconds),
      memorySize: 128,
      environment: { ALLOWED_ORIGIN: SITE_ORIGIN },
    });
    pinLogicalId(fn, name);
    return fn;
  }

  /** One API path: a CORS preflight mock plus a Lambda proxy for every method. */
  private path(fn: lambda.IFunction): Record<string, unknown> {
    return {
      options: {
        summary: 'CORS support',
        consumes: ['application/json'],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Default response for CORS method',
            headers: {
              'Access-Control-Allow-Origin': { type: 'string' },
              'Access-Control-Allow-Headers': { type: 'string' },
              'Access-Control-Allow-Methods': { type: 'string' },
            },
          },
        },
        'x-amazon-apigateway-integration': {
          type: 'mock',
          requestTemplates: { 'application/json': '{\n  "statusCode" : 200\n}\n' },
          responses: {
            default: {
              statusCode: '200',
              responseTemplates: { 'application/json': '{}\n' },
              responseParameters: {
                'method.response.header.Access-Control-Allow-Origin': `'${SITE_ORIGIN}'`,
                'method.response.header.Access-Control-Allow-Methods': "'*'",
                'method.response.header.Access-Control-Allow-Headers': `'${ALLOWED_HEADERS}'`,
              },
            },
          },
        },
      },
      'x-amazon-apigateway-any-method': {
        responses: {},
        'x-amazon-apigateway-integration': {
          type: 'aws_proxy',
          httpMethod: 'POST',
          uri: cdk.Fn.sub(
            'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${FnArn}/invocations',
            { FnArn: fn.functionArn },
          ),
        },
      },
    };
  }

  private adoptedResources() {
    for (const name of ['BylawsInfoReaderLambda', 'BylawUploaderLambda']) {
      const logGroup = new logs.CfnLogGroup(this, `${name}Logs`, { logGroupName: `/aws/lambda/${name}` });
      logGroup.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
    }
    const sender = new ses.CfnEmailIdentity(this, 'SenderIdentity', { emailIdentity: SENDER_EMAIL });
    sender.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
  }
}

function pinLogicalId(construct: Construct, logicalId: string) {
  (construct.node.defaultChild as cdk.CfnResource).overrideLogicalId(logicalId);
}
