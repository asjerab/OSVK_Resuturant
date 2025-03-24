require("dotenv").config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB
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

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

