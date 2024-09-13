let conectado = false;

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

function getAll() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'obtenertodoPersonal.php',
            type: 'POST',
            dataType: "json",
            data: {
                res: 1
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

function login(event) {
    event.preventDefault();

    let ci = $("#ci").val();
    let contra = $("#contra").val();

    $.ajax({
        url: 'login.php',
        type: 'POST',
        dataType: "json",
        data: {
            ci: ci,
            contra: contra
        },
        success: function(response) {
            if (response.success) {
                // Redirigir a la página después de un login exitoso
                window.location.href = "pagina.php";
            } else {
                alert("Cédula o contraseña incorrectos.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error en la solicitud AJAX:", status, error);
            alert("Hubo un error al intentar obtener los datos. Por favor, inténtelo de nuevo más tarde.");
        }
    });
}

async function usuarios() {
    try {
        let personal = await getAll(); // Espera la resolución de getAll() y recibe el JSON
        console.log(personal.length); // Imprime el tamaño del JSON en la consola

        // Verifica si personal es un array antes de usarlo
        if (Array.isArray(personal)) {
            for (let i = 0; i < personal.length; i++) {

                let perfil = "<div class='perfil'>";
                perfil += "<p>" + personal[i].nombre + " " + personal[i].apellido + "</p>";
                perfil += "<p>Cédula: " + personal[i].ci + "</p>";
                perfil += "<p>Teléfono: " + personal[i].telefono + "</p>";
                perfil += "<p>Email: " + personal[i].email + "</p>";
                perfil += "<p>Rol: " + personal[i].rol + "</p>";
                perfil += "</div>";
                $("#menu").append(perfil);
            }
        } else {
            console.error("La respuesta no es un array válido");
        }
    } catch (error) {
        console.error("Error al procesar los usuarios:", error);
    }
}

$(document).ready(function() {
    verificar();
});