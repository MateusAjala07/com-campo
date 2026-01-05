import axios from "axios";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

function carregarConexao() {
  const ip = storage.getString("ipConexao");
  const porta = storage.getString("portaConexao");
  return ip && porta ? { ip, porta } : null;
}

const conexao = carregarConexao();

export const api = axios.create({
  baseURL: conexao ? `http://${conexao.ip}:${conexao.porta}/` : "http://127.0.0.1:3000/",
  auth: {
    username: "comsystem",
    password: "|dExE?0#ffltiruK",
  },
});

export async function consultarServidor() {
  try {
    const response = await api.get("index");
    return response.status;
  } catch (error) {
    throw new Error(error.message || "Não foi possível conectar ao servidor.");
  }
}

export async function consultarUsuarios() {
  try {
    const response = await api.get("appcomcampo/acesso/usuario");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Não foi possível listar os usuarios.");
  }
}

export async function consultarParametrosSistema() {
  try {
    // const response = await api.get("api/parametro/sistema");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Não foi possível listar os parametros.");
  }
}

export async function validarAcesso(pIdDispositivo, pChave, pCodLib) {
  try {
    const response = await api.post(`appcomcampo/acesso/validaracesso`, {
      imei: pIdDispositivo,
      chave: pChave,
      codlib: pCodLib,
    });
    return response.data?.result?.toUpperCase();
  } catch (error) {
    throw new Error(error.message || "Não foi possível validar o acesso.");
  }
}

export async function gravarLicenca(pIdDispositivo, pChave, pCodLib) {
  try {
    const response = await api.post(`appcomcampo/acesso/gravarlicencaservidor`, {
      imei: pIdDispositivo,
      chave: pChave,
      codlib: pCodLib,
    });
    return response.data?.result?.toUpperCase();
  } catch (error) {
    throw new Error(error.message || "Não foi possível gravar a licenca.");
  }
}

export async function consultarFazendas() {
  try {
    const response = await api.get("appcomcampo/fazenda");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Não foi possível listar as fazendas");
  }
}
