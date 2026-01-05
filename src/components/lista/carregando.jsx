import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

export default function ListaCarregando({ itemCount = 5, variant = "card", className }) {
  const skeletons = Array.from({ length: itemCount });

  return (
    <View className={cn("p-4", className)}>
      {skeletons.map((_, index) => (
        <View
          key={index}
          className={cn(
            "mb-4 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm p-4 animate-pulse h-20",
          )}
        >
          <View className="flex-row items-center space-x-4">
            <View className="flex-1 space-y-2 gap-y-2">
              <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
              <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
