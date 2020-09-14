//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");

mongoose.connect(
  "mongodb+srv://admin-kmashao:iamadmin@todolist-tilof.gcp.mongodb.net/blogdb",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

var db = mongoose.connection;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("connected to database");

  const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      min: [5, "Title minimum characters - 5"],
      required: [true, "Title not provided"],
    },
    content: {
      type: String,
      min: [10, "minimum blog characters - 10"],
      required: [true, "blog content not provided"],
    },
  });

  const Blog = mongoose.model("blog", blogSchema);

  app.get("/", (req, res) => {
    Blog.find({}, (err, posts) => {
      if (err) console.error(err);
      else
        res.render("home", { startContent: homeStartingContent, posts: posts });
    });
  });

  app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
  });

  app.get("/compose", (req, res) => {
    res.render("compose");
  });

  app.get("/posts/:postId", (req, res) => {
    
    const postId = req.params.postId;
 
    Blog.findById(postId, (err, post) => {
        console.log(post);
      if (err) {
        console.error(err);
        res.redirect("/");
      } else if (_.isEmpty(post)) {
        res.redirect("/");
      } else {
        res.render("post", {
          title: post.title,
          content: post.content,
        });
      }
    });
  });

  app.post("/compose", (req, res) => {
    const title = req.body.postTitle;
    const content = req.body.content;

    const posts = new Blog({
      title: title,
      content: content,
    });

    posts.save((err, post) => {
      if (!err) {
        console.log("added new blog post\n");
        console.log(post);
        res.redirect("/");
      } else {
        console.error(err);
        res.redirect("/compose");
      }
    });
  });

  let port = process.env.PORT;
    if (_.isEmpty(port)) {
        port = 3000;
    }

  app.listen(port, function () {
    console.log("Server started succesfully");
  });
});
