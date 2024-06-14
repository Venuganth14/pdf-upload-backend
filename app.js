const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const pdfRoutes = require('./pdf/pdfRoutes');
const db = require("./DB/connection");

const app = express();
const PORT = process.env.PORT || 8080;


app.use(bodyParser.json());


app.use(cors({
  origin: "*", 
  credentials: true 
}));


app.use("/files", express.static("files"));

app.use("/auth", require("./auth/userRoutes"));


app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
