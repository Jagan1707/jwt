const router = require('express').Router();
const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verify = require('../middleware/auth')
const moment = require('moment');


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
        const time = moment().toISOString();
        await userSchema.findOneAndUpdate({email:email},{latestVisted : time,loginStatus:true}).then(data=>{
           bcrypt.compare(password,data.password,function(err,result){
            if(err){
                res.json({"err":err.message})
            }
            if(result){
                const token = jwt.sign({data},process.env.JWTKEY,{expiresIn:'1h'});
                console.log("token",time);
                //sessionStorage.setItem('status',data.loginStatus)
               return res.json({status:"success",token,"duration":time})
               
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



// const current_time = moment().toISOString();

// const dd = "Sat Oct 15 2022 14:17:21 GMT+0530 (India Standard Time)"
// const conv = new Date(dd).toISOString();
// console.log("current",conv)
// var startTime = moment(conv,"YYYY-MM-DD hh:mm:ss");
// var endTime = moment(current_time, 'YYYY-MM-DD hh:mm:ss');
// var duration = moment.duration(endTime.diff(startTime));
// var hours = parseInt(duration.asHours());
// var date = parseInt(duration.asDays())
// var minutes = parseInt(duration.asMinutes()) % 60;
// console.log(hours + ' hour and ' + minutes + ' minutes,' + date + 'days ||');


router.post("/logout",(req,res)=>{
    try {
        const email = req.body.email;
        const now = moment().toISOString();
        userSchema.findOne({email:email}).then(result=>{
            // const time = new Date(result.latestVisted).toISOString();
            const loginTime = moment(result.latestVisted,"YYYY-MM-DD hh:mm:ss");
            const current = moment(now,"YYYY-MM-DD hh:mm:ss");
            const duration = moment.duration(current.diff(loginTime));
            const hours = parseInt(duration.asHours());
            const minutes = parseInt(duration.asMinutes()) % 60;
            const days = parseInt(duration.asDays());
            console.log(hours+" hours and "+minutes + " minutes "+ days+" days");
            console.log("vist",result.latestVisted)
         userSchema.findOneAndUpdate({email:email},{loginStatus:false,duration : hours+" hours and "+minutes + " minutes "},{new:true}).then(()=>{
            console.log("success")
         })
            return res.json({status:"success",message:'logout success!',"login duration": hours+" hours and "+minutes + " minutes "+days+" days" })
        }).catch(err=>{
            console.log('err',err.message)
            return res.json({"err":err.message})
        })        
    } catch (err) {
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

router.get("/getUser",async(req,res)=>{
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

router.put("/upadteData",async(req,res)=>{
    try {
        const email = req.body.email

        userSchema.findOneAndUpdate({email:email},req.body).then(data=>{
            res.json({status:"success","result":data})
        }).catch(err=>{
            res.json({status:"failure",message:err.message})
        })
    } catch (error) {
        res.json({"err":error.message})
    }
})


router.delete("/deleteData",async(req,res)=>{
    try {
    
        const email = req.query.email
        userSchema.findOneAndDelete({email:email}).then(del=>{
            res.json({status:"success",message:"successfully deleted",del})
        }).catch(err=>{
            res.json({status:"failure",message:err.message})
            console.log(err)
        })
    } catch (error) {
        res.json({"err":error.message})
        console.log(error.message)
    }
})






module.exports = router