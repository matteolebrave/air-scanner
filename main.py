import json

from position import calculate_bounding_box
from apiRequests import get_aircraft
from havershine import havershine

latitude = float(input("Latitude : "))
longitude = float(input("Longitude : "))
radius = float(input("Rayon (km) : "))

print(f"Position : {latitude}, {longitude}")
print(f"Rayon : {radius} km")

lat_min, lat_max, lon_min, lon_max = calculate_bounding_box(latitude,longitude,radius)

print(f"Latitude : {lat_min} → {lat_max}")
print(f"Longitude : {lon_min} → {lon_max}")


aircraft = get_aircraft(lat_min,lon_min,lat_max,lon_max)

print(f"{len(aircraft)} aéronefs trouvés")


aircraft_in_radius = []
for avion in aircraft:
    distance = havershine(latitude, longitude, avion)

    if distance <= radius * 1000:
        avion["distance"] = distance / 1000
        aircraft_in_radius.append((avion))

print(f"{len(aircraft_in_radius)} aéronefs dans le rayon de {radius} km")

#for avion, distance in aircraft_in_radius:
#    print(avion["callsign"], round(distance / 1000, 2), "km")

json_result = json.dumps(aircraft_in_radius, indent=4)

print(json_result)
