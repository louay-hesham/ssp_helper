#!/bin/bash
IFS='' # To preserve whitespaces

# Replace placeholders in template with lambda code
bylaws_info_reader_code=$(cat lambda/bylaws_info_reader.py)

while read line; do
  echo "${line//%BylawsInfoReaderPlaceholder%/"$bylaws_info_reader_code"}"
done < cloudformation/template.yml > template.yml

# Deploy CloudFormation Stack
aws cloudformation deploy --stack-name SSPHelper --template-file template.yml --capabilities CAPABILITY_NAMED_IAM

# Clean up
rm template.yml
