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
        ultatuestdep DATE,
        horaultatuestdep CHAR(8),
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
        ususuper CHAR(1)
      );      
    `);
  } catch (error) {
    throw new Error(error.message);
  }
}
