<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['ci'])) {
    $ci = $_POST['ci'];
    $conn = Conectar::conexion();

    // Actualizar el estado del usuario para una baja lógica (estableciendo 'baja' a 1)
    $query = "UPDATE Personal SET baja = false WHERE ci = '$ci'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Error al dar de baja al usuario.']);
    }

    mysqli_close($conn);
} else {
    echo json_encode(['success' => false, 'error' => 'Cédula no proporcionada.']);
}
?>
