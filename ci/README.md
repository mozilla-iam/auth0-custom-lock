# CodeBuild / CodePipeline Testing

```bash
git clone https://github.com/aws/aws-codebuild-docker-images.git
cd aws-codebuild-docker-images/ubuntu/node/8.11.0
docker build -t aws/codebuild/nodejs:8.11.0 .
docker pull amazon/aws-codebuild-local:latest --disable-content-trust=false
docker run -it -v /var/run/docker.sock:/var/run/docker.sock -e "IMAGE_NAME=aws/codebuild/node:8.11.0" -e "ARTIFACTS=/home/ec2-user/environment/artifacts" -e "SOURCE=." amazon/aws-codebuild-local
```
