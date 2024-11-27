<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['asignatura'], $_POST['nombre_G'], $_POST['grado'], $_POST['ciDocente'], $_POST['dia'], $_POST['hora'])) {
    $asignatura = $_POST['asignatura'];
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']);
    $ciDocente = $_POST['ciDocente'];
    $año = date('Y'); // Año actual
    $dia = $_POST['dia'];
    $hora = strval($_POST['hora']);

    $conn = Conectar::conexion();

    // Verificar si el docente tiene un conflicto en el mismo horario
    if ($dia !== "Lunes" || $hora !== "0") { // Si la asignatura ya tiene día y hora definidos
        $queryConflicto = "SELECT nombre_A, nombre_G, grado FROM Dicta 
                           WHERE ci = ? AND dia = ? AND hora = ? AND (nombre_G != ? OR grado != ?)";
        $stmtConflicto = $conn->prepare($queryConflicto);
        $stmtConflicto->bind_param('ssssi', $ciDocente, $dia, $hora, $nombre_G, $grado);
        $stmtConflicto->execute();
        $resultConflicto = $stmtConflicto->get_result();

        if ($resultConflicto->num_rows > 0) {
            $conflicto = $resultConflicto->fetch_assoc();
            echo json_encode([
                'success' => false,
                'message' => "El docente ya tiene asignada la asignatura '{$conflicto['nombre_A']}' en el grupo '{$conflicto['nombre_G']} {$conflicto['grado']}' los {$dia}s a la hora {$hora}."
            ]);
            $stmtConflicto->close();
            $conn->close();
            exit;
        }
        $stmtConflicto->close();
    }

    // Paso 1: Verificar si el registro ya existe
    $checkQuery = "SELECT COUNT(*) as total FROM Dicta WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param('ssi', $asignatura, $nombre_G, $grado);
    $stmt->execute();
    $result = $stmt->get_result();
    $exists = $result->fetch_assoc()['total'] > 0;
    $stmt->close();

    if ($exists) {
        // Paso 2: Actualizar el docente si ya existe el registro
        $updateQuery = "UPDATE Dicta SET ci = ? WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param('sssi', $ciDocente, $asignatura, $nombre_G, $grado);
    } else {
        // Paso 3: Insertar un nuevo registro si no existe
        $insertQuery = "INSERT INTO Dicta (ci, nombre_A, nombre_G, grado, año, dia, hora) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($insertQuery);
        $stmt->bind_param('sssiiss', $ciDocente, $asignatura, $nombre_G, $grado, $año, $dia, $hora);
    }

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => $exists ? 'Docente actualizado correctamente.' : 'Docente asignado correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo guardar el docente.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
?>
