import { View, Modal, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/button";
import { LogOut, Wifi, WifiSync } from "lucide-react-native";
import { router } from "expo-router";

export default function MenuInicio({ isOpen, setIsOpen }) {
  return (
    <>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View className="bg-white shadow w-64 flex-1">
            <View className="bg-secondary p-7">
              <Text className="text-white">24 - Gabriel Zanatta</Text>
            </View>
            <Button variant="outline" texto="Sincronização" icon={<WifiSync color={"#99a1af"} />} />
            <View className="justify-end flex-1">
              <Button
                variant="outline"
                texto="Sair"
                icon={<LogOut color={"#99a1af"} />}
                onPress={() => router.replace("/")}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
