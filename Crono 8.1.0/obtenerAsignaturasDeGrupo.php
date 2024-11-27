<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion();

// Ajuste de la consulta SQL para conectar la asignatura con el docente indirectamente
$query = "SELECT nombre_A, carga_horaria FROM Tiene 
           WHERE nombre_G = '$_POST[nombre_G]' AND grado = '$_POST[grado]'
           ORDER BY nombre_A ASC;";

$result = mysqli_query($conn, $query);
$json = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $json[] = array(
            'nombre' => $row['nombre_A'],
            'carga_horaria' => $row['carga_horaria']
        );
    }
    echo json_encode($json);
} else {
    echo json_encode(array("error" => "No se encontraron asignaturas."));
}

// Cerrar la conexión
mysqli_close($conn);
?>