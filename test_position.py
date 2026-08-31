import pytest

from position import calculate_bounding_box


def test_bounding_box():
    lat_min, lat_max, lon_min, lon_max = calculate_bounding_box(
        43.6045, 1.4440, 10
    )

    assert lat_min == pytest.approx(43.5144, abs=0.001)
    assert lat_max == pytest.approx(43.6946, abs=0.001)
    assert lon_min == pytest.approx(1.3196, abs=0.001)
    assert lon_max == pytest.approx(1.5684, abs=0.001)