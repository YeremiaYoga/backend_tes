const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")


const app = express();
const db = require("./models");

db.sequelize.sync( {force: true})
.then(()=> {
    console.log("Resync DB");
    
})
.catch((err) => {
    console.log("gagal" + err.message);
})
var corsOptions = {
    origin:["http://localhost:3000"],
    credentials: true
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=> {
    res.json({message: "cek"});
})

require("./routes/route")(app);
require("./routes/authRoute")(app);
require("./routes/userRoute")(app);

const port = process.env.port || 4000;
app.listen(port, () => {
    console.log("Server running...")
})