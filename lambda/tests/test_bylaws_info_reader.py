import importlib.util
import json
import os

import boto3
from moto import mock_aws

HERE = os.path.dirname(__file__)


def load(name):
    spec = importlib.util.spec_from_file_location(
        name, os.path.join(HERE, "..", name, "index.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def create_table():
    dynamodb = boto3.resource("dynamodb")
    return dynamodb.create_table(
        TableName="Bylaws",
        KeySchema=[{"AttributeName": "Year", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "Year", "AttributeType": "S"}],
        BillingMode="PAY_PER_REQUEST",
    )


@mock_aws
def test_reader_returns_all_bylaws_with_cors_header():
    table = create_table()
    table.put_item(Item={"Year": "2019", "Status": "AVAILABLE"})
    table.put_item(Item={"Year": "2023", "Status": "COMING_SOON"})

    response = load("bylaws_info_reader").lambda_handler({}, None)

    assert response["statusCode"] == 200
    assert response["headers"]["Access-Control-Allow-Origin"] == "https://louay-morsi.me"
    items = sorted(json.loads(response["body"]), key=lambda item: item["Year"])
    assert items == [
        {"Year": "2019", "Status": "AVAILABLE"},
        {"Year": "2023", "Status": "COMING_SOON"},
    ]


@mock_aws
def test_reader_cors_origin_comes_from_environment(monkeypatch):
    create_table()
    monkeypatch.setenv("ALLOWED_ORIGIN", "https://example.test")

    response = load("bylaws_info_reader").lambda_handler({}, None)

    assert response["headers"]["Access-Control-Allow-Origin"] == "https://example.test"
