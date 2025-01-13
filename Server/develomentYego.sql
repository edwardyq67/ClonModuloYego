-- USE master
-- GO
-- ALTER DATABASE devYego SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
-- GO
-- DROP DATABASE devYego;
-- GO

CREATE DATABASE devYego

USE devYego;


CREATE TABLE [Modulos] (
  [idModulo] integer IDENTITY(1,1) PRIMARY KEY,
  [nombre] varchar(100),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO


CREATE TABLE [Seccion] (
  [SeccionId] integer IDENTITY(1,1) PRIMARY KEY,
  [nombre] varchar(100),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)

GO


CREATE TABLE [Permisos] (
  [PermisosId] integer IDENTITY(1,1) PRIMARY KEY,
  [PermisosroleId] integer,
  [seccionId] integer,
  [moduleId] integer,
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [Roles] (
  [idRoles] integer IDENTITY(1,1) PRIMARY KEY,
  [nombreRoles] varchar(100),
  [idPermisos] integer,
  [estado] char,
  [actualizadopor] integer,
  [creadopor] integer,
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO



CREATE TABLE [Login] (
  [idLogin] integer IDENTITY(1,1) PRIMARY KEY,
  [idUsuario] integer,
  [rolId] integer,
  [status] char,
  [Password] varchar(60),
  [nameUsuario] varchar(250),
  [permisosEspeciales] varchar(250),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO


CREATE TABLE [Usuario] (
  [idUsuario] integer IDENTITY(1,1) PRIMARY KEY,
  [Edad] smallint,
  [IdDetalleUsuario] integer,
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO


CREATE TABLE [detalleUsuario] (
  [idDetalleUsuario] integer IDENTITY(1,1) PRIMARY KEY,
  [nombre] varchar(150),
  [viajes] integer,
  [apellido] varchar(100),
  [licencia] varchar(100),
  [genero] varchar(100),
  [telefono] varchar(20),
  [dni] varchar(20),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [Tokens] (
  [tokensId] integer IDENTITY(1,1) PRIMARY KEY,
  [token] varchar(250),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO

CREATE TABLE [Sesiones] (
  [Sesioneid] integer IDENTITY(1,1) PRIMARY KEY,
  [tokenId] integer,
  [idLogin] integer,
  [direccionIp] varchar(20),
  [agente] varchar(250),
  [creado_en] datetime DEFAULT (CURRENT_TIMESTAMP),
  [actualizado_en] datetime DEFAULT (CURRENT_TIMESTAMP)
)
GO




ALTER TABLE [Login] ADD FOREIGN KEY ([idUsuario]) REFERENCES [Usuario] ([idUsuario]);
GO

ALTER TABLE [Login] ADD FOREIGN KEY ([rolId]) REFERENCES [Roles] ([idRoles]);
GO

ALTER TABLE [Permisos] ADD FOREIGN KEY ([seccionId]) REFERENCES [Seccion] ([SeccionId]);
GO

ALTER TABLE [Permisos] ADD FOREIGN KEY ([moduleId]) REFERENCES [Modulos] ([idModulo]);
GO

ALTER TABLE [Usuario] ADD FOREIGN KEY ([IdDetalleUsuario]) REFERENCES [detalleUsuario] ([idDetalleUsuario]);
GO

ALTER TABLE [Sesiones] ADD FOREIGN KEY ([tokenId]) REFERENCES [Tokens] ([tokensId]);
GO

ALTER TABLE [Sesiones] ADD FOREIGN KEY ([idLogin]) REFERENCES [Login] ([idLogin]);
GO




INSERT INTO Modulos(nombre) VALUES ('Modulo1'),('Modulo2'),('Modulo3'),('Modulo4'),('Modulo5')
INSERT INTO Seccion(nombre) VALUES ('Seccion1'),('Seccion2'),('Seccion3'),('Seccion4'),('Seccion5'),('Seccion6'),('Seccion7')

INSERT INTO Permisos(PermisosroleId,moduleId,seccionId) VALUES (1,1,2),
(1,1,2),
(1,1,3),
(1,1,4),
(1,1,5),
(1,2,1),
(1,2,2),
(2,2,3),
(2,3,1),
(2,4,1),
(2,4,2),
(2,5,5),
(2,5,4)

SELECT * FROM Permisos;

INSERT INTO Roles(nombreRoles,idPermisos,estado) VALUES ('Administrador general',1,1), ('Usuario medio', 2,1)

SELECT * FROM Roles;
SELECT * FROM Permisos;


DROP PROCEDURE InsertarUsuarioCompleto;

GO
CREATE PROCEDURE InsertarUsuarioCompleto
    @nombre NVARCHAR(100),
    @viajes INT,
    @apellido NVARCHAR(100),
    @licencia NVARCHAR(50),
    @genero CHAR(1),
    @telefono NVARCHAR(20),
    @dni NVARCHAR(20),
    @Edad INT,
    @rolId INT,
    @status CHAR(1), -- Cambiado a CHAR(1)
    @Password NVARCHAR(100),
    @nameUsuario NVARCHAR(50),
    @permisosEspeciales BIT
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Insertar en detalleUsuario
        INSERT INTO detalleUsuario (nombre, viajes, apellido, licencia, genero, telefono, dni)
        VALUES (@nombre, @viajes, @apellido, @licencia, @genero, @telefono, @dni);

        -- Obtener el ID de detalleUsuario
        DECLARE @IdDetalleUsuario INT;
        SET @IdDetalleUsuario = SCOPE_IDENTITY();

        -- Insertar en Usuario
        INSERT INTO Usuario (Edad, IdDetalleUsuario)
        VALUES (@Edad, @IdDetalleUsuario);

        -- Obtener el ID de Usuario
        DECLARE @IdUsuario INT;
        SET @IdUsuario = SCOPE_IDENTITY();

        -- Insertar en Login
        INSERT INTO Login (idUsuario, rolId, status, Password, nameUsuario, permisosEspeciales)
        VALUES (@IdUsuario, @rolId, @status, @Password, @nameUsuario, @permisosEspeciales);

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        THROW 50000, @ErrorMessage, 1;
    END CATCH
END;


EXEC InsertarUsuarioCompleto 
    @nombre = 'Juan Pérez',
    @viajes = 50,
    @apellido = 'Martínez',
    @licencia = 'XYZ987',
    @genero = 'M',
    @telefono = '123456789',
    @dni = '12345678',
    @Edad = 30,
    @rolId = 5,
    @status = 'V',
    @Password = 'Juan123pass',
    @nameUsuario = 'JuanP',
    @permisosEspeciales = 0;


SELECT * FROM Roles
SELECT * FROM Login
SELECT * FROM Usuario
SELECT * FROM  detalleUsuario

ALTER TABLE Login
DROP COLUMN Edad

SELECT * FROM Permisos;

-- Procedimiento para consultar la eistencia de usuario

DROP PROCEDURE ConsultaExistenciaUsuario
GO

CREATE PROCEDURE ConsultaExistenciaUsuario
    @usuario NVARCHAR(100)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Login WHERE nameUsuario = @usuario)
    BEGIN
        SELECT 1 AS ExisteUsuario;
    END
    ELSE
    BEGIN
        SELECT 0 AS ExisteUsuario;
    END
END;



SELECT * FROM Login;


USE devYego;
EXEC ConsultaExistenciaUsuario @usuario = 'JuanP';

SELECT * FROM Login;


-- Crear procedimiento almacenado para extraer datos en el usuario;

-- Crear procedimiento almacenado para extraer datos del usuario


GO
CREATE PROCEDURE ConsultaLogin
    @usuario NVARCHAR(100)
AS
BEGIN
    -- Declarar una variable para verificar si se encontró un registro
    DECLARE @exists BIT;

    -- Verificar si el usuario existe
    IF EXISTS (
        SELECT DISTINCT 
            lo.idLogin,
            lo.idUsuario,
            lo.status,
            lo.nameUsuario,
            lo.Password,
            r.nombreRoles,
            pe.PermisosroleId
        FROM Login AS lo
        INNER JOIN Roles AS r ON lo.rolId = r.idRoles
        INNER JOIN Permisos AS pe ON r.idPermisos = pe.PermisosroleId
        WHERE lo.nameUsuario = @usuario
    )
    BEGIN
        -- Establecer la variable @exists a 1 si se encuentra un registro
        SET @exists = 1;
    END
    ELSE
    BEGIN
        -- Establecer la variable @exists a 0 si no se encuentra un registro
        SET @exists = 0;
    END

    -- Si no se encuentra ningún registro, terminar el procedimiento
    IF @exists = 0
    BEGIN
        RETURN;
    END

    -- Si se encuentra un registro, ejecutar las consultas adicionales
    -- Devolver la información del usuario
    SELECT DISTINCT 
        lo.idLogin,
        lo.idUsuario,
        lo.status,
        lo.nameUsuario,
        lo.Password,
        r.nombreRoles,
        pe.PermisosroleId
    FROM Login AS lo
    INNER JOIN Roles AS r ON lo.rolId = r.idRoles
    INNER JOIN Permisos AS pe ON r.idPermisos = pe.PermisosroleId
    WHERE lo.nameUsuario = @usuario;

    -- Listar permisos del rol obtenido utilizando IN para múltiples valores
    SELECT PermisosroleId, seccionId, moduleId 
    FROM Permisos 
    WHERE PermisosroleId IN (SELECT pe.PermisosroleId 
                             FROM Login AS lo
                             INNER JOIN Roles AS r ON lo.rolId = r.idRoles
                             INNER JOIN Permisos AS pe ON r.idPermisos = pe.PermisosroleId
                             WHERE lo.nameUsuario = @usuario);

    -- Listar todas las secciones
    SELECT seccionId, nombre 
    FROM Seccion;

    -- Listar todos los módulos
    SELECT idModulo, nombre 
    FROM Modulos;
END;



DROP PROCEDURE ConsultaLogin;

EXEC ConsultaLogin @usuario='JuanP';