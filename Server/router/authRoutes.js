const express = require("express");
const jwt = require("jsonwebtoken");
const {
  getUserByUsername,
  verifyPassword,
  register,
} = require("../model/userModel");

require("dotenv").config();

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Tomando: ", username, password);

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await verifyPassword(
      password,
      user.userData[0].Password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        idLogin: user.userData[0].idLogin,
        idUsuario: user.userData[0].idUsuario,
        status: user.userData[0].status,
        nameusuario: user.userData[0].nameUsuario,
        Password: user.userData[0].Password,
        nombreRoles: user.userData[0].nombreRoles,
        Permisos: user.userData[0].PermisosroleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(process.env.JWT_SECRET);

    res.json({
      Mensaje: "Acceso correcto",
      codigo: 200,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const userData = req.body;
    const result = await register(userData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
