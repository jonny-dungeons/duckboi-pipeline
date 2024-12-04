# Welcome to Duckboi's CDK Pipeline Code

This repository is an exact represention of the duckboi project structure without any application code.

* Each root directory - backend, frontend, websocket - contains the Dockerfile.

* The infra directory contains the kubernetes configuration - this may need to be updated cuz I have not touched it in months - IE: the infra/mongo directory may not be necessary because I am using mongo Atlas which is a SaaS product

* The pipeline directory contains all the CDK pipeline

* A coompose.dev.yml lives in the root and serves to run my application - a redis container is living in this file and spins up - this redis may need to be it's own directory like the frontend, backend and websocket 

* Here is an example of the Duckboi site structure

* Folders are expanded
![image](https://github.com/user-attachments/assets/c9114f66-0674-4ec8-a7a9-89151030504c)

* Folders are collapsed
![image](https://github.com/user-attachments/assets/910323b1-c281-4097-bc75-c44492dc0107)


This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

