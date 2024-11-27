<?php
header('Content-Type: application/json; charset=utf-8');
	require_once 'conexion.php';
	if(ISSET($_POST['opcion'])){
		$conn = Conectar::conexion(); // Conexión a la base de datos.

		$query = "SELECT * FROM "  . $_POST['opcion'];
		$result = mysqli_query($conn, $query);
		$json = array();

		if ($result) {
			while ($row = mysqli_fetch_assoc($result)) {
				$datos = array();
				foreach ($row as $key => $value) {
					$datos[$key] = $value;
				}
				$json[] = $datos;
			}
			echo json_encode($json);

		} else {
        	echo "No devuelve nada";
        }
	}
?> 