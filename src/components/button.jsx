import { TouchableOpacity, Text } from "react-native";

export function Button({ texto = "", icon, classNameButton, ...rest }) {
  return (
    <TouchableOpacity className={`bg-primary p-4 rounded-lg ${classNameButton}`} activeOpacity={0.8} {...rest}>
      {icon}
      <Text className="text-white text-center font-bold text-base">{texto}</Text>
    </TouchableOpacity>
  );
}
