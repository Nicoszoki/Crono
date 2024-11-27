let conectado = false;

let disponibilidad = false;
let grupo = false;

setInterval(verificar, 10000);

function verificar() {
    $.ajax({
        url: 'verificar-conexion.php',
        type: 'POST',
        dataType: "json",
        success: function(response) {
            conectado = response;

            if (conectado == false) {
                $(".conectado").css("background-color", "red");
            } else {
                $(".conectado").css("background-color", "green");
            }
        }
    })

}

function deseleccionar() {
    disponibilidad = false;
    grupo = false;
}

function seleccion() {
    // Elimina el id de cualquier elemento que ya lo tenga
    const elementoAnterior = document.getElementById('opciónSeleccionada');
    if (elementoAnterior) {
        elementoAnterior.removeAttribute('id', 'opciónSeleccionada');
    }

    // Asigna el id al elemento actual
    this.setAttribute('id', 'opciónSeleccionada');
}

function verDisponibilidad(event) {

    const { nombre, apellido, ci } = sessionData;

    $.ajax({
        url: 'obtenerDisponibilidad.php',
        type: 'POST',
        dataType: 'json',
        data: { ci: ci },
        success: function(disponibilidades) {
            const disponibilidadHtml = `
                <h3>Disponibilidad de ${nombre} ${apellido}</h3>
                <table id="availabilityTable">
                    <thead>
                        <tr>
                            <th>Día/Hora</th>
                            <th><div>1°</div><div>07:30 - 08:15</div></th>
                            <th><div>2°</div><div>08:15 - 08:55</div></th>
                            <th><div>3°</div><div>09:00 - 09:45</div></th>
                            <th><div>4°</div><div>09:50 - 10:35</div></th>
                            <th><div>5°</div><div>10:50 - 11:35</div></th>
                            <th><div>6°</div><div>11:35 - 12:15</div></th>
                            <th><div>7°</div><div>12:20 - 13:05</div></th>
                            <th><div>8°</div><div>13:10 - 13:55</div></th>
                            <th><div>9°</div><div>14:30 - 15:15</div></th>
                            <th><div>10°</div><div>15:15 - 16:00</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="tr_first">Lunes</td>${"<td></td>".repeat(10)}</tr>
                        <tr><td class="tr_first">Martes</td>${"<td></td>".repeat(10)}</tr>
                        <tr><td class="tr_first">Miércoles</td>${"<td></td>".repeat(10)}</tr>
                        <tr><td class="tr_first">Jueves</td>${"<td></td>".repeat(10)}</tr>
                        <tr><td class="tr_first">Viernes</td>${"<td></td>".repeat(10)}</tr>
                    </tbody>
                </table>
                <div id="availabilityOutput" style="margin-top: 10px;"></div>
            `;

            Swal.fire({
                title: 'Disponibilidad Horaria',
                html: disponibilidadHtml,
                width: '80%',
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                didOpen: () => {
                    let isDragging = false;

                    document.addEventListener('mousedown', () => isDragging = true);
                    document.addEventListener('mouseup', () => isDragging = false);

                    const cells = document.querySelectorAll('#availabilityTable tbody td');

                    // Marcar celdas basadas en la disponibilidad recibida
                    disponibilidades.forEach(d => {
                        const row = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].indexOf(d.dia);
                        const col = parseInt(d.hora);
                        if (row >= 0 && col >= 0) {
                            $("#availabilityTable tbody tr").eq(row).find("td").eq(col).addClass('available');
                        }
                    });

                    // Permitir seleccionar y deseleccionar celdas con el mouse
                    cells.forEach(cell => {
                        cell.addEventListener('mousedown', () => toggleAvailability(cell));
                        cell.addEventListener('mouseenter', () => {
                            if (isDragging) toggleAvailability(cell);
                        });
                    });

                    function toggleAvailability(cell) {
                        if (!["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].includes(cell.textContent)) {
                            cell.classList.toggle('available');
                        }
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    guardarDisponibilidad(ci);
                }
            });
        },
        error: function() {
            Swal.fire('Error', 'No se pudo obtener la disponibilidad del docente', 'error');
        }
    });
}

function guardarDisponibilidad(ci) {
    const disponibles = [];
    const rows = document.querySelectorAll('#availabilityTable tbody tr');

    rows.forEach((row, rowIndex) => {
        const day = row.cells[0].textContent;
        row.querySelectorAll('td').forEach((cell, colIndex) => {
            if (cell.classList.contains('available')) {
                disponibles.push({ dia: day, hora: colIndex });
            }
        });
    });

    // Enviar la nueva disponibilidad al servidor
    $.ajax({
        url: 'guardarDisponibilidad.php',
        type: 'POST',
        dataType: 'json',
        data: {
            ci: ci,
            disponibilidad: disponibles
        },
        success: function(response) {
            if (response.success) {
                Swal.fire('Guardado', 'La disponibilidad se ha actualizado con éxito.', 'success');
            } else {
                Swal.fire('Error', 'Hubo un problema al actualizar la disponibilidad.', 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo actualizar la disponibilidad.', 'error');
        }
    });
}

// Variables para bloquear la ejecución
let bloqueado = false;

$(document).ready(function() {
    verificar();

    document.querySelectorAll('.opcion').forEach(elemento => {
        elemento.addEventListener('click', seleccion);
    });

    // Listener para el botón #Disponibilidad
    $("#Disponibilidad").on('click', async() => {
        if (!bloqueado) { // Verifica si el bloqueo está activo
            bloqueado = true; // Activa el bloqueo
            try {
                await verDisponibilidad(); // Ejecuta la función
            } finally {
                bloqueado = false; // Libera el bloqueo después de finalizar
            }
        }
    });

    // Listener para el botón #Grupos
    $("#Grupos").on('click', async() => {
        if (!bloqueado) { // Verifica si el bloqueo está activo
            bloqueado = true; // Activa el bloqueo
            try {
                await grupos(); // Ejecuta la función
            } finally {
                bloqueado = false; // Libera el bloqueo después de finalizar
            }
        }
    });
});