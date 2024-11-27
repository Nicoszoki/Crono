<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos

if (isset($_POST['filtro'])) {
    $filtro = $_POST['filtro'];
    $condiciones = [];

    // Construir la consulta
    $query = "SELECT * FROM Asignatura";

    if (!empty($filtro['nombre'])) {
        $nombre = mysqli_real_escape_string($conn, $filtro['nombre']);
        $condiciones[] = "nombre LIKE '%$nombre%'";
    }

    if (count($condiciones) > 0) {
        $query .= " WHERE " . implode(" AND ", $condiciones);
    }

    if (!empty($filtro['orden'])) {
        $query .= " ORDER BY " . mysqli_real_escape_string($conn, $filtro['orden']);
    }

    $result = mysqli_query($conn, $query);
    $json = [];

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $json[] = ['nombre' => $row['nombre']];
        }
        echo json_encode($json);
    } else {
        echo json_encode(["error" => "No se encontraron resultados"]);
    }
} else {
    echo json_encode(["error" => "Faltan datos"]);
}

mysqli_close($conn);
?>
