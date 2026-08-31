from math import sin, cos, sqrt, atan2, radians
R = 6371 * 10**3

def havershine(latitude, longitude, avion):
    latAvion = avion["latitude"]
    longAvion = avion["longitude"]

    dLat = radians(latitude - latAvion)
    dLong = radians(longitude - longAvion)

    a = ( sin(dLat/2)**2 + cos(radians(latAvion))*cos(radians(latitude))*sin(dLong/2)**2 )

    c = 2* atan2(sqrt(a),sqrt(1-a))

    d = R * c

    return d