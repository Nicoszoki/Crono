<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_POST['asignatura'], $_POST['nombre_G'], $_POST['grado'], $_POST['ci'], $_POST['dia'], $_POST['hora'])) {
    $asignatura = $_POST['asignatura'];
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']);
    $ci = $_POST['ci'] ?? null; // Validar que el docente esté definido
    $año = date('Y');
    $dia = $_POST['dia'];
    $hora = $_POST['hora'];

    if (!$ci) {
        echo json_encode(['success' => false, 'message' => 'Docente no especificado.']);
        exit;
    }

    $conn = Conectar::conexion();

    // Verificar si el docente ya está asignado en el mismo día y hora en otro grupo
    $checkQuery = "SELECT nombre_G, grado FROM Dicta 
                   WHERE ci = ? AND dia = ? AND hora = ? AND (nombre_G != ? OR grado != ?)";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param('ssssi', $ci, $dia, $hora, $nombre_G, $grado);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Si hay conflicto, devolver un mensaje de error
        $conflicto = $checkResult->fetch_assoc();
        echo json_encode([
            'success' => false,
            'message' => "El docente ya está asignado en el grupo '{$conflicto['nombre_G']} {$conflicto['grado']}' en el mismo día y hora."
        ]);
        $checkResult->free();
        $checkStmt->close();
        $conn->close();
        exit;
    }

    $checkResult->free();
    $checkStmt->close();

    // Eliminar la relación previa si existe
    $deleteQuery = "DELETE FROM Dicta WHERE nombre_G = ? AND grado = ? AND dia = ? AND hora = ?";
    $deleteStmt = $conn->prepare($deleteQuery);
    $deleteStmt->bind_param('siss', $nombre_G, $grado, $dia, $hora);
    $deleteStmt->execute();
    $deleteStmt->close();

    // Insertar el nuevo horario en la tabla Dicta
    $query = "INSERT INTO Dicta (nombre_A, nombre_G, grado, ci, año, dia, hora) 
              VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);

    // El tipo de datos debe coincidir con la estructura de la tabla
    $stmt->bind_param('ssisiss', $asignatura, $nombre_G, $grado, $ci, $año, $dia, $hora);

    if ($stmt->execute()) {
        // Obtener el nombre del docente basado en la cédula
        $queryDocente = "SELECT CONCAT(P.nombre, ' ', P.apellido) AS docente
                         FROM Personal P
                         JOIN Docente D ON P.ci = D.ci
                         WHERE P.ci = ?";
        $stmtDocente = $conn->prepare($queryDocente);
        $stmtDocente->bind_param('s', $ci);

        if ($stmtDocente->execute()) {
            $result = $stmtDocente->get_result();
            if ($result->num_rows > 0) {
                $docente = $result->fetch_assoc();
                $nombreCompleto = $docente['docente'];

                echo json_encode([
                    'success' => true,
                    'message' => 'Horario guardado correctamente.',
                    'docente' => $nombreCompleto
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'message' => 'Horario guardado correctamente, pero no se encontró el docente.',
                    'docente' => null
                ]);
            }
            $result->free();
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener el nombre del docente.',
                'error' => $stmtDocente->error
            ]);
        }

        $stmtDocente->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al guardar el horario.', 'error' => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
