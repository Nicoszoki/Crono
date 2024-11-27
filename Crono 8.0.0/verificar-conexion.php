<?php
require_once 'conexion.php';

// Probar conexión
$response = [];

try {
    $conexion = Conectar::conexion();
    if ($conexion) {
        $response['success'] = true;
        $response['message'] = 'Conexión exitosa';
    } else {
        $response['success'] = false;
        $response['message'] = 'Error desconocido al intentar conectar';
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = 'Error al conectar con la base de datos: ' . $e->getMessage();
}

// Enviar respuesta como JSON
echo json_encode($response);
?>
