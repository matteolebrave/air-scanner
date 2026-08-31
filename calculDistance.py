from havershine import havershine
from parameters import RADIUS, LATITUDE ,LONGITUDE, AVION
import pytest


def test_distance():
    d = havershine(LATITUDE,LONGITUDE,AVION)
    
    assert d <= RADIUS*10**3