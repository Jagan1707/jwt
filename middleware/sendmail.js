const AWS = require("aws-sdk");
const { nanoid } = require("nanoid");
require("dotenv").config();

AWS.config.update({
  accessKeyId : "AKIAY2O6OS72LOSOXF4N",
  secretAccessKey : "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",
  region : "us-east-1"
})


const ses = new AWS.SES({ apiVersion: "2010-12-01" });


const sendMail = async () => {
  const email = "bmjagan17@gmail.com";
  const shordcode = nanoid(6).toUpperCase();

  try {
    const params = {
      Destination: {
        ToAddresses: [email] // Email address/addresses that you want to send your email
      },
      Message: {
        Body: {
          Html: {
            // HTML Format of the email
            Charset: "UTF-8",
            Data:
              "<html><body><h1>Dear participants,</h1><p style='color:red'>Thank you for reaching out</p></body></html>"
          },
          Text: {
            Charset: "UTF-8",
            Data: "Thanks for reaching out"
          }
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Thanks for reaching out"
        }
      },
      Source: "jagan.platosys@gmail.com"
    };

    //For Sender
    const params1 = {
      Destination: {
         ToAddresses: [email] // Email address/addresses that you want to send your email
      },
      Message: {
        Body: {
          Html: {
            // Charset: "UTF-8",
            Data: "<html><h2>Report from platosys </h2><h3>Name:JAGAN B HELLO "+"</h3><h3>Email: bmjagan17@gmail.com  "+"</h3><h3>Message:hello jagan "+"</h3></html>"
          }, 
          Text: {
          //  Charset: "UTF-8",
           Data: "This is the feedback message from user"
          }
        },
        Subject: {
        //  Charset: "UTF-8",
         Data: "Feedback from "
        }
     },
     Source: "jagan.platosys@gmail.com"
   };

  //  const sendEmailReceiver = ses.sendEmail(params).promise();
   const sendEmailSender = ses.sendEmail(params1).promise();

  //  sendEmailReceiver
  //  .then(data=>{
  //   console.log("email submitted to SES", data);
  //  }).catch(err=>{
  //   console.log(err);
  //  })
  sendEmailSender.then(data=>{
    console.log("email submitted to SES", data);
  }).catch(err=>{
    console.log(err);
  })

  } catch (error) {
    console.log("err", error);
  }
};


module.exports = {sendMail}