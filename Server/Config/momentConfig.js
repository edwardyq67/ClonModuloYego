const moment = require("moment-timezone");

moment.tz.setDefault("America/Lima");

const getCurrentTime = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

module.exports = {
  moment,
  getCurrentTime,
};
