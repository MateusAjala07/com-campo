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

export async function verificarServidor() {
  try {
    const response = await api.get("api/");
    return response.status;
  } catch (error) {
    throw new Error(error.message || "Erro ao verificar o servidor.");
  }
}
