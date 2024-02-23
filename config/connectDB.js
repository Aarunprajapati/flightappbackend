import mongoose from 'mongoose';

 const connectDB = async (MONGODBURL) => {
  try {
    const db_option= {
      dbname:"flightapp"
    }
    await mongoose.connect(MONGODBURL, db_option);
    console.log("Connecting database successfully")
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;