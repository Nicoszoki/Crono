<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'conexion.php';

$conn = Conectar::conexion();

$nombreAsignatura = $_POST['nombreAsignatura']; // Nombre de la asignatura seleccionada
$nombreGrupo = $_POST['nombre_G'];
$grado = $_POST['grado'];
$cargaHoraria = $_POST['carga_horaria']; // Se espera que este dato sea enviado desde el frontend

// Insertar la asignatura en el grupo
$queryInsert = "INSERT INTO Tiene (nombre_A, nombre_G, grado, carga_horaria) 
                VALUES ('$nombreAsignatura', '$nombreGrupo', '$grado', '$cargaHoraria')";

if (mysqli_query($conn, $queryInsert)) {
    echo json_encode(array(
        "success" => true,
        "asignatura" => array(
            "nombre" => $nombreAsignatura,
            "carga_horaria" => $cargaHoraria
        )
    ));
} else {
    echo json_encode(array("success" => false, "error" => "No se pudo añadir la asignatura al grupo."));
}

// Cerrar la conexión
mysqli_close($conn);
?>
