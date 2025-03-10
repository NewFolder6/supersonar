const routes = require('./routes');
const fastify = require('fastify');

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.'});
        const serverAddress = fastify.server.address();
        console.log(`Server listening on ${serverAddress.port}`);

        


    } catch (err){
        console.error(err);
    }
}