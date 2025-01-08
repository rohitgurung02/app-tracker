"use client";

import { useEffect, useState } from "react";

const Map = ({ locations }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [notifiedLocations, setNotifiedLocations] = useState(new Set()); // Track alerted locations

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const handleProximityAlerts = (latitude, longitude) => {
    locations.forEach((location) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        location.locationLatitude,
        location.locationLongitude
      );

      if (distance <= 10 && !notifiedLocations.has(location.locationName)) {
        // Alert user and add location to notified set
        alert(`Caution: ${location.locationAreaCategory} near ${location.locationName}`);
        setNotifiedLocations((prev) => new Set(prev).add(location.locationName));
      } else if (distance > 10) {
        // Reset alert for this location when user moves away
        setNotifiedLocations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(location.locationName);
          return newSet;
        });
      }
    });
  };

  useEffect(() => {
    let watchId = null;

    if (navigator.geolocation) {
      console.log("Requesting location access...");

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocationError(null);
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          handleProximityAlerts(latitude, longitude);
        },
        (error) => {
          console.error("Error retrieving location:", error);
          setLocationError("Location access denied or unavailable.");
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000, // Allow slight caching
          timeout: 10000,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [locations, notifiedLocations]);

  return (
    <div>
      {locationError && <p style={{ color: "red" }}>{locationError}</p>}
      <h2>User Location</h2>
      {userLocation ? (
        <p>
          Latitude: {userLocation.latitude}, Longitude: {userLocation.longitude}
        </p>
      ) : (
        <p>Retrieving location...</p>
      )}

      <h2>Predefined Locations</h2>
      <ul>
        {locations.map((location, index) => (
          <li key={index}>
            {location.locationName} - {location.locationAreaCategory}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Map;
