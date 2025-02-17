import {
  Account,
  Avatars,
  Client,
  Databases,
  OAuthProvider,
  Query,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const config = {
  platform: "com.realstate.dreamhouse",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  addPropertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_ADDPROPERTIES_COLLECTION_ID,
  bookingCollectionId: process.env.EXPO_PUBLIC_APPWRITE_BOOKING_COLLECTION_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success")
      throw new Error("Create OAuth2 token failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Create OAuth2 token failed");

    const session = await account.createSession(userId, secret);
    if (!session) throw new Error("Failed to create session");

    // ✅ Get user info
    let user;
    const ADMIN_EMAILS = [
      "rahmansalman855@gmail.com",
      "mahmudur.salman@gmail.com",
    ];
    user = await account.get();

    if (ADMIN_EMAILS.includes(user.email) && user?.prefs?.role !== "admin") {
      user = await account.updatePrefs({
        role: "admin",
      });
    } else if (!user?.prefs?.role) {
      user = await account.updatePrefs({
        role: "user",
      });
    }

    const isAdmin = user?.prefs?.role === "admin";

    // ✅ Save role and user info to AsyncStorage
    await AsyncStorage.setItem("userRole", user.prefs.role);
    await AsyncStorage.setItem("userId", user.$id);
    await AsyncStorage.setItem("userEmail", user.email);

    return { success: true, isAdmin };
  } catch (error) {
    // console.error(error);
    return { success: false };
  }
}

export const getUserRole = async () => {
  const role = await AsyncStorage.getItem("userRole");
  return role === "admin";
};

export async function logout() {
  try {
    const result = await account.deleteSession("current");
    return result;
  } catch (error) {
    // console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const result = await account.get();
    // console.log(result);
    if (result.$id) {
      const userAvatar = avatar.getInitials(result.name);

      return {
        ...result,
        avatar: userAvatar.toString(),
      };
    }

    return null;
  } catch (error) {
    // console.log(error);
    return null;
  }
}

export const AddProperty = async (data: any) => {
  return await databases.createDocument(
    config.databaseId!,
    config.addPropertiesCollectionId!,
    "unique()",
    data
  );
};
export const getAllProperties = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.addPropertiesCollectionId!
    );
    // console.log("All properties:", response.documents);
    return response.documents;
  } catch (error) {
    // console.error("Error fetching all properties:", error);
    return [];
  }
};

// Delete Property
export const DeleteProperty = async (propertyId: string) => {
  try {
    const response = await databases.deleteDocument(
      config.databaseId!,
      config.addPropertiesCollectionId!,
      propertyId
    );
    // console.log("Property deleted successfully", response);
    return response;
  } catch (error) {
    // console.error("Error deleting property:", error);
    return null;
  }
};



export async function fetchingAddPropertiesById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.addPropertiesCollectionId!,
      id
    );
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const createBooking = async (data: any) => {
  return await databases.createDocument(
    config.databaseId!,
    config.bookingCollectionId!,
    "unique()",
    data
  );
};

export const getAllBookings = async () => {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.bookingCollectionId!
    );
    // console.log("All Bookings:", response.documents);
    return response.documents;
  } catch (error) {
    // console.error("Error fetching all bookings:", error);
    return [];
  }
};
