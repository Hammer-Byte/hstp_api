const libExpress = require("express");
const { validateRequestBody } = require("sahas_utils");
const { getConfig, updateConfigByKey } = require("../db/config");
const { logger } = require("sahas_utils");

const hstpApi = libExpress.Router();

/* =========================
   GET CONFIG
   ========================= */
hstpApi.get("/", async (_, res) => {
  logger.info("GET /config called");

  const config = getConfig();

  if (!config) {
    logger.error("GET /config failed - config cache not initialized");
    return res.status(500).json({ error: "Config cache not initialized" });
  }

  logger.success("GET /config success");
  res.status(200).json(config);
});

/* =========================
   UPDATE CONFIG
   ========================= */
hstpApi.put("/", async (req, res) => {
  logger.info(`PUT /config called with body: ${JSON.stringify(req.body)}`);

  const required = ["key", "value"];
  const { isRequestBodyValid, validatedRequestBody } =
    validateRequestBody(req.body, required);

  if (!isRequestBodyValid) {
    logger.error("PUT /config failed - invalid body");
    return res.status(400).json({ error: "Invalid Body" });
  }

  try {
    const config = updateConfigByKey(validatedRequestBody);

    logger.success(
      `Config updated - KEY:${validatedRequestBody.key} VALUE:${validatedRequestBody.value}`
    );

    res.status(200).json(config);
  } catch (error) {
    logger.error(`PUT /config failed - ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

module.exports = hstpApi;
