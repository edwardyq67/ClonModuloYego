const sql = require("mssql");
const bcrypt = require("bcrypt");
const conx = require("../Config/db");

const getUserByUsername = async (username) => {
  const query = "EXEC ConsultaLogin @usuario = @usuario";
  const params = [{ name: "usuario", type: sql.NVarChar, value: username }];

  try {
    const result = await conx.executeQuery(query, params);
    if (result.recordsets[0] && result.recordsets[0].length > 0) {
      return {
        userData: result.recordsets[0],
        permissionsByRole: result.recordsets[1],
        sections: result.recordsets[2],
        modules: result.recordsets[3],
      };
    } else {
      console.log("No se encontró el usuario.");
      return null;
    }
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const register = async (userData) => {
  const {
    nombre,
    viajes,
    apellido,
    licencia,
    genero,
    telefono,
    dni,
    Edad,
    rolId,
    status,
    Password,
    nameUsuario,
    permisosEspeciales,
  } = userData;

  const checkUserQuery = "EXEC ConsultaExistenciaUsuario @usuario = @usuario";
  const checkUserParams = [
    { name: "usuario", type: sql.NVarChar, value: nameUsuario },
  ];

  const registerUserQuery = `
    EXEC InsertarUsuarioCompleto
    @nombre = @nombre,
    @viajes = @viajes,
    @apellido = @apellido,
    @licencia = @licencia,
    @genero = @genero,
    @telefono = @telefono,
    @dni = @dni,
    @Edad = @Edad,
    @rolId = @rolId,
    @status = @status,
    @Password = @Password,
    @nameUsuario = @nameUsuario,
    @permisosEspeciales = @permisosEspeciales;
  `;

  const registerUserParams = [
    { name: "nombre", type: sql.NVarChar, value: nombre },
    { name: "viajes", type: sql.Int, value: viajes },
    { name: "apellido", type: sql.NVarChar, value: apellido },
    { name: "licencia", type: sql.NVarChar, value: licencia },
    { name: "genero", type: sql.NVarChar, value: genero },
    { name: "telefono", type: sql.NVarChar, value: telefono },
    { name: "dni", type: sql.NVarChar, value: dni },
    { name: "Edad", type: sql.Int, value: Edad },
    { name: "rolId", type: sql.Int, value: rolId },
    { name: "status", type: sql.NVarChar, value: status },
    { name: "Password", type: sql.NVarChar, value: "" },
    { name: "nameUsuario", type: sql.NVarChar, value: nameUsuario },
    {
      name: "permisosEspeciales",
      type: sql.NVarChar,
      value: permisosEspeciales,
    },
  ];

  try {
    const result = await conx.executeQuery(checkUserQuery, checkUserParams);
    if (result.recordset[0].ExisteUsuario === 1) {
      console.log("El usuario ya existe.");
      throw new Error("El usuario ya existe.");
    }

    const hashedPassword = await bcrypt.hash(Password, 7);
    registerUserParams.find((param) => param.name === "Password").value =
      hashedPassword;

    await conx.executeQuery(registerUserQuery, registerUserParams);
    return {
      message: "Usuario registrado exitosamente.",
      password: hashedPassword,
    };
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw error;
  }
};

const verifyPassword = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = { getUserByUsername, register, verifyPassword };
