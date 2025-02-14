import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import icons from "@/constants/icons";
import { getAllProperties } from "@/lib/appwrite"; // Import getAllProperties function
import { Card } from "@/components/Cards"; // Assuming you have a Card component to display properties

const Explore = () => {
  const [properties, setProperties] = useState<any[]>([]); // State for storing properties
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Function to fetch all properties
  const fetchProperties = async () => {
    try {
      const allProperties = await getAllProperties(); // Fetch all properties from Appwrite
      setProperties(allProperties); // Set properties to state
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false); // Stop loading once data is fetched
    }
  };

  // UseEffect to call fetchProperties when the component mounts
  useEffect(() => {
    fetchProperties();
  }, []);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={properties}
        numColumns={2} // Display in 2 columns
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} /> // Render each property inside a Card component
        )}
        keyExtractor={(item) => item.$id} // Use property ID as key
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" /> // Show loading indicator if still fetching
          ) : (
            <Text className="text-center text-gray-500 mt-5">
              No properties found
            </Text> // Display message if no properties are found
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <Text className="text-2xl font-rubik-bold text-black mt-5 text-center">
              Explore All Properties
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;
