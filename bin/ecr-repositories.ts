// ecr-repositories.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecr from "aws-cdk-lib/aws-ecr";

export class ECRStack extends cdk.Stack {
  public readonly frontendRepo: ecr.Repository;
  public readonly backendRepo: ecr.Repository;
  public readonly websocketRepo: ecr.Repository;
  public readonly redisRepo: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.frontendRepo = new ecr.Repository(this, "frontendRepo");
    this.backendRepo = new ecr.Repository(this, "backendRepo");
    this.websocketRepo = new ecr.Repository(this, "websocketRepo");
    this.redisRepo = new ecr.Repository(this, "redisRepo");
  }
}
