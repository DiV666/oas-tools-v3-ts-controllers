import http from 'http';
import express from 'express';
const oasTools = require("@oas-tools/core");

const api = express();
api.use(express.json());
api.use(
    express.urlencoded({
        extended: true
    })
);

const oasConfig = {
    oasFile: `${__dirname}/swagger-v3.yaml`,
    middleware: {
        swagger: {
            path: '/tools/swagger-ui',
        }, 
        router: {
            controllers: `${__dirname}/src/controllers`
        }
    }
}
oasTools.initialize(api, oasConfig).then(() => {
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
}).catch((ex: any) => {
    throw ex;
});