const { CACHE_KEY_USERS, CACHE_KEY_CONFIG } = require("../constants");
// const { getAllUsers } = require("../db/users");
const { CONFIG } = require("../constants/config");
const { logger } = require("sahas_utils");

const cache = {};

/**
 * Add cache entry
 */
const add = async (key, dataGenerator) => {
  logger.info(`Initializing cache - KEY:${key}`);

  const data = await dataGenerator();
  cache[key] = { data, dataGenerator };

  logger.success(`Cache Added - KEY:${key}`);
};

/**
 * Get cached data
 */
const get = (key) => {
  const data = cache?.[key]?.data;

  if (!data) {
    logger.error(`Cache MISS - KEY:${key}`);
    return null;
  }

  logger.info(`Cache HIT - KEY:${key}`);
  return data;
};

/**
 * Refresh cache manually
 */
const refresh = async (key) => {
  if (!cache[key]) {
    logger.error(`Cache Refresh Failed - KEY:${key} not found`);
    return;
  }

  logger.info(`Refreshing cache - KEY:${key}`);

  const data = await cache[key].dataGenerator();
  cache[key].data = data;

  logger.success(`Cache Refreshed - KEY:${key}`);
};

/**
 * Generate all caches at startup
 */
const generateCaches = async () => {
  // USERS cache (disabled until users routes exist)
  // await add(CACHE_KEY_USERS, getAllUsers);

  // CONFIG cache (ACTIVE)
  await add(CACHE_KEY_CONFIG, async () => ({ ...CONFIG }));
};

module.exports = {
  add,
  get,
  refresh,
  generateCaches,
};
