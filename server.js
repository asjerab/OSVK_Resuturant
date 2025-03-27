require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERTEST,
  password: process.env.PASS,
  database: process.env.DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database!");
});
const PORT = process.env.PORT || 13001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Endepunkt for å hente restauranter
app.get("/api/restaurants", (req, res) => {
  connection.query("SELECT * FROM ResturantInfo", (err, results) => {
    if (err) {
      console.error("Feil ved henting av restauranter:", err);
      res.status(500).json({ error: "Databasefeil" });
      return;
    }
    res.json(results);
  });
});
app.get("/api/reviews/:resturants", (req, res) => {
  connection.query(`SELECT * FROM Reviews WHERE Resturant=${req.params.resturants}`, (err, results) => {
    if (err) {
      console.error("Feil ved henting av restauranter:", err);
      res.status(500).json({ error: "Databasefeil" });
      return;
    }
    res.json(results);
  });
});

app.use(express.static("public"));


