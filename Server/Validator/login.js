const expreRegPassword =
  "/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!%*?&])([A-Za-zd$@$!%*?&]|[^ ]){8,15}$/";

/*
    - Minimo 8 caracteres
    - Maximo 15
    Al menos una letra mayúscula
    Al menos una letra minucula
    Al menos un dígito
    No espacios en blanco
    Al menos 1 caracter especial
  */

function validatorPass(password) {
  if (password.test(expreRegPassword)) {
    return true;
  } else {
    return false;
  }
}
