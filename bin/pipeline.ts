// pipeline.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ecr from "aws-cdk-lib/aws-ecr";

import { EKSClusterStack } from "./eks-cluster";
import { ECRStack } from "./ecr-repositories";
import { CodeBuildStack } from "./codebuild";
import { HelmDeploymentStack } from "./helm-deployment";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create EKS cluster and ECR repositories
    const eksClusterStack = new EKSClusterStack(this, "EKSClusterStack");
    const ecrStack = new ECRStack(this, "ECRStack");

    // Define CodePipeline
    const pipeline = new codepipeline.Pipeline(this, "Pipeline", {
      pipelineName: "MyAppPipeline",
    });

    // Add Source Stage (GitHub)
    const sourceStage: any = pipeline.addStage({
      stageName: "Source",
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          actionName: "GitHub_Source",
          owner: "your-github-org",
          repo: "your-private-repo",
          branch: "main",
          oauthToken: cdk.SecretValue.secretsManager("GitHubToken"),
          output: new codepipeline.Artifact(),
        }),
      ],
    });

    // Add Build Stage
    const buildStage: any = pipeline.addStage({
      stageName: "Build",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "Docker_Build",
          project: new CodeBuildStack(this, "CodeBuildStack", {
            ecrRepos: [
              ecrStack.frontendRepo,
              ecrStack.backendRepo,
              ecrStack.websocketRepo,
              ecrStack.redisRepo,
            ],
          }).project,
          input: sourceStage.artifacts[0],
          outputs: [new codepipeline.Artifact()],
        }),
      ],
    });

    // Add Helm Chart Deployment Stage (Install Load Balancer Controller)
    const helmDeployStage: any = pipeline.addStage({
      stageName: "HelmDeploy",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "Helm_Deploy",
          project: new CodeBuildStack(this, "HelmDeployProject", {
            ecrRepos: [],
          }).project,
          input: buildStage.artifacts[0],
          environmentVariables: {
            EKS_CLUSTER_NAME: { value: eksClusterStack.cluster.clusterName },
          },
        }),
      ],
    });

    // Add Deployment Stage (Deploy to EKS)
    const deployStage = pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "Deploy_to_EKS",
          project: new CodeBuildStack(this, "DeployToEKSProject", {
            ecrRepos: [],
          }).project,
          input: helmDeployStage.artifacts[0],
        }),
      ],
    });
  }
}
