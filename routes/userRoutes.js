import express from 'express';
import userController from "../controllers/userController.js";
import flightController from '../controllers/flightController.js';
const routes = express.Router();



// public routes
routes.post('/register', userController.register)
routes.post('/login', userController.login);
routes.get('/displaydata', flightController.displayData)
routes.get('/sourcecity', flightController.sourceData)
routes.get('/destinationcity', flightController.destinationData)
routes.get("/allflight", flightController.allFlightData)
<<<<<<< HEAD
routes.get("/stopflights", flightController.stopfilter)
=======
// routes.get('/stopsdata', flightController.stopsData)
>>>>>>> 1cd32c8cc3120a9729dcb7913782dac3fae2e055
export default routes;      