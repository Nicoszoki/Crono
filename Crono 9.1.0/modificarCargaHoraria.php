<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

// Verificar si los datos requeridos están presentes
if (isset($_POST['asignatura'], $_POST['nuevaCargaHoraria'], $_POST['nombre_G'], $_POST['grado'])) {
    $asignatura = $_POST['asignatura'];
    $nuevaCargaHoraria = intval($_POST['nuevaCargaHoraria']); // Convertir a entero
    $nombre_G = $_POST['nombre_G'];
    $grado = intval($_POST['grado']); // Convertir a entero

    $conn = Conectar::conexion(); // Conexión a la base de datos

    // Contar las clases programadas (relaciones en la tabla Dicta)
    $countQuery = "SELECT COUNT(*) AS total_clases
                   FROM Dicta
                   WHERE nombre_A = ? AND nombre_G = ? AND grado = ? and hora != '0'";
    $countStmt = $conn->prepare($countQuery);
    $countStmt->bind_param('ssi', $asignatura, $nombre_G, $grado);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $countData = $countResult->fetch_assoc();
    $totalClases = $countData['total_clases'];

    // Verificar si la cantidad de clases es mayor que la nueva carga horaria
    if ($totalClases > $nuevaCargaHoraria) {
        echo json_encode(array("success" => false, "message" => "La nueva carga horaria es menor que la cantidad de clases programadas."));
    } else {
        // Preparar la consulta para actualizar la carga horaria en la tabla Tiene
        $updateQuery = "UPDATE Tiene 
                        SET carga_horaria = ? 
                        WHERE nombre_A = ? AND nombre_G = ? AND grado = ?";
        $stmt = $conn->prepare($updateQuery);
        $stmt->bind_param('issi', $nuevaCargaHoraria, $asignatura, $nombre_G, $grado);

        // Ejecutar la consulta de actualización
        if ($stmt->execute()) {
            echo json_encode(array("success" => true, "message" => "Carga horaria actualizada correctamente."));
        } else {
            echo json_encode(array("success" => false, "message" => "No se pudo actualizar la carga horaria."));
        }

        // Cerrar el statement
        $stmt->close();
    }

    // Cerrar la conexión y el statement
    $countStmt->close();
    mysqli_close($conn);
} else {
    echo json_encode(array("success" => false, "message" => "Datos incompletos."));
}
?>
