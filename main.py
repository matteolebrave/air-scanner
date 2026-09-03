from flask import Flask, render_template, request
from Logic.logic import start
import json

app = Flask(__name__)


@app.route("/")
def accueil():
    print("Page d'accueil demandée")
    
    return render_template("index.html")


@app.route("/scan")
def scan():

    LATITUDE = float(request.args.get("latitude"))
    LONGITUDE = float(request.args.get("longitude"))
    RADIUS = float(request.args.get("radius"))

    print("Latitude :", LATITUDE)
    print("Longitude :", LONGITUDE)
    print("Radius :", RADIUS)

    start(LATITUDE, LONGITUDE, RADIUS)

    # On lit le fichier JSON créé par start()
    with open("apiResponse.json", "r", encoding="utf-8") as fichier:
        avions = json.load(fichier)

    return {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "radius": RADIUS,
        "avions": avions
    }


if __name__ == "__main__":
    app.run(debug=True)