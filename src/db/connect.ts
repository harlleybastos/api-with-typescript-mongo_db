import config from "config";
import log from "../logger";
import mongoose from "mongoose";
function connect() {
  const dbUri = config.get("dbUri") as string;

  return mongoose
    .connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      log.info("Connected to database");
    })
    .catch((err) => {
      log.error("db error", err);
      process.exit(1);
    });
}

export default connect;
