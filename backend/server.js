const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
require("dotenv").config();
const app = express()

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended : true}));
mongoose.connect(process.env.DB_URL).then(()=>console.log("DB connected"));

const port = process.env.PORT || 5000;
app.listen(port , ()=>{
    console.log(`Server running at port ${port}`)
})