// Read enviroment variable from .env.local
// or set up 

const config = {
  providers: [
    {
      domain: process.env.AUTH_DOMAIN,
      applicationID: "convex",
    }
  ]
};

export default config;