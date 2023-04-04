const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

// create and config server
const server = express();
server.use(cors());
server.use(express.json({ limit: "10mb" }));

// Variable  que guarda la conexion

let connection;

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// conexión BD

mysql
  .createConnection({
    host: "sql.freedb.tech",
    database: "freedb_projectpair-3",
    user: "freedb_projectpair-root",
    password: "$sC9$tqgs5W!EWM",
  })
  .then((conn) => {
    connection = conn;
    connection
      .connect()
      .then(() => {
        console.log(
          `Conexión establecida con la base de datos (identificador=${connection.threadId})`
        );
      })
      .catch((err) => {
        console.error("Error de conexion: " + err.stack);
      });
  })
  .catch((err) => {
    console.error("Error de configuración: " + err.stack);
  });

//ESCRIBIMOS EL ENDPOINT

server.get("/movies", (req, res) => {
  console.log("Pidiendo a la base de datos información de los movies.");
  console.log(req.query.genre);
  const genreFilterParam = req.query.genre;
  console.log(genreFilterParam);
  let sql;
  if (genreFilterParam === "") {
    sql = "SELECT * FROM movies";
  } else {
    sql = `SELECT * FROM movies WHERE genre LIKE "${genreFilterParam}"`;
    console.log(sql);
  }
  connection
    .query(sql)
    .then(([results, fields]) => {
      console.log("Información recuperada:");
      results.forEach((result) => {
        console.log(result);
      });

      res.json({
        success: true,
        movies: results,
      });
    })
    .catch((err) => {
      throw err;
    });
});
