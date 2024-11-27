<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos.

// Verificar que se reciban los datos necesarios en la solicitud POST
if(isset($_POST['nombre'], $_POST['grado'])) {
    // Recibir los valores de la solicitud
    $nombre = $_POST['nombre'];
    $grado = $_POST['grado'];

    // Preparar la consulta de inserción
    $query = "INSERT INTO Grupo (nombre, grado) 
              VALUES ('$nombre', '$grado')";

    // Ejecutar la consulta
    $result = mysqli_query($conn, $query);

    // Verificar si la inserción fue exitosa
    if($result) {
        echo json_encode(["success" => true, "message" => "Grupo añadido exitosamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al añadir grupo"]);
    }
} else {
    // Si no se reciben todos los datos necesarios
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}
?>
