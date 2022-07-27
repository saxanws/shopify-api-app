import express, {Application, Request, Response} from "express";
import Shopify, {ApiVersion} from '@shopify/shopify-api';
import bodyparser from 'body-parser';
import * as dotenv from "dotenv";
import AuthMiddleWare from './shopify/middlewares/auth';


// Configure to set up the environement variables
dotenv.config();

// Get all the environement variable
const {API_SECRET_KEY, SCOPES, HOST, TOKEN, SHOP,API_KEY, LOCAL_HOST, PORT, FRONT_END_APP } = process.env;

// Set up the context of shopify
Shopify.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: false,
    API_VERSION: ApiVersion.April22
});

// Initialize express app
const app = express();

app.set('front_end_url', FRONT_END_APP);

// this is to apply all the auth process
AuthMiddleWare(app);


// Start the app on the specified PORT
app.listen(PORT, () => {
    console.log(`Server running at http://${LOCAL_HOST}:${PORT}/`);
});