<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion(); // Conexión a la base de datos.

// Recibir los datos enviados desde el cliente
$nombre_A = $_POST['nombre_A'];
$nombre_G = $_POST['nombre_G'];
$grado = $_POST['grado'];

// Comprobamos que los parámetros se hayan recibido correctamente
if (!$nombre_A || !$nombre_G || !$grado) {
    echo json_encode(['error' => 'Faltan parámetros necesarios']);
    exit;
}

// Consulta corregida: obtener la carga horaria total y el máximo de la asignatura en el grupo
$query = "
    SELECT 
        COALESCE(count(D.hora), 0) AS carga_actual, 
        T.carga_horaria AS carga_maxima
    FROM 
        Dicta D
    JOIN 
        Tiene T ON D.nombre_A = T.nombre_A AND D.nombre_G = T.nombre_G AND D.grado = T.grado
    WHERE 
        T.nombre_A = ? AND T.nombre_G = ? AND T.grado = ?
";

$stmt = $conn->prepare($query);

// Verificar si la consulta fue preparada correctamente
if (!$stmt) {
    echo json_encode(['error' => 'Error en la preparación de la consulta: ' . $conn->error]);
    exit;
}

// Corregir bind_param: pasar los parámetros correctos
$stmt->bind_param("ssi", $nombre_A, $nombre_G, $grado);

$stmt->execute();
$result = $stmt->get_result();

// Verificar si hubo un error al ejecutar la consulta
if (!$result) {
    echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $conn->error]);
    exit;
}

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'carga_actual' => $row['carga_actual'],
        'carga_maxima' => $row['carga_maxima']+1
    ]);
} else {
    echo json_encode(['carga_actual' => 0, 'carga_maxima' => 0]);
}

// Cerrar la conexión
mysqli_close($conn);
?>
