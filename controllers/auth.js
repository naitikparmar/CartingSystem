const crypto = require('crypto');
const bcypt = require('bcryptjs');
const User = require('../models/user');
//const sendmail = require('../util/mail');
const { resetmail, sendmail } = require('../util/mail');
const { validationResult} = require('express-validator');
const user = require('../models/user');

exports.getLogin = (req, res, next) => {
   let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid Username or Password')
        return res.redirect('/login')
      }
      bcypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    }).catch(err => {
      console.log(err)
    })
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req)
  const email = req.body.email;
  const password = req.body.password;
 // const confirmPassword = req.body.confirmPassword;
  if(!errors.isEmpty()){
   console.log(errors.array()[0])
   return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg
    });
  }
    bcypt.hash(password, 12)
        .then(hashedpassword => {
          const user = User({
            email: email,
            password: hashedpassword,
            cart: {
              items: []
            }
          })
          return user.save()
        })
        .then(reuslt => {
          sendmail(reuslt.email)
          res.redirect('/login')
    }).catch(err=>{
      throw new Error(err)
    })
  }

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: req.flash('error')
  })
}

exports.postReset = (req, res, next) => {
  const email = req.body.email
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect('/')
    }
    const token = buffer.toString('hex')
    User.findOne({ email })
      .then(user => {
        if (!user) {
          console.log(' no email is found ! ')
          return res.redirect('/reset')
        }
        user.token = token
        user.expiretoken = Date.now() + 3600000;
        return user.save()
          .then(user => {

            resetmail(email, token)
            res.redirect('/')
          }).catch(err => { throw err })
      }).catch(err => { throw err })
    // res.redirect('/reset')
  })
}

exports.getnewPassword = (req, res, next) => {
  const token = req.params.token;
  console.log(token)
  User.findOne({ token, expiretoken: { $gt: Date.now() } })
    .then(user => {
      if (!user) {
        return res.redirect('/');
      }
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/New Password',
        errorMessage: req.flash('error'),
        userid: user._id.toString(),
        passwordToken: token
      })
    }).catch(err => {
      throw err;
    })
}

exports.postnewPassword = (req, res, next) => {

  const userid = req.body.userid;
  const newPassword = req.body.password;
  const passwordToken = req.body.passwordToken;
  let resetUser ;
  User.findOne({ token:passwordToken, expiretoken:{$gt:Date.now()}, _id: userid })
  .then(user=>{
    resetUser = user;
    return bcypt.hash(newPassword,12)
    })
  .then(hashedpassword =>{
    resetUser.password = hashedpassword;
    resetUser.token = undefined;
    resetUser.expiretoken = undefined
    return resetUser.save()
    .then(reuslt=>{
    
      console.log('password updated')
      res.redirect('/login')
      
    })
  })
  .catch(err => {
    throw err
  })

}