export default async function inicialDatabase(db) {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tbsistema (
        id           INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso   INTEGER,
        nomfazenda   VARCHAR(50),
        codciclo     INTEGER,
        desciclo     VARCHAR(45),
        codusu       INTEGER,
        nomusu       VARCHAR(45),
        senusu       VARCHAR(25),
        lembrarlogin CHAR(1) DEFAULT 'S',
        acessomobile CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS licenca (
        id        INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        ip        VARCHAR(40),
        chave     VARCHAR(100),
        codacesso VARCHAR(100),
        imei      VARCHAR(250)
      );

      CREATE TABLE IF NOT EXISTS tbusuarios (
        id           INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        codusu       INTEGER NOT NULL ON CONFLICT ROLLBACK,
        nomusu       VARCHAR(45),
        senusu       VARCHAR(25),
        nivelacesso  INTEGER,
        ususuper     CHAR(1),
        acessomobile CHAR(1) DEFAULT 'N'
      );      

      CREATE TABLE IF NOT EXISTS tbregclima (
        id             INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        guid           VARCHAR(50),
        datreg         DATE,
        horreg         VARCHAR(8),
        numcompeso     INTEGER DEFAULT 0,
        imei           VARCHAR(150),
        idmobile       INTEGER DEFAULT 0,
        status         VARCHAR(1) DEFAULT 'A',
        idpluv         INTEGER DEFAULT 0,
        tempmin        FLOAT   DEFAULT 0,
        tempmed        FLOAT   DEFAULT 0,
        tempmax        FLOAT   DEFAULT 0,
        umidade        FLOAT   DEFAULT 0,
        precipitacao   FLOAT   DEFAULT 0,
        lat            FLOAT   DEFAULT 0,
        lng            FLOAT   DEFAULT 0,
        sincronizarapp CHAR(1) DEFAULT 'N',
        codusuinc      INTEGER DEFAULT 0,
        nomusuinc      VARCHAR(50),
        nsureg         VARCHAR(25),
        id_sinc        INTEGER DEFAULT 4,
        resptec        VARCHAR(50),
        obsclima       VARCHAR(250),
        data           date
      );

      CREATE TABLE IF NOT EXISTS tbfazenda (      
        numcompeso      INTEGER,
        nomfazenda      VARCHAR(50),
        qualpesoliquido VARCHAR(1),
        codremarm       INTEGER,
        codremlav       INTEGER
      );

      CREATE TABLE IF NOT EXISTS tbpluviometros (
        id         INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        idpluv     INTEGER DEFAULT 0,
        numcompeso INTEGER DEFAULT 0,
        numpluv    INTEGER DEFAULT 0,
        numref     VARCHAR(25),
        despluv    VARCHAR(250),
        sitpluv    CHAR(1) DEFAULT 'A'
      );

      CREATE TABLE IF NOT EXISTS tbsafras (
        id         INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso INTEGER NOT NULL ON CONFLICT ROLLBACK,
        descricao  VARCHAR(60),
        codproint  INTEGER,
        codrem     INTEGER,
        datini     DATE,
        datfin     DATE,
        idregsafra INTEGER,
        codciclo   INTEGER
      );

      CREATE TABLE IF NOT EXISTS tbcentrocusto (
        codcentro         INTEGER,
        nomcentro         VARCHAR(50),
        codclacencus      INTEGER,
        pedircodciclo     CHAR(1),
        coddep            INTEGER,
        cpfdevresponsavel VARCHAR(11),
        nomdevresponsavel VARCHAR(80),
        idpropriedade     INTEGER
      );

      CREATE TABLE IF NOT EXISTS tbciclosprod (
        codciclo           INTEGER,
        desciclo           VARCHAR(45),
        codproid           INTEGER,
        valcustokilo       FLOAT,
        qtdproducao        FLOAT,
        qtdkiloporsaco     FLOAT,
        tamanhoareaplantio FLOAT,
        datini             DATE,
        datfin             DATE
      );

      CREATE TABLE IF NOT EXISTS tblotes (
        id INTEGER     NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso     INTEGER NOT NULL ON CONFLICT ROLLBACK,
        codciclo       INTEGER,
        idlot          INTEGER,
        codlot         INTEGER,
        nomlot         VARCHAR(50),
        codnome        VARCHAR(10),
        qtdarealote    FLOAT,
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tblotesciclo (
        id             INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso     INTEGER NOT NULL ON CONFLICT ROLLBACK,
        codciclo       INTEGER,
        codlot         INTEGER,
        codvar         INTEGER,
        nomlot         VARCHAR(50),
        codnome        VARCHAR(10),
        qtdarealote    FLOAT,
        tamanhocolhido FLOAT DEFAULT 0,
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tbdepositos (
        coddep     INTEGER,
        nomdep     VARCHAR(50),
        numcompeso INTEGER
      );

      CREATE TABLE IF NOT EXISTS tbestoque (
        ID       INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        coddep   INTEGER,
        codproid INTEGER,
        nompro   VARCHAR(65),
        unipro   CHAR(2),
        estoque  FLOAT
      );

      CREATE TABLE IF NOT EXISTS tbfuncionarios (
        id         INTEGER,
        codfun     VARCHAR(6),
        nomfun     VARCHAR(45),
        apelido    VARCHAR(25),
        situacao   CHAR(1),
        numcompeso INTEGER
      );

      CREATE TABLE IF NOT EXISTS tblancamentos (
        numcompeso     INTEGER,
        imei           VARCHAR(150),
        tiplan         VARCHAR(10),
        datlan         DATE,
        horlan         VARCHAR(8),
        codciclo       INTEGER,
        codfun         VARCHAR(6),
        nomfun         VARCHAR(45),
        codbem         INTEGER,
        nombem         VARCHAR(65),
        anotacao       VARCHAR(999),        
        tiptalhao      CHAR(1),
        status         CHAR(1),
        id             INTEGER,
        nompro         VARCHAR(65),
        qtdpro         FLOAT,
        guid           VARCHAR(50),
        codusuinc      INTEGER DEFAULT 0,
        nomusuinc      VARCHAR(50),
        idlan          INTEGER DEFAULT 0,
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tblancamentoitens (
        id             INTEGER,
        idlan          INTEGER,
        codproid       INTEGER,
        qtdpro         FLOAT,
        coddep         INTEGER,
        nomdep         VARCHAR(50),
        anotacao       VARCHAR(999),
        codetapa       INTEGER,
        qtdha          FLOAT,
        qtdporha       FLOAT,
        sitlan         CHAR(1),
        status         CHAR(1),
        guid           VARCHAR(50),
        guidlan        VARCHAR(50),
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tblancamentotalhao (
        id             INTEGER,
        idlan          INTEGER,
        codprodid      INTEGER,
        qtdpro         FLOAT,
        coddep         INTEGER,
        nomdep         VARCHAR(50),
        anotacao       VARCHAR(999),
        codetapa       INTEGER,
        qtdha          FLOAT,
        qtd            FLOAT,
        qtdporha       FLOAT,
        sitan          CHAR(1),
        status         CHAR(1),
        guid           VARCHAR(50),
        guidlan        VARCHAR(50),
        codnome        VARCHAR(10),
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tbregoco (
        id             INTEGER,
        idtipoco       INTEGER,
        tipoco         VARCHAR(150),
        datoco         DATE,
        codnome        VARCHAR(10),
        nomlot         VARCHAR(50),
        codciclo       INTEGER,
        obs            VARCHAR(10),
        codusu         INTEGER,
        lat            FLOAT,
        codlot         INTEGER,
        numcompeso     INTEGER,
        imei           VARCHAR(150),
        status         CHAR(1),
        sincronizarapp CHAR(1) DEFAULT 'N',
        lng            FLOAT,
        nsureg         VARCHAR(25),
        idmobile       INTEGER DEFAULT 0,
        guid           VARCHAR(50)
      );

      CREATE TABLE IF NOT EXISTS tbmercadorias (
        codclasselan   CHAR(1),
        codproid       INTEGER,
        nompro         VARCHAR(65),
        unipro         VARCHAR(2),
        codgru         VARCHAR(4),
        nomgru         VARCHAR(35),
        codsub         VARCHAR(3),
        dessub         VARCHAR(35),
        nommar         VARCHAR(35),
        codgrubens     VARCHAR(4),
        nomgrubens     VARCHAR(50),
        placa          VARCHAR(7),
        codpatrimonio  VARCHAR(10),
        numfab         VARCHAR(20),
        tipitem        INTEGER DEFAULT 0,
        numcompeso     INTEGER,
        sincronizarapp CHAR(1) DEFAULT 'N'
      );

      CREATE TABLE IF NOT EXISTS tbtipoco (
        id           INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        descricao    VARCHAR(150),
        idgruoco     INTEGER DEFAULT 0,
        idsubgruoco  INTEGER DEFAULT 0,
        idcultura    INTEGER DEFAULT 0,
        desgruoco    VARCHAR(50),
        dessubgruoco VARCHAR(50)
      );      
    `);
  } catch (error) {
    throw new Error(error.message);
  }
}
