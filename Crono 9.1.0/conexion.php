<?php
class Conectar{
public static function conexion(){
$conexion = new mysqli("localhost", "Administrador", "190424", "crono");
if ($conexion->connect_error) {
die("Connection failed: " . $conexion->connect_error);
}
$conexion->query("SET NAMES 'utf8mb4'");
return $conexion;
}
}

?>