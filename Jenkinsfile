pipeline {
  agent any
  triggers {
    pollSCM('* * * * *') // or rely on webook (preferred)
  }
  stages {
    stage('Build') {
      steps {
        echo "Building branch ${env.BRANCH_NAME}"
        //Add your build commands
      }
    }
  }
}
