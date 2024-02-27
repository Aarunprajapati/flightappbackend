import Flight from "../models/flightModel.js"

const flightController = {
    async cityAirportsTo(req,res){
       try {
        const flights = await Flight.find();
        const sourceAirports = flights.map(flight => flight.displayData.source.airport);
          await res.json({ sourceAirports });
       } catch (error) {
          res.status({error:"internal server error"})
       }
    },

    async cityAirportsFrom(req,res){
        try {
            const flights = await Flight.find();
            const sourceAirports = flights.map(flight => flight.displayData.destination.airport);
              await res.json({ sourceAirports });
           } catch (error) {
              res.status({error:"internal server error"})
           }
    }
}
export default flightController