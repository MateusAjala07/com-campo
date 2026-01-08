import { View, Modal, Text, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/button";
import { LogOut, WifiSync } from "lucide-react-native";
import { router } from "expo-router";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function MenuInicio({ isOpen, setIsOpen }) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        onPress={() => setIsOpen(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable className="bg-white shadow w-64 flex-1" onPress={() => {}}>
            <View className="bg-secondary p-7">
              <Text className="text-white">
                {storage.getString("codUsu")} - {storage.getString("nomUsu")}
              </Text>
            </View>

            <Button
              variant="outline"
              onPress={() => {
                setIsOpen(false);
                router.push("/sincronismo");
              }}
              texto="Sincronização"
              icon={<WifiSync color={"#99a1af"} />}
            />

            <View className="justify-end flex-1">
              <Button
                variant="outline"
                texto="Sair"
                icon={<LogOut color={"#99a1af"} />}
                onPress={() => {
                  setIsOpen(false);
                  router.replace("/");
                }}
              />
            </View>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}
