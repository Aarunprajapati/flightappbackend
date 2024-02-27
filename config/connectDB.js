import mongoose from 'mongoose';

 const connectDB = async (MONGODBURL) => {
  try {
    
    await mongoose.connect(MONGODBURL);
    console.log("Connecting database successfully")
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;