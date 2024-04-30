import express, { Router } from 'express';
import userController from "../controllers/userController.js";
import flightController from '../controllers/flightController.js';
import { VerifyJwt } from '../middleware/auth.middleware.js';
import bookingController from '../controllers/bookingController.js';
import mailController from '../controllers/mailController.js';
import googleUserController from '../controllers/googleUserController.js';

import {upload} from '../middleware/multer.js';
import deleteAccount from '../controllers/deleteAccountController.js';
const routes = express.Router();

// public routes
routes.post('/register', upload.single("profilePic"), userController.register)
routes.post('/login', userController.login);
routes.post('/googleUser', googleUserController.googleUser);
routes.post("/logout", userController.logOut)
//Secured routes

routes.get("/googleUserData",VerifyJwt, googleUserController.googleUserData)
routes.get("/profile", VerifyJwt, userController.profile)
routes.post('/booking', VerifyJwt, bookingController.registerBooking)
routes.get('/userDeatils', VerifyJwt, bookingController.displayBooking)
routes.post('/sendmail', VerifyJwt, mailController.sendmail)
routes.delete("/deleteuser", VerifyJwt, deleteAccount.deleteAccount)

// flights routes
routes.get('/displaydata', flightController.displayData)
routes.get('/sourcecity', flightController.sourceData)
routes.get('/destinationcity', flightController.destinationData)
routes.get("/allflight", flightController.allFlightData)
routes.get("/matchingData", flightController.matchingData)
routes.get("/searchData", flightController.searchData)
export default routes;      