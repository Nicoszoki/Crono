let conectado = false;

let usuario = false;
let asignatura = false;
let grupo = false;

let opcion = "";

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
    usuario = false;
    asignatura = false;
    grupo = false;
}

function seleccionarOpcion() {
    if (usuario == true) {
        opcion = "Personal";
    } else if (asignatura == true) {
        opcion = "Asignatura";
    } else if (grupo == true) {
        opcion = "Grupo";
    }

    console.log(opcion);
}

function login(event) {
    event.preventDefault();

    let ci = $("#ci").val();
    let contra = $("#contra").val();

    Swal.fire({
        title: 'Iniciando sesión',
        html: 'Por favor, espere...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        }
    })

    $.ajax({
        url: 'login.php',
        type: 'POST',
        dataType: "json",
        data: {
            ci: ci,
            contra: contra
        },
        success: function(response) {
            // Redirigir a la página después de un login exitoso
            if (response.success) {
                console.log(response);
                if (response.rol == "Administrador") {

                    window.location.href = "pagina.php";

                } else if (response.rol == "Docente") {

                    window.location.href = "paginaDocente.php";

                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Cédula o contraseña incorrectos.'
                });
                $("#contra").val("");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error en la solicitud AJAX:", status, error);
            alert("Hubo un error al intentar obtener los datos. Por favor, inténtelo de nuevo más tarde.");
        }
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'obtenerTodo.php',
            type: 'POST',
            dataType: "json",
            data: {
                opcion: opcion
            },
            success: function(response) {
                console.log(response);
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error);
                alert("Hubo un error al intentar obtener los datos. Por favor, inténtelo de nuevo más tarde.");
                reject(error);
            }
        });
    });
}

function getUsuariosFiltrados(filtro) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'obtenerUsuarioFiltrado.php',
            type: 'POST',
            dataType: "json",
            data: {
                filtro: filtro
            },
            success: function(response) {
                console.log(response);
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error);
                alert("Hubo un error al intentar obtener los datos. Por favor, inténtelo de nuevo más tarde.");
                reject(error);
            }
        });
    });
}

function getGruposFiltrados(filtro) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'obtenerGrupoFiltrado.php',
            type: 'POST',
            dataType: "json",
            data: {
                filtro: filtro
            },
            success: function(response) {
                console.log(response);
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error);
                alert("Hubo un error al intentar obtener los datos. Por favor, inténtelo de nuevo más tarde.");
                reject(error);
            }
        });
    });
}

function getAsignaturasFiltradas(filtro) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'obtenerAsignaturaFiltrada.php', // Endpoint para obtener asignaturas filtradas
            type: 'POST',
            dataType: "json",
            data: {
                filtro: filtro // Enviar los filtros al servidor
            },
            success: function(response) {
                console.log(response); // Imprimir la respuesta en consola para depuración
                resolve(response); // Resolver la promesa con la respuesta
            },
            error: function(xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error); // Mostrar errores en la consola
                alert("Hubo un error al intentar obtener las asignaturas. Por favor, inténtelo de nuevo más tarde.");
                reject(error); // Rechazar la promesa en caso de error
            }
        });
    });
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

function mostrarPerfiles(personal) {

    let perfil;

    // Opción para añadir un nuevo usuario
    perfil = "<div id='añadirUsuario' class='perfilUsuario opcion'>";
    perfil += "<div style='display: flex;height: 100%;width: 100%;align-items: center;justify-content: center;margin: 0px;padding: 0px;'>";
    perfil += "<p class='negrita' style='font-size: 80px; margin: 0; padding: 0;'>+</p>";
    perfil += "</div></div>";

    $("#menu").append(perfil);

    $("#añadirUsuario").on('click', añadirUsuario);

    for (let i = 0; i < personal.length; i++) {
        // Determinar el ícono según el estado del usuario
        const iconoEstado = personal[i].baja === "0" ?
            "img/iconos/Eliminar.png" // Usuario activo
            :
            "img/iconos/Restaurar.png"; // Usuario inactivo

        perfil = "<div class='perfilUsuario'>";
        perfil += "<div>";
        perfil += "<p class='negrita'>" + personal[i].nombre + " " + personal[i].apellido + "</p>";
        perfil += "<p>Cédula: " + personal[i].ci + "</p>";
        perfil += "<p>Teléfono: " + personal[i].telefono + "</p>";
        perfil += "<p>Email: " + personal[i].email + "</p>";
        perfil += "<p>Rol: " + personal[i].rol + "</p>";
        perfil += "</div>";
        perfil += "<div class='divIcono'>";
        perfil += "<img src='img/iconos/Calendario.png' class='icono'>";
        perfil += "<img src='img/iconos/Editar.png' class='icono'>";
        perfil += `<img src='${iconoEstado}' class='icono iconoEstado' data-id='${personal[i].id}' data-activo='${personal[i].baja}'>`;
        perfil += "</div></div>";

        $("#menu").append(perfil);
    }

    // Asignar eventos a los íconos de estado
    $(".iconoEstado").off("click").on("click", darDeBajaUsuario);
}

function añadirUsuario() {
    Swal.fire({
        title: 'Añadir Usuario',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="apellido" class="swal2-input" placeholder="Apellido">
            <input id="ci" class="swal2-input" placeholder="Cédula">
            <input id="telefono" class="swal2-input" placeholder="Teléfono">
            <input id="email" class="swal2-input" placeholder="Email">
            <select id="rol" class="swal2-input">
                <option value="">Seleccionar Rol</option>
                <option value="Administrador">Administrador</option>
                <option value="Docente">Docente</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#00bcd4', // Color personalizado para el botón de confirmación
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
            const apellido = Swal.getPopup().querySelector('#apellido').value.trim();
            const ci = Swal.getPopup().querySelector('#ci').value.trim();
            const telefono = Swal.getPopup().querySelector('#telefono').value.trim();
            const email = Swal.getPopup().querySelector('#email').value.trim();
            const rol = Swal.getPopup().querySelector('#rol').value;

            if (!nombre || !apellido || !ci || !telefono || !email || !rol) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                Swal.showValidationMessage(`Por favor, ingrese un email válido`);
                return false;
            }

            const phonePattern = /^[0-9]+$/;
            if (!phonePattern.test(telefono)) {
                Swal.showValidationMessage(`Por favor, ingrese un teléfono válido`);
                return false;
            }

            return { nombre, apellido, ci, telefono, email, rol };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, apellido, ci, telefono, email, rol } = result.value;

            Swal.showLoading(); // Muestra el icono de carga después de la confirmación

            $.ajax({
                url: 'insertarUsuario.php',
                type: 'POST',
                dataType: "json",
                data: {
                    nombre: nombre,
                    apellido: apellido,
                    ci: ci,
                    telefono: telefono,
                    email: email,
                    rol: rol
                },
                success: function(response) {
                    Swal.close(); // Cierra el icono de carga
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario añadido',
                            text: 'El usuario ha sido añadido exitosamente.'
                        });
                        usuarios(); // Refresca la lista de usuarios
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al añadir el usuario.'
                        });
                    }
                },
                error: function(status, error) {
                    console.error("Error en la solicitud AJAX:", status, error);
                    Swal.close(); // Cierra el icono de carga
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar añadir el usuario. Por favor, inténtelo de nuevo más tarde.'
                    });
                }
            });
        } else if (result.isDismissed) {
            // Si el usuario cancela la adición
            Swal.fire({
                icon: 'info',
                title: 'Operación cancelada',
                text: 'Se canceló añadir un usuario.'
            });
        }
    });
}

function editarUsuario(event) {
    const usuarioDiv = $(event.target).closest('.perfilUsuario');
    const nombreCompleto = usuarioDiv.find('.negrita').text().trim().split(' ');
    const nombre = nombreCompleto.length > 2 ?
        `${nombreCompleto[0]} ${nombreCompleto[1]}` :
        nombreCompleto[0];
    const apellido = nombreCompleto.slice(nombreCompleto.length > 2 ? 2 : 1).join(' ');

    const ci = usuarioDiv.find('p:contains("Cédula:")').text().split(': ')[1];
    const telefono = usuarioDiv.find('p:contains("Teléfono:")').text().split(': ')[1];
    const email = usuarioDiv.find('p:contains("Email:")').text().split(': ')[1];
    const rol = usuarioDiv.find('p:contains("Rol:")').text().split(': ')[1];



    Swal.fire({
        title: 'Editar Usuario',
        html: `  
            <input id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
            <input id="apellido" class="swal2-input" placeholder="Apellido" value="${apellido}">
            <input id="ci" class="swal2-input" placeholder="Cédula" value="${ci}">
            <input id="telefono" class="swal2-input" placeholder="Teléfono" value="${telefono}">
            <input id="email" class="swal2-input" placeholder="Email" value="${email}">
            <select id="rol" class="swal2-input">
                <option value="Administrador" ${rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                <option value="Docente" ${rol === 'Docente' ? 'selected' : ''}>Docente</option>
            </select>
        `,
        focusConfirm: false,
        showCancelButton: true, // Mostrar botón de cancelar
        cancelButtonText: 'Cancelar', // Texto del botón de cancelar
        confirmButtonColor: '#00bcd4',
        cancelButtonColor: '#d33', // Color del botón de cancelar
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
            const apellido = Swal.getPopup().querySelector('#apellido').value.trim();
            const ci = Swal.getPopup().querySelector('#ci').value.trim();
            const telefono = Swal.getPopup().querySelector('#telefono').value.trim();
            const email = Swal.getPopup().querySelector('#email').value.trim();
            const rol = Swal.getPopup().querySelector('#rol').value;

            if (!nombre || !apellido || !ci || !telefono || !email || !rol) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                Swal.showValidationMessage(`Por favor, ingrese un email válido`);
                return false;
            }

            return { nombre, apellido, ci, telefono, email, rol };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, apellido, ci, telefono, email, rol } = result.value;

            Swal.showLoading();

            $.ajax({
                url: 'editarUsuario.php',
                type: 'POST',
                dataType: "json",
                data: {
                    nombre: nombre,
                    apellido: apellido,
                    ci: ci,
                    telefono: telefono,
                    email: email,
                    rol: rol
                },
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario editado',
                            text: 'El usuario ha sido editado exitosamente.'
                        });
                        usuarios();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al editar el usuario.'
                        });
                    }
                },
                error: function(status, error) {
                    console.error("Error en la solicitud AJAX:", status, error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar editar el usuario. Por favor, inténtelo de nuevo más tarde.'
                    });
                }
            });
        } else if (result.isDismissed) {
            // Si el usuario cancela la edición
            Swal.fire({
                icon: 'info',
                title: 'Operación cancelada',
                text: 'La edición del usuario ha sido cancelada.'
            });
        }
    });
}

$(document).on('click', '.perfilUsuario .icono[src="img/iconos/Editar.png"]', editarUsuario);
$(document).on('click', '.perfilUsuario .icono[src="img/iconos/Calendario.png"]', verDisponibilidad);

$(document).on('click', '.perfilGrupo .icono[src="img/iconos/Calendario.png"]', horarioGrupo);
$(document).on('click', '.perfilGrupo .icono[src="img/iconos/Editar.png"]', editarGrupo);

function verDisponibilidad(event) {
    const usuarioDiv = $(event.target).closest('.perfilUsuario');
    const nombre = usuarioDiv.find('.negrita').text().split(' ')[0];
    const apellido = usuarioDiv.find('.negrita').text().split(' ')[1];
    const ci = usuarioDiv.find('p:contains("Cédula:")').text().split(': ')[1];

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

function darDeBajaUsuario(event) {
    const usuarioDiv = $(event.target).closest('.perfilUsuario');
    const ci = usuarioDiv.find('p:contains("Cédula:")').text().split(': ')[1];
    const esActivo = $(event.target).attr("data-activo") === "0"; // Verificar si el usuario está activo o inactivo

    console.log("esActivo:", esActivo);

    let swalTitle = '¿Estás seguro?';
    let swalText = esActivo ?
        "El usuario será dado de baja lógicamente." :
        "El usuario será restaurado a su estado activo.";

    let confirmText = esActivo ? 'Sí, dar de baja' : 'Sí, restaurar';
    let cancelText = 'Cancelar';

    Swal.fire({
        title: swalTitle,
        text: swalText,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud AJAX para dar de baja o restaurar el usuario
            $.ajax({
                url: esActivo ? 'darDeBajaUsuario.php' : 'restaurarUsuario.php', // Determinar la acción
                type: 'POST',
                dataType: 'json',
                data: { ci: ci },
                success: function(response) {
                    if (response.success) {
                        const actionMessage = esActivo ? '¡Usuario dado de baja!' : '¡Usuario restaurado!';
                        Swal.fire(
                            actionMessage,
                            `El usuario ha sido ${esActivo ? 'dado de baja' : 'restaurado'} exitosamente.`,
                            'success'
                        );
                        usuarios(); // Actualizar la lista de usuarios después de la acción
                    } else {
                        Swal.fire('Error', `No se pudo ${esActivo ? 'dar de baja' : 'restaurar'} al usuario.`, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'Hubo un problema con la solicitud.', 'error');
                }
            });
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

function editarGrupo(event) {
    const grupoDiv = $(event.target).closest('.perfilGrupo');
    const nombreCompleto = grupoDiv.find('.negrita').text().trim().split(' ');
    const grado = nombreCompleto.pop(); // Extrae el último elemento como grado
    const nombre = nombreCompleto.join(' '); // Une el resto como el nombre completo

    Swal.fire({
        title: 'Editar Grupo',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}">
            <input id="grado" class="swal2-input" placeholder="Grado" value="${grado}">
        `,
        focusConfirm: false,
        confirmButtonColor: '#00bcd4',
        preConfirm: () => {
            const nombreNuevo = Swal.getPopup().querySelector('#nombre').value.trim();
            const gradoNuevo = Swal.getPopup().querySelector('#grado').value.trim();

            if (!nombreNuevo || !gradoNuevo) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }

            return { nombre, grado, nombreNuevo, gradoNuevo };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, grado, nombreNuevo, gradoNuevo } = result.value;

            Swal.showLoading(); // Mostrar loading mientras se procesa la solicitud

            $.ajax({
                url: 'editarGrupo.php',
                type: 'POST',
                dataType: "json",
                data: {
                    nombre: nombre,
                    grado: grado,
                    nombreNuevo: nombreNuevo,
                    gradoNuevo: gradoNuevo
                },
                success: function(response) {
                    Swal.close(); // Cerrar loading antes de mostrar la respuesta

                    console.log(response); // Depurar la respuesta recibida

                    // Verificar si la respuesta indica éxito
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Grupo editado',
                            text: response.message
                        });
                        grupos(); // Llamar la función que actualiza la lista de grupos
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'Hubo un problema al editar el grupo.'
                        });
                    }
                },
                error: function(status, error) {
                    console.error("Error en la solicitud AJAX:", status, error);
                    Swal.close();
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar editar el grupo. Por favor, inténtelo de nuevo más tarde.'
                    });
                }
            });
        }
    });
}

async function usuarios() {
    try {
        deseleccionar();
        usuario = true;
        seleccionarOpcion();

        $("#menu").empty();
        $(document).off('input change', '#filtroForm input, #filtroForm select'); // Elimina eventos anteriores

        let personal = await getAll(); // Carga los datos iniciales

        if (Array.isArray(personal)) {
            let filtro = `
                <div id="filtro">
                    <form id="filtroForm" onsubmit="aplicarFiltroUsuario(event); return false">
                        <div>
                            <label>Orden: </label>
                            <select id="filtroOrden">
                                <option value="nombre asc">Nombre: A - Z</option>
                                <option value="nombre desc">Nombre: Z - A</option>
                                <option value="apellido asc">Apellido: A - Z</option>
                                <option value="apellido desc">Apellido: Z - A</option>
                            </select>
                        </div>
                        <div>
                            <label>Nombre: </label>
                            <input id="filtroNombre" type="text">
                        </div>
                        <div>
                            <label>Apellido: </label>
                            <input id="filtroApellido" type="text">
                        </div>
                        <div>
                            <label>Activo: </label>
                            <select id="filtroActivo">
                                <option value="false">Sí</option>
                                <option value="true">No</option>
                            </select>
                        </div>
                    </form>
                </div>`;

            $("#menu").append(filtro);

            // Reasignar eventos al filtro actual
            $(document).on('input change', '#filtroForm input, #filtroForm select', function() {
                aplicarFiltroUsuario({ preventDefault: () => {} });
            });

            aplicarFiltroUsuario({ preventDefault: () => {} }); // Aplicar el filtro inicial
        } else {
            console.error("La respuesta no es un array válido.");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

async function aplicarFiltroUsuario(event) {
    try {
        event.preventDefault();

        let filtro = {
            orden: $("#filtroOrden").val(),
            nombre: $("#filtroNombre").val(),
            apellido: $("#filtroApellido").val(),
            activo: $("#filtroActivo").val(),
            opcion: opcion
        };

        console.log("Filtro:", filtro);

        let personal = await getUsuariosFiltrados(filtro);

        // Verifica si personal es un array antes de usarlo
        if (Array.isArray(personal)) {
            $("#menu .perfilUsuario").remove(); // Elimina solo los perfiles actuales
            mostrarPerfiles(personal); // Muestra los nuevos perfiles filtrados
        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

function mostrarGrupos(grupos) {
    let perfil;

    // añadir usuario
    perfil = "<div id='añadirGrupo' class='perfilGrupo opcion'>";
    perfil += "<div style='display: flex;height: 100%;width: 100%;align-items: center;justify-content: center;margin: 0px;padding: 0px;'>";
    perfil += "<p class='negrita' style='font-size: 80px; margin: 0; padding: 0;'>+</p>";
    perfil += "</div></div>";

    $("#menu").append(perfil);

    $("#añadirGrupo").on('click', añadirGrupo)

    for (let i = 0; i < grupos.length; i++) {

        let perfil = "<div class='perfilGrupo'>";
        perfil += "<div>";
        perfil += "<p class='negrita'>" + grupos[i].nombre + " " + grupos[i].grado + "</p>";
        perfil += "</div>";
        perfil += "<div>";
        perfil += "<img src='img/iconos/Calendario.png' class='icono iconoGrupo'>";
        perfil += "<img src='img/iconos/Editar.png' class='icono iconoGrupo'>";
        perfil += "<img src='img/iconos/Eliminar.png' class='icono iconoGrupo'>";
        perfil += "</div>";
        perfil += "</div>";
        $("#menu").append(perfil);
    }
}

function añadirGrupo() {
    Swal.fire({
        title: 'Añadir Grupo',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="grado" class="swal2-input" placeholder="Grado">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#00bcd4', // Color personalizado para el botón de confirmación
        cancelButtonColor: '#d33',
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
            const grado = Swal.getPopup().querySelector('#grado').value.trim();

            if (!nombre || !grado) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }

            return { nombre, grado };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre, grado } = result.value;

            Swal.showLoading(); // Muestra el icono de carga después de la confirmación

            $.ajax({
                url: 'insertarGrupo.php',
                type: 'POST',
                dataType: "json",
                data: {
                    nombre: nombre,
                    grado: grado
                },
                success: function(response) {
                    Swal.close(); // Cierra el icono de carga
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Grupo añadido',
                            text: 'El grupo ha sido añadido exitosamente.'
                        });
                        grupos(); // Refresca la lista de grupos
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Hubo un problema al añadir el grupo.'
                        });
                    }
                },
                error: function(status, error) {
                    console.error("Error en la solicitud AJAX:", status, error);
                    Swal.close(); // Cierra el icono de carga
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al intentar añadir el grupo. Por favor, inténtelo de nuevo más tarde.'
                    });
                }
            });
        } else if (result.isDismissed) {
            // Si el usuario cancela la adición
            Swal.fire({
                icon: 'info',
                title: 'Operación cancelada',
                text: 'Se canceló añadir un grupo.'
            });
        }
    });
}

function horarioGrupo(event) {
    const grupoDiv = $(event.target).closest('.perfilGrupo');
    const nombreCompleto = grupoDiv.find('.negrita').text().trim().split(' ');
    const grado = parseInt(nombreCompleto.pop());
    const nombreGrupo = nombreCompleto.join(' ');

    console.log("Grupo:", nombreGrupo); // Verifica que nombreGrupo esté definido
    console.log("Grado:", grado); // Verifica que grado esté definido

    $("#menu").empty();

    // Estructura de la planilla de días y horarios (siempre visible)
    const planillaHorariosHtml = `
        <div style="display: flex; width: 100%; justify-content: center;">
            <h2>${nombreGrupo} ${grado}</h2>
        </div>
        <div id="planillaHorarios" style="display: flex; flex-direction: column;">
            <h3 style="display: flex; justify-content: center;">Planilla de Días y Horarios</h3>
            <button id="btnDescargarPDF" style="padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Descargar a PDF
            </button>
            <table id="tablaHorarios">
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
                    <tr><td class="tr_first">Lunes</td>${"<td style='width: 100px;'></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Martes</td>${"<td style='width: 100px;'></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Miércoles</td>${"<td style='width: 100px;'></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Jueves</td>${"<td style='width: 100px;'></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Viernes</td>${"<td style='width: 100px;'></td>".repeat(10)}</tr>
                </tbody>
            </table>
        </div>
    `;

    // Agregar la estructura inicial al menú
    $("#menu").append(planillaHorariosHtml);

    // Botón para descargar PDF
    $("#btnDescargarPDF").on("click", function() {
        descargarPDF(nombreGrupo, grado);
    });

    // Realizar ambas llamadas AJAX en paralelo
    const asignaturasPromise = $.ajax({
        url: 'obtenerAsignaturasDeGrupo.php',
        type: 'POST',
        dataType: 'json',
        data: { nombre_G: nombreGrupo, grado: grado },
    });

    const listaAsignaturasPromise = $.ajax({
        url: 'obtenerAsignaturasDeGrupoLista.php',
        type: 'POST',
        dataType: 'json',
        data: { nombre_G: nombreGrupo, grado: grado },
    });

    // Esperar a que ambas promesas se completen
    Promise.all([asignaturasPromise, listaAsignaturasPromise])
        .then(([asignaturas, listaAsignaturas]) => {
            // Procesar datos de `obtenerAsignaturasDeGrupo.php`
            asignaturas.forEach(asignatura => {
                const dia = asignatura.dia;
                const hora = parseInt(asignatura.hora); // Convertir la hora a un número entero
                const nombreAsignatura = asignatura.nombre;
                const docente = asignatura.docente || 'Sin Docente';

                const row = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].indexOf(dia);
                const col = hora; // Índice de la columna correspondiente a la hora

                if (row >= 0 && col >= 0) {
                    const celda = $("#tablaHorarios tbody tr").eq(row).find("td").eq(col);

                    celda.html(`
                        <div style="text-align: center;">
                            <div style="font-weight: bold;">${nombreAsignatura}</div>
                            <div style="font-size: 0.8em; color: gray;">${docente}</div>
                        </div>
                    `);
                }
            });

            // Procesar datos de `obtenerAsignaturasDeGrupoLista.php`
            let asignaturasHtml = `
                <div id="asignaturas">
                    <h3 style="display: flex; justify-content: center;">Asignaturas</h3>
                    <table id="tablaAsignaturas">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Carga Horaria</th>
                                <th>Docente</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            listaAsignaturas.forEach(asignatura => {
                asignaturasHtml += `
                    <tr>
                        <td>${asignatura.nombre}</td>
                        <td contenteditable="true" class="editable-carga-horaria" data-asignatura="${asignatura.nombre}">
                            ${asignatura.carga_horaria}
                        </td>
                        <td><button class="seleccionarDocente">${asignatura.docente || 'Seleccionar Docente'}</button></td>
                        <td><img src='img/iconos/Eliminar.png' class='icono iconoAsignatura'></td>
                    </tr>`;
            });

            asignaturasHtml += `
                <tr>
                    <td colspan="4">
                        <button id="btnAgregarAsignatura">Añadir Asignatura</button>
                    </td>
                </tr>
            </tbody></table></div>`;

            $("#menu").append(asignaturasHtml);
        })
        .catch(error => {
            console.error('Error al cargar datos del grupo:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos del grupo.', 'error');
        });
}

// Función para descargar el PDF
function descargarPDF(nombreGrupo, grado) {
    const { jsPDF } = window.jspdf; // Asegurarse de que jsPDF esté disponible

    // Clonar la tabla para aplicar las modificaciones sin afectar la original
    const tablaOriginal = document.getElementById('tablaHorarios');
    const tablaClonada = tablaOriginal.cloneNode(true); // Clonar la tabla original

    // Insertar la tabla clonada en un contenedor temporal fuera del DOM
    const contenedorTemporal = document.createElement('div');
    contenedorTemporal.style.position = 'absolute';
    contenedorTemporal.style.left = '-9999px';
    contenedorTemporal.appendChild(tablaClonada);
    document.body.appendChild(contenedorTemporal);

    // Aplicar la función de fusión a la tabla clonada
    fusionarCeldasDuplicadas($(tablaClonada));

    // Usar html2canvas para convertir la tabla clonada a una imagen
    html2canvas(tablaClonada, {
            scale: 1.5, // Aumentar la escala para mayor calidad
            useCORS: true, // Habilitar CORS si se usan recursos externos
        })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png'); // Convertir el canvas a una imagen
            const imgWidth = canvas.width; // Ancho de la imagen en píxeles
            const imgHeight = canvas.height; // Alto de la imagen en píxeles

            // Convertir píxeles a milímetros (jsPDF usa mm)
            const pxToMm = 0.264583; // 1 píxel = 0.264583 mm
            const pdfWidth = imgWidth * pxToMm;
            const pdfHeight = imgHeight * pxToMm;

            // Crear un documento jsPDF con orientación landscape y tamaño exacto
            const doc = new jsPDF('landscape', 'mm', [pdfWidth, pdfHeight]);

            // Agregar la imagen al PDF (ajuste exacto)
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Descargar el PDF
            doc.save(`Horarios_${nombreGrupo}_${grado}.pdf`);
        })
        .catch((error) => {
            console.error("Error al generar el PDF:", error);
            Swal.fire('Error', 'No se pudo generar el PDF.', 'error');
        })
        .finally(() => {
            // Eliminar el contenedor temporal y su contenido
            document.body.removeChild(contenedorTemporal);
        });
}

$(document).on('click', '#tablaHorarios tbody td', añadirAsignaturaAGrupo);

function añadirAsignaturaAGrupo() {
    // Asegúrate de que la celda no sea la primera columna (Día/Hora)
    if ($(this).hasClass('tr_first')) return;

    const celda = $(this);
    const textoEncabezado = $('#menu h2').text(); // Capturar el encabezado del menú
    const partesEncabezado = textoEncabezado.match(/^(.+)\s(\d+)$/); // Dividir el nombre y grado

    // Validar que el encabezado tiene el formato esperado
    if (!partesEncabezado || partesEncabezado.length < 3) {
        console.error('Formato de encabezado inválido. Se esperaba "NombreGrupo NúmeroGrado".');
        return;
    }

    const nombreGrupo = partesEncabezado[1].trim(); // Primera parte del encabezado (nombre del grupo)
    const grado = parseInt(partesEncabezado[2]); // Segunda parte del encabezado (número del grado)

    // Evitar que un menú se muestre dos veces en la misma celda
    if (celda.find('.menu-asignaturas').length > 0) return;

    // Realiza una solicitud AJAX para obtener las asignaturas del grupo
    $.ajax({
        url: 'obtenerAsignaturasDeGrupoLista.php',
        type: 'POST',
        dataType: 'json',
        data: {
            nombre_G: nombreGrupo,
            grado: grado
        },
        success: function(asignaturas) {
            if (!asignaturas || asignaturas.length === 0) {
                console.log('No hay asignaturas disponibles para este grupo.');
                return;
            }

            // Crear el menú desplegable personalizado
            const menuHtml = $('<div>')
                .addClass('menu-asignaturas')
                .css({
                    position: 'absolute',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    zIndex: 1000,
                    padding: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    maxHeight: '250px',
                    maxWidth: '250px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                });

            // Opción de espacio en blanco para eliminar asignaturas
            const blankItem = $('<div>')
                .text('ELIMINAR')
                .css({
                    padding: '5px',
                    cursor: 'pointer',
                    borderBottom: '1px solid black',
                    backgroundColor: '#00bcd4'
                })
                .on('click', function() {
                    const dia = celda.closest('tr').find('td.tr_first').text().trim(); // Día
                    const hora = celda.index().toString(); // Índice de la columna como string

                    // Eliminar la asignatura de la base de datos
                    $.ajax({
                        url: 'eliminarHorarioDicta.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            nombre_G: nombreGrupo,
                            grado: grado,
                            dia: dia,
                            hora: hora
                        },
                        success: function(response) {
                            if (response.success) {
                                console.log('Horario eliminado correctamente.');
                                celda.empty(); // Vaciar la celda
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: response.message
                                });
                            }
                        },
                        error: function() {
                            console.error('Error al eliminar el horario.');
                        }
                    });

                    // Eliminar el menú desplegable
                    menuHtml.remove();
                });

            menuHtml.append(blankItem);

            // Añadir las opciones de asignaturas al menú
            asignaturas.forEach(asignatura => {
                const item = $('<div>')
                    .text(asignatura.nombre)
                    .css({
                        padding: '5px',
                        cursor: 'pointer',
                        borderBottom: '1px solid black'
                    })
                    .on('click', function() {
                        // Datos de la asignatura seleccionada
                        const asignaturaSeleccionada = asignatura.nombre;
                        const docenteCI = asignatura.docenteCI || '';
                        const dia = celda.closest('tr').find('td.tr_first').text().trim(); // Día
                        const hora = celda.index().toString(); // Índice de la columna como string

                        // Verificar la carga horaria antes de asignar
                        $.ajax({
                            url: 'verificarCargaHoraria.php',
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                nombre_A: asignaturaSeleccionada,
                                nombre_G: nombreGrupo,
                                grado: grado
                            },
                            success: function(response) {
                                console.log(`Carga actual: ${response.carga_actual}, Carga máxima: ${response.carga_maxima}`);

                                const cargaActual = response.carga_actual || 0; // Carga actual traída desde el backend
                                const cargaMaxima = response.carga_maxima || 0; // Carga máxima traída desde el backend
                                const nuevaCarga = 1; // Horas que intentas añadir

                                // Validar si la nueva carga excede el máximo permitido
                                if (cargaActual + nuevaCarga > cargaMaxima) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Exceso de carga horaria',
                                        text: `La asignatura "${asignaturaSeleccionada}" no se puede añadir, ya se ha alcanzado el límite de carga horaria.`,
                                    });
                                    return; // Detener si excede el límite
                                }

                                // Guardar la selección en la base de datos
                                $.ajax({
                                    url: 'guardarHorarioDicta.php',
                                    type: 'POST',
                                    dataType: 'json',
                                    data: {
                                        asignatura: asignaturaSeleccionada,
                                        nombre_G: nombreGrupo,
                                        grado: grado,
                                        ci: docenteCI,
                                        dia: dia,
                                        hora: hora
                                    },
                                    success: function(response) {
                                        if (response.success) {
                                            const docente = response.docente;
                                            console.log('Horario guardado correctamente.');
                                            celda.html(`
                                                <div style="text-align: center;">
                                                    <div style="font-weight: bold;">${asignaturaSeleccionada}</div>
                                                    <div style="font-size: 0.8em; color: gray;">${docente}</div>
                                                </div>
                                            `);
                                        } else {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Conflicto de horario',
                                                text: response.message,
                                            });
                                        }
                                    },
                                    error: function() {
                                        console.error('Error al guardar el horario.');
                                    }
                                });
                            },
                            error: function(xhr, status, error) {
                                Swal.fire('Error', 'No se pudo verificar la carga horaria.', 'error');
                            }
                        });

                        // Eliminar el menú desplegable
                        menuHtml.remove();
                    });

                menuHtml.append(item);
            });

            // Eliminar el menú desplegable al hacer clic fuera
            $(document).on('click', function(event) {
                if (!$(event.target).closest('.menu-asignaturas').length) {
                    menuHtml.remove();
                }
            });

            // Insertar el menú desplegable en la celda
            celda.css('position', 'relative').append(menuHtml);
        },
        error: function() {
            console.error('No se pudieron cargar las asignaturas.');
        }
    });
}

function verificarCargaHoraria(asignatura, horasNuevas, callback) {
    $.ajax({
        url: 'verificarCargaHoraria.php', // Endpoint para verificar carga horaria
        type: 'POST',
        dataType: 'json',
        data: { asignatura },
        success: function(response) {
            const cargaActual = response.carga_actual || 0;
            const cargaMaxima = response.carga_maxima;

            if (cargaActual + horasNuevas > cargaMaxima) {
                Swal.fire({
                    icon: 'error',
                    title: 'Exceso de carga horaria',
                    text: `No puedes asignar más horas. Máximo permitido: ${cargaMaxima} horas.`,
                });
            } else {
                callback(); // Si pasa la validación, ejecuta la acción.
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo verificar la carga horaria.', 'error');
        }
    });
}

function mostrarListaAsignaturas() {

    const textoEncabezado = $('#menu h2').text(); // Obtener el encabezado completo
    const partesEncabezado = textoEncabezado.match(/^(.*\D)\s(\d+)$/);

    if (!partesEncabezado || partesEncabezado.length < 3) {
        Swal.fire('Error', 'No se pudo determinar el grupo y el grado.', 'error');
        return;
    }

    const nombreGrupo = partesEncabezado[1].trim();
    const grado = parseInt(partesEncabezado[2].trim());

    if (isNaN(grado)) {
        Swal.fire('Error', 'El grado no es válido.', 'error');
        return;
    }

    $.ajax({
        url: 'obtenerTodasAsignaturas.php',
        type: 'POST',
        dataType: 'json',
        success: function(asignaturas) {
            let opcionesHtml = `<select id="listaAsignaturas">`;
            asignaturas.forEach(asignatura => {
                opcionesHtml += `<option value="${asignatura.nombre}">${asignatura.nombre}</option>`;
            });
            opcionesHtml += `</select>`;

            let cargaHoraria;
            Swal.fire({
                title: 'Selecciona una Asignatura',
                html: opcionesHtml,
                confirmButtonText: 'Añadir',
                cancelButtonText: 'Cancelar',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    const nombreAsignatura = $('#listaAsignaturas').val();
                    console.log("Nombre de Asignatura Seleccionado:", nombreAsignatura); // Verificar que nombreAsignatura se define correctamente

                    Swal.fire({
                        title: 'Ingrese la carga horaria para la asignatura',
                        input: 'number',
                        inputAttributes: {
                            min: 1,
                            step: 1
                        },
                        showCancelButton: true,
                        confirmButtonText: 'Aceptar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: (value) => {
                            if (!value || value <= 0) {
                                Swal.showValidationMessage('Por favor, ingrese una carga horaria válida');
                                return false;
                            }
                            return value;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cargaHoraria = result.value;
                            agregarAsignaturaATabla(nombreAsignatura, nombreGrupo, grado, cargaHoraria);
                        }
                    });
                }
            });
        },
        error: function() {
            Swal.fire('Error', 'No se pudo obtener la lista de asignaturas.', 'error');
        }
    });
}

function agregarAsignaturaATabla(nombreAsignatura, nombreGrupo, grado, cargaHoraria) {
    console.log("Datos para Agregar Asignatura:", { nombreAsignatura, nombreGrupo, grado, cargaHoraria });

    if (!nombreAsignatura || !nombreGrupo || !grado || isNaN(cargaHoraria)) {
        console.error("Error: Faltan datos para agregar la asignatura.");
        Swal.fire('Error', 'Faltan datos para agregar la asignatura. Por favor, revisa los campos.', 'error');
        return;
    }

    $.ajax({
        url: 'agregarAsignaturaAGrupo.php',
        type: 'POST',
        dataType: 'json',
        data: {
            nombreAsignatura: nombreAsignatura,
            nombre_G: nombreGrupo,
            grado: grado,
            carga_horaria: cargaHoraria
        },
        success: function(response) {
            if (response.success) {
                // Llamada para obtener la lista actualizada de asignaturas
                $.ajax({
                    url: 'obtenerAsignaturasDeGrupoLista.php',
                    type: 'POST',
                    dataType: 'json',
                    data: { nombre_G: nombreGrupo, grado: grado },
                    success: function(asignaturas) {
                        // Reconstruir la tabla con los datos actualizados
                        let asignaturasHtml = `
                            <table id="tablaAsignaturas">
                                <thead>
                                    <tr>
                                        <th>Asignatura</th>
                                        <th>Carga Horaria</th>
                                        <th>Docente</th>
                                        <th>Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody>
                        `;

                        asignaturas.forEach(asignatura => {
                            asignaturasHtml += `
                                <tr>
                                    <td>${asignatura.nombre}</td>
                                    <td contenteditable="true" class="editable-carga-horaria" data-asignatura="${asignatura.nombre}">
                                        ${asignatura.carga_horaria}
                                    </td>
                                    <td><button class="seleccionarDocente">${asignatura.docente || 'Seleccionar Docente'}</button></td>
                                    <td><img src='img/iconos/Eliminar.png' class='icono iconoAsignatura'></td>
                                </tr>`;
                        });

                        asignaturasHtml += `
                            <tr>
                                <td colspan="4">
                                    <button id="btnAgregarAsignatura">Añadir Asignatura</button>
                                </td>
                            </tr>
                        </tbody></table>`;

                        // Reemplazar la tabla actual con la nueva
                        $('#tablaAsignaturas').replaceWith(asignaturasHtml);

                        Swal.fire('Asignatura Añadida', 'La tabla se ha actualizado correctamente.', 'success');
                    },
                    error: function() {
                        Swal.fire('Error', 'No se pudo obtener la lista actualizada de asignaturas.', 'error');
                    }
                });
            } else {
                Swal.fire('Error', 'Hubo un problema al añadir la asignatura.', 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo añadir la asignatura al grupo.', 'error');
        }
    });
}

$(document).on('click', '.iconoAsignatura', eliminarAsignaturaDeGrupo);

function eliminarAsignaturaDeGrupo() {
    const fila = $(this).closest('tr'); // Obtener la fila de la asignatura
    const asignatura = fila.find('td:first').text().trim(); // Nombre de la asignatura
    const textoEncabezado = $('#menu h2').text().trim(); // Obtener el encabezado del menú
    const partesEncabezado = textoEncabezado.match(/^(.+)\s(\d+)$/); // Dividir el nombre del grupo y grado

    // Validar que el encabezado tiene el formato esperado
    if (!partesEncabezado || partesEncabezado.length < 3) {
        Swal.fire('Error', 'El formato del encabezado no es válido.', 'error');
        return;
    }

    const nombreGrupo = partesEncabezado[1].trim(); // Nombre del grupo
    const grado = parseInt(partesEncabezado[2]); // Grado del grupo

    // Mostrar SweetAlert para confirmar la eliminación
    Swal.fire({
        title: '¿Estás seguro?',
        text: `Esto eliminará todas las relaciones de la asignatura "${asignatura}" en este grupo.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la eliminación mediante AJAX
            $.ajax({
                url: 'eliminarAsignaturaDeGrupo.php',
                type: 'POST',
                dataType: 'json',
                data: {
                    asignatura: asignatura,
                    nombre_G: nombreGrupo,
                    grado: grado
                },
                success: function(response) {
                    if (response.success) {
                        // Eliminar la fila de la tabla de asignaturas
                        fila.remove();

                        // Mostrar mensaje de éxito y recargar la planilla de horarios
                        Swal.fire('Eliminada', 'La asignatura ha sido eliminada correctamente.', 'success').then(() => {
                            recargarPlanillaHorarios(nombreGrupo, grado);
                        });
                    } else {
                        Swal.fire('Error', response.message || 'No se pudo eliminar la asignatura.', 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo procesar la eliminación.', 'error');
                }
            });
        }
    });
}

function recargarPlanillaHorarios(nombreGrupo, grado) {
    // Realiza la llamada AJAX para obtener los datos de la planilla
    $.ajax({
        url: 'obtenerAsignaturasDeGrupo.php',
        type: 'POST',
        dataType: 'json',
        data: { nombre_G: nombreGrupo, grado: grado },
        success: function(asignaturas) {
            // Reconstruir la planilla de horarios
            const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
            const planillaBody = $("#tablaHorarios tbody");

            // Limpiar la planilla actual
            planillaBody.empty();

            // Crear filas de la planilla
            dias.forEach(dia => {
                let filaHtml = `<tr><td class="tr_first">${dia}</td>`;
                for (let hora = 1; hora <= 10; hora++) {
                    filaHtml += `<td style="width: 100px;"></td>`;
                }
                filaHtml += `</tr>`;
                planillaBody.append(filaHtml);
            });

            // Insertar asignaturas en las celdas correspondientes
            asignaturas.forEach(asignatura => {
                const dia = asignatura.dia;
                const hora = parseInt(asignatura.hora); // Convertir la hora a número entero
                const nombreAsignatura = asignatura.nombre;
                const docente = asignatura.docente || 'Sin Docente';

                const row = dias.indexOf(dia);
                const col = hora; // Índice de la columna correspondiente a la hora

                if (row >= 0 && col >= 0) {
                    const celda = $("#tablaHorarios tbody tr").eq(row).find("td").eq(col);

                    celda.html(`
                        <div style="text-align: center;">
                            <div style="font-weight: bold;">${nombreAsignatura}</div>
                            <div style="font-size: 0.8em; color: gray;">${docente}</div>
                        </div>
                    `);
                }
            });
        },
        error: function() {
            Swal.fire('Error', 'No se pudo recargar la planilla de horarios.', 'error');
        }
    });
}

$(document).on('click', '.seleccionarDocente', seleccionarDocente);

function seleccionarDocente() {
    const boton = $(this); // Botón que fue presionado
    const fila = boton.closest('tr'); // Fila a la que pertenece el botón
    const asignatura = fila.find('td:first').text().trim(); // Nombre de la asignatura
    const textoEncabezado = $('#menu h2').text(); // Obtener el encabezado completo

    const partesEncabezado = textoEncabezado.match(/^(.*\D)\s(\d+)$/);

    if (!partesEncabezado || partesEncabezado.length < 3) {
        Swal.fire('Error', 'No se pudo determinar el grupo y el grado.', 'error');
        return;
    }

    const nombreGrupo = partesEncabezado[1].trim();
    const grado = parseInt(partesEncabezado[2].trim());

    if (isNaN(grado)) {
        Swal.fire('Error', 'El grado no es válido.', 'error');
        return;
    }

    $.ajax({
        url: 'obtenerDocentesDisponibles.php',
        type: 'POST',
        dataType: 'json',
        success: function(docentes) {
            console.log("Docentes Disponibles:", docentes); // Verificar que docentes se cargue correctamente
            if (!docentes || docentes.length === 0) {
                Swal.fire('Sin docentes', 'No hay docentes disponibles.', 'info');
                return;
            }

            const selectHtml = $('<select>')
                .css({ width: '100%', margin: '5px 0' })
                .append('<option value="" disabled selected>Seleccione un docente</option>');

            docentes.forEach(docente => {
                selectHtml.append(`<option value="${docente.ci}">${docente.nombre} ${docente.apellido}</option>`);
            });

            Swal.fire({
                title: 'Seleccionar Docente',
                html: selectHtml[0].outerHTML,
                confirmButtonText: 'Guardar',
                showCancelButton: true,
                preConfirm: () => {
                    const docenteSeleccionado = Swal.getPopup().querySelector('select').value;
                    if (!docenteSeleccionado) {
                        Swal.showValidationMessage('Debe seleccionar un docente.');
                    }
                    return docenteSeleccionado;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const docenteCI = result.value; // CI del nuevo docente seleccionado
                    const docenteSeleccionado = docentes.find(d => d.ci === docenteCI);

                    if (!docenteSeleccionado) {
                        Swal.fire('Error', 'El docente seleccionado no se encuentra disponible.', 'error');
                        return;
                    }

                    // Realizar la actualización o asignación en la base de datos
                    $.ajax({
                        url: 'guardarDocenteAsignatura.php',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            asignatura: asignatura,
                            nombre_G: nombreGrupo,
                            grado: grado,
                            ciDocente: docenteCI,
                            dia: "Lunes", // Placeholder
                            hora: "0" // Placeholder
                        },
                        success: function(response) {
                            if (response.success) {
                                Swal.fire('Guardado', response.message, 'success');
                                boton.text(`${docenteSeleccionado.nombre} ${docenteSeleccionado.apellido}`); // Actualizar el botón con el nuevo docente
                                recargarPlanillaHorarios(nombreGrupo, grado); // Recargar la planilla de horarios
                            } else {
                                Swal.fire('Error', response.message || 'No se pudo guardar el docente.', 'error');
                            }
                        },
                        error: function() {
                            Swal.fire('Error', 'Hubo un problema al guardar el docente.', 'error');
                        }
                    });
                }
            });
        },
        error: function() {
            Swal.fire('Error', 'No se pudieron obtener los docentes.', 'error');
        }
    });
}

// Event listener para el botón de añadir asignatura
$(document).on('click', '#btnAgregarAsignatura', mostrarListaAsignaturas);

function fusionarCeldasDuplicadas(tabla) {
    // Iterar sobre cada fila del cuerpo de la tabla clonada
    tabla.find('tbody tr').each(function() {
        let prevCell = null; // Para almacenar la celda previa
        let colspan = 1; // Colspan inicial

        $(this).find('td:not(.tr_first)').each(function() {
            const currentCell = $(this); // Celda actual
            const currentText = currentCell.text().trim(); // Texto sin espacios extras

            // Si esta celda es igual a la anterior y no está vacía
            if (prevCell && prevCell.text().trim() === currentText && currentText !== '') {
                colspan++; // Incrementar el colspan
                currentCell.remove(); // Eliminar la celda actual
                prevCell.attr('colspan', colspan); // Ajustar el colspan en la celda previa
            } else {
                // Reiniciar si no coincide
                prevCell = currentCell;
                colspan = 1;
            }
        });
    });
}

async function grupos() {
    try {
        deseleccionar();
        grupo = true;
        seleccionarOpcion();

        $("#menu").empty(); // Limpia el menú
        $(document).off('input change', '#filtroForm input, #filtroForm select'); // Elimina eventos anteriores

        let grupos = await getAll(); // Carga los datos iniciales

        if (Array.isArray(grupos)) {
            let filtro = `
                <div id="filtro">
                    <form id="filtroForm" onsubmit="aplicarFiltroGrupo(event); return false">
                        <div>
                            <label>Orden: </label>
                            <select id="filtroOrden">
                                <option value="nombre asc">Nombre: A - Z</option>
                                <option value="nombre desc">Nombre: Z - A</option>
                            </select>
                        </div>
                        <div>
                            <label>Nombre: </label>
                            <input id="filtroNombre" type="text">
                        </div>
                        <div>
                            <label>Grado: </label>
                            <input id="filtroGrado" type="number">
                        </div>
                    </form>
                </div>`;

            $("#menu").append(filtro);

            // Reasignar eventos al filtro actual
            $(document).on('input change', '#filtroForm input, #filtroForm select', function() {
                aplicarFiltroGrupo({ preventDefault: () => {} });
            });

            aplicarFiltroGrupo({ preventDefault: () => {} }); // Aplicar el filtro inicial
        } else {
            console.error("La respuesta no es un array válido.");
        }
    } catch (error) {
        console.error("Error al procesar los grupos:", error);
    }
}

async function aplicarFiltroGrupo(event) {
    try {

        event.preventDefault();

        let filtro = {
            orden: $("#filtroOrden").val(),
            nombre: $("#filtroNombre").val(),
            grado: $("#filtroGrado").val(),
            opcion: opcion
        };
        console.log(filtro);

        let grupos = await getGruposFiltrados(filtro);

        // Verifica si grupos es un array antes de usarlo
        if (Array.isArray(grupos)) {
            $("#menu .perfilGrupo").remove(); // Elimina solo los perfiles actuales
            mostrarGrupos(grupos); // Muestra los nuevos perfiles filtrados
        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

async function asignaturas() {
    try {
        deseleccionar();
        asignatura = true;
        seleccionarOpcion();

        $("#menu").empty(); // Limpia el menú actual
        $(document).off('input change', '#filtroForm input, #filtroForm select'); // Elimina eventos anteriores

        let data = await getAll(); // Obtiene las asignaturas iniciales

        if (Array.isArray(data)) {
            let filtro = `
                <div id="filtro">
                    <form id="filtroForm" onsubmit="aplicarFiltroAsignaturas(event); return false">
                        <div>
                            <label>Orden: </label>
                            <select id="filtroOrden">
                                <option value="nombre asc">Nombre: A - Z</option>
                                <option value="nombre desc">Nombre: Z - A</option>
                            </select>
                        </div>
                        <div>
                            <label>Nombre: </label>
                            <input id="filtroNombre" type="text">
                        </div>
                    </form>
                </div>`;

            $("#menu").append(filtro);

            $(document).on('input change', '#filtroForm input, #filtroForm select', function() {
                aplicarFiltroAsignaturas({ preventDefault: () => {} });
            });

            aplicarFiltroAsignaturas({ preventDefault: () => {} }); // Aplicar filtro inicial
        } else {
            console.error("La respuesta no es un array válido.");
        }
    } catch (error) {
        console.error("Error al procesar las asignaturas:", error);
    }
}

async function aplicarFiltroAsignaturas(event) {
    try {
        event.preventDefault();

        let filtro = {
            orden: $("#filtroOrden").val(),
            nombre: $("#filtroNombre").val(),
            opcion: opcion // Debe ser "Asignatura"
        };

        let asignaturas = await getAsignaturasFiltradas(filtro); // Llama al endpoint correspondiente

        if (Array.isArray(asignaturas)) {
            $("#menu .perfilAsignatura").remove(); // Limpia las asignaturas actuales
            mostrarAsignaturas(asignaturas); // Muestra las asignaturas filtradas
        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al aplicar filtro a las asignaturas:", error);
    }
}

function mostrarAsignaturas(asignaturas) {
    let perfil;

    perfil = "<div id='añadirAsignatura' class='perfilAsignatura opcion'>";
    perfil += "<div style='display: flex;height: 100%;width: 100%;align-items: center;justify-content: center;margin: 0;padding: 0;'>";
    perfil += "<p class='negrita' style='font-size: 80px;'>+</p>";
    perfil += "</div></div>";

    $("#menu").append(perfil);
    $("#añadirAsignatura").on('click', añadirAsignatura);

    asignaturas.forEach(asignatura => {
        perfil = "<div class='perfilAsignatura'>";
        perfil += `<p class='negrita'>${asignatura.nombre}</p>`;
        perfil += `<div><button class='editarAsignatura' data-nombre='${asignatura.nombre}'>Editar</button></div>`;
        perfil += "</div>";

        $("#menu").append(perfil);
    });

    $(".editarAsignatura").on("click", editarAsignatura);
}

function añadirAsignatura() {
    Swal.fire({
        title: 'Añadir Asignatura',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
        `,
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value.trim();
            if (!nombre) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }
            return { nombre };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombre } = result.value;
            $.ajax({
                url: 'insertarAsignatura.php',
                type: 'POST',
                dataType: "json",
                data: { nombre },
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Asignatura añadida', '', 'success');
                        asignaturas(); // Recargar asignaturas
                    } else {
                        Swal.fire('Error', response.message, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo añadir la asignatura.', 'error');
                }
            });
        }
    });
}

function editarAsignatura(event) {
    const nombreActual = $(event.target).data('nombre'); // Nombre actual de la asignatura
    Swal.fire({
        title: 'Editar Asignatura',
        html: `
            <input id="nombreNuevo" class="swal2-input" placeholder="Nuevo Nombre" value="${nombreActual}">
        `,
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const nombreNuevo = Swal.getPopup().querySelector('#nombreNuevo').value.trim();
            if (!nombreNuevo) {
                Swal.showValidationMessage(`Por favor, complete todos los campos`);
                return false;
            }
            return { nombreActual, nombreNuevo };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { nombreActual, nombreNuevo } = result.value;
            $.ajax({
                url: 'editarAsignatura.php',
                type: 'POST',
                dataType: "json",
                data: { nombre: nombreActual, nombreNuevo },
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Asignatura actualizada', '', 'success');
                        asignaturas();
                    } else {
                        Swal.fire('Error', response.message, 'error');
                    }
                },
                error: function() {
                    Swal.fire('Error', 'No se pudo actualizar la asignatura.', 'error');
                }
            });
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

    // Listener para el botón #Usuarios
    $("#Usuarios").on('click', async() => {
        if (!bloqueado) { // Verifica si el bloqueo está activo
            bloqueado = true; // Activa el bloqueo
            try {
                await usuarios(); // Ejecuta la función
            } finally {
                bloqueado = false; // Libera el bloqueo después de finalizar
            }
        }
    });

    // Listener para el botón #Asignaturas
    $("#Asignaturas").on('click', async() => {
        if (!bloqueado) { // Verifica si el bloqueo está activo
            bloqueado = true; // Activa el bloqueo
            try {
                await asignaturas(); // Ejecuta la función
            } finally {
                bloqueado = false; // Libera el bloqueo después de finalizar
            }
        }
    });
});