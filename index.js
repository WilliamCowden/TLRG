import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";


// server variables
const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
let posts = [];
let currentPost = {};
let errorMessage;

async function newQuery(queryString) {
  const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "1234",
    port: 5432,
  });
  try {
    await db.connect();
    console.log("DB_CONNECTION: connected");
    const result = await db.query(queryString);
    console.log("DB_CONNECTION: query successful");
    await db.end();
    console.log("DB_CONNECTION: connection ended");
    return result;

  } catch (err) {
    errorMessage = err;
    console.error("DB_CONNECTION: error! : ", err);
    res.redirect("/error");
  }
}

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


// route handlers
app.get("/", (req, res) => {
  const date = new Date();

  res.render(__dirname + "/views/index.ejs", res.locals = {
    dir: __dirname,
    year: date.getFullYear(),
  });
});

app.get("/blog", async (req, res) => {
  try {
    const date = new Date();

    posts = await newQuery("SELECT * FROM tye_blog");
    currentPost = posts.rows[0];
console.log(posts);
    res.render(
      __dirname + "/views/blog.ejs",
      res.locals = {
        dir: __dirname,
        year: date.getFullYear(),
        posts: posts.rows,
        currentPost: currentPost
      }
    );
  } catch (err) {
      console.error(err);
      res.redirect("/error");
  }
});

app.post("/blog/get-post", (req, res) => {

  try {
    posts.forEach(post => {
      if (post.title == req.body.title) {
        currentPost = post;
        res.redirect("/blog");
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