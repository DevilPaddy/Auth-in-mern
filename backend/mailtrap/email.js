const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require("./emailTemplets");
const {client, TOKEN, sender} = require('../mailtrap/mailtrap.config');
const { MailtrapClient } = require("mailtrap");


// sending verification code...
const sendVerificationEmail = async(email, verificationToken)=>{
    const recipient = [{email}];

    try{
        const response = await client.send({
            from:sender,
            to: recipient,
            subject: "verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verificition",
        });
        console.log("email send successfully:",response);
    }
    catch(err){
        console.log("error in email section: ",err);
    }
}


// sending welcome email...
const sendWelcomeEmail = async (email, name)=>{
    const recipient = [{email}];

    try{
        const res =  await client.send({
            from: sender,
            to: recipient,
            template_uuid: "d80bbafe-c277-477d-bf9d-0beee0f53d3d",
            template_variables: {
                "name": "Test_Name"
              },
        });
        console.log("email send successfully🥳",res);
        
    }
    catch(err){
        console.log(err);
    }
}

// send reset password email...
const sendPasswordResetEmail = async (email, resetUrl)=>{
    const recipient = [{email}];

    try{
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL", resetUrl),
            category: "password Reset"
        });
        console.log("pass request send successful..",res);
    }
    catch(err){
        console.log("error in reset pass email part...",err);
        // return res.status(400).json({message:"something went wrong..."});
    }
}

// sent password updated email...
const sentResetSuccessEmail = async(email)=>{
    const recipient = [{email}];
    try{  
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Successful",
        });
        console.log("pass updates successful..",res);
    }
    catch(err){
        console.log("some error in email templet sending for successful pass reset...",err);
        // return res.status(400).json({message: "something went wrong..."});
    }
}

module.exports = {
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sendPasswordResetEmail, 
    sentResetSuccessEmail
};