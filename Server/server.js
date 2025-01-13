const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("./Config/passportConfig");
const loginRoutes = require("./router/authRoutes");
const platformRoutes = require("./router/platformRoutes");

const { moment } = require("./config/momentConfig");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/", loginRoutes);
// Ruta protegida
app.use(
  "/platform",
  platformRoutes,
  passport.authenticate("jwt", { session: false })
);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
