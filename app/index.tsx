import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [plants, setPlants] = useState<
    {
      id: number;
      name: string;
      moisture: number;
      min: number;
      max: number;
      image: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://192.168.254.242:5000/moisture"); // replace with your PC's IP
        const data = await response.json();

        // map API response to include images + min/max values
        const plantData = [
          {
            id: 1,
            name: "Aloe Vera",
            moisture: data.moisture1,
            min: 30,
            max: 60,
            image:
              "https://upload.wikimedia.org/wikipedia/commons/c/cd/Aloe_vera_flower_1.jpg",
          },
          {
            id: 2,
            name: "Snake Plant",
            moisture: data.moisture2,
            min: 40,
            max: 70,
            image:
              "https://upload.wikimedia.org/wikipedia/commons/f/fd/Sansevieria_trifasciata_01.jpg",
          },
        ];

        setPlants(plantData);
      } catch (error) {
        console.error("Error fetching moisture data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading plant data...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f2f2f2",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        🌱 My Plants
      </Text>

      {plants.map((plant) => {
        const isHealthy = plant.moisture > 30;

        return (
          <TouchableOpacity
            key={plant.id}
            onPress={() =>
              router.push({
                pathname: "/plant/[id]",
                params: { id: plant.id.toString() },
              })
            }
            style={{
              backgroundColor: isHealthy ? "green" : "red",
              padding: 20,
              marginVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              {plant.name}
            </Text>
            <Text style={{ color: "white" }}>Moisture: {plant.moisture}%</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
