import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dbUSer:hcbq6WVC7yXit6eJ@cluster0.vhdgyan.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      dbName: "YAxis-Overseas",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;