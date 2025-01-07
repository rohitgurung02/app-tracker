"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ locations }) => {
  const [map, setMap] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [locationError, setLocationError] = useState(null);

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const leafletMap = L.map("map").setView([41.823989, -71.412834], 13);
      setMap(leafletMap);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap);

      return () => {
        leafletMap.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (map) {
      const userIcon = L.icon({
        iconUrl: "https://img.icons8.com/ios-filled/50/0000FF/marker.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      let watchId = null;

      if (navigator.geolocation) {
        // Explain to the user why location access is needed
        console.log("Requesting location access...");

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocationError(null); // Clear any previous error
            const { latitude, longitude } = position.coords;

            if (userMarker) {
              userMarker.setLatLng([latitude, longitude]);
            } else {
              const marker = L.marker([latitude, longitude], { icon: userIcon })
                .addTo(map)
                .bindPopup("You are here!");
              setUserMarker(marker);
            }

            // Check proximity to locations
            locations.forEach((location) => {
              const distance = calculateDistance(
                latitude,
                longitude,
                location.locationLatitude,
                location.locationLongitude
              );

              if (distance <= 100) { // Within 100 meters
                alert(`Caution: ${location.locationAreaCategory} near ${location.locationName}`);
              }
            });
          },
          (error) => {
            console.error("Error retrieving location:", error);
            setLocationError("Location access denied or unavailable.");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
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
    }
  }, [map, locations, userMarker]);

  return (
    <div>
      {locationError && <p style={{ color: "red" }}>{locationError}</p>}
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
};

export default Map;
