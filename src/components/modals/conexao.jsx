import { View, Text, Modal } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../input";
import Button from "../button";

export default function ModalConexao({ isOpen, setIsOpen }) {
  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingHorizontal: 16,
          justifyContent: "center",
        }}
      >
        <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
          <View className="gap-y-2">
            <Input label="Nome" />
            <Input label="IP" />
            <Input label="Porta" />
          </View>
          <View className="gap-y-2">
            <Button texto="Gravar" />
            <Button texto="Cancelar" variant="outline" onPress={() => setIsOpen(false)} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
