const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const user = require('./routes/user.route');

app.get("/",(req,res)=>{
    res.send("Its working");
    console.log('Its working');
})

console.log('test',process.env.DBURL)

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json())

mongoose.connect(process.env.DBURL,{
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(DB=>{
    console.log("DataBase Connected Successfully")
}).catch(err=>{
    console.log('err',err.message)
})

app.use('/user',user)




const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Server running this Port ${port} `)
})