<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos

if (isset($_POST['nombre'])) {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);

    // Insertar una nueva asignatura
    $query = "INSERT INTO Asignatura (nombre) VALUES ('$nombre')";

    $result = mysqli_query($conn, $query);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Asignatura añadida exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al añadir asignatura: " . mysqli_error($conn)]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}

mysqli_close($conn);
?>
