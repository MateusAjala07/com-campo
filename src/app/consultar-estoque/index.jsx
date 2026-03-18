import useDepositoDatabase from "@/database/useDepositoDatabase";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Select from "@/components/select";
import Cabecalho from "@/components/cabecalho";

export default function ConsultarEstoque() {
  const [estoque, setEstoque] = useState("");
  const [dataEstoque, setDataEstoque] = useState([]);
  const { consultarDepositosLocal } = useDepositoDatabase();

  async function listarEstoque() {
    const response = await consultarDepositosLocal();
    setDataEstoque(response);
  }

  useEffect(() => {
    listarEstoque();
  }, []);
  return (
    <>
       <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
        <Cabecalho titulo="Consultar Estoque" />
        <View className="bg-white p-5 shadow rounded-xl justify-center">
          <View className="flex-row justify-end"></View>
          <View className="gap-y-4">
            <Select
              label="Estoque"
              data={dataEstoque}
              value={estoque?.coddep ?? ""}
              onChange={setEstoque}
              placeholder="Selecione o Estoque"
              config={{ label: "nomdep", value: "coddep" }}
              search
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
