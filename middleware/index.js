var Comment = require("../models/comment");
var Campground = require("../models/campground")

var middleware = {};

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","you need to login!");
    res.redirect("/campgrounds/login");
}

middleware.isCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId,function(err,comment){
            if(err) console.log(err)
            else{
                if(req.user._id.equals(comment.author.id)){
                    next();
                }
                else{
                    req.flash("error","you dont have permission")
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error","you need to login!")
        res.redirect("back")
    }
}

middleware.isCampgroundOwnership = function(req,res,next){
    
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,campground){
            if(err) console.log(err);
            else{
                if(req.user._id.equals(campground.author.id)){
                    console.log(campground)
                    next();
                }else{
                    req.flash("error","you dont have permission")
                    res.redirect("back");
                }
            }
           
        })
        
    }else{
        req.flash("error","you need to login!")
        res.redirect("back")
    }
}

module.exports = middleware;