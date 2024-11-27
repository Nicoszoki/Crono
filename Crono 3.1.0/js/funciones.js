let personal = [];
let conectado = false;

setInterval(verificar, 3000);

function verificar() {
    if (conectado == false) {
        $(".conectado").css("background-color", "red");
    } else {
        $(".conectado").css("background-color", "green");
    }
}

getAll();

function getAll() {
    $.ajax({
        url: 'obtenertodo.php',
        type: 'POST',
        dataType: "json",
        data: {
            res: 1
        },
        success: function(response) {
            console.log(response);
            personal = response;
            conectado = true;
        }
    })
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
            console.error("Error en la solicitud AJAX:", error);
            alert("Hubo un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.");
        }
    });
}