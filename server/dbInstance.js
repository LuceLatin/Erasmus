import mongoose from 'mongoose';

let isConnected;
let bucket;

export const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return { connection: mongoose.connection, bucket };
    }

    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authMechanism: 'DEFAULT',
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            dbName: 'erazmus'
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        isConnected = conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);

       if (isConnected) {
            bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
                bucketName: "filesBucket",
            });
            console.log("GridFSBucket initialized");
        }

        return { connection: conn, bucket };

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
