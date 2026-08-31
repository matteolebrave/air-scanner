import folium
import os
import webbrowser


def create_map(LAT, LON, AVIONS):

    # -------------------------
    # Créer la carte Folium
    # -------------------------
    ma_carte = folium.Map(
        location=[LAT, LON],
        zoom_start=12
    )

    # -------------------------
    # Ajouter les avions
    # -------------------------

    image = "Map/Avion.png"

    for avion in AVIONS:

        heading = avion["true_track"] if avion["true_track"] != "null" else 0

        folium.Marker(
            location=[
                avion["latitude"],
                avion["longitude"]
            ],

            icon=folium.DivIcon(
                html=f"""
                <div style="
                    position: relative;
                    width: 100px;
                    height: 80px;
                    transform: translate(-50%, -50%);
                ">

                    <!-- Icône de l'avion -->
                    <img
                        src="{image}"
                        style="
                            position: absolute;
                            width: 50px;
                            height: 50px;
                            left: 20px;
                            top: 15px;
                            transform: rotate({heading}deg);
                        "
                    >

                    <!-- Callsign -->
                    <div style="
                        position: absolute;
                        left: 50%;
                        top: -10px;
                        transform: translateX(-50%);

                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        font-weight: bold;

                        color: black;
                        background-color: white;

                        padding: 2px 5px;
                        border-radius: 3px;
                        border: 1px solid #555;

                        white-space: nowrap;

                        box-shadow: 0px 1px 3px rgba(0,0,0,0.3);
                    ">
                        {avion["callsign"]}
                    </div>

                </div>
                """
            ),

            # On peut garder un tooltip pour avoir
            # des informations supplémentaires au survol
            tooltip=avion["callsign"]
        ).add_to(ma_carte)

    # -------------------------
    # Sauvegarder la carte HTML
    # -------------------------

    fichier_html = os.path.abspath("ma_carte.html")

    ma_carte.save(fichier_html)

    print("Fichier HTML :", fichier_html)
    print("Existe :", os.path.exists(fichier_html))

    # -------------------------
    # Ouvrir dans le navigateur
    # -------------------------

    webbrowser.open("file://" + fichier_html)
