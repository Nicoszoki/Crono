<?php
session_start(); // Iniciar sesión
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$response = [];

try {
    if (isset($_POST['ci']) && isset($_POST['contra'])) {
        $conn = Conectar::conexion(); // Conexión a la base de datos

        if (!$conn) {
            throw new Exception('No se pudo conectar a la base de datos.');
        }

        $ci = mysqli_real_escape_string($conn, $_POST['ci']);
        $contra = mysqli_real_escape_string($conn, $_POST['contra']);

        // Verificar en la base de datos
        $query = "SELECT * FROM Personal WHERE ci = '$ci' AND contraseña = '$contra'";
        $result = mysqli_query($conn, $query);

        if (!$result) {
            throw new Exception('Error en la consulta SQL: ' . mysqli_error($conn));
        }

        if (mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);

            // Guardar datos del usuario en la sesión
            $_SESSION['nombre'] = $user['nombre'];
            $_SESSION['apellido'] = $user['apellido'];
            $_SESSION['ci'] = $user['ci'];

            // Respuesta de éxito
            $response = [
                'success' => true,
                'nombre' => $user['nombre'],
                'apellido' => $user['apellido'],
                'rol' => $user['rol']
            ];
        } else {
            // Usuario no encontrado
            $response = [
                'success' => false,
                'message' => 'Credenciales incorrectas'
            ];
        }
    } else {
        // Faltan parámetros en la solicitud
        $response = [
            'success' => false,
            'message' => 'Faltan parámetros: ci o contra'
        ];
    }
} catch (Exception $e) {
    // Manejo de errores
    $response = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

// Enviar respuesta como JSON
echo json_encode($response);
?>
