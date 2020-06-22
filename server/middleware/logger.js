const logger = (req, _, next) => {
  console.log(
    `${req.protocol}://${req.get("host")}${req.originalUrl} : ${Date.now()}`
  );
  next();
};

module.exports = logger;
