import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const redisPassword = process.env.REDIS_DB_PASSWORD || undefined;
const redisConnectionUrl = process.env.REDIS_CONNECTION_URL;

const redisConfig = redisConnectionUrl
    ? { url: redisConnectionUrl }
    : {
        socket: {
            host: process.env.REDIS_URL || "redis",
            port: Number(process.env.REDIS_PORT || 6379),
            tls: process.env.REDIS_TLS === "true",
        },
    };

if (redisPassword) {
    redisConfig.username = process.env.REDIS_USERNAME || "default";
    redisConfig.password = redisPassword;
}

const client = createClient(redisConfig);

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
