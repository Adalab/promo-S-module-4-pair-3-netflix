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
//fichero de conexión con mongoDB
const dbConnect = require("../config/conexion");
dbConnect();

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

// ENDPOINT LOGIN

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

//ENDPOINT DE MANGODB
const Movies = require("../models/movies");
server.get("/movies_all_mongo", (req, res) => {
  let genreparams = req.query.genre;
  if (genreparams === "") {
    Movies.find({}).then((docs, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
        res.json({
          success: true,
          movies: docs,
        });
      }
    });
  } else {
    Movies.find({ genre: genreparams }).then((docs, err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(docs);
        res.json({
          success: true,
          movies: docs,
        });
      }
    });
  }
});

//ENDOPOINT FAVORITES
const favorite = require("../models/Favorites");
server.post("/favorites-add", (req, res) => {
  let idMovie = ObjectId("64328d2f4081277ad2d7384e")
  let idUser = ObjectId("64328eee4081277ad2d73851")
  const favorite = new Favorites(
     {
     idUser: idMovie
     idMovie: idUser
     score: 10
     }
  );
  favorite.save(function (err, doc) {
  res.json(doc);
  });
  });
