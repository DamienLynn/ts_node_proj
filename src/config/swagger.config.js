const path = require('path');
const URLS = {
    Local: 'http//localhost:8000',
    Development: 'http://xApi4dev.tunyat.com',
}
const env = process.env.NODE_ENV;
const serverUrl = env == 'production' ? URLS.Production : 
    env == 'development' ? URLS.Development : 
    env == 'staging' ? URLS.Staging : 
    URLS.Local;

const version1 = Object.freeze({
    definition: {
        openapi: '3.0.0', 
        info: {
            title: 'X-API',
            version: '1.0.0',
            description: 'X-API doc'
        },
        servers: [
            {
                url: `${serverUrl}/v1`,
                variables: {
                    "basePath": {
                        default: "/v1"
                    }
                }
            }
        ]
    },
    // apis: [path.resolve(__dirname, '../controllers/*.ts')+'/*.ts']
    apis: [path.resolve(__dirname, '../controllers/*.ts')]
});

module.exports = {
    v1: version1
}