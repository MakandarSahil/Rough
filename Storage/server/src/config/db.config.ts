import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const url = 'mongodb://root:1234@localhost:27017/testdb?authSource=admin&directConnection=true';
    await mongoose.connect(url);
    console.log('MongoDB Connected');
  } catch (e) {
    console.log('MongoDB Connection failed', e);
    process.exit(1);
  }
};