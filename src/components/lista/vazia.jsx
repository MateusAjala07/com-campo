import { View, Text, TouchableOpacity } from "react-native";
import { RefreshCw } from "lucide-react-native";

export default function ListaVazia({ message, onRefresh }) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-gray-500 text-base mb-2">{message}</Text>
      {onRefresh && (
        <TouchableOpacity onPress={onRefresh} className="mt-2 flex-row items-center space-x-2 bg-blue-500 px-3 py-2 rounded-xl">
          <RefreshCw size={16} color="#fff" />
          <Text className="text-white font-medium">Recarregar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
