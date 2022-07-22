import express, {Application, Request, Response} from "express";
// import dotenv from 'dotenv';
import Shopify, {ApiVersion} from '@shopify/shopify-api';
import bodyparser from 'body-parser';
import * as dotenv from "dotenv";
// dotenv.config({ path: '/.env' });
require('dotenv').config();


// dotenv.config();

const host = '127.0.0.1';
const port = 3000;

interface AuthQuery {
    code: string;
    timestamp: string;
    state: string;
    shop: string;
    host?: string;
    hmac?: string;
  }

const {API_SECRET_KEY, SCOPES, HOST, TOKEN, SHOP,API_KEY, HOST_SCHEME } = process.env;

const API_K: string = API_KEY+"";
const S_K: string = API_KEY+"";

const shops: { [key: string]: string | undefined } = {};
    
// Shopify.Context.initialize({
//     API_KEY: API_KEY + "",
//     API_SECRET_KEY: `${API_SECRET_KEY}`,
//     SCOPES: [`${SCOPES}`],
//     IS_EMBEDDED_APP:false
// })

Shopify.Context.initialize({
    API_KEY,
    API_SECRET_KEY,
    SCOPES: [SCOPES],
    HOST_NAME: HOST,
    IS_EMBEDDED_APP: false,
    API_VERSION: ApiVersion.April22
});

const app = express();
// app.use(bodyparser.urlencoded({extended: true}))

// Point 
app.get('/', async (req: any, res: Response) => {
    console.log(shops[req.query.shop]);
    if(typeof shops[req.query.shop] !== 'undefined') {
        // res.send(HOST);
        // res.redirect("https://www.facebook.com/axan.similien/");
        res.redirect(`/auth?shop=${req.query.shop}`);
    } else {
        console.log(req.query.shop);
        res.redirect(`/auth?shop=${req.query.shop}`)
        // res.redirect(`/auth?shop=axan-actiontrak`)
    }
    
});

app.get('/auth', async (req:Request, res: Response) => {
    // console.log(req)

    const authRoute = await Shopify.Auth.beginAuth(req, res, req.query.shop as string, '/auth/callback', false);

    console.log(authRoute);
    
    return res.redirect(authRoute);
});

app.get('/auth/callback', async (req:any, res: Response) => {
    try {
        const shopSession:any = await Shopify.Auth.validateAuthCallback(req, res, req.query);
        console.log(shopSession);
        shops[shopSession.shop] = shopSession;
    } catch (e) {
        console.error(e);
    }  

    res.redirect("https://www.facebook.com/axan.similien/");
});

// app.get('/products', async (req, res) => {
   
//         res.status(200).send("hi there");
// })


app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}/`);
});