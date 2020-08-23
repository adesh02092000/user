const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();


app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({
    extended : true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/user",{useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = {
    name : String,
    post : String
};

let User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("index");
})

// get all the users

app.get("/users", function(req, res){
    User.find({}, function(err, foundUsers){
        res.send(foundUsers);
    });
});

// Post a new user
app.post("/users", function(req, res){
    const newUser = new User({
        name : req.body.name,
        post : req.body.post
    });
    newUser.save(function(err){
        if(!err)
            {
                res.send("Successfully added a new User");
            }
        else{
            res.send(err);
        }
    });
});

// Delete all the users
app.delete("/users", function(req, res){
    User.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all the users");
        }
        else{
            res.send("err");
        }
    })
})

// Get specific user
app.route("/users/:userName")

.get(function(req, res){
   // used findOne to get only one entry 
    User.findOne({name : req.params.userName}, function(err, foundUser){
        if(foundUser){
            res.send(foundUser);
        }
        else{
            res.send("No such User in the database");
        }
    });
})

.patch(function(req, res){
    User.updateOne(
    {name : req.params.userName},
    {$set : req.body},
    function(err){
        if(!err)
            {
                res.send("Successfully updated the user");
            }
        else 
            {
                res.send(err);
            }
    }
    );
})

.delete(function(req, res){

    User.deleteOne(
        {name : req.params.userName},
        function(err){
            if(!err){
                res.send("Successfully deleted the user");
            }
            else{
                res.send(err);
            }
        }
    );
});


app.listen(3000, function(req, res){
    console.log("Server is up at PORT 3000");
})

module.exports = app;

