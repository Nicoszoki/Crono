<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion();

$query = "SELECT nombre FROM Asignatura order by nombre asc";
$result = mysqli_query($conn, $query);

$json = array();
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $json[] = array(
            'nombre' => $row['nombre']
        );
    }
    echo json_encode($json);
} else {
    echo json_encode(array("error" => "No se pudieron obtener las asignaturas."));
}

// Cerrar la conexión
mysqli_close($conn);
?>
