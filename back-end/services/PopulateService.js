const fs = require("fs");
const { QueryTypes } = require("sequelize");
const db = require("../models");

const populate = async (filename) => {
  const { records } = await JSON.parse(fs.readFileSync('./data/' + filename ));

  for (const record of records) {
    await db.sequelize.query(record.query, {
      raw: true,
      type: QueryTypes.INSERT,
    });
  }
};

module.exports = {populate};