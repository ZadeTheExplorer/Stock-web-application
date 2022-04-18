const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

//GET 1: all stocks
// Returns all available stocks, optionally filtered by industry sector.
router.get("/symbols", function (req, res, next) {
  // When query does not have keys
  //req.query !== req.params
  if (Object.keys(req.query).length === 0) {
    console.log(req.query.industry);
    req.db
      .from("stocks")
      .distinct("name", "symbol", "industry")
      .then((rows) => {
        console.log(rows);
        res.status(200).json(rows);
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: false, Message: "Error in MySQL query" });
      });
  } else {
    if (!req.query.industry || Object.keys(req.query) > 1) {
      res.status(400).json({ Error: true, message: "Invalid query!" });
    } else {
      req.db
        .from("stocks")
        .distinct("name", "symbol", "industry")
        .where("industry", "like", `%${req.query.industry}%`)
        .then((rows) => {
          if (rows.length !== 0) {
            console.log(rows);
            res.status(200).json(rows);
          } else {
            res
              .status(404)
              .json({
                Error: true,
                message: "Can not found this industry: " + req.query.industry,
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.json({ Error: false, Message: "Error in MySQL query" });
        });
    }
  }
});

//GET 2: a specific symbol
// Returns the latest entry for a particular stock searched by symbol
// (1-5 upper case letters).
router.get("/:symbol", function (req, res, next) {
  const symbol = req.params.symbol;
  if (
    symbol !== symbol.toUpperCase() ||
    symbol.length <= 0 ||
    symbol.length > 5
  ) {
    res
      .status(400)
      .json({
        error: true,
        message:
          "Incorrect format - must be 1-5 letters. Your input: " + symbol,
      });
  } else if (Object.keys(req.query).length !== 0) {
    res
      .status(400)
      .json({ error: true, message: "Invalid query. No parameters allowed." });
  } else {
    req.db
      .from("stocks")
      .distinct("*")
      .where("symbol", "=", symbol)
      //latest stocks info
      .andWhere(function () {
        this.where("timestamp", "=", "2020-03-24");
      })
      .then((rows) => {
        if (rows.length !== 0) {
          console.log(rows);
          res.status(200).json(rows[0]);
        } else {
          res
            .status(404)
            .json({
              Error: true,
              message: "Can not found this symbol: " + symbol,
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: false, Message: "Error in MySQL query" });
      });
  }
});

//GET 3: get specific stock when logged
// Return entries of stock searched by symbol, optionally filtered by date.
const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;
  let token = null;
  console.log(authorization);

  // Retrieve token
  if (authorization && authorization.split(" ").length === 2) {
    token = authorization.split(" ")[1];
    console.log("Token: ", token);
  } else {
    // No token found
    res.status(403).json({ error: true, message: "Forbidden" });
    return;
  }

  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);

    if (decoded.expiredAt > Date.now()) {
      res.status(403).json({ error: true, message: "Token has expired" });
      return;
    }
    // Permit user to advance to route
    next();
  } catch (e) {
    console.log("Token is not valid: ", e);
  }
};

router.get("/authed/:symbol", authorize, function (req, res, next) {
  if (Object.keys(req.query).length === 0) {
    req.db
      .from("stocks")
      .select("*")
      .where("symbol", "=", req.params.symbol)

      .andWhere(function () {
        this.whereBetween("timestamp", ["2020-03-24", "2020-03-24"]);
      })

      .then((rows) => {
        res.status(200).json(rows);
      })
      .catch((err) => {
        console.log(err);
        res.json({ Error: false, Message: "Error in MySQL query" });
      });
  } else if (
    !req.query.from ||
    !req.query.to ||
    Object.keys(req.query).length > 2
  ) {
    res.status(400).json({ Error: true, message: "Bad Request" });
  } else if (req.query.from > req.query.to) {
    res
      .status(404)
      .json({
        Error: true,
        message: "Not Found. Start date can not comes after End date",
      });
  } else {
    req.db
      .from("stocks")
      .select("*")
      .where("symbol", "=", req.params.symbol)
      .andWhere(function () {
        this.whereBetween("timestamp", [
          req.query.from.substring(0, 10),
          req.query.to.substring(0, 10),
        ]);
      })

      .then((rows) => {
        if (rows.length !== 0) {
          res.status(200).json(rows);
        } else {
          res.status(404).json({
            Error: true,
            message: `Can not found symbol: ${symbol} in range: ${req.query.from} to: ${req.query.to}`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ error: true, message: "Error in MySQL query" });
      });
  }
});

module.exports = router;
