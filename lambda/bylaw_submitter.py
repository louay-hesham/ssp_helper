          import boto3
          import json
          def lambda_handler(event, context):
            print(event)
            print(context)
            return {
                "statusCode": 200,
                "body": "{\"status\": \"SUCCESS\"}",
                "headers": {
                    "Access-Control-Allow-Origin": "http://louay-morsi.me"
                }
            }
