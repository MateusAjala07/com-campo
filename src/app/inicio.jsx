import { SafeAreaView } from "react-native-safe-area-context";
import Cabecalho from "@/components/cabecalho";
import CardIcone from "@/components/cardIcone";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import React, { useState } from "react";
import { CloudSunRain, Fuel, MapPinned, Package, PackageOpen } from "lucide-react-native";
import MenuInicio from "@/components/modals/menuInicio";

export default function Inicio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      {isMenuOpen && <MenuInicio isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />}

      <StatusBar style="auto" />
      <Cabecalho titulo="ComCampo" voltar={false} menu={() => setIsMenuOpen(!isMenuOpen)} />
      <View className="p-4 flex flex-row gap-2 flex-wrap">
        <CardIcone
          icon={<MapPinned size={30} color={"#47a603"} />}
          texto="Ocorrências"
          navigate="/ocorrencias"
        />
        <CardIcone
          icon={<CloudSunRain size={30} color={"#47a603"} />}
          texto="Climáticos"
          navigate="/climaticos"
        />
        <CardIcone
          icon={<Fuel size={30} color={"#47a603"} />}
          texto="Abastecimentos"
          navigate="/abastecimentos"
        />
        <CardIcone
          icon={<Package size={30} color={"#47a603"} />}
          texto="Baixa de Estoque"
          navigate="/baixa-de-estoque"
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
