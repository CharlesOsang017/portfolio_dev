import mongoose from 'mongoose';

// Only apply DNS workarounds in local (non-Vercel) environments
if (!process.env.VERCEL) {
    try {
        const { default: dns } = await import('dns');
        dns.setDefaultResultOrder('ipv4first');
    } catch (e) {
        console.warn('Could not configure DNS:', e.message);
    }
}

// Cached connection for serverless — avoids reconnecting on every cold start
let cachedConnection = null;

export const connectToDb = async () => {
    // If already connected, reuse the existing connection
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Reusing existing DB connection.');
        return cachedConnection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI environment variable is not set.');
    }

    try {
        cachedConnection = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // fail fast on Vercel cold starts
            socketTimeoutMS: 45000,
        });
        console.log('Database connected successfully!');
        return cachedConnection;
    } catch (error) {
        console.error('Error connecting to the Database:', error.message);
        throw error; // let the caller handle it (don't call process.exit in serverless)
    }
};
