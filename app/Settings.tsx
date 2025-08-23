import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

// ✅ Add interface
interface Plant {
  id: string;
  name: string;
  min: number;
  max: number;
  imageUri?: string;
}

export default function SettingsScreen() {
  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const loadPlants = async () => {
      const stored = await AsyncStorage.getItem("plants");
      if (stored) {
        try {
          const parsed: Plant[] = JSON.parse(stored);
          setPlants(parsed);
        } catch (error) {
          console.error("Error parsing plants:", error);
        }
      }
    };
    loadPlants();
  }, []);

  // ✅ Updated to use keyof Plant
  const updatePlantField = (
    index: number,
    field: keyof Plant,
    value: string | number
  ) => {
    const updated = [...plants];
    updated[index] = { ...updated[index], [field]: value };
    setPlants(updated);
  };

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      updatePlantField(index, "imageUri", result.assets[0].uri);
    }
  };

  const saveAll = async () => {
    for (const plant of plants) {
      const { min = 0, max = 100, name = "" } = plant;
      if (min >= max) {
        Alert.alert(
          "Invalid Range",
          `Check moisture range for ${name || "Unnamed Plant"}`
        );
        return;
      }
    }

    await AsyncStorage.setItem("plants", JSON.stringify(plants));
    Alert.alert("Saved", "All plant settings saved successfully!");
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Edit Plant Settings</Text>

      {plants.map((plant, index) => {
        const { name = "", min = 0, max = 100, imageUri = "" } = plant || {};

        return (
          <View key={plant.id || index} style={styles.plantCard}>
            <TextInput
              placeholder="Plant Name"
              style={styles.input}
              value={name}
              onChangeText={(text) => updatePlantField(index, "name", text)}
            />

            <TouchableOpacity onPress={() => pickImage(index)}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.placeholderAvatar}>
                  <Text>Pick Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Min Moisture: {min}%</Text>
            <Slider
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={min}
              onValueChange={(value) =>
                updatePlantField(index, "min", Math.min(value, max - 1))
              }
              style={styles.slider}
            />

            <Text style={styles.label}>Max Moisture: {max}%</Text>
            <Slider
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={max}
              onValueChange={(value) =>
                updatePlantField(index, "max", Math.max(value, min + 1))
              }
              style={styles.slider}
            />
          </View>
        );
      })}

      <TouchableOpacity style={styles.button} onPress={saveAll}>
        <Text style={styles.buttonText}>Save All</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#94c9bfff",
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#154a29",
  },
  plantCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#154a29",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 15,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
    backgroundColor: "#e6f2ed",
  },
  button: {
    backgroundColor: "#154a29",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
