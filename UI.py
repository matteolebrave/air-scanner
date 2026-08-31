from tkinter import * 
from map import create_map


def scan():
    LAT = latitude.get()
    LON = longitude.get()
    radius = rayon.get()


    print("Latitude :", LAT)
    print("Longitude :", LON)
    print("Rayon :", radius)

    AVIONS = [{
            "icao24": "4bc8e2",
            "callsign": "PGT43WU ",
            "origin_country": "Turkey",
            "time_position": 1788175563,
            "last_contact": 1788175563,
            "longitude": 6.1068,
            "latitude": 46.2344,
            "baro_altitude": 0,
            "on_ground": True,
            "velocity": 4.37,
            "true_track": 177.19,
            "vertical_rate": 0,
            "sensors": 0,
            "geo_altitude": 0,
            "squawk": "3215",
            "spi": False,
            "position_source": 0
        }]
    Label(RESULTS, text=f"{len(AVIONS)} aéronef{'s' if len(AVIONS)>1 else ''} détecté{'s' if len(AVIONS)>1 else ''}").grid(row=1, column=0, padx=10, pady=10)
    for i in range(len(AVIONS)):
        Label(RESULTS, text=AVIONS[i]["callsign"]).grid(row=i+2, column=0, padx=10, pady=10)
        Label(RESULTS, text=AVIONS[i]["callsign"]).grid(row=i+2, column=1, padx=10, pady=10)
        Label(RESULTS, text=AVIONS[i]["geo_altitude"]).grid(row=i+2, column=2, padx=10, pady=10)
    
    Button(MAIN,text="Afficher sur la Carte !", command=lambda: create_map(LAT,LON,AVIONS)).grid(row=2, column=1)


## window declaration
root = Tk()
root.title("air-scanner -- Leop & Mat")
root.geometry("800x600")


## first pannel
#│           ✈ AIR SCANNER             │
#│                                     │
#│ latitude   [48.8566]                │
#│ longitude  [2.3522]                 │
#│ Rayon      [50] km                  │

MAIN = Frame(root, borderwidth=2, relief=GROOVE)
MAIN.pack(side=TOP, padx=30, pady=30)

Label(MAIN, text="✈ Air Scanner !",  font=("Arial", 16, "bold")).grid(row=0, column=0, columnspan=2)


latitude = StringVar()
longitude = StringVar()
rayon = StringVar()

INPUT = Frame(MAIN, borderwidth=2, relief=GROOVE)
INPUT.grid(row=1, column=0, padx=10, pady=10)


Label(INPUT, text="latitude : ").grid(row=1, column=0, padx=10, pady=10)
Entry(INPUT, textvariable=latitude, width=30).grid(row=1, column=1, padx=10, pady=10)
Label(INPUT, text="longitude : ").grid(row=2, column=0, padx=10, pady=10)
Entry(INPUT, textvariable=longitude, width=30).grid(row=2, column=1, padx=10, pady=10)
Label(INPUT, text="Rayon : ").grid(row=3, column=0, padx=10, pady=10)
Entry(INPUT, textvariable=rayon, width=30).grid(row=3, column=1, padx=10, pady=10)
Label(INPUT, text="km").grid(row=3, column=3, padx=10, pady=10)

Button(INPUT,text="SCANNER", command=scan).grid(row=4, column=1)


RESULTS = Frame(MAIN, borderwidth=2, relief=GROOVE)
RESULTS.grid(row=2, column=0, padx=10, pady=10)


    




root.mainloop()

