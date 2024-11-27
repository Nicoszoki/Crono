<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['ci']) && isset($_POST['disponibilidad'])) {
    $ci = $_POST['ci'];
    $disponibilidad = $_POST['disponibilidad'];
    $conn = Conectar::conexion();

    // Iniciar transacción manualmente
    mysqli_query($conn, "START TRANSACTION");

    try {
        // Eliminar las disponibilidades previas del docente en ambas tablas
        $deleteD_DHQuery = "DELETE FROM D_DH WHERE ci = '$ci'";
        mysqli_query($conn, $deleteD_DHQuery);

        $deleteDisponibilidadQuery = "DELETE FROM Disponibilidad_horaria WHERE id IN (SELECT id FROM D_DH WHERE ci = '$ci')";
        mysqli_query($conn, $deleteDisponibilidadQuery);

        // Insertar nuevas disponibilidades y obtener sus IDs
        $insertDisponibilidadQuery = "INSERT INTO Disponibilidad_horaria (dia, hora) VALUES ";
        $values = [];
        foreach ($disponibilidad as $d) {
            $dia = mysqli_real_escape_string($conn, $d['dia']);
            $hora = (int)$d['hora'];
            $values[] = "('$dia', $hora)";
        }
        $insertDisponibilidadQuery .= implode(',', $values);
        
        mysqli_query($conn, $insertDisponibilidadQuery);

        // Obtener los IDs de las filas insertadas en Disponibilidad_horaria
        $lastId = mysqli_insert_id($conn);
        $insertedIds = range($lastId, $lastId + count($disponibilidad) - 1);

        // Insertar referencias en D_DH para cada disponibilidad del docente
        $insertD_DHQuery = "INSERT INTO D_DH (ci, id) VALUES ";
        $dhValues = [];
        foreach ($insertedIds as $id) {
            $dhValues[] = "('$ci', $id)";
        }
        $insertD_DHQuery .= implode(',', $dhValues);
        mysqli_query($conn, $insertD_DHQuery);

        // Confirmar la transacción
        mysqli_query($conn, "COMMIT");

        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        // Revertir transacción si hay error
        mysqli_query($conn, "ROLLBACK");
        echo json_encode(['success' => false, 'error' => 'Error al guardar la disponibilidad.']);
    }

    mysqli_close($conn);
} else {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos.']);
}
?>
