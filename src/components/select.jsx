import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function Select({
  data,
  value,
  onChange,
  label,
  placeholder = "Selecione uma opção",
  searchPlaceholder = "Buscar...",
  config = { label: "descricao", value: "id" },
  error,
  search = false,
}) {
  const [isFocus, setIsFocus] = useState(false);

  const renderItem = (item) => {
    const isSelected = item[config.value] === value;

    return (
      <View style={[styles.item, isSelected && styles.itemSelected]}>
        <Text style={[styles.textItem, isSelected && styles.textItemSelected]}>
          {item[config.label]}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
      )}

      <Dropdown
        style={[styles.dropdown, isFocus && styles.dropdownFocus, error && styles.dropdownError]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.dropdownContainer}
        data={data}
        search={search}
        maxHeight={300}
        labelField={config.label}
        valueField={config.value}
        placeholder={!isFocus ? placeholder : "..."}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onChange(item[config.value]);
          setIsFocus(false);
        }}
        renderItem={renderItem}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: "#d1d5dc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "white",
  },
  dropdownFocus: {
    borderColor: "#47a603",
    borderWidth: 1.5,
  },
  dropdownError: {
    borderColor: "#ef4444",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5dc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemSelected: {
    backgroundColor: "#f1f5f9",
  },
  textItem: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
  },
  textItemSelected: {
    fontWeight: "600",
  },
  placeholderStyle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: "#64748b",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    borderRadius: 6,
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#ef4444",
  },
});
