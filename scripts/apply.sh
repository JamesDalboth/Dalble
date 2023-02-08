#!/usr/bin/env bash

programname=$0
function usage {
    echo ""
    echo "Runs terraform apply for a deploy. Run in project root"
    echo ""
    echo "usage: $programname --version string"
    echo ""
    echo "  --version string     docker image version"
    echo "                          (example: 0.3.0, defaults: latest)"
    echo "  --approve flag  auto approve terraform apply"
    echo ""
}

while [ $# -gt 0 ]; do
    if [[ $1 == "--help" ]]; then
        usage
        exit 0
    elif [[ $1 == "--"* ]]; then
        v="${1/--/}"
        declare "$v"="$2"
        shift
    fi
    shift
done

if [[ $help ]]; then
  usage
  exit 0
fi

version=${version:-latest}

if [[ -z ${approve} ]]; then
  (
  cd infrastructure/aws/workspace_shared/1_service
  terraform init -reconfigure -backend-config=../../tfvars/production/us-east-1/service.tfbackend
  terraform apply -var-file=../../tfvars/production/us-east-1/terraform.tfvars -var deployment_version=$version
  )
else
  (
  cd infrastructure/aws/workspace_shared/1_service
  terraform init -reconfigure -backend-config=../../tfvars/production/us-east-1/service.tfbackend
  terraform apply --auto-approve -var-file=../../tfvars/production/us-east-1/terraform.tfvars -var deployment_version=$version
  )
fi


