import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createBooking, fetchingAddPropertiesById } from "@/lib/appwrite";
import { useAppwrite } from "@/lib/useAppwrite";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/gloabal-provider";

const Property = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useGlobalContext();
  console.log(user);

  const windowHeight = Dimensions.get("window").height;

  const { data: property } = useAppwrite({
    fn: fetchingAddPropertiesById,
    params: {
      id: id!,
    },
  });

  const handleBooking = async () => {
    if (!user) {
      Alert.alert("Error", "You need to be logged in to book a property.");
      return;
    }

    if (!property) {
      Alert.alert("Error", "Property details are missing.");
      return;
    }

    try {
      const bookingData = {
        propertyId: property?.$id,
        userId: user.$id,
        userName: user.name,
        userEmail: user.email,
        propertyImage: property?.image,
        price: property?.price,
        status: "pending", // Default booking status
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Send data to Appwrite
      await createBooking(bookingData);

      Alert.alert("Success", "Your booking request has been sent!");
      console.log("Booking has confirmed");
    } catch (error) {
      console.error("Booking failed:", error);
      Alert.alert("Error", "Failed to book the property. Try again later.");
    }
  };

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 bg-white"
      >
        {/* Property Image */}
        <View className="relative w-full" style={{ height: windowHeight / 2 }}>
          <Image
            source={{ uri: property?.image }}
            className="size-full"
            resizeMode="cover"
          />
          <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
          />
          <View
            className="z-50 absolute inset-x-7"
            style={{ top: Platform.OS === "ios" ? 70 : 20 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-primary-200 rounded-full size-11 flex items-center justify-center"
            >
              <Image source={icons.backArrow} className="size-5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Details */}
        <View className="px-5 mt-7">
          <Text className="text-2xl font-rubik-extrabold">
            {property?.name}
          </Text>
          <View className="flex flex-row items-center gap-3 mt-2">
            <Text className="text-sm font-rubik-bold bg-primary-100 px-4 py-2 rounded-full text-primary-300">
              {property?.type}
            </Text>
            {/* <Text className="text-black-200 text-sm font-rubik-medium">
              {property?.rating} ({property?.reviews?.length} reviews)
            </Text> */}
          </View>
        </View>

        {/* Overview */}
        <View className="px-5 mt-7">
          <Text className="text-xl font-rubik-bold">Overview</Text>
          <Text className="text-black-200 text-base font-rubik mt-2">
            {property?.description}
          </Text>
        </View>

        {/* Facilities */}
        {property?.facilities?.length > 0 && (
          <View className="px-5 mt-7">
            <Text className="text-xl font-rubik-bold">Facilities</Text>
            <View className="flex flex-row flex-wrap mt-2 gap-5">
              {property?.facilities.map(
                (
                  item:
                    | string
                    | number
                    | boolean
                    | ReactElement<any, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | null
                    | undefined,
                  index: Key | null | undefined
                ) => (
                  <View
                    key={index}
                    className="flex items-center min-w-16 max-w-20"
                  >
                    <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                      <Image source={icons.info} className="size-6" />
                    </View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      className="text-black-300 text-sm text-center font-rubik mt-1.5"
                    >
                      {item}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {/* Price & Book Button */}
        <View className="absolute bg-white bottom-0 w-full rounded-t-2xl border-t border-primary-200 p-7">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-primary-300 text-2xl font-rubik-bold">
              ${property?.price}
            </Text>
            <TouchableOpacity
              className="bg-primary-300 py-3 px-6 rounded-full shadow-md"
              onPress={handleBooking}
            >
              <Text className="text-white text-lg font-rubik-bold">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Property;
