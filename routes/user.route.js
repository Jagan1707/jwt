const router = require('express').Router();
const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = require('../middleware/auth')


router.post('/Register',async(req,res)=>{
    try{

        let username = req.body.username
        let phone = req.body.phone
        let email = req.body.email 
        let password = req.body.password 
        
        if(username){
            let nameData = await userSchema.findOne({"username":username}).exec();
            if(nameData){
                return res.status(400).json({'status':'failed', 'message':'user name already exist'})
            } 
        }else{
            return res.status(404).json({'status':'failed', 'message':'Please enter your name'})
        }
    
        if(email){
            let emailData = await userSchema.findOne({'email':email}).exec();
            if(emailData){
                return res.status(400).json({"status":"failed", "message":"email id already exist"})
            }
        }else{
            return res.status(400).json({"status":"failed", "message":"Please enter your Email id"})
        }
    
        if(phone){
            let numberData = await userSchema.findOne({"phone":phone}).exec();
            if(numberData){
                return res.status(400).json({"status":"failed", "message":"mobile number already exist"})
            }
        }else{
            return res.status(400).json({"status":"failed", "message":"Please enter your Number"})
        }
        const userDetails = await userSchema(req.body);
        const salt = await bcrypt.genSalt(10);
        userDetails.password = bcrypt.hashSync(password,salt)
        
        await userDetails.save().then(result=>{
            res.json({status:'success',message:"register successfull","result":result})
        }).catch(err=>{
            res.json({status:"failure","err":err.message});
        })

    }catch(err){
        console.log(err.message)
        res.json({'err':err.message})
    }
})


router.post('/login',async(req,res)=>{
    try{

        let email = req.body.email
        let password = req.body.password

        await userSchema.findOne({email:email}).then(data=>{
           bcrypt.compare(password,data.password,function(err,result){
            if(err){
                res.json({"err":err.message})
            }
            if(result){
                const token = jwt.sign({data},process.env.JWTKEY,{expiresIn:'1h'});
                console.log("token",token);
                return res.json({status:"success",token})
            }else{
                return res.json({status:"failure",message:"invalide password"})
            }

           })
        }).catch(err=>{
            return res.json({status:'failure',message:"invalide mail id"})
           }) 


    }catch(err){
        return res.json({"err":err.message})
    }
})

router.get("/tokenVerify",async(req,res)=>{
    try{
        let token = req.header("token")
        if(!token){
            return res.json({status:"failure",message:"token not recived"})
        }
        const decode = jwt.verify(token,process.env.JWTKEY);
        return res.json({status:"success","result":decode})
    }catch(err){
        return res.json({"err":err.message})
    }
})

router.get("/getUser",verify,async(req,res)=>{
    try{
        await userSchema.find().then(data=>{
            return res.json({status:"success","result":data})
        }).catch(err=>{
            return res.json({status:"failure",message:"user not exist"})
        })
    }catch(err){
        return res.json({'err':err.message})
    }
})

router.get('/findone',verify,async(req,res)=>{
    try{
        let email = req.body.email
       const data= await userSchema.findOne({email:email}).exec();
       if(data){
            return res.json({status:"success","result":data})
       }else{
            return res.json({status:"failure",message:"user not exist"})
       }
    }catch(err){
        return res.json({'err':err.message})
    }
})







module.exports = router