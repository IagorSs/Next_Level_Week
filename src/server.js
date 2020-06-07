const express = require("express");
const server = express();

const db = require("./database/db.js");

server.use(express.static("public"));

// enable server to work with req.body
server.use(express.urlencoded({ extended: true }));

const nunjucks = require("nunjucks");

nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

server.get("/", (req,res) => res.render("index.html"));

server.get("/create-point", (req,res) => res.render("create-point.html", { saved: false }));

server.post("/savepoint", (req,res) => {

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values =  [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err){
            console.log(err);
            return res.send("Erro no cadastro!");
        }
        return res.render("create-point.html", { saved: true });
    }

    db.run(query,values, afterInsertData);
});

// for consult all database
server.get("/alldatabase", (req,res) => {
    db.all(`SELECT * FROM places`, function(err,rows) {
        if(err) return console.log(err);

        return res.render("search-results.html", { places: rows, total: rows.length});
    });
});

server.get("/search", (req,res) => {

    const search = req.query.search;

    if(search == "") return res.render("search-results.html", { total: 0});

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err,rows) {
        if(err) return console.log(err);

        return res.render("search-results.html", { places: rows, total: rows.length});
    });
});

// initializes the server
server.listen(3000);