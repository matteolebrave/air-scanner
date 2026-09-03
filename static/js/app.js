
// ======================================================
// INITIALISATION DE LA CARTE
// ======================================================

const map = L.map("map").setView(
    [48.8566, 2.3522],
    8
);

// ======================================================
// LÉGENDE D'ALTITUDE
// ======================================================

const altitudeLegend = L.control({
    position: "bottomright"
});


altitudeLegend.onAdd = function(map) {

    const div = L.DomUtil.create(
        "div",
        "altitude-legend"
    );


    div.innerHTML = `

        <div class="altitude-gradient">

            <span
                class="altitude-tick"
                style="left: 0%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 3.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 7%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 14%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 21.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 28.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 35.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 42.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 57.5%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 78%;"
            ></span>

            <span
                class="altitude-tick"
                style="left: 100%;"
            ></span>

        </div>


        <div class="altitude-labels">

            <span
                class="altitude-label first"
                style="left: 0%;"
            >
                0
            </span>

            <span
                class="altitude-label"
                style="left: 3.5%;"
            >
                500
            </span>

            <span
                class="altitude-label"
                style="left: 7%;"
            >
                1 000
            </span>

            <span
                class="altitude-label"
                style="left: 14%;"
            >
                2 000
            </span>

            <span
                class="altitude-label"
                style="left: 21.5%;"
            >
                4 000
            </span>

            <span
                class="altitude-label"
                style="left: 28.5%;"
            >
                6 000
            </span>

            <span
                class="altitude-label"
                style="left: 35.5%;"
            >
                8 000
            </span>

            <span
                class="altitude-label"
                style="left: 42.5%;"
            >
                10 000
            </span>

            <span
                class="altitude-label"
                style="left: 57.5%;"
            >
                20 000
            </span>

            <span
                class="altitude-label"
                style="left: 78%;"
            >
                30 000
            </span>

            <span
                class="altitude-label last"
            >
                40 000+
            </span>

        </div>
    `;




    // Empêche les clics sur la légende
    // de déplacer la carte

    L.DomEvent.disableClickPropagation(div);


    return div;
};


altitudeLegend.addTo(map);



L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);



// Liste des marqueurs actuellement présents
let markers = [];



// ======================================================
// LANCER LE SCAN
// ======================================================

async function lancerScan(recentrer = true) {


    // Récupération des valeurs des champs

    const latitude =
        document.getElementById("latitude").value;

    const longitude =
        document.getElementById("longitude").value;

    const radius =
        document.getElementById("radius").value;


    // Vérification simple

    if (
        latitude === "" ||
        longitude === "" ||
        radius === ""
    ) {

        alert("Veuillez remplir les trois champs.");

        return;
    }


    // Désactive le bouton pendant le scan

    const bouton =
        document.querySelector(".scan-button");

    bouton.disabled = true;

    bouton.textContent = "SCAN EN COURS...";


    try {


        // ==================================================
        // REQUÊTE VERS PYTHON
        // ==================================================

        const response = await fetch(

            "/scan?" +

            "latitude=" +
            encodeURIComponent(latitude) +

            "&longitude=" +
            encodeURIComponent(longitude) +

            "&radius=" +
            encodeURIComponent(radius)

        );


        // Vérifie si Python a répondu correctement

        if (!response.ok) {

            throw new Error(
                "Erreur lors de la requête."
            );

        }


        // Récupération du JSON

        const data =
            await response.json();


        console.log("Réponse Python :", data);


        // ==================================================
        // AFFICHAGE
        // ==================================================

        afficherAvionsCarte(data.avions);

        afficherListeAvions(data.avions);


        // Centre la carte sur la zone demandée

        // Centre la carte uniquement lors d'un scan manuel

        if (recentrer) {

            map.setView(
                [
                    data.latitude,
                    data.longitude
                ],
                8
            );

        }


    } catch (error) {

        console.error(error);

        alert(
            "Une erreur est survenue pendant le scan."
        );

    }


    // Réactive le bouton

    bouton.disabled = false;

    bouton.textContent = "LANCER LE SCAN";

}

// Actualisation //

let scanTimeout = null;

async function demarrerActualisation() {

    // On surrpime  une éventuelle actualisation précédente
    if (scanTimeout !== null) {
        clearTimeout(scanTimeout);
    }

    // Premier scan : on recentre la carte
    await lancerScan(true);

    async function actualiser() {

        // Scan automatique : on ne bouge PAS la carte
        await lancerScan(false);

        // On attend 10 000 ms avant le prochain scan
        scanTimeout = setTimeout(actualiser, 5000);
    }

    // Premier scan automatique dans 10 secondes
    scanTimeout = setTimeout(actualiser, 5000);
}

// ======================================================
// COULEUR SELON L'ALTITUDE
// ======================================================

const altitudeColors = [

    { altitude: 0,     color: [244, 91, 10] },    // orange/rouge
    { altitude: 500,   color: [244, 91, 10] },
    { altitude: 1000,  color: [244, 127, 10] },
    { altitude: 2000,  color: [249, 185, 26] },
    { altitude: 4000,  color: [242, 214, 0] },
    { altitude: 6000,  color: [169, 208, 0] },
    { altitude: 8000,  color: [43, 197, 27] },
    { altitude: 10000, color: [20, 187, 154] },
    { altitude: 20000, color: [28, 188, 210] },
    { altitude: 30000, color: [77, 71, 229] },
    { altitude: 40000, color: [224, 0, 207] }

];


function couleurSelonAltitude(altitude) {

    // Au-dessus de 40 000 m
    if (altitude >= 40000) {

        const c = altitudeColors[altitudeColors.length - 1].color;

        return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }


    // En dessous de 0 m
    if (altitude <= 0) {

        const c = altitudeColors[0].color;

        return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    }


    // Recherche des deux couleurs entre lesquelles
    // l'altitude se trouve

    for (let i = 0; i < altitudeColors.length - 1; i++) {

        const min = altitudeColors[i];
        const max = altitudeColors[i + 1];


        if (
            altitude >= min.altitude &&
            altitude <= max.altitude
        ) {

            // Position entre les deux paliers
            const ratio =
                (altitude - min.altitude) /
                (max.altitude - min.altitude);


            // Interpolation RGB

            const r = Math.round(
                min.color[0] +
                (max.color[0] - min.color[0]) * ratio
            );

            const g = Math.round(
                min.color[1] +
                (max.color[1] - min.color[1]) * ratio
            );

            const b = Math.round(
                min.color[2] +
                (max.color[2] - min.color[2]) * ratio
            );


            return `rgb(${r}, ${g}, ${b})`;
        }
    }


    return "black";
}


// ======================================================
// AFFICHER LES AVIONS SUR LA CARTE
// ======================================================

function afficherAvionsCarte(avions) {


    // --------------------------------------------------
    // Suppression des anciens marqueurs
    // --------------------------------------------------

    markers.forEach(

        marker => map.removeLayer(marker)

    );

    markers = [];


    // --------------------------------------------------
    // Création des nouveaux marqueurs
    // --------------------------------------------------

    avions.forEach(avion => {


        // true_track fourni par OpenSky
        //
        // 0   = Nord
        // 90  = Est
        // 180 = Sud
        // 270 = Ouest

        const orientation =
            avion["true_track"] ?? 0;

        
        const altitude = avion["geo_altitude"];

        let couleur;

        if (avion["on_ground"] === true) {

            couleur = "black";

        } else if (altitude == null) {

            couleur = "black";

        } else {

            couleur = couleurSelonAltitude(altitude);

        }


        // Création de l'icône

        const avionIcon = L.divIcon({

            className: "avion-icon",

            html: `
                <div
                    class="avion-image"
                    style="
                        background-color: ${couleur};
                        transform: rotate(${orientation}deg);
                    "
                ></div>
            `,

            iconSize: [40, 40],

            iconAnchor: [20, 20]

        });



        // Création du marqueur

        const marker = L.marker(

            [
                avion["latitude"],
                avion["longitude"]
            ],

            {
                icon: avionIcon
            }

        ).addTo(map);


        // --------------------------------------------------
        // Popup
        // --------------------------------------------------

        marker.bindPopup(`

            <strong>
                ${avion["callsign"] || "Inconnu"}
            </strong>

            <br><br>

            Altitude :
            ${avion["geo_altitude"] ?? "N/A"}

            <br>

            Cap :
            ${orientation}°

            <br>

            Latitude :
            ${avion["latitude"]}

            <br>

            Longitude :
            ${avion["longitude"]}

        `);


        // Ajoute le marqueur à notre tableau

        markers.push(marker);

    });

}



// ======================================================
// AFFICHER LA LISTE DES AVIONS
// ======================================================



function afficherListeAvions(avions) {


    const liste =
        document.getElementById("aircraft-list");


    // Vide la liste

    liste.innerHTML = "";


    // Aucun avion

    if (
        !avions ||
        avions.length === 0
    ) {

        liste.innerHTML = `
            <div>
                Aucun avion trouvé.
            </div>
        `;

        return;
    }


    // --------------------------------------------------
    // Création d'un élément pour chaque avion
    // --------------------------------------------------

    avions.forEach((avion, index) => {


        const element =
            document.createElement("div");


        element.className =
            "aircraft";


        const callsign =
            avion["callsign"] || "Inconnu";


        const altitude =
            avion["altitude"] ?? "N/A";


        const orientation =
            avion["true_track"] ?? 0;


        element.innerHTML = `

            <div class="aircraft-callsign">

                ✈ ${callsign}

            </div>

            <div class="aircraft-info">

                Altitude :
                ${altitude}

                <br>

                Cap :
                ${orientation}°

                <br>

                Position :
                ${Number(avion["latitude"]).toFixed(4)},
                ${Number(avion["longitude"]).toFixed(4)}

            </div>

        `;


        // --------------------------------------------------
        // Clic sur un avion dans la liste
        // --------------------------------------------------

        element.onclick = function() {


            const marker =
                markers[index];


            if (!marker) {
                return;
            }


            // Centre la carte sur l'avion

            map.setView(

                [
                    avion["latitude"],
                    avion["longitude"]
                ],

                10

            );


            // Ouvre le popup

            marker.openPopup();

        };


        // Ajoute l'avion à la liste

        liste.appendChild(element);

    });

}
