import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

export default function Cabecalho({
  titulo = "",
  voltar = true,
  menu = false,
  atualizar = false,
  icon = <Ionicons name="refresh-outline" size={24} />,
}) {
  return (
    <View className="flex-row items-center p-4 bg-secondary">
      {voltar && (
        <TouchableOpacity
          className="bg-background p-2 rounded-full"
          onPress={voltar === true ? () => router.back() : voltar}
        >
          <Ionicons name="arrow-back-outline" size={24} />
        </TouchableOpacity>
      )}

      {menu && (
        <TouchableOpacity className="bg-background p-2 rounded-full" onPress={menu}>
          <Ionicons name="menu-outline" size={24} />
        </TouchableOpacity>
      )}

      <Text className="texto-primario text-white flex-1 text-center">{titulo}</Text>

      {atualizar && (
        <TouchableOpacity className="bg-background p-2 rounded-full" onPress={atualizar}>
          {icon}
        </TouchableOpacity>
      )}
    </View>
  );
}
