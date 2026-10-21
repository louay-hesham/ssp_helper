import boto3
import json
import os

ALLOWED_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "https://louay-morsi.me")

def lambda_handler(event, context):
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table('Bylaws')
  ddb_scan_response = table.scan()
  bylaws = ddb_scan_response['Items']
  return {
      "statusCode": 200,
      "body": json.dumps(bylaws),
      "headers": {
          "Access-Control-Allow-Origin": ALLOWED_ORIGIN
      }
  }
