import http from 'http';
import express, { Express, Request, Response } from 'express';
const swaggerTools = require('oas-tools');
import YAML from 'yamljs';

const openapiDefinition = YAML.load(`./swagger-v2.yaml`);

const api = express();
api.use(express.json());
api.use(
    express.urlencoded({
        extended: true
    })
);

const options = {
    controllers: `${__dirname}/src/controllers/`,
    strict: true,
    validator: true,
    docs: {
        apiDocs: '/definition',
        apiDocsPrefix: '/tools',
        swaggerUi: '/swagger-ui',
        swaggerUiPrefix: '/tools'
    }
};
swaggerTools.configure(options);
swaggerTools.initialize(openapiDefinition, api, function (ex: any): void {
    if (ex) {
        throw ex;
    }

    const server = http.createServer(api);
    const port = '4008';
    server.listen(port, (): void => console.log(`Listening on port ${port}`));

    const gracefulExit = (): void => {
        console.log('Signal received ...');
        server.close((): void => {
            console.log('Server stopped ...');
            console.log('Exiting process ...');
            process.exit();
        });
    };

    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
});
