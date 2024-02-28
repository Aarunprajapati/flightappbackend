import Flight from "../models/flightModel.js"

const flightController = {
    async displayData(req,res){
       try {
        const flights = await Flight.find();
        const sourceAirports = flights.map(flight => flight.displayData);
          await res.json({ sourceAirports });
       } catch (error) {
          res.status({error:"internal server error"})
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
  }
  
}
export default flightController