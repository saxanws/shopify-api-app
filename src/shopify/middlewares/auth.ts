import {Shopify} from '@shopify/shopify-api';
import express, {Application, Request, Response} from "express";


var AuthMiddleWare = (app: express.Application) => {

    // Point of entry when downloading the app
    app.get('/shopify', async (req: Request, res: Response) => {
        if(req.query.shop) {
            res.redirect(`/shopify/auth?shop=${req.query.shop}`)
        } else {
            res.redirect("https://www.youtube.com/");
        }    
    });

    // Step to begin the auth
    app.get('/shopify/auth', async (req:Request, res: Response) => {
        const authRoute = await Shopify.Auth.beginAuth(req, res, req.query.shop as string, '/shopify/auth/callback', false);    
        return res.redirect(authRoute);
    });

    // Validate and getting the token
    app.get('/shopify/auth/callback', async (req:any, res: Response) => {
        try {
            const shopSession:any = await Shopify.Auth.validateAuthCallback(req, res, req.query);
            console.log(shopSession);
        } catch (e) {
            console.error(e);
        }  

        res.redirect(app.get('front_end_url'));
    });
}

// Exporting the Auth
export default AuthMiddleWare;