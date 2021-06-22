const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

const db = require("./models");
const User = db.users;

const Bilet = db.bilets;

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

db.sequelize.sync();
app.get("/", (req, res) => {
  res.json({ message: "Its working" });
});
app.post("/register", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    id: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
  };
  User.findOne({
    where: { email: req.body.email, password: req.body.password },
  }).then((data) => {
    console.log(data);
    if (!data) {
      User.create(user)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: err.message || "Error",
          });
        });
    } else {
      res.send("error");
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({
    where: { email: req.body.email, password: req.body.password },
  })
    .then((data) => {
      if (data) {
        jwt.sign(
          { data },
          "secretkey",
          { expiresIn: "3000000000000000000000000000000000000s" },
          (err, token) => {
            res.json({
              token,
            });
          }
        );
      } else {
        res.send("error");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error",
      });
    });
});

app.post("/bilet", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const bilet = {
        countryDep: req.body.countryDep,
        countryArr: req.body.countryArr,
        number: req.body.number,
        minPrice: req.body.minPrice,
        transporter: req.body.transporter,
        id: Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000,
        userID: authData["data"]["id"],
      };
      Bilet.create(bilet)
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: err.message || "Error",
          });
        });
    }
  });
});

app.get("/bilet", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      Bilet.findAll({
        where: { userID: authData["data"]["id"] },
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: err.message || "Error",
          });
        });
    }
  });
});

app.delete("/bilet", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log(authData);
      const id = req.body.id;

      Bilet.destroy({
        where: { id: id },
      })
        .then((data) => {
          res.send("Done");
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send({
            message: err.message || "Error",
          });
        });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.listen(5000, () => console.log("Server started on port 5000"));
