node {
  try {
    def version = null;
    def tag = null;
    def gitCommit = null;
    def imageName = null;
    def app;
    // This displays colors using the 'xterm' ansi color map.
    stage ('Checkout') {
      slackSend(message: ":male_mage:  Starting build  ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)")
      checkout scm
      //sh 'env';
      def major = readFile('major_version.txt').trim()
      gitCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
      tag = "${env.BRANCH_NAME}.${major}.${env.BUILD_NUMBER}.${gitCommit}"
      version = "${major}.${env.BUILD_NUMBER}"
      sh "echo VERSION = \\'${version}\\' > client/src/version.js";
      sh "echo TAG = \\'${tag}\\' >> client/src/version.js";
      sh "echo BRANCH = \\'${env.BRANCH_NAME}\\' >> client/src/version.js";
      sh "echo GIT_COMMIT = \\'${gitCommit}\\' >> client/src/version.js";

      def version_in_file = readFile 'client/src/version.js'
      echo version_in_file
    }

    stage ('Build docker image') {
      imageName = "nexus.coti.io/repository/docker/testnet-wallet:${tag}"
      
      def host = null;
      if (env.BRANCH_NAME == "master"){
        host = "https://pay.coti.io";
        cryptoLibBranch = "master";
      } else if (env.BRANCH_NAME == "dev") {
        host = "https://pay.coti.io";
        cryptoLibBranch = "dev-yaniv";
      }
      else {
        host = "https://pay-dev.coti.io";
      }

      sh "cp /var/lib/jenkins/crypto-library.key ."

      app = docker.build(imageName, "--build-arg REACT_APP_HOST=${host} --build-arg CRYPTO_LIBRARY_BRANCH=${cryptoLibBranch} .")
      
    }
    stage ("Test"){
        slackSend(color: 'danger', message: "Test not yet implemented")
    }
    stage ('Push Docker image') {
      docker.withRegistry('https://nexus.coti.io', 'nexus') {
        app.push()
        app.push("latest-${env.BRANCH_NAME}")
      }
    }
    stage ('Deploy') {
      if (env.BRANCH_NAME == "master"){
        sh "~/scripts/upgrade_dev.sh "; 
        //we need to implement deploy process 222233466666
      }
      else if (env.BRANCH_NAME == "qa"){
        sh "~/scripts/upgrade_qa.sh ";
      }
      else  {
        sh "~/scripts/upgrade_dev.sh ";
      }
    }
    stage ('cleanup') {
      echo 'Cleanup:';
      sh "docker rmi -f ${imageName}";
    }

    stage('notify'){
      echo "sending notification to slack";
      slackSend( message: ":racing_motorcycle: build : ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)");
    }
  } catch (e) {
    slackSend(color: 'danger', message: ":dizzy_face: FAILED: ${env.JOB_NAME} [${env.BUILD_NUMBER}] (${env.BUILD_URL}console)")
    throw e
    //simple test if build works automatically
  }

}
