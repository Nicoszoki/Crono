<?php
class Conectar{
public static function conexion(){
$conexion = new mysqli("192.168.21.101", "aterax", "190424", "crono");
if ($conexion->connect_error) {
die("Connection failed: " . $conexion->connect_error);
}
$conexion->query("SET NAMES 'utf8'");
return $conexion;
}
}

// Test connection
$conexion = Conectar::conexion();
if ($conexion) {
echo "Conexión exitosa a la base de datos";
}
?>