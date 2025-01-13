const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../model/userModel");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const payload = {
      userId: user.id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  login,
};
