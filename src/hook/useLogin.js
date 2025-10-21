export default function useLogin() {
  function efetuarLogin(codigo, usuario, senha, lembrarLogin) {
    console.log({ codigo, usuario, senha, lembrarLogin });
  }

  return { efetuarLogin };
}
