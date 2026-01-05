import { TouchableOpacity, Text, View } from "react-native";
import { cn } from "@/lib/utils";

export default function Button({
  texto = "",
  icon,
  variant = "default",
  textVariant,
  size = "default",
  classNameButton = "",
  ...rest
}) {
  const variants = {
    default: "bg-primary",
    destructive: "bg-red-600",
    outline: "border border-gray-100 bg-transparent",
    secondary: "bg-gray-700",
    ghost: "bg-transparent",
    link: "bg-transparent",
    warning: "bg-yellow-500",
    success: "bg-green-600",
  };

  const variantsText = {
    default: "text-white",
    destructive: "text-white",
    outline: "text-gray-400",
    secondary: "text-white",
    ghost: "text-gray-700",
    link: "text-blue-500 underline",
    warning: "text-white",
    success: "text-white",
  };

  const sizes = {
    default: "px-8 py-4 rounded-lg shadow-xs",
    sm: "px-3 py-1.5 rounded-lg shadow-xs",
    lg: "px-10 py-5 rounded-lg shadow-xs",
    icon: "p-3 rounded-full shadow-xs",
  };

  const currentVariant = variants[variant] || variants.default;
  const currentText = variantsText[textVariant || variant] || variantsText.default;
  const currentSize = sizes[size] || sizes.default;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={cn(
        "flex flex-row items-center justify-center gap-2",
        currentVariant,
        currentSize,
        classNameButton,
      )}
      {...rest}
    >
      {icon && <View>{icon}</View>}
      {texto !== "" && (
        <Text className={cn("text-center font-semibold text-base", currentText)}>{texto}</Text>
      )}
    </TouchableOpacity>
  );
}
