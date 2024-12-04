// eks-cluster.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class EKSClusterStack extends cdk.Stack {
  public readonly cluster: eks.Cluster;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "VPC", { maxAzs: 3 });

    this.cluster = new eks.Cluster(this, "EKSCluster", {
      vpc,
      defaultCapacity: 2, // Number of nodes
      version: eks.KubernetesVersion.V1_21,
    });
  }
}
