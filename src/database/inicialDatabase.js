export default async function inicialDatabase(db) {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tbsistema (
        id INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso INTEGER,
        nomfazenda VARCHAR(50),
        codciclo INTEGER,
        desciclo VARCHAR(45),
        codusu INTEGER,
        nomusu VARCHAR(45),
        senusu VARCHAR(25),
        lembrarlogin CHAR(1) DEFAULT 'S',
        acessomobile CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS licenca (
        id INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        ip VARCHAR(40),
        chave VARCHAR(100),
        codacesso VARCHAR(100),
        imei VARCHAR(250)
      );

      CREATE TABLE IF NOT EXISTS tbusuarios (
        id INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        codusu INTEGER NOT NULL ON CONFLICT ROLLBACK,
        nomusu VARCHAR(45),
        senusu VARCHAR(25),
        nivelacesso INTEGER,
        ususuper CHAR(1),
        acessomobile CHAR(1) DEFAULT 'N'
      );      

      CREATE TABLE IF NOT EXISTS tbregclima (
        id           INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        guid         VARCHAR(50),
        guid_sinc    VARCHAR(50),
        datreg       DATE,
        horreg       VARCHAR(8),
        numcompeso   INTEGER default 0,
        imei         VARCHAR(150),
        idmobile     INTEGER default 0,
        status       VARCHAR(1) default 'A',
        idpluv       INTEGER default 0,
        tempmin      FLOAT   default 0,
        tempmed      FLOAT   default 0,
        tempmax      FLOAT   default 0,
        umidade      FLOAT   default 0,
        precipitacao FLOAT   default 0,
        lat          FLOAT   default 0,
        lng          FLOAT   default 0,
        sincronizarapp VARCHAR(1) default 'N',
        codusuinc      INTEGER default 0,
        nomusuinc      VARCHAR(50),
        nsureg       VARCHAR(25),
        id_sinc      INTEGER DEFAULT 4,
        resptec      VARCHAR(50),
        obsclima     VARCHAR(250),
        data         date
      );

      CREATE TABLE IF NOT EXISTS tbfazenda (      
        numcompeso INTEGER,
        nomfazenda VARCHAR(50),
        qualpesoliquido VARCHAR(1),
        codremarm INTEGER,
        codremlav INTEGER
      );

    `);
  } catch (error) {
    throw new Error(error.message);
  }
}
