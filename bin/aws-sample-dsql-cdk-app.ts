#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsSampleDsqlCdkAppStack } from '../lib/aws-sample-dsql-cdk-app-stack';

const app = new cdk.App();
new AwsSampleDsqlCdkAppStack(app, 'AwsSampleDsqlCdkAppStack');
