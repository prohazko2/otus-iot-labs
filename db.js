//import json from "./data.json";
import { readFile, writeFile, watchFile } from "fs";

const DB_PATH = `${__dirname}/data.json`;

function reload() {
  return new Promise((resolve, reject) => {
    readFile(DB_PATH, (err, content) => {
      if (err) return reject(err);
      try {
        data = JSON.parse(content.toString());
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

watchFile(DB_PATH, () => {
  reload();
});

function flush() {
  return new Promise((resolve, reject) => {
    const json = JSON.stringify(data, null, 2);
    writeFile(DB_PATH, json, (err) => (err ? reject(err) : resolve()));
  });
}

module.exports = {
  flush,
};
