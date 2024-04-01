import express from 'express';
import userController from "../controllers/userController.js";
import flightController from '../controllers/flightController.js';
import { VerifyJwt } from '../middleware/auth.middleware.js';
const routes = express.Router();



// public routes
routes.post('/register', userController.register)
routes.post('/login', userController.login);

//Secured routes
routes.post("/logout", VerifyJwt ,userController.logOut)

// flights routes
routes.get('/displaydata', flightController.displayData)
routes.get('/sourcecity', flightController.sourceData)
routes.get('/destinationcity', flightController.destinationData)
routes.get("/allflight", flightController.allFlightData)
routes.get("/matchingData", flightController.matchingData)
routes.get("/searchData", flightController.searchData)

export default routes;      