import express from 'express';
import userController from "../controllers/userController.js";
import flightController from '../controllers/flightController.js';
const routes = express.Router();



// public routes
routes.post('/register', userController.register)
routes.post('/login', userController.login);
routes.get('/tocity', flightController.cityAirportsTo)
routes.get('/fromcity', flightController.cityAirportsFrom)


export default routes;      