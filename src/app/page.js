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
        const response = await fetch("./api/locations.json"); // Fetch from local JSON file
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error("Error fetching locations data:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <h1>Pothole & Animal Prone Areas</h1>
      <Map locations={locations} />
    </div>
  );
}
