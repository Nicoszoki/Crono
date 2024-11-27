<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['nombre_G'], $_POST['grado'])) {
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']); // Convertir a entero para mayor seguridad

    $conn = Conectar::conexion();

    // Usar una consulta preparada para evitar inyecciones SQL
    $query = "SELECT T.nombre_A, T.carga_horaria, DI.ci AS docenteCI, CONCAT(P.nombre, ' ', P.apellido) AS docente
          FROM Tiene T
          LEFT JOIN Dicta DI ON T.nombre_A = DI.nombre_A AND T.nombre_G = DI.nombre_G AND T.grado = DI.grado
          LEFT JOIN Personal P ON DI.ci = P.ci
          WHERE T.nombre_G = ? AND T.grado = ? AND (DI.hora = '0' OR DI.ci IS NULL)
          ORDER BY T.nombre_A ASC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('si', $nombre_G, $grado);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $json = [];

        while ($row = $result->fetch_assoc()) {
            $json[] = [
                'nombre' => $row['nombre_A'],
                'carga_horaria' => $row['carga_horaria'],
                'docenteCI' => $row['docenteCI'],
                'docente' => $row['docente'] ?? null // Incluye el nombre del docente o null si no hay ninguno
            ];
        }

        echo json_encode($json);
    } else {
        echo json_encode(['error' => 'No se pudieron obtener las asignaturas.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Datos incompletos.']);
}
?>
