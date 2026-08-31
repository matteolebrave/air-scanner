import requests
import json

apiKEY = "286bc0ebbed2d9942a0ce82e727b4750" # api key

realTime = "https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226" # querry for real time flight

flightDate ="&flight_date="

nbFlight = "&limit=" # nb of flight

offset = "&offset=" #redondance


url = realTime #+ apiKEY + nbFlight + "100" + offset + "0"

#print(url)

apiResults = requests.get(url)
apiResponse = apiResults.json()
print(apiResponse)
#print(apiResponse)

with open("apiResponse.json", "w") as f:
    states = apiResponse["states"]
    print(states)
    f.write(json.dumps(apiResponse, indent=4))

# with open("apiResponse.json" ,"r") as f:
#     f.read()

