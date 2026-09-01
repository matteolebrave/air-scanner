import requests


def get_aircraft(lamin, lomin, lamax, lomax):

    query = (
        "https://opensky-network.org/api/states/all"
        f"?lamin={lamin}"
        f"&lomin={lomin}"
        f"&lamax={lamax}"
        f"&lomax={lomax}"
    )

    api_results = requests.get(query)
    api_response = api_results.json()

    data_list = []

    states = api_response.get("states") or []

    for data in states:
        text = {
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
        }

        data_list.append(text)

    return data_list