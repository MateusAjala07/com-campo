import { SafeAreaView } from "react-native-safe-area-context";
import Cabecalho from "@/components/cabecalho";
import CardIcone from "@/components/cardIcone";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { CloudSunRain, Fuel, MapPinned, Package, PackageOpen } from "lucide-react-native";
import MenuInicio from "@/components/modals/menuInicio";
import { createMMKV } from "react-native-mmkv";
import { Alert } from "react-native";
import { BackHandler } from "react-native";
import { usePathname } from "expo-router";

const storage = createMMKV({
  id: "storage",
});

export default function Inicio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const backAction = () => {
      if (pathname === "/inicio") {
        Alert.alert("Sair", "Tem certeza que deseja sair do app?", [
          { text: "Cancelar", onPress: () => null, style: "cancel" },
          { text: "Sim", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [pathname]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      {isMenuOpen && <MenuInicio isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />}

      <StatusBar style="auto" />
      <Cabecalho
        titulo={storage.getString("nomFazenda")}
        voltar={false}
        menu={() => setIsMenuOpen(!isMenuOpen)}
      />
      <View className="p-4 flex flex-row justify-between gap-y-4 flex-wrap">
        {/* <CardIcone
          icon={<MapPinned size={30} color={"#47a603"} />}
          texto="Ocorrências"
          navigate="/ocorrencias"
        /> */}
        <CardIcone
          icon={<CloudSunRain size={30} color={"#47a603"} />}
          texto="Reg. Climáticos"
          navigate="/registros-climaticos"
        />
        <CardIcone
          icon={<Package size={30} color={"#47a603"} />}
          texto="Reg. Baixa de Estoque"
          navigate="/registros-baixa-de-estoque"
        />
        <CardIcone
          icon={<Fuel size={30} color={"#47a603"} />}
          texto="Abastecimentos"
          navigate="/abastecimentos"
        />
        
        <CardIcone
          icon={<PackageOpen size={30} color={"#47a603"} />}
          texto="Consultar Estoque"
          navigate="/consultar-estoque"
        />
      </View>
    </SafeAreaView>
  );
}
