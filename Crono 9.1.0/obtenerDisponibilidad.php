<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

// Verificar si el parámetro 'ci' está presente en la solicitud
if (isset($_POST['ci'])) {
    $ci = $_POST['ci'];  // Obtener el valor de la cédula desde el POST
    $conn = Conectar::conexion(); // Conexión a la base de datos.

    // Escapar el valor de 'ci' para prevenir inyecciones SQL
    $ci = mysqli_real_escape_string($conn, $ci);

    // Preparar la consulta para obtener la disponibilidad uniendo D_DH y Disponibilidad_horaria
    $query = "SELECT dh.dia, dh.hora FROM D_DH AS ddh JOIN Disponibilidad_horaria AS dh ON ddh.id = dh.id WHERE ddh.ci = '$ci'
    ";
    $result = mysqli_query($conn, $query);

    $json = array();

    // Si la consulta devuelve resultados, almacenarlos en un array
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $json[] = array(
                'dia' => $row['dia'],
                'hora' => $row['hora']
            );
        }

        // Devolver los resultados en formato JSON
        echo json_encode($json);
    } else {
        // Si no hay resultados, devolver un mensaje indicando error
        echo json_encode(array("error" => "No se encontró disponibilidad para el CI proporcionado."));
    }

    // Cerrar la conexión
    mysqli_close($conn);
} else {
    // Si no se proporciona el parámetro 'ci', devolver un error
    echo json_encode(array("error" => "Falta el parámetro CI."));
}
?>
