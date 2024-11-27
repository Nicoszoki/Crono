<?php
class Conectar{
public static function conexion(){
$conexion = new mysqli("localhost", "root", "", "crono");
if ($conexion->connect_error) {
die("Connection failed: " . $conexion->connect_error);
}
$conexion->query("SET NAMES 'utf8'");
return $conexion;
}
}

?>