const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const port = process.env.PORT || 8000;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// get requests
// get and render all foxes
app.get('/', function(req, res){
    Fox.find({}, function(err, foxes){
        if(err){
            //do error stuff
            res.render('index')
        } else {
            res.render('index', {allFoxes:foxes});
        }
    })    
})

// get new page/form for adding new member to pack
app.get('/fox/new', function(req, res){
    res.render('newFox')
})
// get and render one specific fox, by id
app.get('/fox/:id', function(req, res){
    Fox.findOne({_id: req.params.id}, function(err, fox){
        if(err){
            //do error stuff
            res.redirect("/")
        } else {
            res.render('oneFox', {fox:fox})
        }
    })
})
// get edit view
app.get('/fox/edit/:id', function(req, res){
    Fox.findOne({_id: req.params.id}, function(err, fox){
        if(err){
            //do error stuff
            console.log("error finding fox")
            res.redirect("/")
        } else {
            res.render('editFox', {fox:fox})
        }
    })
});



// post request(s)
// action route for new fox form
app.post('/foxes', function(req, res){
    console.log("body", req.body)

    const fox = new Fox({
        name: req.body.name,
        age: req.body.age,
        favFood: req.body.favFood,
    });
    fox.save(function(err){
        if(err){
            //do error stuff
            console.log("error whilst saving")
            res.render('newFox',{errors: fox.errors})
        } else {
            console.log("success", req.body)
            res.redirect('/')
        }
    })
})

// action route for edit fox
app.post('/fox/:id', function(req, res){
    console.log("edit body", req.body)
    Fox.update({_id: req.params.id}, {$set: {
        name: req.body.name, 
        age: req.body.age,
        favFood: req.body.favFood
    }}, function(err, fox){
        if(err){
            //do error stuff
            console.log("didn't update")
            res.redirect('/')
        } else {
            console.log("successful update")
            res.redirect('/')
        }
    })
})
// delete a fox
app.get('/fox/destroy/:id', function(req, res){
    Fox.remove({_id: req.params.id}, function(err){
        if(err){
            console.log("error deleting fox");
            res.redirect("/")
        } else {
            console.log(req.params.id, "deleted");
            res.redirect("/")
        }
    })
})

//connect to db
mongoose.connect('mongodb://localhost/mongooseDashboard')

//make schema
const foxSchema = new Schema({
    name: {type: String, required: true, minlength: 2},
    age: {type: Number, required: true},
    favFood: {type: String, required: true, minlength: 5}
}, {timestamps:true})
//make model
mongoose.model('Fox', foxSchema);
const Fox = mongoose.model('Fox');


app.listen(port, function(){
    console.log(`listening on port: ${port}`)
});