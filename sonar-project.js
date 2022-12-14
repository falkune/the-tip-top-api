const sonarqubeScanner =  require('sonarqube-scanner');
sonarqubeScanner(
    {
        serverUrl:  'https://sonarqube.dsp-archiwebo21-ct-df-an-cd.fr/',
        token:"squ_8e56bbb33748be5aaaf3294c2d4a1c56afdebf04",
        options : {
            'sonar.projectName': 'TheTipTop API',
            'sonar.projectDescription': 'API For TheTipTop',
            'sonar.sources':  './src',
            'sonar.tests':  'src',
            'sonar.inclusions':  '../**/*.ts', // Entry point of your code
            'sonar.test.inclusions':'../**/*.spec.ts,../**/*.spec.jsx,../**/*.test.js,../**/*.test.jsx',
            'sonar.typescript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml',
            'sonar.log.level': 'DEBUG',
            'sonar.verbose': 'true'
        }
    }, () => { }
    );