<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos

if (isset($_POST['nombre'], $_POST['nombreNuevo'])) {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
    $nombreNuevo = mysqli_real_escape_string($conn, $_POST['nombreNuevo']);

    // Iniciar una transacción para asegurar consistencia
    mysqli_begin_transaction($conn);

    try {
        // Actualizar el nombre de la asignatura en la tabla principal
        $queryAsignatura = "UPDATE Asignatura SET nombre = '$nombreNuevo' WHERE nombre = '$nombre'";
        mysqli_query($conn, $queryAsignatura);

        // Actualizar el nombre de la asignatura en las tablas relacionadas
        $queryTiene = "UPDATE Tiene SET nombre_A = '$nombreNuevo' WHERE nombre_A = '$nombre'";
        mysqli_query($conn, $queryTiene);

        $queryRequiere = "UPDATE Requiere SET nombre_A = '$nombreNuevo' WHERE nombre_A = '$nombre'";
        mysqli_query($conn, $queryRequiere);

        $queryDicta = "UPDATE Dicta SET nombre_A = '$nombreNuevo' WHERE nombre_A = '$nombre'";
        mysqli_query($conn, $queryDicta);

        $queryAsignaDoc = "UPDATE Asigna_doc SET nombre_A = '$nombreNuevo' WHERE nombre_A = '$nombre'";
        mysqli_query($conn, $queryAsignaDoc);

        // Si todas las consultas son exitosas, confirmar la transacción
        mysqli_commit($conn);
        echo json_encode(["success" => true, "message" => "Asignatura actualizada exitosamente en todas las tablas"]);
    } catch (Exception $e) {
        // En caso de error, revertir los cambios
        mysqli_rollback($conn);
        echo json_encode(["success" => false, "message" => "Error al actualizar la asignatura: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}

mysqli_close($conn);
?>
