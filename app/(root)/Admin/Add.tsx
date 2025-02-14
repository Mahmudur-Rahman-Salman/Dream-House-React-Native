import { View, Text, Alert, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "@/lib/gloabal-provider";
import { AddProperty } from "@/lib/appwrite";

const Add = () => {
  const { user } = useGlobalContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleAddProperty = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to add a property.");
      return;
    }

    if (!name || !address || !type || !price || !image || !description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      const propertyData = {
        userId: user.$id, // Owner of the property
        name,
        address,
        type,
        price: parseInt(price), // Ensure price is a number
        image,
        description,
      };

      // Send data to Appwrite
      await AddProperty(propertyData);

      Alert.alert("Success", "Property added successfully!");
      console.log("Property has been added!");

      // Clear form fields
      setName("");
      setAddress("");
      setType("");
      setPrice("");
      setImage("");
      setDescription("");
    } catch (error) {
      console.error("Error adding property:", error);
      Alert.alert("Error", "Failed to add the property. Try again later.");
    }
  };

  return (
    <View className="p-5 bg-white">
      <Text className="text-xl font-bold mb-5">Add New Property</Text>
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="Property Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="Type"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
      />
      <TextInput
        className="border p-2 mb-4 rounded"
        placeholder="description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded mt-5"
        onPress={handleAddProperty}
      >
        <Text className="text-white text-lg text-center font-bold">
          Add Property
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Add;
