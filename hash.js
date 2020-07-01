const crypto = require("crypto");

module.exports = (url) => {
  const hash = crypto.createHmac("sha256", url).digest("hex");
  return hash.slice(0, 10);
};
