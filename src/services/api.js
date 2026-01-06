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

export async function consultarUsuariosServidor() {
  try {
    const response = await api.get("appcomcampo/acesso/usuario");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Não foi possível listar os usuarios.");
  }
}

export async function validarAcessoServidor(pIdDispositivo, pChave, pCodLib) {
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

export async function gravarLicencaServidor(pIdDispositivo, pChave, pCodLib) {
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

export async function consultarFazendasServidor() {
  try {
    const response = await api.get("appcomcampo/fazenda");
    return response.data;
  } catch (error) {
    throw new Error(error.message || "Não foi possível listar as fazendas");
  }
}

export async function consultarRegistrosClimaticosServidor() {
  try {
    const response = await api.get("comcampo/registros-climaticos");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function registrarRegistrosClimaticosServidor(registrosClimaticos) {
  try {
    const registrosClimaticosString = JSON.stringify(registrosClimaticos);
    await api.post("comcampo/registros-climaticos", { regclima: registrosClimaticosString });
  } catch (error) {
    throw new Error(error.message || "Não foi possível registrar os lançamentos");
  }
}

export async function excluirRegistroClimaticoServidor(pGuid) {
  try {
    await api.delete(`comcampo/registros-climaticos/${pGuid}`);
  } catch (error) {
    throw new Error(error.message || "Erro ao excluir registro");
  }
}
