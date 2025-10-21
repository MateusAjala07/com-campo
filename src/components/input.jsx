import React, { forwardRef } from "react";
import { View, Text, TextInput } from "react-native";
import { cn } from "../utils/cn";

const Input = forwardRef(function Input({ label, icon, error, classNameContainer, classNameInput, placeholder, secureTextEntry, editable = true, ...rest }, ref) {
  return (
    <View className={cn("w-full", classNameContainer)}>
      {label && <Text className="text-sm font-medium mb-1">{label}</Text>}

      <View className={`flex-row items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:border-primary w-full ${!editable && "inputDisabled"} ${error && "border-red-500"}`}>
        {icon ? <View>{icon}</View> : null}

        <TextInput ref={ref} placeholder={placeholder} secureTextEntry={secureTextEntry} className={cn(`flex-1 text-base text-black`, classNameInput)} selectionColor="#47a603" {...rest} />
      </View>

      {error ? <Text className="text-red-500 text-xs mt-1">{error}</Text> : null}
    </View>
  );
});

export default Input;
