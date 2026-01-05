import { Alert, Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";
import Input from "../input";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ehNumeroValido, gerarGuid } from "@/utils/funcoes";
import useRegistrosClimaticosDatabase from "@/database/useRegistrosClimaticosDatabase";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function ModalRegistrarClima({
  isOpen,
  setIsOpen,
  pluviometro,
  setPluviometro,
  precipitacao,
  setPrecipitacao,
  data,
  setData,
  dataFormatada,
  setDataFormatada,
  guidRegistro,
  acao,
}) {
  const [isCalendarioOpen, setIsCalenarioOpen] = useState(false);

  const { registrarClima, editarClima } = useRegistrosClimaticosDatabase();

  function verificarCampos() {
    if (!pluviometro) {
      throw new Error("Informe o Pluviômetro!");
    }
    if (!dataFormatada) {
      throw new Error("Informe a data!");
    }
    if (!precipitacao) {
      throw new Error("Informe a precipitação!");
    }
    if (!ehNumeroValido(pluviometro)) {
      throw new Error("Valor inválido para o pluviômetro!");
    }
    if (!ehNumeroValido(precipitacao)) {
      throw new Error("Valor inválido para a precipitação!");
    }
  }

  async function handleRegistrarClima() {
    try {
      verificarCampos();
      if (acao === "adicionar") {
        const guid = gerarGuid();
        await registrarClima(guid, pluviometro, precipitacao, dataFormatada);
      } else if (acao === "editar") {
        editarClima(guidRegistro, pluviometro, precipitacao, dataFormatada);
      }
      setIsOpen(false);
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  function onSelecionarData(event, selectedDate) {
    const currentDate = selectedDate;
    setIsCalenarioOpen(false);
    setData(currentDate);
    setDataFormatada(
      currentDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    );
  }

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
            justifyContent: "center",
          }}
        >
          <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
            <View className="gap-y-2">
              <Input
                label="Pluviômetro"
                placeholder="Número do Pluviômetro"
                value={pluviometro}
                onChangeText={setPluviometro}
                keyboardType="numeric"
              />
              <Input
                label="Data"
                value={dataFormatada}
                showSoftInputOnFocus={false}
                onPressIn={() => setIsCalenarioOpen(true)}
              />

              {isCalendarioOpen && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={data}
                  mode="date"
                  is24Hour={true}
                  onChange={onSelecionarData}
                />
              )}

              <Input
                label="Precipitação (mm)"
                value={precipitacao}
                onChangeText={setPrecipitacao}
                keyboardType="numeric"
              />
            </View>
            <View className="gap-y-2">
              <Button texto="Salvar" onPress={handleRegistrarClima} />
              <Button texto="Cancelar" variant="outline" onPress={() => setIsOpen(false)} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
