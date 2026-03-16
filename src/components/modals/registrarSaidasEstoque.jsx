import { Modal, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Select from "../select";
import { useEffect, useState } from "react";
import useSafrasDatabase from "@/database/useSafrasDatabase";
import Button from "../button";
import useMercadoriaDatabase from "@/database/useMercadoriaDatabase";
import useFuncionarioDatabase from "@/database/useFuncionarioDatabase";
import Input from "../input";
import Lista from "../lista";

export default function ModalRegistrarSaidasEstoque({ isOpen, setIsOpen }) {
  const { consultarSafrasLocal } = useSafrasDatabase();
  const { consultarMaquinasLocal, consultarProdutosLocal } = useMercadoriaDatabase();
  const { consultarFuncionariosLocal } = useFuncionarioDatabase();

  const dataTipoLancamento = [{ nome: "Aplicar na Lavoura" }, { nome: "Outras Aplicações" }];
  const dataTipoTalhao = [{ nome: "Informar por Talhão" }, { nome: "Lançar para Todos" }];
  const [dataSafra, setDataSafra] = useState([]);
  const [dataMaquinas, setDataMaquinas] = useState([]);
  const [dataFuncionarios, setDataFuncionarios] = useState([]);
  const [dataProdutos, setDataProdutos] = useState([]);
  const [dataItens, setDataItens] = useState([]);

  const [aba, setAba] = useState("Lançamento1");

  const [tipoLancamento, setTipoLancamento] = useState("");
  const [tipoTalhao, setTipoTalhao] = useState("");
  const [safra, setSafra] = useState("");
  const [maquina, setMaquina] = useState("");
  const [funcionario, setFuncionario] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(0);

  const [observacaoLancamento, setObservacaoLancamento] = useState("");
  const [observacaoItem, setObservacaoItem] = useState("");

  async function listarSafras() {
    const response = await consultarSafrasLocal();
    setDataSafra(response);
  }

  async function listarMaquinas() {
    const response = await consultarMaquinasLocal("nompro");
    setDataMaquinas(response);
  }

  async function listarFuncionarios() {
    const response = await consultarFuncionariosLocal("nomfun");
    setDataFuncionarios(response);
  }

  async function listarProdutos() {
    const response = await consultarProdutosLocal("nompro", 0);
    setDataProdutos(response);
  }

  function handleAvancar() {
    switch (aba) {
      case "Lançamento1":
        setAba("Lançamento2");
        break;

      case "Lançamento2":
        setAba("Item");
        break;

      case "Item":
        setAba("Listagem Itens");
        setDataItens([...dataItens, produto]);
        break;

      default:
        break;
    }
  }

  function handleVoltar() {
    switch (aba) {
      case "Lançamento1":
        setIsOpen(false);
        break;

      case "Lançamento2":
        setAba("Lançamento1");
        break;

      case "Item":
        setAba("Lançamento2");
        break;

      case "Listagem Itens":
        setAba("Item");
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    if (isOpen) {
      setAba("Lançamento1");
      listarSafras();
      listarMaquinas();
      listarFuncionarios();
      listarProdutos();
    }
  }, [isOpen]);

  return (
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
          {aba === "Lançamento1" && (
            <>
              <Text className="texto-secundario">Lançamento 1 / 2</Text>
              <Select
                label="Tipo do Lançamento"
                data={dataTipoLancamento}
                value={tipoLancamento}
                onChange={setTipoLancamento}
                placeholder="Selecione"
                config={{ label: "nome", value: "nome" }}
              />
              <Select
                label="Lançar para todos os talhões?"
                data={dataTipoTalhao}
                value={tipoTalhao}
                onChange={setTipoTalhao}
                placeholder="Selecione"
                config={{ label: "nome", value: "nome" }}
              />
              <Select
                label="Safra"
                data={dataSafra}
                value={safra}
                onChange={setSafra}
                placeholder="Selecione"
                config={{ label: "descricao", value: "descricao" }}
              />
            </>
          )}

          {aba === "Lançamento2" && (
            <>
              <Text className="texto-secundario">Lançamento 2 / 2</Text>
              <Select
                label="Máquina"
                data={dataMaquinas}
                value={maquina}
                onChange={setMaquina}
                placeholder="Máquina / Bem"
                search
                config={{ label: "nompro", value: "idpro" }}
              />
              <Select
                label="Funcionário"
                data={dataFuncionarios}
                value={funcionario}
                onChange={setFuncionario}
                placeholder="Selecione"
                search
                config={{ label: "nomfun", value: "nomfun" }}
              />
              <Input
                label="Observação"
                multiline
                value={observacaoLancamento}
                onChangeText={setObservacaoLancamento}
                classNameContainerInput="h-20"
                classNameInput="h-full w-full"
                textAlignVertical="top"
              />
            </>
          )}

          {aba === "Item" && (
            <>
              <Text className="texto-secundario">Item</Text>
              <Select
                label="Produto"
                data={dataProdutos}
                value={produto}
                onChange={setProduto}
                placeholder="Selecione"
                search
                config={{ label: "nompro", value: "nompro" }}
              />
              <Input
                label="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
                keyboardType="numeric"
              />
              <Input
                label="Observação"
                multiline
                value={observacaoItem}
                onChangeText={setObservacaoItem}
                classNameContainerInput="h-20"
                classNameInput="h-full w-full"
                textAlignVertical="top"
              />
            </>
          )}

          {aba === "Listagem Itens" && (
            <>
              <Lista data={dataItens} />
            </>
          )}

          <View className="flex flex-row justify-between">
            <Button
              texto={aba === "Lançamento1" ? "Cancelar" : "Voltar"}
              variant="secondary"
              onPress={handleVoltar}
            />
            <Button texto="Avançar" onPress={handleAvancar} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
