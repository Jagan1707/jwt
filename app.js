const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const user = require('./routes/user.route');
const multer = require('multer');
const path = require('path');
const convert = require('csv-converter-to-pdf-and-html')

app.use(express.static("pubilc/upload"));



const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"pubilc/upload")
    },
    filename : (req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
})

const upload = multer({storage:storage}).array('file')

app.post('/',async(req,res)=>{

    upload(req,res,(err)=>{
        if(!req.files){
            console.log('error');
        }else if(req.files.length == 0){
            res.send({status:"failure"})
        }
        else if(err){
        console.log('err',err.message)
        res.send({status:'failure',"err":err.message})
     }else{
        console.log("file",req.files);
        res.send({status:'success',data: req.files})
     }
    })
})




// const storage = multer.diskStorage({
//     destination : function(req,file,cb){
//         cb(null,'pubilc/upload')
//     },
//     filename : function(req,file,cb){
//         cb(null,Date.now()+path.extname(file.originalname))
//     }
// })

// const upload = multer({storage:storage}).single('file')

// let pdfname = Date.now() +"17"

// app.get("/",(req,res)=>{
//     // res.send("Its working");
//     // console.log('Its working');
//     upload(req,res,err=>{
//         if(err){
//             console.log('err',err.message)
//         }else{
//             console.log(req.file.path)
//             const change = new convert()
//             const filPath = path.resolve(req.file.path);
//             const destination = path.resolve("./pdf",pdfname)

//         change.PDFConverter(filPath,destination)

//         }
//     })
// })

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