#!/bin/bash
# pushd lambdas

# zip bylaws_info_reader.zip bylaws_info_reader.py

aws cloudformation deploy --stack-name SSPHelper --template-file cloudformation/template.yml --capabilities CAPABILITY_NAMED_IAM


# rm bylaws_info_reader.zip
