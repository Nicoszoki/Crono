<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos.

// Verificar que se reciban los datos necesarios en la solicitud POST
if (isset($_POST['ci'], $_POST['nombre'], $_POST['apellido'], $_POST['telefono'], $_POST['email'], $_POST['rol'])) {
    // Recibir los valores de la solicitud
    $ci = $_POST['ci'];
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $telefono = $_POST['telefono'];
    $email = $_POST['email'];
    $rol = $_POST['rol'];
    $contraseña = $ci; // Contraseña predeterminada igual al CI

    // Iniciar la transacción para garantizar consistencia
    mysqli_begin_transaction($conn);

    try {
        // Preparar la consulta de inserción en la tabla Personal
        $queryPersonal = "INSERT INTO Personal (ci, nombre, apellido, telefono, email, contraseña, rol) 
                          VALUES ('$ci', '$nombre', '$apellido', '$telefono', '$email', '$contraseña', '$rol')";
        if (!mysqli_query($conn, $queryPersonal)) {
            throw new Exception("Error al insertar en la tabla Personal: " . mysqli_error($conn));
        }

        if ($rol === "Administrador") {
            // Insertar en No_Docente
            $queryNoDocente = "INSERT INTO No_Docente (ci) VALUES ('$ci')";
            if (!mysqli_query($conn, $queryNoDocente)) {
                throw new Exception("Error al insertar en la tabla No_Docente: " . mysqli_error($conn));
            }
        }

        // Siempre se inserta en la tabla Docente, aunque no sea docente
        $queryDocente = "INSERT INTO Docente (ci) VALUES ('$ci')";
        if (!mysqli_query($conn, $queryDocente)) {
            throw new Exception("Error al insertar en la tabla Docente: " . mysqli_error($conn));
        }

        // Confirmar la transacción si todo fue exitoso
        mysqli_commit($conn);
        echo json_encode(["success" => true, "message" => "Usuario añadido exitosamente"]);
    } catch (Exception $e) {
        // Revertir la transacción en caso de error
        mysqli_rollback($conn);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    // Si no se reciben todos los datos necesarios
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
}

mysqli_close($conn);
?>