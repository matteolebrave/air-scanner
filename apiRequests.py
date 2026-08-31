import requests
import json

querry = "https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226" # querry for real time flight


apiResults = requests.get(querry)
apiResponse = apiResults.json()

data_list = []
states = apiResponse["states"]

for data in states:

    text ={ 
    "icao24": data[0],
    "callsign": data[1],
    "origin_country": data[2],
    "time_position": data[3],
    "last_contact": data[4],
    "longitude": data[5],
    "latitude": data[6],
    "baro_altitude": data[7],
    "on_ground": data[8],
    "velocity": data[9],
    "true_track": data[10],
    "vertical_rate": data[11],
    "sensors": data[12],
    "geo_altitude": data[13],
    "squawk": data[14],
    "spi": data[15],
    "position_source": data[16],
    #"category": data[17]
    }

    data_list.append(text)
    
with open("apiResponse.json", "w") as f:
    f.write(json.dumps(data_list, indent = 4))


# with open("apiResponse.json" ,"r") as f:
#     f.read()

