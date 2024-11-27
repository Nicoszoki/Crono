<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/estilo.css/estilo.css">
</head>

<body>
    <div class="container">
        <div class="left">
            <div>
                <img class="logo" src="img/Logo.png" alt="crono-logo">
            </div>
        </div>
        <div class="right">
            <div class="login">
                <h2>LOGIN</h2>
                <form onsubmit="login(event)">
                    <input id="ci" type="text" placeholder="Cédula">
                    <input id="contra" type="password" placeholder="Contraseña">
                    <button type="submit">INGRESAR</button>
                </form>
            </div>
        </div>
    </div>
    <div class="conectado"></div>
    <script src="js/jquery-3.7.1.min.js"></script>
    <script src="js/funciones.js"></script>
</body>

</html>