import React, { forwardRef, useState } from "react";
import { View, Text, TextInput } from "react-native";
import { cn } from "@/lib/utils";

const Input = forwardRef(function Input(
  {
    label,
    icon,
    error,
    classNameContainer,
    classNameContainerInput,
    classNameInput,
    classNameLabel,
    placeholder,
    secureTextEntry,
    onBlur,
    editable = true,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={cn("w-full", classNameContainer)}>
      {label && (
        <Text
          className={cn(
            "text-sm font-medium text-gray-700 dark:text-gray-300 mb-1",
            classNameLabel,
          )}
        >
          {label}
        </Text>
      )}

      <View
        className={cn(
          "flex-row items-center rounded-lg px-3 h-14 gap-2 border",
          editable ? "bg-white dark:bg-neutral-900" : "bg-neutral-100 dark:bg-neutral-800",
          focused ? "border-primary" : "border-gray-300",
          error && "border-red-500",
          classNameContainerInput,
        )}
      >
        {icon && <View>{icon}</View>}

        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            if (onBlur) onBlur(event);
            setFocused(false);
          }}
          className={cn(
            "flex-1 text-base text-black dark:text-white",
            !editable && "opacity-60",
            classNameInput,
          )}
          selectionColor="#1a7dd7"
          {...rest}
        />
      </View>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
});

export default Input;
