// helm-deployment.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as eks from "aws-cdk-lib/aws-eks";

export class HelmDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: { cluster: eks.Cluster }) {
    super(scope, id);

    const helmChart = props.cluster.addHelmChart("ALBController", {
      chart: "aws-load-balancer-controller",
      repository: "https://aws.github.io/eks-charts",
      namespace: "kube-system",
      values: {
        clusterName: props.cluster.clusterName,
      },
    });
  }
}
