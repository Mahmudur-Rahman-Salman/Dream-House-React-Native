import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ImageSourcePropType } from "react-native";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/gloabal-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "@/lib/appwrite";
import { router } from "expo-router";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

const Profile = () => {
  const { user, refetch } = useGlobalContext();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      // console.log("user role : ", role);
      setIsAdmin(role === "admin");
      setLoading(false);
    };
    checkRole();
  }, []);

  if (loading) return null;

  const handleLogout = async () => {
    const result = await logout();
    if (result) {
      Alert.alert("Success", "Logged out successfully");
      refetch({});
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-7"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-xl font-rubik-bold ">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>
        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full"
            />
            <TouchableOpacity className="absolute bottom-11 right-2">
              <Image source={icons.edit} className="size-9" />
            </TouchableOpacity>

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text>
          </View>
        </View>
        <View>
          <Text className="text-xl text-center font-rubik mt-2">
            {user?.email}
          </Text>
        </View>

        {isAdmin && (
          <View className="flex flex-col mt-10">
            <TouchableOpacity
              onPress={() => router.push("/addProperty/Add")}
              className="flex flex-row items-center justify-between py-3"
            >
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.calendar} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Add Property
                </Text>
              </View>

              <Image source={icons.rightArrow} className="size-5" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/bookings/booking")}
              className="flex flex-row items-center justify-between py-3"
            >
              <View className="flex flex-row items-center gap-3">
                <Image source={icons.calendar} className="size-6" />
                <Text className="text-lg font-rubik-medium text-black-300">
                  Bookings
                </Text>
              </View>

              <Image source={icons.rightArrow} className="size-5" />
            </TouchableOpacity>
          </View>
        )}

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
