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
        <div">
            <label id="usuario" class="titulo"></label>
        </div>
    </div>

    <!-- columna -->
     <div id="columna">
        <div class="opcion">
            <label id="horarios" class="titulo">Horarios</label>
        </div>
        <div class="opcion">
            <label id="Asignaturas" class="titulo">Asignaturas</label>
        </div>
        <div class="opcion">
            <label id="Usuarios" class="titulo">Usuarios</label>
        </div>
        <div class="opcion logout" onclick="window.location.href='index.php'">
            <label id="Logout" class="titulo">Cerrar Sesión</label>
        </div>
     </div>
    <div class="conectado"></div>
    <script src="js/jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
    <script src="js/nombre.js"></script>
</body>

</html>