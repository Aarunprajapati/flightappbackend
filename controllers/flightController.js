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
        const flight = await Flight.find()
        await res.json({flight})
    } catch (error) {
        res.status(500).json({error:"something went wrong"})
    }
},
async matchingData(req, res) {
    try {
        const { location, locationR, stopInfo, depTime } = req.query;

        if (!(location && locationR)) {
            return res.status(400).json({ error: "Please provide all the required details" });
        }

        let query = {
            "displayData.source.airport.cityName": location,
            "displayData.destination.airport.cityName": locationR,
        };

        if (stopInfo) {
            query["displayData.stopInfo"] = stopInfo;
        }

        // Assuming depTime is passed as 'morning' or 'evening'
        if (depTime) {
            // This part needs adjustment or an alternative approach
            // MongoDB does not support direct time string comparison in this way for date fields
        }

        const flights = await Flight.find(query);

        // Filtering based on depTime, if specified, needs to be done in memory
        // This is not efficient for large datasets
        let filteredFlights = flights;
        if (depTime) {
            const isMorning = depTime.toLowerCase() === "morning";
            filteredFlights = flights.filter(flight => {
                const hour = new Date(flight.displayData.source.depTime).getHours();
                return isMorning ? hour < 12 : hour >= 12;
            });
        }

        if (filteredFlights.length > 0) {
            return res.status(200).json(filteredFlights);
        } else {
            return res.status(404).json({ error: "No matching flights found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
},




  
}
export default flightController