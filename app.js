import { generateDBTables } from "./libs/db.js";
import { allowTraffic, createApp } from "./server.js";
const { filer, logger } = require("@hammerbyte/utils");

const DIRECTORY_CONFIGS = process.env.DIRECTORY_CONFIGS || "configs";
const DIRECTORY_LOGS = process.env.DIRECTORY_LOGS || "logs";

const REQUIRED_DIRS = [DIRECTORY_LOGS, DIRECTORY_CONFIGS];

//initiate the logger
logger.init({
    saveLogs: Bun.env.SAVE_LOGS, // Set to true to write to files
    logsDirectory: "logs", // This folder will be created automatically
});

logger.info(Bun.env);

try {
    filer.prepareDirectories(REQUIRED_DIRS);
    await generateDBTables();
    logger.success("Tables Ready");
    const app = createApp();
    await allowTraffic(app);
    logger.success("Incoming Traffic Allowed....");
} catch (err) {
    logger.error(err);
    process.exit(1);
}
