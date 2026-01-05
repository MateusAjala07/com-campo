import { TouchableOpacity, Text, View } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function CardIcone({
  icon = null,
  texto = "",
  navigate = null,
  loading = false,
  ...rest
}) {
  if (loading) {
    return (
      <View
        className="bg-gray-200 w-30 h-30 p-5 rounded-xl gap-y-4 justify-center animate-pulse"
        {...rest}
      >
        <View className="w-10 h-10 bg-gray-300 rounded-full self-center" />
        <View className="w-16 h-3 bg-gray-300 rounded self-center mt-2" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      className="bg-white w-30 h-30 p-5 shadow rounded-xl gap-y-4 justify-center"
      onPress={() => navigate && router.navigate(navigate)}
      activeOpacity={0.8}
      {...rest}
    >
      {icon}
      <Text className="text-sm font-medium text-gray-700">{texto}</Text>
    </TouchableOpacity>
  );
}
