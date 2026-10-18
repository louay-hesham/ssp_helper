import base64

import boto3
from moto import mock_aws
from moto.core import DEFAULT_ACCOUNT_ID
from moto.ses import ses_backends

from test_bylaws_info_reader import create_table, load

PDF = base64.b64encode(b"%PDF-1.4 test").decode()


@mock_aws
def test_submitter_emails_the_pdf_and_records_coming_soon():
    boto3.client("ses").verify_email_identity(EmailAddress="louay.hesham@gmail.com")
    table = create_table()
    event = {
        "headers": {"bylaw-year": "2024"},
        "body": "data:application/pdf;base64," + PDF,
    }

    response = load("bylaw_submitter").lambda_handler(event, None)

    assert response["statusCode"] == 200
    assert response["body"] == '{"status": "SUCCESS"}'
    assert response["headers"]["Access-Control-Allow-Origin"] == "http://louay-morsi.me"
    assert table.get_item(Key={"Year": "2024"})["Item"]["Status"] == "COMING_SOON"

    sent = ses_backends[DEFAULT_ACCOUNT_ID]["eu-west-1"].sent_messages
    assert len(sent) == 1
    assert sent[0].source == "louay.hesham@gmail.com"
    assert "SSPHelper: 2024 Bylaw has been submitted for review" in sent[0].raw_data
    assert "2024_bylaw.pdf" in sent[0].raw_data
