import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    username: 'default',
    password: process.env.REDIS_DB_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
    }
});

client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
        await client.connect();

        // Test connection
        await client.set('foo', 'bar');
        const result = await client.get('foo');
        console.log('Redis connected, test key (foo):', result);
    } catch (error) {
        console.error('Redis Connection Failed:', error);
    }
};

export { client, connectRedis };
