var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.post("/register", function (req, res, next) {
  //TODO: CHECK USER REQUEST
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }

  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((rows) => {
      if (rows.length !== 0) {
        //400 bad request
        //login
        res.status(400).json({
          error: true,
          message: "user exists",
        });
        return;
      }

      //IMPLEMENT HASHING PASSWORD USING BCRYPT MODULE
      //JWTOKEN SERVERSIDE worksheet
      const saltRounds = 10;
      //hash is async => hashSync
      const hash = bcrypt.hashSync(password, saltRounds);

      //After hashing password
      return req.db.from("users").insert({ email, hash });
    })
    .then(() => {
      res
        .status(201)
        .json({ success: true, message: "User registered successfully" });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: false, Message: "Error in MySQL query" });
    });
});

//TODO: MAKE LOGIN
router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  // verify that both email and password are provided
  if (!email || !password) {
    res
      .status(400)
      .json({
        error: true,
        message: "Request body incomplete - email and password needed",
      })
      .statusMessage("Bad Request");
    return;
  }
  req.db
    .from("users")
    .select("*")
    .where("email", "=", email)
    .then((rows) => {
      if (rows.length === 0) {
        //400 bad request
        //login
        res.status(401).json({
          error: true,
          message: "user is not exists",
        });
        return;
      }
      return bcrypt.compareSync(password, rows[0].hash);
    })
    .then((isLogged) => {
      if (isLogged) {
        const key = process.env.SECRETKEY;
        const validTime = 86400; //seconds = 24h
        const now = Math.floor(Date.now() / 1000);
        console.log(now);

        const exp = now + validTime;
        console.log(exp);

        const token = jwt.sign({ email, exp: exp }, key);
        res.json({ token_type: "Bearer", token, expires_in: validTime });
      } else {
        res.status(401).json({ error: true, message: "Wrong password" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: false, Message: "Error in MySQL query" });
    });
});

module.exports = router;
