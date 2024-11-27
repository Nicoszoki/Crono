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
            console.log(response);
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
        onBeforeOpen: () => {
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
    for (let i = 0; i < personal.length; i++) {

        let perfil = "<div class='perfilUsuario'>";
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
        perfil += "</div>";
        perfil += "</div>";
        $("#menu").append(perfil);
    }
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

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroUsuario(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option><option value="apellido asc">Apellido: A - Z</option><option value="apellido desc">Apellido: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Apellido: </label><input id="filtroApellido" type="text"></div><div><label>Activo: </label><select id="filtroActivo"><option value="false">Sí</option><option value="true">No</option></select></div><div><button type="submit">Filtrar</button></div></form></div>';

            $("#menu").append(filtro);

            mostrarPerfiles(personal);

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

        console.log(filtro);

        let personal = await getUsuariosFiltrados(filtro);

        console.log(personal.length); // Imprime el tamaño del JSON en la consola

        // Verifica si personal es un array antes de usarlo
        if (Array.isArray(personal)) {

            $("#menu").empty();

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroUsuario(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option><option value="apellido asc">Apellido: A - Z</option><option value="apellido desc">Apellido: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Apellido: </label><input id="filtroApellido" type="text"></div><div><label>Activo: </label><select id="filtroActivo"><option value="false">Sí</option><option value="true">No</option></select></div><div><button type="submit">Filtrar</button></div></form></div>';

            $("#menu").append(filtro);

            mostrarPerfiles(personal);

        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

function mostrarGrupos(grupos) {
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

async function grupos() {
    try {

        deseleccionar();
        grupo = true;
        seleccionarOpcion();

        $("#menu").empty();

        let grupos = await getAll(); // Espera la resolución de getAll() y recibe el JSON

        // Verifica si grupos es un array antes de usarlo
        if (Array.isArray(grupos)) {

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroGrupo(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Grado: </label><input id="filtroGrado" type="number"></div><div><button type="submit">Filtrar</button></div></form></div>';

            $("#menu").append(filtro);

            mostrarGrupos(grupos);

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

        console.log(filtro);

        let grupos = await getGruposFiltrados(filtro);

        console.log(grupos.length); // Imprime el tamaño del JSON en la consola

        // Verifica si grupos es un array antes de usarlo
        if (Array.isArray(grupos)) {

            $("#menu").empty();

            let filtro = '<div id="filtro"><form id="filtroForm" onsubmit="aplicarFiltroGrupo(event);return false"><div><label>Orden: </label><select id="filtroOrden"><option value="nombre asc">Nombre: A - Z</option><option value="nombre desc">Nombre: Z - A</option></select></div><div><label>Nombre: </label><input id="filtroNombre" type="text"></div><div><label>Grado: </label><input id="filtroGrado" type="number"></div><div><button type="submit">Filtrar</button></div></form></div>';

            $("#menu").append(filtro);

            mostrarGrupos(grupos);

        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

// Variables para bloquear la ejecución
let bloqueadoUsuarios = false;
let bloqueadoGrupos = false;

$(document).ready(function() {
    verificar();

    // Listener para el botón #Grupos
    $("#Grupos").on('click', async() => {
        if (!bloqueadoGrupos) { // Verifica si el botón está bloqueado
            bloqueadoGrupos = true; // Bloquea el botón
            try {
                await grupos(); // Ejecuta la función
            } finally {
                bloqueadoGrupos = false; // Libera el botón después de finalizar
            }
        }
    });

    // Listener para el botón #Usuarios
    $("#Usuarios").on('click', async() => {
        if (!bloqueadoUsuarios) { // Verifica si el botón está bloqueado
            bloqueadoUsuarios = true; // Bloquea el botón
            try {
                await usuarios(); // Ejecuta la función
            } finally {
                bloqueadoUsuarios = false; // Libera el botón después de finalizar
            }
        }
    });
});