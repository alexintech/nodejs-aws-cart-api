import { Function, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Cors } from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import path from 'path';

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartService = new Function(this, 'cartService', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(path.join(__dirname, '../../../dist')),
      handler: 'main.handler',
    });

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
