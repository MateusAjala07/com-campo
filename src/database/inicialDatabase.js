export default async function inicialDatabase(db) {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tbsistema (
        ID INTEGER NOT NULL ON CONFLICT ROLLBACK PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT,
        numcompeso INTEGER,
        nomfazenda varchar(50),
        codciclo integer,
        desciclo varchar(45),
        codusu integer,
        nomusu VARCHAR(45),
        senusu VARCHAR(25),
        lembrarlogin char(1) default 'S',
        ultatuestdep date,
        horaultatuestdep char(8),
        acessomobile char(1) default 'N'
      );

      CREATE TABLE IF NOT EXISTS licenca (
        id INTEGER PRIMARY KEY,
        imei character varying(15),
        ip character varying(15),
        chave character varying(15),
        codacesso character varying(15),
        permissaocamera boolean 
      );
    `);
  } catch (error) {
    throw new Error(error.message);
  }
}
