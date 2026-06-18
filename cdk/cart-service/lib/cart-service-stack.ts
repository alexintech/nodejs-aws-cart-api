import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import { DatabaseInstance } from 'aws-cdk-lib/aws-rds';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { Duration } from 'aws-cdk-lib/core';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import path from 'path';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const securityGroupIds = [process.env.DATABASE_SECURITY_GROUP_ID!];
    const shopDb = DatabaseInstance.fromDatabaseInstanceAttributes(
      this,
      'ShopDatabase',
      {
        instanceIdentifier: process.env.DATABASE_NAME!,
        instanceEndpointAddress: process.env.DB_HOST!,
        instanceResourceId: process.env.DATABASE_RESOURCE_ID!,
        port: 5432,
        securityGroups: securityGroupIds.map((id) =>
          SecurityGroup.fromSecurityGroupId(this, `SecurityGroup-${id}`, id),
        ),
      },
    );

    const cartService = new Function(this, 'cartService', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(path.join(__dirname, '../../../dist')),
      handler: 'main.handler',
      timeout: Duration.seconds(30),
      environment: {
        DB_HOST: process.env.DB_HOST ?? '',
        DB_PORT: process.env.DB_PORT ?? '5432',
        DB_NAME: process.env.DB_NAME ?? 'postgres',
        DB_USER: process.env.DB_USER ?? 'postgres',
        DB_PASSWORD: process.env.DB_PASSWORD ?? '',
        DB_SSL: process.env.DB_SSL ?? 'true',
      },
    });

    shopDb.grantConnect(cartService, process.env.DB_USER!);

    const cartApi = new RestApi(this, 'cartApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    cartApi.root.addProxy({
      defaultIntegration: new LambdaIntegration(cartService),
    });
  }
}
