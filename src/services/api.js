import axios from "axios";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export const api = axios.create({
  auth: {
    username: "comsystem",
    password: "|dExE?0#ffltiruK",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const ip = storage.getString("ipConexao");
    const porta = storage.getString("portaConexao");

    if (ip && porta) {
      config.baseURL = `http://${ip}:${porta}/`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let mensagemErro = "Ocorreu um erro inesperado.";

    if (error.response) {
      mensagemErro = error.response.data?.message || `Erro do servidor: ${error.response.status}`;
    } else if (error.request) {
      mensagemErro = "Sem resposta do servidor. Verifique sua conexão.";
    } else {
      mensagemErro = error.message;
    }

    return Promise.reject(new Error(mensagemErro));
  },
);

export async function consultarServidor() {
  const response = await api.get("index", { timeout: 3000 });
  return response.status;
}

export async function consultarUsuariosServidor() {
  const response = await api.get("comcampo/usuarios");
  return response.data;
}

export async function validarAcessoServidor(pIdDispositivo, pChave, pCodLib) {
  const response = await api.get(
    `comcampo/acesso/validar?imei=${pIdDispositivo}&chave=${pChave}&codlib=${pCodLib}`,
    {
      imei: pIdDispositivo,
      chave: pChave,
      codlib: pCodLib,
    },
  );
  return response.data?.result?.toUpperCase();
}

export async function gravarLicencaServidor(pIdDispositivo, pChave, pCodLib) {
  const response = await api.post(`comcampo/acesso/licenca`, {
    imei: pIdDispositivo,
    chave: pChave,
    codlib: pCodLib,
  });
  return response.data?.result?.toUpperCase();
}

export async function consultarFazendasServidor() {
  const response = await api.get("comcampo/fazendas");
  return response.data;
}

export async function consultarRegistrosClimaticosServidor() {
  const response = await api.get("comcampo/registros-climaticos");
  return response.data;
}

export async function registrarRegistrosClimaticosServidor(registrosClimaticos) {
  const registrosClimaticosString = JSON.stringify(registrosClimaticos);
  await api.post("comcampo/registros-climaticos", { regclima: registrosClimaticosString });
}

export async function excluirRegistroClimaticoServidor(pGuid) {
  await api.delete(`comcampo/registros-climaticos/${pGuid}`);
}

export async function consultarSafrasServidor(pAno = 0) {
  const response = await api.get(`comcampo/safras?ano=${pAno}`);
  return response.data;
}

export async function consultarPluviometrosServidor() {
  const response = await api.get(`comcampo/pluviometros`);
  return response.data;
}
