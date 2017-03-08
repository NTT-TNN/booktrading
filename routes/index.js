var express = require('express');
var passport=require('passport');
var router = express.Router();

var books = require('../models/book');
var booksGG = require('google-books-search-2');
var trads = require('../models/trad');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{message:req.flash('loginMessage')});
});
router.get('/allBook',function(req,res,next){
	books.find({},function(err,docs){
		if(err) throw err;
		res.render('allBooks');
	})
})
router.get('/allBooks',function(req,res,next){
	books.find({},function(err,docs){
		console.log(docs);
		res.json(docs);
	});
})
router.get('/myBook',function(req,res,next){
	console.log(req.user.local.email);
	res.render('myBooks');
})
router.get('/myBooks',function(req,res,next){
	console.log(req.user.local.email);
	books.find({owner:req.user.local.email},function(err,docs){
		res.json(docs);
	});
})
router.delete('/delmyBooks',function(req,res,next){
	console.log(req.body.id);
	// console.log(req.user.local.email);
	books.remove({ _id: req.body.id }, function (err) {
	    if (err){
	        console.log(err);
	    }
    	console.log('removed! ' + JSON.stringify(books))
	});
	books.find({},function(err,docs){
		res.json(docs);
	});
})
router.post('/tradBooks',function(req,res,next){
	books.find({_id:req.body.id},function(err,results){
				if(err) throw err;
				console.log(results);
				var newTrad = new trads({
					title:results[0].title,
					owner:req.user.local.email
				});
				newTrad.save(function(err){
		        if(err) throw err;
		        console.log("luu du lieu thanh cong");
		      })
		})
})
router.post('/myBooks',function(req,res,next){
	booksGG.search(req.body.bookName).then(function(result){
		console.log(result[0]);
		var newBook = new books({
			title:result[0].title,
			owner:req.user.local.email,
			thumbnail: result[0].thumbnail
		});
		newBook.save(function(err){
        if(err) throw err;
        console.log("luu du lieu thanh cong");
      })
		books.find({owner:req.user.local.email},function(err,results){
				if(err) throw err;
				console.log(results);
				res.render("myBooks");
		})
	}).catch(function (err) {
  		console.error(err);
	});
})
router.get('/myTrad',function(req,res,next){
	trads.find({owner:req.user.local.email},function(err,results){
		if(err){
			console.log("Loi"+err);
		}
		res.json(results);
	})
})
router.get('/tradToMe',function(req,res,next){
	trads.find({},function(err,results){
		if(err){
			console.log("Loi"+err);
		}
		var docs=[];
		for(var i=0;i<results.length;i++){
			if(results[i].owner === req.user.local.email){

			}else{
				docs.push(results[i]);
			}
		}
		res.json(docs);
	})
})
router.delete('/delmyTrads',function(req,res,next){
	console.log(req.body.id);
	// console.log(req.user.local.email);
	trads.remove({ _id: req.body.id }, function (err) {
	    if (err){
	        console.log(err);
	    }
    	console.log('remove completed! ');
	});
	trads.find({},function(err,docs){
		res.json(docs);
	});
})
router.delete('/addBooks',function(req,res,next){
	console.log(req.body.id);
	console.log(req.body.title);
	trads.remove({ _id: req.body.id }, function (err) {
	    if (err){
	        console.log(err);
	    }
    	console.log('remove completed! ');
	});
	// books.find({title:'Lol'},function(err,result){
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	console.log(result);
	// 	result.owner=req.user.local.email;
	// 	result.save(function(err){
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		console.log("Chinh sua du lieu thanh cong!!!");
	// 	})
		
	// })
	books.update({ title: req.body.title }, { owner:req.user.local.email }, function (err) {
	    if (err) {
	        console.log(err);
	    }
	    console.log('update Completed');
	});

	books.find({owner:req.user.local.email},function(err,result){
		if(err){
			console.log(err);
		}
		res.json(result);
	})
})
 module.exports = router;
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }

  res.redirect('/');
}
