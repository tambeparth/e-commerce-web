// MongoDB Atlas Connection Test
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('🔄 Testing MongoDB Atlas connection...');
        
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri || mongoUri.includes('yourpassword')) {
            console.log('❌ Please update your .env file with actual MongoDB Atlas connection string');
            console.log('📋 Steps:');
            console.log('1. Go to MongoDB Atlas');
            console.log('2. Get your connection string');
            console.log('3. Replace MONGODB_URI in .env file');
            return;
        }
        
        await mongoose.connect(mongoUri);
        console.log('✅ Successfully connected to MongoDB Atlas!');
        console.log('🎉 Your database is ready for automatic connections');
        
        // Test creating a simple document
        const testSchema = new mongoose.Schema({ test: String });
        const TestModel = mongoose.model('Test', testSchema);
        
        await TestModel.create({ test: 'Connection successful' });
        console.log('✅ Database write test successful');
        
        await TestModel.deleteMany({ test: 'Connection successful' });
        console.log('✅ Database cleanup successful');
        
        mongoose.connection.close();
        console.log('🔒 Connection closed');
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('💡 Check your connection string and network access settings');
    }
};

testConnection();
