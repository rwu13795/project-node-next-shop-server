import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export const createSession = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  // the MongoDBStore will set the expiration time the same as we set for the session
  // by using the expiration function offered by MongoDB
  proxy: true,
  cookie: {
    maxAge: 1000 * 60 * 60,
    path: "/",
    secure: true, // must use the "secure" when serve the data over https
    sameSite: true,
    httpOnly: true,
    domain: ".node-next-shop-rw.store", // all the subdomain will set the cookies
  },
  // store: sessionStore, // additional config for using the MongoDBstore
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
});

// NOTE //
/*
  (1) Since the Heroku is on the Public Suffix List, any app which uses the 
      default domain provided by Heroku (*.herokuapp.com) is not able to set
      the cookies
  (2) I have to buy a domain from other provider, and then add this custom domain
      to the app deployed on Heroku 

  (3) MOST IMPORTANT! 
      both the client and the server must use the same domain in order
      to allow the client to set the cookies inside the browser. Otherwise, the 
      NextJS "getServerSideProps" will be unable to get the cookies inside the "context"
  (4) I can use the the same domain for the client and server by adding the subdomain.
      For example, if I have a domain "node-next-shop-rw.store". I just need to add
      "client" or "server" inside the "host" field while adding the DNS record in
      the custom domain. And the two new subdomains will be "client.node-next-shop-rw.store" 
      and "server.node-next-shop-rw.store".
*/
