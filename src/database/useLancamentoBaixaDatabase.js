import {
  consultarLancamentosBaixasServidor,
  consultarLancamentosItensServidor,
  consultarLancamentosTalhoesServidor,
} from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useLancamentoBaixaDatabase() {
  const db = useSQLiteContext();

  async function atualizarLancamentosBaixasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const lancamentosBaixas = await consultarLancamentosBaixasServidor();
      const lancamentosItens = await consultarLancamentosItensServidor();
      const lancamentosTalhoes = await consultarLancamentosTalhoesServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync(
          `
            DELETE FROM tblancamentos
            WHERE sincronizarapp = 'S'
          `,
        );

        if (lancamentosBaixas.length > 0) {
          for (const lancamentoBaixa of lancamentosBaixas) {
            await db.runAsync(
              `
                INSERT INTO tblancamentos
                (
                  id, guid, numcompeso, imei, tiplan, datlan, horlan, codciclo, codfun,
                  nomfun, codbem, nombem, anotacao, tiptalhao, status, sincronizarapp, codusuinc, nomusuinc
                )
                VALUES
                (
                  ?, ?, ?, ?, ?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?, ?, ?, ?, ?
                );
              `,
              [
                lancamentoBaixa.id,
                lancamentoBaixa.guid,
                lancamentoBaixa.numcompeso,
                lancamentoBaixa.imei,
                lancamentoBaixa.tiplan,
                lancamentoBaixa.datlan,
                lancamentoBaixa.horlan,
                lancamentoBaixa.codciclo,
                lancamentoBaixa.codfun,
                lancamentoBaixa.nomfun,
                lancamentoBaixa.codbem,
                lancamentoBaixa.nombem,
                lancamentoBaixa.anotacao,
                lancamentoBaixa.tiptalhao,
                lancamentoBaixa.status,
                "S",
                lancamentoBaixa.codusuinc,
                lancamentoBaixa.nomusuinc,
              ],
            );
          }
        }

        await db.runAsync(
          `
            DELETE FROM tblancamentoitens
            WHERE sincronizarapp = 'S'
          `,
        );

        if (lancamentosItens.length > 0) {
          for (const lancamentoItem of lancamentosItens) {
            await db.runAsync(
              `
                INSERT INTO tblancamentoitens
                (
                  idlan, guid, guidlan, codproid, qtdpro, coddep, nomdep, anotacao, codetapa,
                  qtdha, qtdporha, sitlan, status, sincronizarapp
                ) 
                VALUES
                (
                  ?, ?, ?, ?, ?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?
                );
            `,
              [
                lancamentoItem.idlan,
                lancamentoItem.guid,
                lancamentoItem.guidlan,
                lancamentoItem.codproid,
                lancamentoItem.qtdpro,
                lancamentoItem.coddep,
                lancamentoItem.nomdep,
                lancamentoItem.anotacao,
                lancamentoItem.codetapa,
                lancamentoItem.qtdha,
                lancamentoItem.qtdporha,
                lancamentoItem.sitlan,
                lancamentoItem.status,
                "S",
              ],
            );
          }
        }

        await db.runAsync(
          `
            DELETE FROM tblancamentotalhao
            WHERE sincronizarapp = 'S'
          `,
        );

        if (lancamentosTalhoes.length > 0) {
          for (const lancamentoTalhao of lancamentosTalhoes) {
            await db.runAsync(
              `
                INSERT INTO tblancamentotalhao
                ( 
                  idlan, guid, guidlan, codnome, qtd, status, sincronizarapp 
                ) 
                VALUES 
                ( 
                  ?, ?, ?, ?, ?, ?, ?
                )  
              `,
              [
                lancamentoTalhao.idlan,
                lancamentoTalhao.guid,
                lancamentoTalhao.guidlan,
                lancamentoTalhao.codnome,
                lancamentoTalhao.qtd,
                lancamentoTalhao.status,
                "S",
              ],
            );
          }
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar lançamento de baixas: " + error);
    }
  }

  return { atualizarLancamentosBaixasLocal };
}
