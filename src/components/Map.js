"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ potholes }) => {
  const [map, setMap] = useState(null);

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

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);
            L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map)
              .bindPopup("You are here!")
              .openPopup();
          },
          (error) => console.error("Error retrieving location:", error)
        );
      }

      potholes.forEach((pothole) => {
        const { latitude, longitude, description } = pothole;
        if (latitude && longitude) {
          L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(description || "Pothole");
        }
      });
    }
  }, [map, potholes]);

  if (typeof window === "undefined") {
    return null; // Prevent server-side rendering
  }

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default Map;
