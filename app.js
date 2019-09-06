//jshint: ejsversion:6

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const express = require("express");

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true
});

const Article = mongoose.model("Article", {
    title: String,
    content: String
})

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

////////////////////// Requests Targeting All Articles ///////////////////

app.route("/articles")
    .get(function(req, res) {
        Article.find({}, function(err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post(function(req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err) {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err)
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if (!err) {
                res.send("Successfully deleted all articles.")
            } else {
                res.send(err);
            }
        })
    });

////////////////////// Requests Targeting a Specific Articles ///////////////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({
            title: req.params.articleTitle
        }, function(err, foundArticles) {
            if (!err) {
                if (foundArticles) {
                    res.send(foundArticles)
                } else {
                    res.send("No matching articles.")
                }
            } else {
                res.send(err);
            }
        })
    })
    .put(function(req, res) {
        Article.update({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },
            function(err) {
                if (!err) {
                    res.send("Successfully updated article.");
                }
            }
        )
    })
    .patch(function(req, res) {
        Article.update({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function(err) {
                if (!err) {
                    res.send("Successfully patched article.");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .delete(function(req, res) {
        Article.deleteOne({
            title: req.params.articleTitle
        }, function(err) {
            if (!err) {
                res.send("Successfully deleted an article.")
            } else {
                res.send(err);
            }
        })
    });

////////////////////// Server ///////////////////

app.listen(port, () => console.log("App listening on port " + port));
