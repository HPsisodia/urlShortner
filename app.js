const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const helmet = require("helmet");

global.appRoot = path.resolve(__dirname);

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());


// const static_path = path.join(__dirname, '/public/images');
// console.log(__dirname, '/views/images');
// app.use(express.static('public'));
// app.set("views", path.join(__dirname, "/public/views"));
// app.set("view engine", "hbs");

const urlRoute = require('./route/urls');


app.use("/", urlRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Application is running on port ${PORT}`);
  }); 

