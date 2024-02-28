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
}
export default flightController