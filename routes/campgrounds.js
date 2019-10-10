 var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var passport = require("passport");
var middleware = require("../middleware/")


router.post("/",middleware.isLoggedIn,function(req,res){
    
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
       id : req.user._id,
       username: req.user.username,
    }
    var newCampground = {name:name,price:price,image:image,description:desc,author:author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
            res.redirect("/campgrounds/new");
        }
        else{
            console.log(newlyCreated);
        }
    })
    res.redirect("/campgrounds");
})
//authorisation
router.get("/:id/edit",middleware.isCampgroundOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campground/edit.ejs",{campground:foundCampground})
    })
    
})


router.put("/:id/edit",middleware.isCampgroundOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,data){
        if(err){
            console.log(err);
        }
        console.log(data);
        res.redirect("/campgrounds/"+ req.params.id)
    })
})




router.delete("/:id/delete",middleware.isCampgroundOwnership,function(req,res){
    Campground.findByIdAndDelete(req.params.id,function(err,data){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/");
        }
    })
})
//----------------------------


//authentication
router.get("/register",function(req,res){
    res.render("campground/register.ejs");
})

router.get("/login",function(req,res){
    res.render("campground/login.ejs")
})

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash("error",err.message)
            return res.redirect("/campgrounds/register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","you are now registered")
            res.redirect("/campgrounds");
        })
    })
})

router.post("/login",passport.authenticate("local",{
    successRedirect: "/campgrounds",
    failureRedirect: "/campgrounds/login",
}),function(req,res){  
})


router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","your are logged out successfully!")
    res.redirect("/campgrounds")
})


router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campground/new.ejs");
})
router.get("/:uniqueId",function(req,res){
        var id = req.params.uniqueId;
        
        Campground.findById(id).populate("comments").exec(function(err,foundCampground){
            if(err){
                 console.log(err);
            }else{
                res.render("campground/show.ejs",{campground:foundCampground});
            }
        })
})

router.get("/",function(req,res){
    //show all campgrounds.
    Campground.find({},function(err,foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campground/index.ejs",{campgrounds:foundCampground})
        }
    })
    
})




module.exports = router;