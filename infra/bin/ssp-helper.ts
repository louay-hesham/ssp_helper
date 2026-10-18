import * as cdk from 'aws-cdk-lib';
import { SspHelperStack } from '../lib/ssp-helper-stack';

const app = new cdk.App();

// The stack name matches the CloudFormation stack that already exists, so the
// first deploy converts it in place instead of creating a second one.
new SspHelperStack(app, 'SSPHelper', {
  env: { account: '795547477565', region: 'eu-west-1' },
});
