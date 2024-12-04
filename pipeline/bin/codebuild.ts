import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecr from "aws-cdk-lib/aws-ecr";

export class CodeBuildStack extends cdk.Stack {
  project: codebuild.IProject;
  constructor(
    scope: Construct,
    id: string,
    props: { ecrRepos: ecr.Repository[] },
    stackProps?: cdk.StackProps
  ) {
    super(scope, id, stackProps);

    const githubSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "GitHubSecret",
      "github-token"
    );

    const project = new codebuild.Project(this, "CodeBuildProject", {
      source: codebuild.Source.gitHub({
        owner: "jonny-dungeons",
        repo: "duckboi",
        webhook: true,
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true, // Required for Docker builds
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: [
              "aws --version",
              "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URL",
              "npm install", // Assuming dependencies
            ],
          },
          build: {
            commands: [
              "docker build -t $ECR_REPO_URL/frontend .", // React Frontend
              "docker build -t $ECR_REPO_URL/backend .", // Express API
              "docker build -t $ECR_REPO_URL/websocket .", // WebSocket API
              "docker build -t $ECR_REPO_URL/redis .", // Redis
            ],
          },
          post_build: {
            commands: [
              "docker push $ECR_REPO_URL/frontend",
              "docker push $ECR_REPO_URL/backend",
              "docker push $ECR_REPO_URL/websocket",
              "docker push $ECR_REPO_URL/redis",
            ],
          },
        },
      }),
    });
  }
}
