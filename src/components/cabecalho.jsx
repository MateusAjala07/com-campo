import { View, Text } from "react-native";
import React from "react";
import { router } from "expo-router";
import { ChevronLeft, Menu, RotateCcw } from "lucide-react-native";
import Button from "./button";

export default function Cabecalho({
  titulo = "",
  voltar = true,
  menu = false,
  atualizar = false,
  icon = <RotateCcw />,
}) {
  return (
    <View className="flex-row items-center p-4 bg-secondary">
      {voltar && (
        <Button
          icon={<ChevronLeft />}
          size="icon"
          variant="secondary"
          onPress={voltar === true ? () => router.back() : voltar}
        />
      )}

      {menu && <Button icon={<Menu />} size="icon" variant="secondary" onPress={menu} />}

      <Text className="texto-primario text-white flex-1 text-center">{titulo}</Text>

      {atualizar && <Button icon={icon} variant="secondary" size="icon" onPress={atualizar} />}
    </View>
  );
}
