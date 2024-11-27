<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion();

// Ajuste de la consulta SQL para conectar la asignatura con el docente indirectamente
$query = "SELECT T.nombre_A AS nombre, T.carga_horaria, P.nombre, P.apellido AS docente
    FROM Tiene T
    JOIN Asignatura A ON T.nombre_A = A.nombre 
    JOIN Dicta DI ON DI.nombre_A = T.nombre_A AND DI.nombre_G = T.nombre_G AND DI.grado = T.grado
    JOIN Docente DOC ON DOC.ci = DI.ci 
    JOIN Personal P ON P.ci = DOC.ci
    WHERE T.nombre_G = '$_POST[nombre_G]' AND T.grado = '$_POST[grado]';
";

$result = mysqli_query($conn, $query);
$json = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $json[] = array(
            'nombre' => $row['nombre'],
            'carga_horaria' => $row['carga_horaria'],
            'docente' => $row['docente'] ? $row['docente'] : null
        );
    }
    echo json_encode($json);
} else {
    echo json_encode(array("error" => "No se encontraron asignaturas."));
}

// Cerrar la conexión
mysqli_close($conn);
?>