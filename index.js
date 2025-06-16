import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";


// server variables
const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "1234",
  port: 5432
});
let posts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

db.connect(console.log("DB CONNECTION SUCCESS"));
db.query("SELECT * FROM blog_posts", (err, result) => {
  if (err) {
    console.error("DB QUERY ERROR: ", err);
    res.redirect("/error");
  } else {
    posts = result.rows;
    console.log("QUERY SUCCESS: ", posts[0].title);
  }
  db.end(console.log("DB CONNECTION ENDED"));
});


// routes
app.get("/", (req, res) => {
  const date = new Date();

  res.render(__dirname + "/views/home.ejs", res.locals = {
    dir: __dirname,
    year: date.getFullYear(),
  });
});

app.get("/blog", (req, res) => {
  try {
    const date = new Date();

    res.render(
      __dirname + "/views/blog.ejs",
      res.locals = {
        dir: __dirname,
        year: date.getFullYear(),
        posts: posts
      }
    );
  } catch (err) {
      console.error(err);
      res.redirect("/error");
  }
});

app.post("/blog/get-blog-post", (req, res) => {
  
  try {
    posts.forEach(post => {
      if (post.title == req.body.title) {
        res.render(__dirname + "/views/post.ejs", 
          res.locals = { dir: __dirname, post: post });
      }
    });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

app.get("/vendors", (req, res) => {
  try {
    res.render(__dirname + "/views/vendors.ejs", 
      res.locals = {dir: __dirname}
    );
  } catch (err) {
    console.error("ERROR RENDERING VENDORS PAGE: ", err);
    res.redirect("/error");
  }
});

app.get("/error", (req, res) => {
    res.render(__dirname + "/views/error.ejs");
});


// app is listening on specified port
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});