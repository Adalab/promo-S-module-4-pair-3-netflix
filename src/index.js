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

// ENDPOING LOGIN

server.post("/login", (req, res) => {
  const data = req.body;
  console.log(data);
  let sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  let value = [req.body.email, req.body.password];
  connection
    .query(sql, value)
    .then(([results, fields]) => {
      console.log(results);
      if (results.length === 1) {
        res.json({
          success: true,
          userId: results[0].idUSers,
        });
      } else {
        res.json({
          success: false,
          errorMessage: "Usuaria/o no encontrada/o",
        });
      }
    })
    .catch((err) => {
      throw err;
    });
});

// configurar motor de plantillas
server.set("view engine", "ejs");

// RUTAS DINÁMICAS

server.get("/movie/:movieId", (req, res) => {
  const moviesId = req.params.movieId;
  const sql = "SELECT * FROM movies WHERE idmovies= ?";
  connection
    .query(sql, [moviesId])
    .then(([results, fields]) => {
      console.log(results);
      res.render("movies_detail", results[0]);
    })
    .catch((err) => {
      throw err;
    });
});

// Rutas estáticas

const staticServerPathWeb = "./src/public-react";
server.use(express.static(staticServerPathWeb));
const staticServerPathImage = "./src/public-movies-images";
server.use(express.static(staticServerPathImage));
