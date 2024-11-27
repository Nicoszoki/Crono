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

    // añadir usuario
    perfil = "<div id='añadirUsuario' class='perfilUsuario opcion'>";
    perfil += "<div style='display: flex;height: 100%;width: 100%;align-items: center;justify-content: center;margin: 0px;padding: 0px;'>";
    perfil += "<p class='negrita' style='font-size: 80px; margin: 0; padding: 0;'>+</p>";
    perfil += "</div></div>";

    $("#menu").append(perfil);

    $("#añadirUsuario").on('click', añadirUsuario)

    for (let i = 0; i < personal.length; i++) {
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
        perfil += "<img src='img/iconos/Eliminar.png' class='icono'>";
        perfil += "</div></div>";
        $("#menu").append(perfil);
    }

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
$(document).on('click', '.perfilUsuario .icono[src="img/iconos/Eliminar.png"]', darDeBajaUsuario);

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

    Swal.fire({
        title: '¿Estás seguro?',
        text: "El usuario será dado de baja lógicamente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud AJAX para la baja lógica
            $.ajax({
                url: 'darDeBajaUsuario.php',
                type: 'POST',
                dataType: 'json',
                data: { ci: ci },
                success: function(response) {
                    if (response.success) {
                        Swal.fire(
                            '¡Usuario dado de baja!',
                            'El usuario ha sido dado de baja exitosamente.',
                            'success'
                        );
                        usuarios(); // Actualizar la lista de usuarios después de la baja
                    } else {
                        Swal.fire('Error', 'No se pudo dar de baja al usuario.', 'error');
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

        {
            /* <div id="filtro">
                            <form id="filtroForm" onsubmit="aplicarFiltro(event); return false">
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
                                <div>
                                    <button type="submit">Filtrar</button>
                                </div>
                            </form>
                        </div> */
        }

        let personal = await getAll(); // Espera la resolución de getAll() y recibe el JSON

        // Verifica si personal es un array antes de usarlo
        if (Array.isArray(personal)) {

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroUsuario(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option><option value="apellido asc">Apellido: A - Z</option><option value="apellido desc">Apellido: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Apellido: </label><input id="filtroApellido" type="text"></div><div><label>Activo: </label><select id="filtroActivo"><option value="false">Sí</option><option value="true">No</option></select></div></form></div>';

            $(document).on('input change', '#filtroForm input, #filtroForm select', function() {
                aplicarFiltroUsuario({ preventDefault: () => {} });
            });

            $("#menu").append(filtro);

            aplicarFiltroUsuario({ preventDefault: () => {} });

        } else {
            console.error("La respuesta no es un array válido");
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
            <h2>${nombreGrupo} - Grado: ${grado}</h2>
        </div>
        <div id="planillaHorarios" style="display: flex; flex-direction: column;">
            <h3 style="display: flex; justify-content: center;">Planilla de Días y Horarios</h3>
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
                    <tr><td class="tr_first">Lunes</td>${"<td></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Martes</td>${"<td></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Miércoles</td>${"<td></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Jueves</td>${"<td></td>".repeat(10)}</tr>
                    <tr><td class="tr_first">Viernes</td>${"<td></td>".repeat(10)}</tr>
                </tbody>
            </table>
        </div>
    `;

    // Llamada AJAX para obtener las asignaturas del grupo
    $.ajax({
        url: 'obtenerAsignaturasDeGrupo.php',
        type: 'POST',
        dataType: 'json',
        data: {
            nombre_G: nombreGrupo,
            grado: grado
        },
        success: function(asignaturas) {
            let asignaturasHtml = `
                <div id="asignaturas">
                    <h3 style="display: flex; justify-content: center;">Asignaturas</h3>
                    <table id="tablaAsignaturas">
                        <thead>
                            <tr>
                                <th>Asignatura</th>
                                <th>Carga Horaria</th>
                                <th>Docente</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            if (asignaturas && asignaturas.length) {
                asignaturas.forEach(asignatura => {
                    asignaturasHtml += `
                        <tr>
                            <td>${asignatura.nombre}</td>
                            <td contenteditable="true" class="editable-carga-horaria" data-asignatura="${asignatura.nombre}">
                                ${asignatura.carga_horaria}
                            </td>
                            <td><button class="seleccionarDocente">Seleccionar Docente</button></td>
                        </tr>`;
                });
            }

            // Agrega el botón para añadir asignaturas
            asignaturasHtml += `
                <tr>
                    <td colspan="3">
                        <button id="btnAgregarAsignatura">Añadir Asignatura</button>
                    </td>
                </tr>
            `;

            asignaturasHtml += '</tbody></table></div>';

            $("#menu").append(planillaHorariosHtml + asignaturasHtml);

            // Detectar el inicio de la edición y guardar el valor original
            $(document).on('focus', '.editable-carga-horaria', function() {
                // Guardar el valor actual en data-original si no está ya establecido
                if (!$(this).attr('data-original')) {
                    $(this).attr('data-original', $(this).text().trim());
                }
            });

            // Detectar la edición de celdas con la clase .editable-carga-horaria
            $(document).on('keydown', '.editable-carga-horaria', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evitar el comportamiento predeterminado (moverse hacia abajo)
                    $(this).blur(); // Disparar el evento blur para dejar de editar
                }
            });

            // Detectar cuando se termina de editar una celda
            $(document).on('blur', '.editable-carga-horaria', function() {
                const nuevaCargaHoraria = $(this).text().trim();
                const asignatura = $(this).data('asignatura');

                // Validar que la nueva carga horaria sea un número válido
                if (isNaN(nuevaCargaHoraria) || nuevaCargaHoraria <= 0) {
                    Swal.fire('Error', 'Por favor, ingrese una carga horaria válida.', 'error');
                    $(this).text($(this).attr('data-original')); // Restaurar el valor original si es inválido
                    return;
                }

                // Realizar el update mediante AJAX
                $.ajax({
                    url: 'modificarCargaHoraria.php',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        asignatura: asignatura,
                        nuevaCargaHoraria: nuevaCargaHoraria,
                        nombre_G: nombreGrupo,
                        grado: grado
                    },
                    success: function(response) {
                        if (response.success) {
                            Swal.fire('Actualizado', 'La carga horaria se ha actualizado correctamente.', 'success');
                            $(this).attr('data-original', nuevaCargaHoraria); // Actualizar el valor original
                        } else {
                            Swal.fire('Error', 'Hubo un problema al actualizar la carga horaria.', 'error');
                        }
                    },
                    error: function() {
                        Swal.fire('Error', 'No se pudo actualizar la carga horaria.', 'error');
                    },
                });
            });

            $(document).on('click', '#btnAgregarAsignatura', function() {
                mostrarListaAsignaturas(nombreGrupo, grado);
            });
        },
        error: function() {
            console.error('Error al obtener las asignaturas.');
            Swal.fire('Error', 'No se pudo cargar la tabla de asignaturas.', 'error');
        }
    });
}

function mostrarListaAsignaturas(nombreGrupo, grado) {
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
                const penultimo = $('#tablaAsignaturas tbody tr').last().prev();
                const nuevaFila = `
                    <tr>
                        <td>${response.asignatura.nombre}</td>
                        <td contenteditable="true">${response.asignatura.carga_horaria}</td>
                        <td><button class="seleccionarDocente">Seleccionar Docente</button></td>
                    </tr>
                `;

                if (penultimo.length) {
                    penultimo.before(nuevaFila);
                } else {
                    // Si no hay suficientes filas, agregar normalmente al final
                    $('#tablaAsignaturas tbody').append(nuevaFila);
                }

                Swal.fire('Asignatura Añadida', 'La asignatura se ha añadido al grupo.', 'success');
            } else {
                Swal.fire('Error', 'Hubo un problema al añadir la asignatura.', 'error');
            }
        },
        error: function() {
            Swal.fire('Error', 'No se pudo añadir la asignatura al grupo.', 'error');
        }
    });
}

// Event listener para el botón de añadir asignatura
$(document).on('click', '#btnAgregarAsignatura', mostrarListaAsignaturas);

async function grupos() {
    try {

        deseleccionar();
        grupo = true;
        seleccionarOpcion();

        $("#menu").empty();

        let grupos = await getAll(); // Espera la resolución de getAll() y recibe el JSON

        // Verifica si grupos es un array antes de usarlo
        if (Array.isArray(grupos)) {

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroGrupo(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Grado: </label><input id="filtroGrado" type="number"></div></form></div>';

            $(document).on('input change', '#filtroForm input, #filtroForm select', function() {
                aplicarFiltroGrupo({ preventDefault: () => {} });
            });

            $("#menu").append(filtro);

            aplicarFiltroGrupo({ preventDefault: () => {} });

        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
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
});