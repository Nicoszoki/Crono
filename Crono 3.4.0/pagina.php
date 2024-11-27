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
            <div id="Horarios" class="opcion" onclick="horarios()">
                <label class="titulo">Horarios</label>
            </div>
            <div id="Asignaturas" class="opcion" onclick="asignaturas()">
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
        <div id="menu">
            <div id="filtro">
                <form id="filtroForm" onsubmit="aplicarFiltro()">
                    <div>
                        <label>Orden: </label>
                        <select id="filtroOrden">
                            <option value="nombre asc">Nombre: A-Z</option>
                            <option value="nombre desc">Nombre: Z-A</option>
                            <option value="apellido asc">Apellido: A-Z</option>
                            <option value="apellido desc">Apellido: Z-A</option>
                        </select>
                    </div>
                    <div>
                        <label>Nombre: </label>
                        <input id="filtroNombre" type="text">
                    </div>
                    <div>
                        <label>Apellido: </label>
                        <input id="filtroApellido" type="text">
                    </div>
                    <div>
                        <label>Activo: </label>
                        <select id="filtroActivo">
                            <option value="false">Sí</option>
                            <option value="true">No</option>
                        </select>
                    </div>
                    <div>
                        <button type="submit">Filtrar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="conectado"></div>
    <script src="js/jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
</body>

</html>