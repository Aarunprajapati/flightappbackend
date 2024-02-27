
import mongoose from 'mongoose';
import { Data } from './data.js';
import Flight from './models/flightModel.js';


async function seedDatabase() {
        try {     
            await mongoose.connect('mongodb+srv://rohitkumar302013:Z7krrvAra57eSt0w@cluster0.irch0q5.mongodb.net/flightApp?retryWrites=true&w=majority&appName=Cluster0');
            console.log('Connected to MongoDB');
            const existingDataCount = await Flight.countDocuments();
    if (existingDataCount === 0) {
        const apiData = Data; 
        await Flight.insertMany(apiData);
        console.log('Data inserted successfully');
    } else {
        console.log('Data already exists in the Flight collection. Skipping insertion.');
    }
        } catch (error) {
            console.error('Error seeding database:', error);
    }
}

seedDatabase();
