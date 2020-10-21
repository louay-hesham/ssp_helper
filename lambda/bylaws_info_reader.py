          import boto3
          def lambda_handler(event, context):
            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('Bylaws')
            ddb_scan_response = table.scan()
            bylaws = ddb_scan_response['Items']
            return bylaws
