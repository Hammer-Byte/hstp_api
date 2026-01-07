const { CACHE_KEY_USERS } = require("../constants");
const { getAllUsers } = require("../db/users");
const { logger } = require("sahas_utils");

const cache = {};

/**
 * Add cache entry
 */
const add = (key, dataGenerator) =>
  dataGenerator().then((data) => {
    cache[key] = { data, dataGenerator };
    logger.success(`Cache Added - KEY:${key}`);
  });

/**
 * Get cached data
 */
const get = (key) => cache?.[key]?.data;

/**
 * Refresh cache manually
 */
const refresh = (key) =>
  cache[key]?.dataGenerator().then((data) => {
    cache[key].data = data;
    logger.success(`Cache Refreshed - KEY:${key}`);
  });

/**
 * Generate all caches at startup
 */
const generateCaches = async () => {
  await add(CACHE_KEY_USERS, getAllUsers);
};

module.exports = {
  add,
  get,
  refresh,
  generateCaches,
};
