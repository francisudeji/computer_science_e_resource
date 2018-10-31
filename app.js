const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "static/uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage });

const PORT = 1234;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/static"));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Allow-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "computer_science_e_resource",
  connectTimeout: 999999
});


connection.connect((err, result) => {
  if (err) throw err;

  setInterval(function(e) {
    connection.query("SELECT * FROM book", function(err, result) {
      console.log("CONNECTION_KEEP_ALIVE")
    })
  }, 3000);

  app.listen(PORT, error => {
    if (err) console.log("server error", {error});
    console.log(
      `>MySQL Database Connection Successful on thread ${
      connection.threadId
      }\n>Server started on port ${PORT} :)`
    );
  });
});



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/books", (req, res) => {
  connection.query("SELECT * FROM book", function(error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      status: 200,
      responseText: "ok",
      books: results
    });
  });
});

app.post("/api/books", upload.fields([{name: 'cover', maxCount: 1}, {name: 'file', maxCount: 1}]), (req, res) => {
  const bookInfo = {
    title: req.body.title,
    category: req.body.category,
    cover: req.files['cover'][0].filename,
    file: req.files['file'][0].filename
  }

  connection.query("INSERT INTO book SET ?", bookInfo, function (error, results, fields) {
    if (error) throw error;
    res.status(201).json({
      status: 201,
      responseText: "Book resource created",
      results
    });
  });
});

app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id

  connection.query(`DELETE FROM book WHERE id=${connection.escape(id)}`, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      status: 200,
      responseText: "Book resource deleted",
      results
    });
  });
});
