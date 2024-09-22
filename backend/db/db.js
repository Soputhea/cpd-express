require('dotenv').config()
const mongoose = require('mongoose')

// Get MongoDB connection details from environment variables
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDbName = process.env.MONGO_DB_NAME || 'cpd-db';

// Construct the MongoDB URI
const mongoUri = `mongodb://${mongoHost}:${mongoPort}/${mongoDbName}`;

async function dbConnect() {
    // mongoose.connection.on('connected', () => {
    //     console.log("Connected")
    // })
    // await mongoose.connect(uri,{
    //     dbName: dbName
    // })
    await mongoose.connect(mongoUri, {})
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.error('Error connecting to MongoDB:', error));
}

module.exports = dbConnect