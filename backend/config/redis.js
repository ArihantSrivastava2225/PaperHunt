import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    username: 'default',
    password: '9ymMqfIa85i7mJgleTwgedkFsZUupLk3',
    socket: {
        host: 'redis-17490.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17490
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
