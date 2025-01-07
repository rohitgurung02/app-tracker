"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the Map component
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/potholes");
        const data = await response.json();
        setLocations(
          data.map((item) => ({
            locationName: item.locationName,
            locationLatitude: parseFloat(item.locationLatitude),
            locationLongitude: parseFloat(item.locationLongitude),
            locationAreaCategory: item.locationAreaCategory,
          }))
        );
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <h1>Pothole Map</h1>
      <Map locations={locations} />
    </div>
  );
}
