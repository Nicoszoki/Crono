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

    // Verificar si el docente ya está asignado en el mismo día y hora en otro grupo
    $checkQuery = "SELECT nombre_G, grado FROM Dicta 
                   WHERE ci = ? AND dia = ? AND hora = ? AND (nombre_G != ? OR grado != ?)";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bind_param('ssssi', $ciDocente, $dia, $hora, $nombre_G, $grado);
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
