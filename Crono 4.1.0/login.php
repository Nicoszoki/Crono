<?php
session_start(); // Iniciar sesión
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['ci']) && isset($_POST['contra'])) {
    $conn = Conectar::conexion(); // Conexión a la base de datos.

    $ci = $_POST['ci'];
    $contra = $_POST['contra'];

    // Verificar en la base de datos
    $query = "SELECT * FROM Personal WHERE ci = '$ci' AND contraseña = '$contra'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        $user = mysqli_fetch_assoc($result);

        // Guardar datos del usuario en la sesión
        $_SESSION['nombre'] = $user['nombre'];
        $_SESSION['apellido'] = $user['apellido'];
        $_SESSION['ci'] = $user['ci'];

        // Devuelve una respuesta JSON de éxito
        echo json_encode([
            'success' => true,
            'nombre' => $user['nombre'],
            'apellido' => $user['apellido']
        ]);
    } else {
        // Devuelve una respuesta JSON de error
        echo json_encode(['success' => false]);
    }
}
?>
