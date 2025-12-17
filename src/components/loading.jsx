import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";

export default function Loading({ ativo, mensagem }) {
  return (
    <Modal transparent animationType="fade" visible={ativo} statusBarTranslucent>
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl items-center">
          <ActivityIndicator size="large" color="#47a603" />
          {mensagem ? (
            <Text className="mt-3 text-base text-gray-800 dark:text-gray-200 text-center">
              {mensagem}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
