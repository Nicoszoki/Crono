<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos

// Verificar que se reciban los datos necesarios en la solicitud POST
if (isset($_POST['nombre'], $_POST['grado'], $_POST['nombreNuevo'], $_POST['gradoNuevo'])) {
    // Recibir los valores de la solicitud
    $nombre = $_POST['nombre'];
    $grado = $_POST['grado'];
    $nombreNuevo = $_POST['nombreNuevo'];
    $gradoNuevo = $_POST['gradoNuevo'];

    // Preparar la consulta de actualización
    $query = "UPDATE Grupo SET 
              nombre = '$nombreNuevo', 
              grado = '$gradoNuevo' 
              WHERE nombre = '$nombre' AND grado = '$grado'";

    // Ejecutar la consulta
    $result = mysqli_query($conn, $query);

    // Verificar si la actualización fue exitosa
    if ($result) {
        echo json_encode(["success" => true, "message" => "Grupo actualizado exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar grupo: " . mysqli_error($conn)]);
    }
} else {
    // Si no se reciben todos los datos necesarios
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}

mysqli_close($conn);
?>
