const sgmail = require('@sendgrid/mail');
const { connect } = require('mongoose');
const { send } = require('@sendgrid/mail');

const SEND_GRID_APIKEY = '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'

sgmail.setApiKey(SEND_GRID_APIKEY);

const sendmail =(emailid)=>{
    const msg = {

        to : emailid,
        from : ' parmar.naitik1@gmail.com ',
        subject :' sucessfully signup',
        html : '<h1>Welcome to Shopapp</h1>'
    
    }
    sgmail.send(msg).then(()=>{
        console.log('success');
    }).catch(err=>{
        console.log(err)
    })
    
}

const resetmail = (emailid,token) =>{
    const msg = {
        to : emailid,
        from : 'parmar.naitik1@gmail.com',
        subject:'Resetting Password ',
        html:`
        <p><a href="http://localhost:3000/reset/${token}" >Click here</a> for reset your password !</p> `
    }
    sgmail.send(msg).then(()=>{console.log('signup message send')}).catch(err=>{throw err})
}

module.exports = {sendmail,resetmail}