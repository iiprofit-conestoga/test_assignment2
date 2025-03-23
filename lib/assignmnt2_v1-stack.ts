import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class Assignmnt2V1Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 Bucket
    const myBucket = new s3.Bucket(this, 'ksolanki6269-MyFirstBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Only for dev/test environments
    });

    // Create a Lambda Function
    const myLambda = new lambda.Function(this, 'ksolanki6269-MyLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          console.log('Lambda invoked!');
          return { statusCode: 200, body: 'Hey, This is new message from iiprofit (ksolanki6269).' };
        }
      `),
      environment: {
        BUCKET_NAME: myBucket.bucketName,
      },
    });

    // Grant Lambda permissions to read/write to the S3 bucket
    myBucket.grantReadWrite(myLambda);

    // Create a DynamoDB Table
    const myTable = new dynamodb.Table(this, 'ksolanki6269-MyTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'ksolanki6269-MyTable',
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Only for dev/test environments
    });

    // Grant Lambda permissions to access DynamoDB
    myTable.grantReadWriteData(myLambda);
  }
}