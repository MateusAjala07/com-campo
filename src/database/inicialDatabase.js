export default async function inicialDatabase(db) {
  try {
    await db.execAsync(``);
  } catch (error) {
    throw error;
  }
}
