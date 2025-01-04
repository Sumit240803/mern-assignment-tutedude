const express = require("express")
const cors = require("cors")
const bodyparser = require("body-parser")
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const compression = require("compression");
require("dotenv").config();
const app = express()

app.use(cors())
app.use(compression());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended : true}));
app.use("/api/auth" , authRoutes)
app.use("/api/user" , userRoute)
mongoose.connect(process.env.DB_URL).then(()=>console.log("DB connected"));

const port = process.env.PORT || 5000;
app.listen(port , ()=>{
    console.log(`Server running at port ${port}`)
})