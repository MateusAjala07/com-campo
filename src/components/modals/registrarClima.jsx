import { Alert, Modal, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";
import Input from "../input";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ehNumeroValido, gerarGuid } from "@/utils/funcoes";
import useClimaticoDatabase from "@/database/useClimaticoDatabase";
import { alerta } from "../alerta";
import Select from "../select";

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
  handleRequestClose = () => setIsOpen(false),
}) {
  const [isCalendarioOpen, setIsCalenarioOpen] = useState(false);
  const [dataPluviometro, setDataPluviometro] = useState([]);

  const {
    registrarRegistrosClimaticosLocal,
    editarRegistrosClimaticosLocal,
    consultarPluviometrosLocal,
  } = useClimaticoDatabase();

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

  async function handleSalvar() {
    try {
      verificarCampos();
      if (acao === "adicionar") {
        const guid = gerarGuid();
        await registrarRegistrosClimaticosLocal(guid, pluviometro, precipitacao, dataFormatada);
      } else if (acao === "editar") {
        editarRegistrosClimaticosLocal(guidRegistro, pluviometro, precipitacao, dataFormatada);
      }
      handleRequestClose();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  async function handleCancelar() {
    alerta({
      title: "Atenção",
      message: "Deseja cancelar o lançamento?",
      textYes: "SIM",
      textNo: "NÃO",
      onYes: () => handleRequestClose(),
      cancelable: true,
    });
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

  async function listarPluviometros() {
    const response = await consultarPluviometrosLocal();
    setDataPluviometro(response);
  }

  useEffect(() => {
    if (isOpen) {
      listarPluviometros();
    }
  }, [isOpen]);

  return (
    <>
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={handleRequestClose}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
          }}
        >
          <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
            <View className="gap-y-2">
              <Select
                label="Pluviômetro"
                data={dataPluviometro}
                value={pluviometro}
                onChange={setPluviometro}
                placeholder="Selecione o pluviômetro"
                config={{ label: "despluv", value: "idpluv" }}
                search
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
              <Button texto="Salvar" onPress={handleSalvar} />
              <Button texto="Cancelar" variant="outline" onPress={handleCancelar} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}
