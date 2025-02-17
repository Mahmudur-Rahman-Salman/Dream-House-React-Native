import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAllBookings } from "@/lib/appwrite"; 




interface Booking {
  $id: string;
  userId: string;
  propertyId: string;
  status: string;
  userName: string;
  userEmail: string;
  propertyImage: string;
  price: number;
  date: string;
  createdAt: string;
}

const BookingScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const allBookings = await getAllBookings(); 
      // console.log("Fetched All Bookings:", allBookings);
      const bookingsData: Booking[] = allBookings.map((booking: any) => ({
        $id: booking.$id,
        userId: booking.userId,
        propertyId: booking.propertyId,
        status: booking.status,
        userName: booking.userName,
        userEmail: booking.userEmail,
        propertyImage: booking.propertyImage,
        price: booking.price,
        date: booking.date,
        createdAt: booking.createdAt,
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4 text-center">All Bookings</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : bookings.length === 0 ? (
        <Text className="text-center text-xl text-gray-500">
          No bookings found.
        </Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View className="p-4 mb-3 bg-gray-100 rounded-lg flex-col">
              <Image
                source={{ uri: item.propertyImage }}
                className="w-full h-60 rounded-md mb-2"
                resizeMode="cover"
              />
              <Text className="text-lg font-semibold mb-1">
                Booking ID: {item.$id}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                Date: {item.date}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                Property ID: {item.propertyId}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                Status: {item.status}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                Price: ${item.price}
              </Text>
              <Text className="text-sm text-gray-500 mb-1">
                Booked by: {item.userName} ({item.userEmail})
              </Text>
              <Text className="text-xs text-gray-300">
                Created At: {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default BookingScreen;
