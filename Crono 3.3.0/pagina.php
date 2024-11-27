<?php
session_start(); // Iniciar la sesión

// Verificar si el usuario está autenticado
if (!isset($_SESSION['ci'])) {
    header('Location: index.php'); // Redirigir al inicio de sesión si no está autenticado
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crono</title>
    <link rel="stylesheet" href="css/estilo.css/estilo.css">
</head>

<body>
    <div class="encabezado">
        <div>
            <img id="logoPag" src="img/Logo.png" alt="crono-logo">
        </div>
        <div>
            <!-- Mostrar el nombre del usuario de la sesión -->
            <label id="usuario" class="titulo"><?php echo $_SESSION['nombre'] . ' ' . $_SESSION['apellido']; ?></label>
        </div>
    </div>

    <div id="panel">
        <!-- columna -->
        <div id="columna">
            <div id="horarios" class="opcion">
                <label class="titulo">Horarios</label>
            </div>
            <div id="Asignaturas" class="opcion">
                <label class="titulo">Asignaturas</label>
            </div>
            <div id="Usuarios" class="opcion" onclick="usuarios()">
                <label class="titulo">Usuarios</label>
            </div>
            <div class="opcion logout" onclick="window.location.href='logout.php'">
                <label id="Logout" class="titulo">Cerrar Sesión</label>
            </div>
        </div>

        <!-- menu -->
        <div id="menu"></div>
    </div>
    <div class="conectado"></div>
    <script src="js/jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
</body>

</html>