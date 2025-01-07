"use client"

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ potholes }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize the map only in the browser
      const leafletMap = L.map("map").setView([41.823989, -71.412834], 13); // Default center (Providence, RI)
      setMap(leafletMap);

      // Add tile layer
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap);

      return () => {
        leafletMap.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (map && typeof window !== "undefined") {
      // Define custom icon for user marker (blue color)
      const userIcon = L.icon({
        iconUrl: "https://img.icons8.com/ios-filled/50/0000FF/marker.png", // Blue marker image
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32], // Position of the popup relative to the icon
      });

      // Track user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Center map on user's location
            map.setView([latitude, longitude], 15);

            // Add marker for user's location with the blue icon
            L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map)
              .bindPopup("You are here!")
              .openPopup();
          },
          (error) => {
            console.error("Error retrieving location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }

      // Add markers for potholes
      potholes.forEach((pothole) => {
        const { latitude, longitude, description } = pothole;
        if (latitude && longitude) {
          L.marker([latitude, longitude]).addTo(map).bindPopup(description || "Pothole");
        }
      });
    }
  }, [map, potholes]);

  return <div id="map" style={{ height: "500px", width: "100%" }}></div>;
};

export default Map;