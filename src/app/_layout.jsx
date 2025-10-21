import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { SafeAreaProvider } from "react-native-safe-area-context";
import inicialDatabase from "../database/inicialDatabase";
import "../../global.css";

export default function Layout() {
  return (
    <SQLiteProvider databaseName="banco.db" onInit={inicialDatabase}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
