import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fake data (replace with API fetch later)
  const plants = [
    {
      id: "1",
      name: "Aloe Vera",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/c/cd/Aloe_vera_flower.jpg",
      moisture: 30,
      min: 40,
      max: 70,
    },
    {
      id: "2",
      name: "Snake Plant",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/10/Sansevieria_trifasciata_01.JPG",
      moisture: 70,
      min: 50,
      max: 80,
    },
  ];

  const plant = plants.find((p) => p.id === id);

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Plant not found</Text>
      </View>
    );
  }

  const { name, image, moisture, min, max } = plant;
  const isHealthy = moisture >= min && moisture <= max;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Image source={{ uri: image }} style={styles.image} />

      <Text style={styles.subtitle}>Moisture Level</Text>
      <Text style={styles.level}>{moisture}%</Text>

      <View style={styles.rangeBar}>
        <View
          style={[
            styles.rangeFill,
            {
              width: `${Math.min(
                Math.max(((moisture - min) / (max - min)) * 100, 0),
                100
              )}%`,
            },
          ]}
        />
      </View>

      <View style={styles.rangeLabels}>
        <Text>Min: {min}%</Text>
        <Text>Max: {max}%</Text>
      </View>

      <Text style={[styles.status, { color: isHealthy ? "green" : "red" }]}>
        {isHealthy ? "Happy and healthy!" : "Needs attention!"}
      </Text>

      <View style={styles.bottom}>
        <Text style={styles.info}>Current: {moisture}%</Text>
        <Text style={styles.info}>
          Ideal Range: {min}-{max}%
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Change Plant Type</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a8d5ba",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  image: { width: 150, height: 150, borderRadius: 75, marginVertical: 15 },
  subtitle: { fontSize: 18, fontWeight: "500", marginTop: 10 },
  level: { fontSize: 32, fontWeight: "bold", marginVertical: 5 },
  rangeBar: {
    width: "90%",
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginVertical: 10,
  },
  rangeFill: { height: "100%", backgroundColor: "green", borderRadius: 5 },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  status: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  bottom: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  info: { fontSize: 16, fontWeight: "500" },
  button: { backgroundColor: "darkgreen", padding: 12, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
