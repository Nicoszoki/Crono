<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos.

// Verificar que se reciban los datos necesarios en la solicitud POST
if(isset($_POST['ci'], $_POST['nombre'], $_POST['apellido'], $_POST['telefono'], $_POST['email'], $_POST['rol'])) {
    // Recibir los valores de la solicitud
    $ci = $_POST['ci'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $rol = $_POST['rol'];
    $contraseña = $ci;

    // Preparar la consulta de inserción
    $query = "INSERT INTO Personal (ci, nombre, apellido, telefono, email, contraseña, rol) 
              VALUES ('$ci', '$nombre', '$apellido', '$telefono', '$email', '$contraseña', '$rol')";

    // Ejecutar la consulta
    $result = mysqli_query($conn, $query);

    // Verificar si la inserción fue exitosa
    if($result) {
        echo json_encode(["success" => true, "message" => "Usuario añadido exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al añadir usuario"]);
    }
} else {
    // Si no se reciben todos los datos necesarios
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}
?>
