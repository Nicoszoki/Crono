<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['asignatura'], $_POST['nombre_G'], $_POST['grado'])) {
    $asignatura = $_POST['asignatura'];
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']);

    $conn = Conectar::conexion();

    // Verificar si la asignatura tiene un docente asignado
    $query = "SELECT COUNT(*) AS total FROM Dicta WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ssi', $asignatura, $nombre_G, $grado);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row['total'] > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'La asignatura no tiene un docente asignado.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
?>
