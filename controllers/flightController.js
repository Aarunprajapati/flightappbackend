import Flight from "../models/flightModel.js"

const flightController = {
   
   async displayData(req, res) {
      try {
          const flights = await Flight.find();
          const sourceCitiesSet = new Set();
          const destinationCitiesSet = new Set();
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

  async sourceData(req, res) {
    try {
        const flights = await Flight.find();
        const sourceCitiesSet = new Set(); 
        flights.forEach(flight => {
            sourceCitiesSet.add(flight.displayData.source.airport.cityName);
        });

        const sourceAirports = Array.from(sourceCitiesSet);

        await res.json({ sourceAirports });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
  },

    async destinationData(req, res) {
      try {
          const flights = await Flight.find();
          const sourceCitiesSet1 = new Set(); 
          flights.forEach(flight => {
            sourceCitiesSet1.add(flight.displayData.destination.airport.cityName);
          });
          const sourceAirports1 = Array.from(sourceCitiesSet1);
          await res.json({ sourceAirports1 });
      } catch (error) {
          res.status(500).json({ error: "Internal server error" });
      }
  },
  
  async allFlightData(req, res) {
    try {
        const flight = await Flight.find();
        await res.json({flight})
    } catch (error) {
        res.status(500).json({error:"something went wrong"})
    }
  },
 
  
}
export default flightController