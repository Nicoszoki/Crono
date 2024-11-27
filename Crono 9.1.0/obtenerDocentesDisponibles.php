<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion();

// Consulta para obtener los docentes no dados de baja
$query = "SELECT D.ci, P.nombre, P.apellido 
          FROM Docente D
          JOIN Personal P ON D.ci = P.ci
          WHERE P.baja = 0
          ORDER BY P.nombre ASC";

$result = $conn->query($query);
$docentes = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $docentes[] = [
            'ci' => $row['ci'],
            'nombre' => $row['nombre'],
            'apellido' => $row['apellido']
        ];
    }
    echo json_encode($docentes);
} else {
    echo json_encode(['error' => 'No se pudieron obtener los docentes.']);
}

$conn->close();
?>
