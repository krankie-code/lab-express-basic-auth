const express = require('express');
var router = express.Router();

router.get('/', (req, res , next)=>{
    res.render('home');
})

router.use((req, res, next)=>{
    if(req.session.currentUser){
        next();
    }else{
        res.redirect('/login')
    }
})

router.get('/main', (req, res, next)=>{
    res.render('main')
})

router.get('/private', (req, res, next)=>{
    res.render('private')
})

router.get('/logout', (req, res , next)=>{
    req.session.destroy((err)=>{
        res.redirect('/login')
    })
})

module.exports = router;