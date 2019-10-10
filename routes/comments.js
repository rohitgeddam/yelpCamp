var express = require("express");
var router = express.Router({mergeParams:true});

var Campground = require("../models/campground");
var Comment = require("../models/comment")

var middleware = require("../middleware/")

//authorization routes

router.get("/edit/:commentId",middleware.isCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.commentId,function(err,foundComment){
                res.render("comment/edit.ejs",{comment:foundComment,campgrounds:foundCampground})
            })
        }
    })
})


router.put("/edit/:commentId",middleware.isCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,updatedComment){
        if(err) console.log(err);
        else{
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
})

router.delete("/delete/:commentId",middleware.isCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.commentId,function(err){
        if(err) console.log(err);
        else{
            
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


router.get("/comments/new",middleware.isLoggedIn,function(req,res){
    //find a campground
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err)
        }
        else{
            console.log(foundCampground)
            res.render("./comment/new.ejs",{campgrounds:foundCampground});
        }
    })
})

router.post("/comments/",middleware.isLoggedIn,function(req,res){
    //find the campground by id create the comment and save to the campground.
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err) console.log(err);
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    //now save the campground
                    foundCampground.save(function(err,savedCampground){
                        if(err) console.log(err);
                        else{
                            console.log("success");
                            console.log(savedCampground);
                            res.redirect("/campgrounds/" + req.params.id )
                        }
                    })
                }
            })
        }
    })
})



module.exports = router;