import { View, Text, TouchableOpacity } from "react-native";
import { AlertTriangle } from "lucide-react-native";

export default function ListaErro({ message = "Erro inesperado", onRetry }) {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <AlertTriangle size={28} color="#ef4444" />
      <Text className="text-red-500 text-base mt-2">{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="mt-3 bg-red-500 px-3 py-2 rounded-xl">
          <Text className="text-white font-medium">Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
