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
// routes.get('/stopsdata', flightController.stopsData)
export default routes;      