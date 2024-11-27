<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['nombre_G'], $_POST['grado'], $_POST['dia'], $_POST['hora'])) {
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']);
    $dia = $_POST['dia'];
    $hora = intval($_POST['hora']);

    $conn = Conectar::conexion();

    // Eliminar la entrada de la tabla Dicta
    $query = "DELETE FROM Dicta 
              WHERE nombre_G = ? AND grado = ? AND dia = ? AND hora = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('siss', $nombre_G, $grado, $dia, $hora);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Horario eliminado correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se pudo eliminar el horario.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
?>
