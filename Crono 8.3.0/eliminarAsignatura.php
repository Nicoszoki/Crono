<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos

if (isset($_POST['nombre'])) {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);

    // Eliminar la asignatura
    $query = "DELETE FROM Asignatura WHERE nombre = '$nombre'";

    $result = mysqli_query($conn, $query);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Asignatura eliminada exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar asignatura: " . mysqli_error($conn)]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}

mysqli_close($conn);
?>
