const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "kadriye",
    password: "123456",
    database: "retourenmanager"
});


db.connect((err) => {

    if (err) {
        console.error("Datenbankfehler:", err);
        return;
    }

    console.log("Mit Datenbank verbunden");

});


app.get("/", (req, res) => {

    res.send("RetourenManager läuft");

});


app.get("/retouren", (req, res) => {

    db.query(
        "SELECT * FROM retouren",
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(results);

        }
    );

});


app.post("/retouren", (req, res) => {


    const {
        bestellnummer,
        kundenname,
        produktname,
        retourengrund,
        status,
        erstellt_am

    } = req.body;



    const sql = `
        INSERT INTO retouren
        (
            bestellnummer,
            kundenname,
            produktname,
            retourengrund,
            status,
            erstellt_am
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            bestellnummer,
            kundenname,
            produktname,
            retourengrund,
            status,
            erstellt_am
        ],

        (err, result) => {


            if(err){

                return res.status(500).json(err);

            }


            res.json({
                message:"Retoure erfolgreich gespeichert"
            });


        }
    );


});

// Retoure Status ändern
app.put("/retouren/:id", (req, res) => {

    const id = req.params.id;

    const { status } = req.body;


    const sql = `
        UPDATE retouren
        SET status = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            status,
            id
        ],

        (err, result) => {


            if (err) {

                return res.status(500).json(err);

            }


            res.json({

                message: "Status erfolgreich geändert"

            });


        }

    );


});

// Retoure löschen
app.delete("/retouren/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM retouren WHERE id = ?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Retoure erfolgreich gelöscht"
            });

        }
    );

});

app.listen(3000, () => {

    console.log("Server läuft auf Port 3000");

});



