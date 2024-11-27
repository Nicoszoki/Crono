<?php
class Conectar{
public static function conexion(){
$conn = new mysqli("localhost", "root", "", "crono");
if ($conn->connect_error) {
die("Conexión fallida: " . $conn->connect_error);
}
$conn->query("SET NAMES 'utf8'");
return $conn;
}
}
?>