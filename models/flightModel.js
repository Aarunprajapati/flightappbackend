import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
  id: String,
  fare: Number,
  displayData: {
      source: {
          airport: {
              cityCode: String,
              cityName: String,
              terminal: String,
              airportCode: String,
              airportName: String,
              countryCode: String,
              countryName: String
          },
          depTime: Date
      },
      airlines: [{
          airlineCode: String,
          airlineName: String,
          flightNumber: String
      }],
      stopInfo: String,
      destination: {
          airport: {
              cityCode: String,
              cityName: String,
              terminal: String,
              airportCode: String,
              airportName: String,
              countryCode: String,
              countryName: String
          },
          arrTime: Date
      },
      totalDuration: String
  }
});

const Flight = mongoose.model('Flight', FlightSchema);

export default Flight
