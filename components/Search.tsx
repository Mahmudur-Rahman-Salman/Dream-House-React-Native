// import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
// import React from "react";
// import icons from "@/constants/icons";

// const Search = () => {
//   return (
//     <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
//       <View className="flex-1 flex flex-row items-center justify-start z-50">
//         <Image source={icons.search} className="size-5" />
//         <TextInput
//           value="search"
//         //   onChangeText={handleSearch}
//           placeholder="Search for anything"
//           className="text-sm font-rubik text-black-300 ml-2 flex-1"
//         />
//       </View>

//       <TouchableOpacity>
//         <Image source={icons.filter} className="size-5" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Search;

import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";

export const Search = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [query, setQuery] = useState<string>("");

  const handleSearch = () => {
    if (query) {
      onSearch(query); // Call the search function with the query
    }
  };

  return (
    <View className="flex flex-row items-center justify-between w-full px-4 rounded-lg bg-accent-100 border border-primary-100 mt-5 py-2">
      <View className="flex-1 flex flex-row items-center justify-start z-50">
        <Image source={icons.search} className="size-5" />
        <TextInput
          value={query}
          onChangeText={setQuery} // Update the query state when user types
          placeholder="Search for anything"
          className="text-sm font-rubik text-black-300 ml-2 flex-1"
        />
      </View>
      <TouchableOpacity onPress={handleSearch}>
        <Image source={icons.filter} className="size-5" />
      </TouchableOpacity>
    </View>
  );
};
