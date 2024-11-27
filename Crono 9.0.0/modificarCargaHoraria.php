<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

// Verificar si los datos requeridos están presentes
if (isset($_POST['asignatura'], $_POST['nuevaCargaHoraria'], $_POST['nombre_G'], $_POST['grado'])) {
    $asignatura = $_POST['asignatura'];
    $nuevaCargaHoraria = intval($_POST['nuevaCargaHoraria']); // Convertir a entero
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']); // Convertir a entero

    $conn = Conectar::conexion(); // Conexión a la base de datos

    // Preparar la consulta para evitar inyecciones SQL
    $query = "UPDATE Tiene 
              SET carga_horaria = ? 
              WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('issi', $nuevaCargaHoraria, $asignatura, $nombre_G, $grado);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(array("success" => true, "message" => "Carga horaria actualizada correctamente."));
    } else {
        echo json_encode(array("success" => false, "message" => "No se pudo actualizar la carga horaria."));
    }

    // Cerrar la conexión y el statement
    $stmt->close();
    mysqli_close($conn);
} else {
    echo json_encode(array("success" => false, "message" => "Datos incompletos."));
}
?>
