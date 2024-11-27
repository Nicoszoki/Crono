<?php
header('Content-Type: application/json; charset=utf-8');
	require_once 'conexion.php';
	if(ISSET($_POST['res'])){
		$conn = Conectar::conexion(); // Conexión a la base de datos.

		$query = "SELECT * FROM Personal";
		$result = mysqli_query($conn, $query);
		$json = array();
		if($result) {
			while($row = mysqli_fetch_assoc($result)) {
            // Creamos un array asociativo para recibir esos valores, 
            // tiene que coincidir el nombre de los campos de la bd
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
        	echo "No devuelve nada";
        }
	}
?> 