var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment.js")
var Campground = require("./models/campground")
var User = require("./models/user")
var passport = require("passport")
var LocalStrategy = require("passport-local")
var passportLocalMongoose = require("passport-local-mongoose")
var campgroundRoute = require("./routes/campgrounds");
var commentRoute = require("./routes/comments")
var methodOverride = require("method-override");
var flash = require("connect-flash");
//database connect
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true, useUnifiedTopology: true })

//set passport ->>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.use(require("express-session")({
    secret : "do not tell this secret to anyone",
    resave : false,
    saveUninitialized:false,
}))
app.use(flash());

//routes




app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"))


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//passport setup ends ->>>>>>>>>>>>>>>>>>>>>>>

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));

//db schema


 app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
})

app.use("/campgrounds",campgroundRoute);
app.use("/campgrounds/:id",commentRoute);

app.get("/",function(req,res){
    res.render("campground/landing.ejs")

})


//middlewares

// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.render("campgrounds/login.ejs")
// }


app.listen(3000,()=>{
    console.log("server has started at port 3000.")
})

