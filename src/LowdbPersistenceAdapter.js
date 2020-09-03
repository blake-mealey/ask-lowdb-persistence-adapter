const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

class LowdbPersistenceAdapter {
  constructor(options = {}) {
    this.dbName = options.dbName || "persistenceAttributes.db.json";
    this.attributesKey = options.attributesKey || "persistenceAttributes";

    const adpater = new FileSync(this.dbName);
    this.db = low(adpater);
    this.db.defaults({ [this.attributesKey]: {} });
  }

  async getAttributes(_requestEnvelope) {
    return this.db.read().get(this.attributesKey).value();
  }

  async saveAttributes(_requestEnvelope, attributes) {
    this.db.set(this.attributesKey, attributes).write();
  }
}

module.exports = LowdbPersistenceAdapter;
