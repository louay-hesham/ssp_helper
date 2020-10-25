          import base64
          import boto3
          import tempfile
          import json
          import re
          import os

          from email.mime.multipart import MIMEMultipart
          from email.mime.text import MIMEText
          from email.mime.application import MIMEApplication
          from botocore.exceptions import ClientError


          def lambda_handler(event, context):
            bylaw_year = event['headers']['bylaw-year']
            bylaw_base64 = event['body'].partition(",")[2]
            bytes = decode_base64(bylaw_base64)
            tempdir = tempfile.mkdtemp()
            path = os.path.join(tempdir)
            file_path = path + '/' + bylaw_year + "_bylaw.pdf"
            bylaw_file = open(file_path, 'wb')
            bylaw_file.write(bytes)
            bylaw_file.close()

            print(send_email(bylaw_year, file_path))

            dynamodb = boto3.resource('dynamodb')
            table = dynamodb.Table('Bylaws')
            table.put_item(
              TableName='Bylaws',
              Item={
                'Year': bylaw_year,
                'Status': 'COMING_SOON'
              }
            )
            return {
                "statusCode": 200,
                "body": "{\"status\": \"SUCCESS\"}",
                "headers": {
                    "Access-Control-Allow-Origin": "http://louay-morsi.me"
                }
            }

          def decode_base64(data, altchars='+/'):
            data = re.sub(r'[^a-zA-Z0-9%s]+' % altchars, '', data)  # normalize
            missing_padding = len(data) % 4
            if missing_padding:
                data += '='* (4 - missing_padding)
            return base64.b64decode(data, altchars)

          def send_email(year, file_name):
              # The email body for recipients with non-HTML email clients.
              BODY_TEXT = "A new bylaw has been submitted for review. Please check attached file."
              # The HTML body of the email.
              BODY_HTML = """\
              <html>
              <head></head>
              <body>
              <h1>Please review</h1>
              <p>A new bylaw has been submitted for review. Please check attached file.</p>
              </body>
              </html>
              """
              CHARSET = "utf-8"
              client = boto3.client('ses')
              msg = MIMEMultipart('mixed')
              # Add subject, from and to lines.
              msg['Subject'] = "SSPHelper: " + year + " Bylaw has been submitted for review"
              msg['From'] = 'louay.hesham@gmail.com'
              msg['To'] = 'louay.hesham@gmail.com'
              msg_body = MIMEMultipart('alternative')
              textpart = MIMEText(BODY_TEXT.encode(CHARSET), 'plain', CHARSET)
              htmlpart = MIMEText(BODY_HTML.encode(CHARSET), 'html', CHARSET)
              # Add the text and HTML parts to the child container.
              msg_body.attach(textpart)
              msg_body.attach(htmlpart)
              # Define the attachment part and encode it using MIMEApplication.
              att = MIMEApplication(open(file_name, 'rb').read())
              att.add_header('Content-Disposition','attachment',filename=year + "_bylaw.pdf")
              if os.path.exists(file_name):
                  print("File exists")
              else:
                  print("File does not exists")
              # Attach the multipart/alternative child container to the multipart/mixed
              # parent container.
              msg.attach(msg_body)
              # Add the attachment to the parent container.
              msg.attach(att)
              try:
                  #Provide the contents of the email.
                  response = client.send_raw_email(
                      Source=msg['From'],
                      Destinations=[
                          msg['To']
                      ],
                      RawMessage={
                          'Data':msg.as_string(),
                      }
                  )
              # Display an error if something goes wrong.
              except ClientError as e:
                  return(e.response['Error']['Message'])
              else:
                  return("Email sent! Message ID:", response['MessageId'])
