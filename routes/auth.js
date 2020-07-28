const express = require('express')
const router = express.Router();

const User = require('../models/User');

const bycrypt = require('bcryptjs')
const bycryptSalt = 10;


router.get('/signup', (req,res,next)=>{
    res.render('auth/signup');
})

router.post('/signup', (req,res,next)=>{
    const {username , password } = req.body

    if(username === '' || password === ''){
        res.render('auth/signup',{
            errorMessage: 'Indicate a username and a password to signup'
        });
        return;
    }

    User.findOne({username})
        .then((user)=>{
            if(user !== null){
                res.render('auth/signup', {
                    errorMessage: 'The username already exists'
                })
                return;
            }

            
    const salt = bycrypt.genSaltSync(bycryptSalt)
    const hashPass = bycrypt.hashSync(password, salt)

    User.create({username , password: hashPass})
        .then(()=>{
            res.redirect('/')
        })
        .catch((error)=>{
            console.log(error)
        })

     })
    .catch((error)=>{
        next(error)
    })      
})
        

router.get('/login',(req,res,next)=>{
 res.render('auth/login')
})

router.post('/login',(req,res,next)=>{
    const {username, password} = req.body

    if(username === '' || password === ''){
        res.render('auth/login',{
            errorMessage: 'Please insert both username and password'
        })
         return;   
    }

    User.findOne({username})
        .then((user)=>{
            if(!user){
                res.render('auth/login',{
                    errorMessage: 'The username doesn\'t exists'
                })
            }
        
    
            if(bycrypt.compareSync(password,user.password)){
                req.session.currentUser = user;
                res.redirect('/')
            }else{
                res.redirect('auth/login',{
                    errorMessage:'Incorrect password'
                })
            }
    
        })
        .catch((error)=>{
            console.log(error)
        })
})

module.exports = router;