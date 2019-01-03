const connectString = "192.168.0.55/raidcalendar";
const db = require("monk")(connectString);

db.then(() => {
    console.log("connected to database");
})

module.exports = db;