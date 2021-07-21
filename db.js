const Datastore = require("nedb-promises");

module.exports = {
  objects: Datastore.create("./_db/objects.db"),
};
