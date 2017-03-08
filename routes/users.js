
var express = require('express');
var passport=require('passport');
var user = require('../models/user.js');
var router = express.Router();
// login=false;
/* GET users listing. */
router.get('/',isLoggedIn, function(req, res, next) {
  res.render('index',{message:req.flash('loginMessage')});
});

router.get('/login',function(req,res,next){
  res.render('login.ejs',{message:req.flash('loginMessage')});
});

router.get('/signup',function(req,res){
  res.render('signup.ejs',{message:req.flash('loginMessage')});
});

router.get('/profile',isLoggedIn,function(req,res){
  res.render('profile');
});
router.get('/logout',isLoggedIn,function(req,res){
  req.logout();
  login=false;
  res.redirect('/users');
});
router.post('/updateProfile',isLoggedIn,function(req,res){
  var city = req.body.city;
  var age = req.body.age;
  console.log(city);
  console.log(age);
  console.log(req.user.local.email);
  user.findOne({'local.email':req.user.local.email},function(err,result){
   
    if(err) throw err;
    console.log(result.local);
      result.local.city = city;
      result.local.age = age;
      result.save(function(err){
         if(err) throw err;
         console.log("luu du lieu thanh cong");
       });
  });
  res.redirect('/users')
})
router.post('/changePassword',isLoggedIn,function(req,res){
  var currentPassword = req.body.currentPassword;
  var newPassword = req.body.newPassword;
  console.log(currentPassword);
  console.log(newPassword);
  console.log(req.user.local.email);
  user.findOne({'local.email':req.user.local.email},function(err,result){
   
    if(err) throw err;
    console.log(result.local);
    var checked = result.validPassword(currentPassword);
    console.log(checked);
      if(checked === true){
      var myPassword=result.generateHash(newPassword);
          result.local.password = myPassword;
          console.log("myPassword");
          console.log(myPassword);
          result.save(function(err){
             if(err) throw err;
             console.log("luu du lieu thanh cong");
           });
           res.redirect('/users')
        }else{
          console.log("sai mat khau");
           res.redirect('/users/profile');
        }
      });

 
})
router.post('/signup',passport.authenticate('local-signup',{
  successRedirect:'/users/login',
  failureRedirect:'/users/signup',
  failureFlash:true,
}));

router.post('/login',passport.authenticate('local-login',{
  successRedirect: '/users',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/users/profile',
  failureRedirect: '/home',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
}));


module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }
  res.redirect('/');
}
