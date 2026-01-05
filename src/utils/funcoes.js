import { consultarServidor } from "@/services/api";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import * as Application from "expo-application";
import * as Device from "expo-device";
import uuid from "react-native-uuid";

export async function redeAtiva() {
  const state = await NetInfo.fetch();
  return {
    ativo: state.isConnected,
    mensagem: state.isConnected ? "" : "Sem conexão com a internet!",
  };
}

export async function servidorAtivo() {
  const status = await consultarServidor();
  return {
    ativo: status === 200,
    mensagem: status === 200 ? "" : "Servidor inativo!",
  };
}

export async function redeEServidorAtivo() {
  let rede, servidor;
  rede = await redeAtiva();
  if (rede.ativo) {
    servidor = await servidorAtivo();
  }

  return {
    ativo: rede.ativo && servidor.ativo,
    mensagem: !rede.ativo ? rede.mensagem : !servidor.ativo ? servidor.mensagem : "",
  };
}

export async function listarInformacoesDispositivo() {
  try {
    let id = Application.getAndroidId();
    if (!id) {
      id = await Application.getIosIdForVendorAsync();
      return { id };
    }

    return {
      id,
      brand: Device.brand,
      model: Device.modelName,
    };
  } catch (error) {
    throw new Error(error.message || "Erro ao obter informações do dispositivo.");
  }
}

export function gerarChave() {
  let bContinua = false;
  let sBase = "";

  while (!bContinua) {
    let hora = new Date().getHours().toString().padStart(2, "0");
    let minuto = new Date().getMinutes().toString().padStart(2, "0");
    let segundo = new Date().getSeconds().toString().padStart(2, "0");

    let base = parseInt(hora + minuto, 10) * parseInt(segundo, 10);
    sBase = base.toString().trim();

    if (sBase !== "0") {
      bContinua = true;
    }
  }

  let chave = "";
  for (let i = 0; i < sBase.length; i++) {
    if (i === sBase.length - 1) {
      chave += sBase[i];
    } else {
      chave += sBase[i] + ".";
    }
  }

  let imei = listarInformacoesDispositivo().id;

  return { chave, base: sBase, imei };
}

export async function listarIP() {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    return response.data.ip;
  } catch (error) {
    throw new Error(error.message || "Não foi possível obter o IP público.");
  }
}

export function codif(s) {
  const shift = 152;
  let text1 = "";

  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i) + shift;
    text1 += String.fromCharCode(code);
  }

  return text1;
}

export function ehNumeroValido(valor) {
  return !isNaN(parseFloat(valor)) && isFinite(valor);
}

export function gerarGuid() {
  return uuid.v4();
}
