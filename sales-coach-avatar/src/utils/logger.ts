import log from "loglevel";

if (process.env.NODE_ENV === "production") {
  log.setLevel(log.levels.ERROR);
} else {
  log.setLevel(log.levels.DEBUG);
}

export const logger = log;
