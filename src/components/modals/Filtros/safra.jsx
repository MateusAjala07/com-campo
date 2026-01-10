import Button from "@/components/button";
import Select from "@/components/select";
import useSafrasDatabase from "@/database/useSafrasDatabase";
import { Filter, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModalFiltroSafras({ isOpen, setIsOpen }) {
  const [safra, setSafra] = useState("");
  const [dataSafra, setDataSafra] = useState([]);

  const { consultarSafrasLocal } = useSafrasDatabase();

  async function listarSafras() {
    const response = await consultarSafrasLocal();
    setDataSafra(response);
  }

  useEffect(() => {
    listarSafras();
  }, []);

  return (
    <>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <View className="bg-white p-5 shadow rounded-xl justify-center">
            <View className="flex-row justify-end">
              <X onPress={() => setIsOpen(false)} />
            </View>
            <View className="gap-y-4">
              <Select
                label="Safra"
                data={dataSafra}
                value={safra}
                onChange={setSafra}
                placeholder="Selecione a safra"
                config={{ label: "descricao", value: "id" }}
              />
              <Button texto="Filtrar" icon={<Filter color={"#fff"} size={20} />} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
