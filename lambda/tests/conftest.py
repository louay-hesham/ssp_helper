import os
import sys

os.environ.setdefault("AWS_DEFAULT_REGION", "eu-west-1")
os.environ.setdefault("AWS_ACCESS_KEY_ID", "testing")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "testing")

HERE = os.path.dirname(__file__)
for name in ("bylaws_info_reader", "bylaw_submitter"):
    sys.path.insert(0, os.path.join(HERE, "..", name))
