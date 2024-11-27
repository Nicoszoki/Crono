<?php
require_once 'conexion.php';

// probar conexión

$res;

$conexion = Conectar::conexion();
if ($conexion) {
    $res = true;
} else {
    $res = false;
}

echo json_encode($res);
?>