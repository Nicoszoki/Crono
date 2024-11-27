<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

if (isset($_POST['filtro'])) {
    $filtro = $_POST['filtro'];
    $conn = Conectar::conexion(); // Conexión a la base de datos.
    
    // Base de la consulta
    $query = "SELECT * FROM " . $filtro['opcion'];
    $condiciones = [];

    // Verificar cada filtro y agregarlo a la consulta si tiene valor
    if (!empty($filtro['nombre'])) {
        $nombre = mysqli_real_escape_string($conn, $filtro['nombre']);
        $condiciones[] = "nombre LIKE '%$nombre%'";
    }
    if (!empty($filtro['apellido'])) {
        $apellido = mysqli_real_escape_string($conn, $filtro['apellido']);
        $condiciones[] = "apellido LIKE '%$apellido%'";
    }
    if (!empty($filtro['activo'])) {
        $activo = $filtro['activo'] === 'true' ? '1' : '0';
        $condiciones[] = "baja = '$activo'";
    }

    // Si hay condiciones, añadirlas a la consulta
    if (count($condiciones) > 0) {
        $query .= " WHERE " . implode(" AND ", $condiciones);
    }

    // Agregar el ordenamiento si se especifica
    if (!empty($filtro['orden'])) {
        $query .= " ORDER BY " . mysqli_real_escape_string($conn, $filtro['orden']);
    }

    $result = mysqli_query($conn, $query);
    $json = [];
    
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $json[] = array(
                'ci' => $row['ci'],
                'nombre' => $row['nombre'],
                'apellido' => $row['apellido'],
                'telefono' => $row['telefono'],
                'email' => $row['email'],
                'contraseña' => $row['contraseña'],
                'rol' => $row['rol'],
                'baja' => $row['baja']
            );
        }
        echo json_encode($json);
    } else {
        echo json_encode(["error" => "No se encontraron resultados"]);
    }
}
?>
