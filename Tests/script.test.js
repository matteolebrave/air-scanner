/**
 * Tests de static/script.js
 *
 * IMPORTANT :
 * Aucun changement n'est nécessaire dans script.js.
 */

const fs = require("fs");
const path = require("path");


// ======================================================
// CONFIGURATION JSDOM
// ======================================================

/**
 * On utilise le DOM fourni par Jest/jsdom.
 */
document.body.innerHTML = `
    <div id="map"></div>

    <input id="latitude">
    <input id="longitude">
    <input id="radius">

    <button class="scan-button">
        LANCER LE SCAN
    </button>

    <div id="aircraft-list"></div>
`;


// ======================================================
// MOCK DE LEAFLET
// ======================================================

function createFakeMap() {

    return {

        setView: jest.fn().mockReturnThis(),

        removeLayer: jest.fn(),

        addLayer: jest.fn(),

    };
}


const fakeMap = createFakeMap();


const fakeMarkers = [];


global.L = {

    map: jest.fn(() => fakeMap),

    control: jest.fn(() => ({

        onAdd: null,

        addTo: jest.fn(),

    })),

    DomUtil: {

        create: jest.fn((tag, className) => {

            const element =
                document.createElement(tag);

            element.className = className;

            return element;

        }),

        disableClickPropagation: jest.fn(),

    },

    tileLayer: jest.fn(() => ({

        addTo: jest.fn(),

    })),

    divIcon: jest.fn(options => options),

    marker: jest.fn((position, options) => {

        const marker = {

            position,

            options,

            bindPopup: jest.fn(),

            openPopup: jest.fn(),

        };

        fakeMarkers.push(marker);

        return {

            ...marker,

            addTo: jest.fn(() => marker),

        };

    }),

};


// ======================================================
// CHARGEMENT DU SCRIPT ORIGINAL
// ======================================================

const scriptPath =
    path.join(
        __dirname,
        "../static/js/app.js"
    );


const script = fs.readFileSync(
    scriptPath,
    "utf8"
);


// On exécute le script dans le contexte global
eval(script);


// ======================================================
// TESTS
// ======================================================


describe(
    "Air Scanner",
    () => {


        // ==================================================
        // COULEUR SELON ALTITUDE
        // ==================================================

        describe(
            "couleurSelonAltitude",
            () => {


                test(
                    "0 m doit être orange",
                    () => {

                        expect(
                            couleurSelonAltitude(0)
                        ).toBe(
                            "rgb(244, 91, 10)"
                        );

                    }
                );


                test(
                    "altitude négative doit être orange",
                    () => {

                        expect(
                            couleurSelonAltitude(-100)
                        ).toBe(
                            "rgb(244, 91, 10)"
                        );

                    }
                );


                test(
                    "500 m doit être orange",
                    () => {

                        expect(
                            couleurSelonAltitude(500)
                        ).toBe(
                            "rgb(244, 91, 10)"
                        );

                    }
                );


                test(
                    "1000 m doit être la couleur correspondante",
                    () => {

                        expect(
                            couleurSelonAltitude(1000)
                        ).toBe(
                            "rgb(244, 127, 10)"
                        );

                    }
                );


                test(
                    "2000 m doit être jaune",
                    () => {

                        expect(
                            couleurSelonAltitude(2000)
                        ).toBe(
                            "rgb(249, 185, 26)"
                        );

                    }
                );


                test(
                    "10000 m doit être turquoise",
                    () => {

                        expect(
                            couleurSelonAltitude(10000)
                        ).toBe(
                            "rgb(20, 187, 154)"
                        );

                    }
                );


                test(
                    "20000 m doit être cyan",
                    () => {

                        expect(
                            couleurSelonAltitude(20000)
                        ).toBe(
                            "rgb(28, 188, 210)"
                        );

                    }
                );


                test(
                    "30000 m doit être violet",
                    () => {

                        expect(
                            couleurSelonAltitude(30000)
                        ).toBe(
                            "rgb(77, 71, 229)"
                        );

                    }
                );


                test(
                    "40000 m doit être rose",
                    () => {

                        expect(
                            couleurSelonAltitude(40000)
                        ).toBe(
                            "rgb(224, 0, 207)"
                        );

                    }
                );


                test(
                    "au-dessus de 40000 m doit rester rose",
                    () => {

                        expect(
                            couleurSelonAltitude(45000)
                        ).toBe(
                            "rgb(224, 0, 207)"
                        );

                    }
                );


                test(
                    "une altitude intermédiaire doit être interpolée",
                    () => {

                        const couleur =
                            couleurSelonAltitude(1500);

                        expect(couleur).toMatch(
                            /^rgb\(\d+, \d+, \d+\)$/
                        );

                        expect(couleur).not.toBe(
                            "black"
                        );

                    }
                );

            }
        );


        // ==================================================
        // AFFICHER LA LISTE DES AVIONS
        // ==================================================

        describe(
            "afficherListeAvions",
            () => {


                beforeEach(() => {

                    document.getElementById(
                        "aircraft-list"
                    ).innerHTML = "";

                });


                test(
                    "doit afficher aucun avion si la liste est vide",
                    () => {

                        afficherListeAvions([]);

                        expect(
                            document.getElementById(
                                "aircraft-list"
                            ).textContent
                        ).toContain(
                            "Aucun avion trouvé."
                        );

                    }
                );


                test(
                    "doit afficher un avion",
                    () => {

                        const avions = [

                            {

                                callsign: "AFR123",

                                altitude: 10000,

                                true_track: 90,

                                latitude: 48.8566,

                                longitude: 2.3522

                            }

                        ];


                        afficherListeAvions(avions);


                        const liste =
                            document.getElementById(
                                "aircraft-list"
                            );


                        expect(
                            liste.children.length
                        ).toBe(1);


                        expect(
                            liste.textContent
                        ).toContain(
                            "AFR123"
                        );


                        expect(
                            liste.textContent
                        ).toContain(
                            "10000"
                        );


                        expect(
                            liste.textContent
                        ).toContain(
                            "90°"
                        );

                    }
                );


                test(
                    "doit afficher plusieurs avions",
                    () => {

                        const avions = [

                            {
                                callsign: "AFR123",
                                altitude: 10000,
                                true_track: 90,
                                latitude: 48,
                                longitude: 2
                            },

                            {
                                callsign: "BAW456",
                                altitude: 20000,
                                true_track: 180,
                                latitude: 49,
                                longitude: 3
                            },

                            {
                                callsign: "DLH789",
                                altitude: 30000,
                                true_track: 270,
                                latitude: 50,
                                longitude: 4
                            }

                        ];


                        afficherListeAvions(avions);


                        expect(
                            document.getElementById(
                                "aircraft-list"
                            ).children.length
                        ).toBe(3);

                    }
                );


                test(
                    "doit afficher Inconnu si le callsign est absent",
                    () => {

                        const avions = [

                            {

                                altitude: 5000,

                                true_track: 45,

                                latitude: 48,

                                longitude: 2

                            }

                        ];


                        afficherListeAvions(avions);


                        expect(
                            document.getElementById(
                                "aircraft-list"
                            ).textContent
                        ).toContain(
                            "Inconnu"
                        );

                    }
                );


                test(
                    "doit formater la latitude et longitude à 4 décimales",
                    () => {

                        const avions = [

                            {

                                callsign: "TEST",

                                altitude: 5000,

                                true_track: 45,

                                latitude: 48.85661234,

                                longitude: 2.35224567

                            }

                        ];


                        afficherListeAvions(avions);


                        const texte =
                            document.getElementById(
                                "aircraft-list"
                            ).textContent;


                        expect(texte).toContain(
                            "48.8566"
                        );


                        expect(texte).toContain(
                            "2.3522"
                        );

                    }
                );

            }
        );


        // ==================================================
        // AFFICHER LES AVIONS SUR LA CARTE
        // ==================================================

        describe(
            "afficherAvionsCarte",
            () => {


                beforeEach(() => {

                    fakeMap.removeLayer.mockClear();

                    L.marker.mockClear();

                    L.divIcon.mockClear();

                });


                test(
                    "doit créer un marqueur pour chaque avion",
                    () => {

                        const avions = [

                            {
                                callsign: "AFR123",
                                geo_altitude: 10000,
                                true_track: 90,
                                latitude: 48,
                                longitude: 2,
                                on_ground: false
                            },

                            {
                                callsign: "BAW456",
                                geo_altitude: 20000,
                                true_track: 180,
                                latitude: 49,
                                longitude: 3,
                                on_ground: false
                            }

                        ];


                        afficherAvionsCarte(avions);


                        expect(
                            L.marker
                        ).toHaveBeenCalledTimes(2);

                    }
                );


                test(
                    "doit supprimer les anciens marqueurs",
                    () => {

                        afficherAvionsCarte([

                            {

                                callsign: "TEST",

                                geo_altitude: 10000,

                                true_track: 0,

                                latitude: 48,

                                longitude: 2,

                                on_ground: false

                            }

                        ]);


                        const nombreAvant =
                            fakeMap.removeLayer
                                .mock.calls.length;


                        afficherAvionsCarte([]);


                        expect(
                            fakeMap.removeLayer
                                .mock.calls.length
                        ).toBeGreaterThan(
                            nombreAvant
                        );

                    }
                );


                test(
                    "un avion au sol doit être noir",
                    () => {

                        afficherAvionsCarte([

                            {

                                callsign: "GROUND",

                                geo_altitude: 100,

                                true_track: 0,

                                latitude: 48,

                                longitude: 2,

                                on_ground: true

                            }

                        ]);


                        const icon =
                            L.divIcon.mock
                                .calls[
                                    L.divIcon.mock.calls.length - 1
                                ][0];


                        expect(
                            icon.html
                        ).toContain(
                            "background-color: black"
                        );

                    }
                );


                test(
                    "un avion sans altitude doit être noir",
                    () => {

                        afficherAvionsCarte([

                            {

                                callsign: "NOALT",

                                geo_altitude: null,

                                true_track: 0,

                                latitude: 48,

                                longitude: 2,

                                on_ground: false

                            }

                        ]);


                        const icon =
                            L.divIcon.mock
                                .calls[
                                    L.divIcon.mock.calls.length - 1
                                ][0];


                        expect(
                            icon.html
                        ).toContain(
                            "background-color: black"
                        );

                    }
                );


                test(
                    "l'orientation de l'avion doit être utilisée",
                    () => {

                        afficherAvionsCarte([

                            {

                                callsign: "TEST",

                                geo_altitude: 10000,

                                true_track: 135,

                                latitude: 48,

                                longitude: 2,

                                on_ground: false

                            }

                        ]);


                        const icon =
                            L.divIcon.mock
                                .calls[
                                    L.divIcon.mock.calls.length - 1
                                ][0];


                        expect(
                            icon.html
                        ).toContain(
                            "rotate(135deg)"
                        );

                    }
                );

            }
        );


        // ==================================================
        // LANCER SCAN
        // ==================================================

        describe(
            "lancerScan",
            () => {


                beforeEach(() => {

                    document.getElementById(
                        "latitude"
                    ).value = "48.8566";


                    document.getElementById(
                        "longitude"
                    ).value = "2.3522";


                    document.getElementById(
                        "radius"
                    ).value = "100";


                    document.querySelector(
                        ".scan-button"
                    ).disabled = false;


                    document.querySelector(
                        ".scan-button"
                    ).textContent =
                        "LANCER LE SCAN";


                    global.fetch =
                        jest.fn();

                });


                test(
                    "doit refuser les champs vides",
                    async () => {

                        document.getElementById(
                            "latitude"
                        ).value = "";


                        const alertMock =
                            jest.spyOn(
                                window,
                                "alert"
                            ).mockImplementation(
                                () => {}
                            );


                        await lancerScan();


                        expect(
                            alertMock
                        ).toHaveBeenCalledWith(
                            "Veuillez remplir les trois champs."
                        );


                        alertMock.mockRestore();

                    }
                );


                test(
                    "doit appeler /scan avec les bons paramètres",
                    async () => {

                        global.fetch.mockResolvedValue({

                            ok: true,

                            json: async () => ({

                                avions: [],

                                latitude: 48.8566,

                                longitude: 2.3522

                            })

                        });


                        await lancerScan();


                        expect(
                            global.fetch
                        ).toHaveBeenCalledWith(

                            "/scan?latitude=48.8566&longitude=2.3522&radius=100"

                        );

                    }
                );


                test(
                    "doit afficher une alerte si la requête échoue",
                    async () => {

                        global.fetch.mockResolvedValue({

                            ok: false

                        });


                        const alertMock =
                            jest.spyOn(
                                window,
                                "alert"
                            ).mockImplementation(
                                () => {}
                            );


                        await lancerScan();


                        expect(
                            alertMock
                        ).toHaveBeenCalledWith(
                            "Une erreur est survenue pendant le scan."
                        );


                        alertMock.mockRestore();

                    }
                );


                test(
                    "doit réactiver le bouton après le scan",
                    async () => {

                        global.fetch.mockResolvedValue({

                            ok: true,

                            json: async () => ({

                                avions: [],

                                latitude: 48.8566,

                                longitude: 2.3522

                            })

                        });


                        await lancerScan();


                        const bouton =
                            document.querySelector(
                                ".scan-button"
                            );


                        expect(
                            bouton.disabled
                        ).toBe(false);


                        expect(
                            bouton.textContent
                        ).toBe(
                            "LANCER LE SCAN"
                        );

                    }
                );


                test(
                    "recentrer=false ne doit pas recentrer la carte",
                    async () => {

                        global.fetch.mockResolvedValue({

                            ok: true,

                            json: async () => ({

                                avions: [],

                                latitude: 48.8566,

                                longitude: 2.3522

                            })

                        });


                        fakeMap.setView.mockClear();


                        await lancerScan(false);


                        expect(
                            fakeMap.setView
                        ).not.toHaveBeenCalled();

                    }
                );


                test(
                    "recentrer=true doit recentrer la carte",
                    async () => {

                        global.fetch.mockResolvedValue({

                            ok: true,

                            json: async () => ({

                                avions: [],

                                latitude: 48.8566,

                                longitude: 2.3522

                            })

                        });


                        fakeMap.setView.mockClear();


                        await lancerScan(true);


                        expect(
                            fakeMap.setView
                        ).toHaveBeenCalledWith(

                            [
                                48.8566,
                                2.3522
                            ],

                            8

                        );

                    }
                );

            }
        );


        // ==================================================
        // CLIC SUR UN AVION
        // ==================================================

        describe(
            "clic sur un avion",
            () => {


                test(
                    "doit déplacer la carte au clic",
                    () => {

                        const avions = [

                            {
                                callsign: "AFR123",

                                geo_altitude: 10000,

                                altitude: 10000,

                                true_track: 90,

                                latitude: 48.8566,

                                longitude: 2.3522,

                                on_ground: false

                            }

                        ];


                        // Création du marqueur correspondant à l'avion
                        afficherAvionsCarte(avions);


                        // Création de la liste
                        afficherListeAvions(avions);


                        // On remet le mock à zéro
                        fakeMap.setView.mockClear();


                        // Récupération de l'avion dans la liste
                        const avion =
                            document.querySelector(".aircraft");


                        expect(avion).not.toBeNull();


                        // Simulation du clic
                        avion.click();


                        // Vérification du déplacement de la carte
                        expect(
                            fakeMap.setView
                        ).toHaveBeenCalledWith(

                            [
                                48.8566,
                                2.3522
                            ],

                            10

                        );

                    }
                );


            }
        );

    }
);


// ======================================================
// TESTS SUPPLÉMENTAIRES
// ======================================================

describe(
    "Tests complémentaires",
    () => {


        // ==================================================
        // POPUP DES AVIONS
        // ==================================================

        describe(
            "Popup d'un avion",
            () => {

                beforeEach(() => {

                    L.marker.mockClear();
                    L.divIcon.mockClear();

                });


                test(
                    "doit créer un popup avec le callsign",
                    () => {

                        afficherAvionsCarte([

                            {
                                callsign: "AFR123",
                                geo_altitude: 10000,
                                true_track: 90,
                                latitude: 48.8566,
                                longitude: 2.3522,
                                on_ground: false
                            }

                        ]);


                        const marker =
                            L.marker.mock.results[0].value;


                        expect(
                            marker.bindPopup
                        ).toHaveBeenCalled();


                        const popup =
                            marker.bindPopup.mock.calls[0][0];


                        expect(popup)
                            .toContain("AFR123");

                    }
                );


                test(
                    "le popup doit afficher l'altitude",
                    () => {

                        afficherAvionsCarte([

                            {
                                callsign: "TEST123",
                                geo_altitude: 12500,
                                true_track: 180,
                                latitude: 48,
                                longitude: 2,
                                on_ground: false
                            }

                        ]);


                        const marker =
                            L.marker.mock.results[0].value;


                        const popup =
                            marker.bindPopup.mock.calls[0][0];


                        expect(popup)
                            .toContain("12500");

                    }
                );


                test(
                    "le popup doit afficher N/A si l'altitude est absente",
                    () => {

                        afficherAvionsCarte([

                            {
                                callsign: "TEST123",
                                geo_altitude: null,
                                true_track: 180,
                                latitude: 48,
                                longitude: 2,
                                on_ground: false
                            }

                        ]);


                        const marker =
                            L.marker.mock.results[0].value;


                        const popup =
                            marker.bindPopup.mock.calls[0][0];


                        expect(popup)
                            .toContain("N/A");

                    }
                );


                test(
                    "le popup doit afficher les coordonnées",
                    () => {

                        afficherAvionsCarte([

                            {
                                callsign: "TEST123",
                                geo_altitude: 10000,
                                true_track: 90,
                                latitude: 48.8566,
                                longitude: 2.3522,
                                on_ground: false
                            }

                        ]);


                        const marker =
                            L.marker.mock.results[0].value;


                        const popup =
                            marker.bindPopup.mock.calls[0][0];


                        expect(popup)
                            .toContain("48.8566");


                        expect(popup)
                            .toContain("2.3522");

                    }
                );

            }
        );


        // ==================================================
        // VALEURS PAR DÉFAUT
        // ==================================================

        describe(
            "Valeurs par défaut",
            () => {


                test(
                    "true_track absent doit utiliser 0 degré",
                    () => {

                        afficherAvionsCarte([

                            {
                                callsign: "TEST",
                                geo_altitude: 10000,
                                latitude: 48,
                                longitude: 2,
                                on_ground: false
                            }

                        ]);


                        const icon =
                            L.divIcon.mock.calls[
                                L.divIcon.mock.calls.length - 1
                            ][0];


                        expect(icon.html)
                            .toContain(
                                "rotate(0deg)"
                            );

                    }
                );


                test(
                    "callsign absent doit afficher Inconnu dans le popup",
                    () => {

                        afficherAvionsCarte([

                            {
                                geo_altitude: 10000,
                                true_track: 90,
                                latitude: 48,
                                longitude: 2,
                                on_ground: false
                            }

                        ]);


                        const marker =
                            L.marker.mock.results[
                                L.marker.mock.results.length - 1
                            ].value;


                        const popup =
                            marker.bindPopup.mock.calls[0][0];


                        expect(popup)
                            .toContain("Inconnu");

                    }
                );

            }
        );


        // ==================================================
        // PARAMÈTRES DU SCAN
        // ==================================================

        describe(
            "Paramètres du scan",
            () => {


                beforeEach(() => {

                    document.getElementById(
                        "latitude"
                    ).value = "48.8566";


                    document.getElementById(
                        "longitude"
                    ).value = "2.3522";


                    document.getElementById(
                        "radius"
                    ).value = "100";


                    global.fetch =
                        jest.fn();


                    global.fetch.mockResolvedValue({

                        ok: true,

                        json: async () => ({

                            avions: [],

                            latitude: 48.8566,

                            longitude: 2.3522

                        })

                    });

                });


                test(
                    "doit correctement encoder les paramètres",
                    async () => {

                        document.getElementById(
                            "latitude"
                        ).value = "48.8566";


                        document.getElementById(
                            "longitude"
                        ).value = "2.3522";


                        document.getElementById(
                            "radius"
                        ).value = "100 km";


                        await lancerScan(false);


                        expect(
                            global.fetch
                        ).toHaveBeenCalledWith(

                            "/scan?latitude=48.8566&longitude=2.3522&radius=100%20km"

                        );

                    }
                );


                test(
                    "doit désactiver le bouton pendant le scan",
                    async () => {

                        let terminerFetch;

                        const fetchEnCours = new Promise(resolve => {
                            terminerFetch = resolve;
                        });


                        global.fetch = jest.fn(() => {

                            const bouton =
                                document.querySelector(
                                    ".scan-button"
                                );


                            // Le fetch est encore en cours ici
                            expect(bouton.disabled)
                                .toBe(true);


                            expect(bouton.textContent)
                                .toBe(
                                    "SCAN EN COURS..."
                                );


                            return fetchEnCours;

                        });


                        const scan =
                            lancerScan(false);


                        // Attend que fetch ait été appelé
                        await new Promise(resolve => {
                            setTimeout(resolve, 0);
                        });


                        expect(
                            global.fetch
                        ).toHaveBeenCalled();


                        // Libère le fetch
                        terminerFetch({

                            ok: true,

                            json: async () => ({

                                avions: [],

                                latitude: 48.8566,

                                longitude: 2.3522

                            })

                        });


                        await scan;


                        // À la fin du scan le bouton doit être réactivé
                        const bouton =
                            document.querySelector(
                                ".scan-button"
                            );


                        expect(
                            bouton.disabled
                        ).toBe(false);


                        expect(
                            bouton.textContent
                        ).toBe(
                            "LANCER LE SCAN"
                        );

                    }
                );


            }
        );


        // ==================================================
        // LÉGENDE
        // ==================================================

        describe(
            "Légende d'altitude",
            () => {


                test(
                    "doit créer la légende",
                    () => {

                        expect(
                            L.control
                        ).toHaveBeenCalled();


                        const control =
                            L.control.mock.results[
                                L.control.mock.results.length - 1
                            ].value;


                        expect(
                            control.onAdd
                        ).toEqual(
                            expect.any(Function)
                        );

                    }
                );


            }
        );


        // ==================================================
        // INTERACTION AVEC LA LISTE
        // ==================================================

        describe(
            "Interaction avec la liste",
            () => {


                test(
                    "cliquer sur un avion doit ouvrir son popup",
                    () => {

                        const avions = [

                            {
                                callsign: "AFR123",
                                altitude: 10000,
                                true_track: 90,
                                latitude: 48.8566,
                                longitude: 2.3522
                            }

                        ];


                        // Crée le marqueur correspondant
                        afficherAvionsCarte([

                            {
                                callsign: "AFR123",
                                geo_altitude: 10000,
                                true_track: 90,
                                latitude: 48.8566,
                                longitude: 2.3522,
                                on_ground: false
                            }

                        ]);


                        afficherListeAvions(avions);


                        const element =
                            document.querySelector(
                                ".aircraft"
                            );


                        element.click();


                        const dernierMarker =
                            fakeMarkers[
                                fakeMarkers.length - 1
                            ];


                        expect(
                            dernierMarker.openPopup
                        ).toHaveBeenCalled();

                    }
                );

            }
        );

    }
);
