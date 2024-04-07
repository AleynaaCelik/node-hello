const express = require('express');
const http = require('http');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

const dbConnection = mysql.createConnection({
  host: 'lab-db.c58o6246ixe9.eu-west-1.rds.amazonaws.com',
  user: 'admin',
  password: '6qj0hOm9ILRHIzOtfHh0',
  database: 'students'
});

dbConnection.connect((err) => {
  if (err) {
    console.error('Database connection failed: ', err);
    return;
  }
  console.log('Connected to the database.');
});

app.get("/students", (req, res) => {
  dbConnection.query("SELECT * FROM students", (err, results, fields) => {
    if (err) {
      console.log("Database query error: ", err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while fetching students."
      });
    } else {
      res.status(200).json({
        status: "success",
        data: results,
      });
    }
  });
});

app.post("/students/add/:ad/:surname", (req, res)=> {
  const sql = "INSERT INTO students (ad, surname) VALUES (?, ?)";
  dbConnection.query(sql, [req.params.ad, req.params.surname], (err, results, fields) => {
    if (err) {
      console.log("Database query error: ", err);
      res.status(500).json({
        status: "error",
        message: "An error occurred while adding the student."
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Student added successfully."
      });
    }
  });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
