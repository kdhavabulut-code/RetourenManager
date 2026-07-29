const API_URL = "http://localhost:3000/retouren";

const bestellnummerInput = document.getElementById("bestellnummer");
const kundennameInput = document.getElementById("kundenname");
const produktnameInput = document.getElementById("produktname");
const retourengrundInput = document.getElementById("retourengrund");

const speichernBtn = document.getElementById("speichernBtn");
const retourenListe = document.getElementById("retourenListe");

const sucheInput = document.getElementById("sucheInput");

const gesamtAnzahl = document.getElementById("gesamtAnzahl");
const offenAnzahl = document.getElementById("offenAnzahl");
const bearbeitetAnzahl = document.getElementById("bearbeitetAnzahl");
const erledigtAnzahl = document.getElementById("erledigtAnzahl");

let alleRetouren = [];





// ----------------------------
// Retoure Karte erstellen
// ----------------------------

function retoureKarteErstellen(retoure) {

   const div = document.createElement("div");

    div.className = "retoure";


    div.innerHTML = `

<div class="retoure-info">

    <h3>${retoure.kundenname}</h3>

    <p>
        <strong>Bestellung:</strong>
        ${retoure.bestellnummer}
    </p>

    <p>
        <strong>Produkt:</strong>
        ${retoure.produktname}
    </p>

    <p>
        <strong>Grund:</strong>
        ${retoure.retourengrund}
    </p>

    <p>
    <strong>Datum:</strong>
   ${new Date(retoure.erstellt_am).toLocaleDateString("de-DE")}
</p>

</div>


<div class="retoure-footer">

<select
    class="status ${retoure.status.toLowerCase()}"
    onchange="statusAendern(${retoure.id}, this.value)"
>

<option value="Offen"
${retoure.status === "Offen" ? "selected" : ""}>
🟠 Offen
</option>


<option value="Bearbeitet"
${retoure.status === "Bearbeitet" ? "selected" : ""}>
🔵 Bearbeitet
</option>


<option value="Erledigt"
${retoure.status === "Erledigt" ? "selected" : ""}>
🟢 Erledigt
</option>


</select>


<button onclick="retoureLoeschen(${retoure.id})">
Löschen
</button>


</div>

`;


    return div;

}


function dashboardAktualisieren() {


    gesamtAnzahl.textContent = alleRetouren.length;


    offenAnzahl.textContent =
        alleRetouren.filter(
            retoure => retoure.status === "Offen"
        ).length;


    bearbeitetAnzahl.textContent =
        alleRetouren.filter(
            retoure => retoure.status === "Bearbeitet"
        ).length;


    erledigtAnzahl.textContent =
        alleRetouren.filter(
            retoure => retoure.status === "Erledigt"
        ).length;

}

// ----------------------------
// Retouren laden
// ----------------------------

async function ladeRetouren() {

    try {

        const response = await fetch(API_URL);

        const daten = await response.json();

alleRetouren = daten;

dashboardAktualisieren(daten);

retourenListe.innerHTML = "";


        daten.forEach(retoure => {


            const div = retoureKarteErstellen(retoure);


            retourenListe.appendChild(div);


        });


    } catch (error) {

        console.error("Liste hatası:", error);

    }

}

// ----------------------------
// Formular leeren
// ----------------------------

function formularLeeren() {

    bestellnummerInput.value = "";
    kundennameInput.value = "";
    produktnameInput.value = "";
    retourengrundInput.value = "";

}


// ----------------------------
// Neue Retoure speichern
// ----------------------------

speichernBtn.addEventListener("click", async () => {


    if (
        bestellnummerInput.value.trim() === "" ||
        kundennameInput.value.trim() === "" ||
        produktnameInput.value.trim() === "" ||
        retourengrundInput.value.trim() === ""
    ) {

        alert("Bitte alle Felder ausfüllen");

        return;

    }

    const retoure = {

        bestellnummer: bestellnummerInput.value,

        kundenname: kundennameInput.value,

        produktname: produktnameInput.value,

        retourengrund: retourengrundInput.value,

        status: "Offen",

        erstellt_am: new Date().toISOString().slice(0, 10)

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(retoure)

        });

        const data = await response.json();

        console.log("Server Antwort:", data);

        if (!response.ok) {

            throw new Error(JSON.stringify(data));

        }

        alert("Retoure gespeichert");

        formularLeeren();

        ladeRetouren();

    } catch (error) {

        console.error("Speicher Fehler:", error);

        alert("Fehler beim Speichern");

    }

});

async function statusAendern(id, status) {

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })

        });


        if (!response.ok) {

            throw new Error("Status konnte nicht geändert werden.");

        }


        ladeRetouren();


    } catch (error) {

        console.error(error);

        alert("Fehler beim Ändern des Status.");

    }

}

sucheInput.addEventListener("input", function() {

    const suchbegriff = sucheInput.value.toLowerCase();


    const gefilterteRetouren = alleRetouren.filter(retoure => {

        return (
            retoure.kundenname.toLowerCase().includes(suchbegriff) ||
            retoure.bestellnummer.toLowerCase().includes(suchbegriff)
        );

    });


    retourenListe.innerHTML = "";


    if (gefilterteRetouren.length === 0) {

        retourenListe.innerHTML = `
            <p class="keine-retouren">
                Keine Retouren gefunden
            </p>
        `;

        return;

    }


    gefilterteRetouren.forEach(retoure => {

        const div = retoureKarteErstellen(retoure);

        retourenListe.appendChild(div);

    });


});
// ----------------------------
// Retoure löschen
// ----------------------------

async function retoureLoeschen(id) {

    const bestaetigung = confirm(
        "Möchten Sie diese Retoure wirklich löschen?"
    );

    if (!bestaetigung) {
        return;
    }

    await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    ladeRetouren();

}

ladeRetouren();
