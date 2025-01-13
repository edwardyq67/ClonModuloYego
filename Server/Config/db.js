const sql = require("mssql");
require("dotenv").config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  server: process.env.SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    return pool;
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error);
    throw error;
  }
};

const executeQuery = async (query, params = []) => {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request();

    params.forEach((param) => {
      result.input(param.name, param.type || sql.NVarChar, param.value);
    });

    return await result.query(query);
  } catch (error) {
    console.error("Error ejecutando la consulta:", error);
    throw error;
  }
};

module.exports = {
  executeQuery,
};
