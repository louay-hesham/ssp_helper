#!/bin/bash
IFS='' # To preserve whitespaces

# Replace placeholders in template with lambda code
bylaws_info_reader_code=$(cat lambda/bylaws_info_reader.py)
bylaw_submitter_code=$(cat lambda/bylaw_submitter.py)

while read line; do
  echo "${line//%BylawsInfoReaderPlaceholder%/"$bylaws_info_reader_code"}"
done < cloudformation/template.yml > template.yml.temp

while read line; do
  echo "${line//%BylawUploaderPlaceholder%/"$bylaw_submitter_code"}"
done < template.yml.temp > template.yml

# Deploy CloudFormation Stack
aws cloudformation deploy --stack-name SSPHelper --template-file template.yml --capabilities CAPABILITY_NAMED_IAM

# Clean up
rm template.yml.temp
rm template.yml
