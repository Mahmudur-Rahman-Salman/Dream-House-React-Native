import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";


import { getAllProperties } from "@/lib/appwrite"; 
import { Card } from "@/components/Cards"; 

const Explore = () => {
  const [properties, setProperties] = useState<any[]>([]); // State for storing properties
  const [loading, setLoading] = useState(true); // Loading state for fetching data

  // Function to fetch all properties
  const fetchProperties = async () => {
    try {
      const allProperties = await getAllProperties(); 
      setProperties(allProperties); 
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false); 
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
        numColumns={2} 
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} /> 
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" /> 
          ) : (
            <Text className="text-center text-gray-500 mt-5">
              No properties found
            </Text> 
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5">
            <Text className="text-2xl font-rubik-bold text-black mt-5 text-center">
              Explore All Properties
            </Text>
            <Text className="text-2xl font-rubik-bold text-black mt-5">List of properties : {properties.length}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Explore;

