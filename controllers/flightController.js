import Flight from "../models/flightModel.js"

const flightController = {
   //  async displayData(req,res){
   //     try {
   //      const flights = await Flight.find();
   //      const sourceAirports = flights.map(flight => flight.displayData);
   //        await res.json({ sourceAirports });
   //     } catch (error) {
   //        res.status({error:"internal server error"})
   //     }
   //  },
   async displayData(req, res) {
      try {
          const flights = await Flight.find();
  
          // Initialize sets to store unique city names for source and destination
          const sourceCitiesSet = new Set();
          const destinationCitiesSet = new Set();
  
          // Initialize arrays to store unique source and destination airports
          const uniqueSourceAirports = [];
          const uniqueDestinationAirports = [];
  
          flights.forEach(flight => {
              const sourceCityName = flight.displayData.source.airport.cityName;
              const destinationCityName = flight.displayData.destination.airport.cityName;
  
              if (!sourceCitiesSet.has(sourceCityName)) {
                  sourceCitiesSet.add(sourceCityName);
                  uniqueSourceAirports.push(flight.displayData.source);
              }
  
              if (!destinationCitiesSet.has(destinationCityName)) {
                  destinationCitiesSet.add(destinationCityName);
                  uniqueDestinationAirports.push(flight.displayData.destination);
              }
          });
  
          await res.json({ source: uniqueSourceAirports, destination: uniqueDestinationAirports });
      } catch (error) {
          res.status(500).json({ error: "Internal server error" });
      }
  },
  
}
export default flightController