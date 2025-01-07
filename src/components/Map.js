"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamically import the Map component
const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [potholes, setPotholes] = useState([]);

  useEffect(() => {
    const fetchPotholes = async () => {
      const apiUrl = "https://data.providenceri.gov/api/views/tisk-wsvu/rows.json?accessType=DOWNLOAD";
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const potholesData = data.data.map((item) => ({
          latitude: parseFloat(item[14]),
          longitude: parseFloat(item[15]),
          description: item[8] || "Pothole",
        }));

        setPotholes(potholesData);
      } catch (error) {
        console.error("Error fetching pothole data:", error);
      }
    };

    fetchPotholes();
  }, []);

  return (
    <div>
      <h1>Pothole Map</h1>
      <Map potholes={potholes} />
    </div>
  );
}
