const libExpress = require("express");
const cors = require("cors");
const { logger } = require("sahas_utils");
const { ROUTE_NOT_FOUND } = require("./constants");

// api server
const hstpAPI = libExpress();

// CORS
hstpAPI.use(
  cors({
    origin: process.env.ALLOWED_CORS_ORIGINS
      ? process.env.ALLOWED_CORS_ORIGINS.split(",")
      : [],
  })
);

// allow json request payloads and cookies only by express
hstpAPI.use(libExpress.json());
hstpAPI.use(libExpress.urlencoded({ extended: true }));

// api end points and routers
// const routers = {
//   "/users": {
//     router: require("./routes/users"),
//   },
// };

// apply all routes
Object.entries(routers).forEach(([path, routeHandler]) =>
  hstpAPI.use(path, routeHandler.router)
);

// if api path is not processable
hstpAPI.use((req, res) => res.status(404).json({ error: ROUTE_NOT_FOUND }));

// APP Port and start app
const allowTraffic = () =>
  hstpAPI.listen(process.env.SERVER_PORT, () =>
    logger.success(`APIs started at ${process.env.SERVER_PORT}`)
  );

// global exception handling
process.on("uncaughtException", (error) => logger.error(error));

module.exports = { allowTraffic };
