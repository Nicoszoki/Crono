<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['asignatura'], $_POST['nombre_G'], $_POST['grado'])) {
    $asignatura = $_POST['asignatura'];
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']);

    $conn = Conectar::conexion();

    // Iniciar una transacción para asegurar la consistencia
    $conn->begin_transaction();

    try {
        // Eliminar todas las relaciones en Dicta para la asignatura y grupo
        $queryDicta = "DELETE FROM Dicta 
                       WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
        $stmtDicta = $conn->prepare($queryDicta);
        $stmtDicta->bind_param('ssi', $asignatura, $nombre_G, $grado);

        if (!$stmtDicta->execute()) {
            throw new Exception('Error al eliminar la asignatura de Dicta.');
        }

        // Eliminar la relación en Tiene
        $queryTiene = "DELETE FROM Tiene 
                       WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
        $stmtTiene = $conn->prepare($queryTiene);
        $stmtTiene->bind_param('ssi', $asignatura, $nombre_G, $grado);

        if (!$stmtTiene->execute()) {
            throw new Exception('Error al eliminar la asignatura de Tiene.');
        }

        // Confirmar la transacción
        $conn->commit();

        echo json_encode(['success' => true, 'message' => 'Asignatura eliminada correctamente.']);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    } finally {
        $stmtDicta->close();
        $stmtTiene->close();
        $conn->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
?>
