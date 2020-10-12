const express = require('express');
const { check,body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset)

router.post('/login', authController.postLogin);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('please enter a valid input!')
        .custom((value,{req})=>{
            User.findOne({email:value})
            .then(user=>{
                if(!user){
                    return true
                }
            }).catch(err=>{
                 throw new Error(err)
            })
        })
        ,
    body('password','Please enter password with number and text and 5 character long !')
    .isLength({min:5}).isAlphanumeric(),
    body('confirmpassword').custom((value,{req})=>{
        if(value !== req.body.password){
         throw new Error('Password has to match !')
        }else{
            return true;
        }
    })
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset/:token', authController.getnewPassword);

router.post('/new-password', authController.postnewPassword);

module.exports = router;