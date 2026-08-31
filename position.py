import math


def calculate_bounding_box(latitude, longitude, radius):
    delta_lat = radius / 111

    delta_lon = radius / (111 * math.cos(math.radians(latitude)))

    lat_min = latitude - delta_lat
    lat_max = latitude + delta_lat

    lon_min = longitude - delta_lon
    lon_max = longitude + delta_lon

    return lat_min, lat_max, lon_min, lon_max