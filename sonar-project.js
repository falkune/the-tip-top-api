const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'https://sonarqube.dsp-archiwebo21-ct-df-an-cd.fr/',
        token:"squ_8e56bbb33748be5aaaf3294c2d4a1c56afdebf04",
        options : {
            'sonar.sources':  './src',
            'sonar.tests':  'src',
            'sonar.inclusions':  'src/**/*.ts', // Entry point of your code
            'sonar.test.inclusions':'src/**/*.spec.ts,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
            'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml'
        }
    }, () => {});