import mongoose from "mongoose"
import dns from 'dns';

// Only apply DNS workarounds in local environment to avoid breaking Vercel DNS
if (!process.env.VERCEL) {
    try {
        dns.setDefaultResultOrder('ipv4first');
        if (process.env.IP_ADDRESS_ONE && process.env.IP_ADDRESS_TWO) {
            dns.setServers([process.env.IP_ADDRESS_ONE, process.env.IP_ADDRESS_TWO]);
        }
    } catch (e) {
        console.warn('Could not set custom DNS servers', e.message);
    }
}

// Track connection state for serverless environments
let isConnected = false;

export const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully!!!');
    } catch (error) {
        console.log("Error connecting to the Database!", error.message)
        process.exit(1);
    }
}

