const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const User=require('./script/user.js');
const History=require('./script/history.js');
const methodOverride = require('method-override');
const { get } = require('http');
const appErr=require('./utils/appErr');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local');


mongoose.connect('mongodb://localhost:27017/user', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/style')));
app.use(express.static(path.join(__dirname, '/script')));

const sessionConfig = {
    secret:'secret',
    saveUninitialized:true,
    resave:false,
    cookie:{
        httpOnly:true, 
        expires:Date.now() + 1000 * 3600 * 24* 7 ,
        maxAge: 1000 * 3600 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.welcome = req.flash('welcome');
    res.locals.goodBye=req.flash('goodBye')
    next();
})

function wrapAsync(fun) {
    return function(req,res,next){
        fun(req,res,next).catch(e=>next(e))
    }
}

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must login ')
        return res.redirect('/login')
    }
   
        next();
}


app.get('/getquote', isLoggedIn,(req, res) => {
    res.render('getquote')
})
app.post('/getquote', isLoggedIn,wrapAsync( async (req, res) => {
    const user = await User.findOne({username:res.locals.currentUser.username});
    const addHistory = new History(req.body.history);
    user.histories.push(addHistory);
    await addHistory.save();
    await user.save();
    res.redirect('/records')
}))

app.get('/pricecalculator',isLoggedIn,(req, res) => {
   var locationFactor = 0.02;
   var rateHistoryFactor = 0.01;
   var gallonsRequestedFactor = 0.03;
   const companyProfitFactor = 0.1; 
  if(req.query.gallons > 1000) gallonsRequestedFactor = 0.02 ;
   if(res.locals.currentUser.state !== "TX") locationFactor = 0.04;
   if (res.locals.currentUser.histories.length ==0) rateHistoryFactor = 0;
  const gallonPrice = (1.5 * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor)).toFixed(4);
  const totalPrice = (gallonPrice * req.query.gallons).toFixed(2);
   res.send({price:gallonPrice,total:totalPrice, gallon:req.query.gallons})
})

app.get('/login', (req, res) => {
    
    res.render('login')
})

app.post('/login', passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req, res) => {
    req.flash('welcome','This is the right place to find the best price!!')
    res.redirect('/getquote')
})

app.get('/logout',(req,res)=>{
    req.logout();
    req.flash('goodBye','See you soon!!')
    res.redirect('/home');
})

app.get('/registration', (req, res) => {
    res.render('registration')

})

app.get('/signup', isLoggedIn,(req, res) => {
    res.render('signup')
})
app.post('/register',wrapAsync( async (req,res,next)=>{
    try{
    const {username,password} = req.body;
    const user =  new User({username});
    const registerUser = await User.register(user,password);
    req.login(registerUser,err=> {
        if (err) return next(err);
        req.flash('success','successfully register now finish setting up your profile')
        res.redirect('/signup')
    })

    } catch(e){
        req.flash('error',e.message)
        res.redirect('/registration')
    }
 }))

app.post('/signup',wrapAsync(async (req,res)=>{
    const EditedUser= await User.findOneAndUpdate({username:res.locals.currentUser.username},req.body)
    await EditedUser.save();
    res.redirect('/home')
 
 }))

app.get('/home', (req, res) => {
    res.render('home')
})

app.get('/records',isLoggedIn, wrapAsync(async(req,res)=>{
    const user = await User.findOne({username:res.locals.currentUser.username}).populate('histories');
    const records = user.histories;
    res.render('record',{records})
}))

app.all('*',(req,res,next)=>{
    next(new appErr('Page Not Found',404))
})
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    if (!err.message) err.message='Something went wrong'
    res.status(status).render('error.ejs',{err})
})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})


