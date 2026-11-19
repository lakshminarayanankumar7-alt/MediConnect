import mongoose from 'mongoose';

/**
 * Connect to MongoDB database securely using Mongoose
 * Validates environment variables and prevents credential leakage
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = '[MongoDB Error] MONGODB_URI environment variable is not defined in backend/.env';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'mediconnect',
    });

    console.log(
      `[MongoDB] Database connected successfully: "${conn.connection.name}" (Host: ${conn.connection.host})`
    );
    return conn;
  } catch (error) {
    // Sanitized error logging - never log URI or sensitive strings
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;
