//Dependencies 
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//set port
var PORT = 3000;

//require models
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

//scraping tools
var request = require("request");
var cheerio = require("cheerio");
//set mongoose so leverage ES6 promises
mongoose.Promise = Promise;
// Initialize Express
var app = express();

//use bodyparser
app.use(bodyParser.urlencoded({
  extended: false
}));

//database config with mongoose
mongoose.connect("mongodb://localhost/homeworkdb");
var db = mongoose.connection;

db.on("error", function(error){
	console.log(error);
});

db.once("open", function(){
	console.log("Successfully connected to database!")
});


//setup handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Make public a static dir
app.use(express.static("public"));

app.get("/scrape", function(req, res){

	Article.remove({}, function(err, doc){
		if(err){
			console.log("collection couldnt be removed " + err);
			return;
		}else{
			console.log("collection deleted");
		}
	});

	//make request to site which will be scaped
	request("http://digg.com/", function(err, response, html){
		//load the html into cheerio and save % as a shorthand selector
		var $ = cheerio.load(html);

		//pick out pices of each element and assign them as key value pairs in the result object
		$("article").each(function(i, element){


				var result = {};

	 			result.title = $(element).find("a.digg-story__title-link").text();

	 			result.caption = $(element).find("div.digg-story__content").find("div.entry-content").text();

	 			result.link = $(element).find("a.digg-story__title-link").attr("href");

	 			console.log(result);

	 			var entry = new Article(result);

	 			console.log(result);

	 			entry.save(function(err, doc){
	 				if (err){
	 					console.log(err);
	 				}
	 				else{
	 					console.log(doc);
	 				}
	 			});
	 		
		});	   
	});


			res.render("scrape");
	
});



//display all as a json object
app.get("/articles",function(req,res){

	Article.find({}, function(err, result){
		if (err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});



//save new comments and link to correct article
app.post("/articles/:articleId",function(req,res){

	newComment = new Comment(req.body);

	newComment.save(function(err, result){

		Article.findOneAndUpdate({"_id": req.params.articleId}, {$push:{"comment": result._id}}, {new:true} ,function(err, doc){
			if (err){
				res.send(err)
			}else{
				res.send(doc)
			}
		});

	});
});






//diaplay the handlebars page
app.get("/", function(req, res){

	//find all and render in handlebars
		Article.find({}).populate("comment").exec(
		function(err, doc){
		if (err){
			res.send(err);
		}
		else{
			
			var hbsObject = {
				entry: doc
			};

			res.render("index", hbsObject);
			};
		});


});



app.delete("/comments/:id", function(req, res){

	Comment.remove({"_id": req.params.id}, function(err, doc){
		if(err){
			console.log("collection couldnt be removed " + err);
			return;
		}else{
			console.log("collection deleted");
		}
	});
})



app.get("/articles/:articleId",function(req,res){

	Article.find({"_id": req.params.articleId}).populate("comment").exec(
		function(err, doc){
			if (err){
				res.send(err)
			}else{
				res.send(doc)
			}
		});
});



app.listen(PORT, function() {
  console.log("App running on port 3000!");
});
