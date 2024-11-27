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
        data: {
            res: 1
        },
        success: function(response) {
            console.log(response);
            personal = JSON.parse(response);
            conectado = true;
        }
    })
}

function login(event) {
    event.preventDefault()

    let ci = $("#ci").val();
    let contra = $("#contra").val();
    let ingreso = 0;

    for (let i = 0; i < personal.length; i++) {
        if (personal[i].ci === ci && personal[i].contrasena === contra) {
            window.location.href = "pagina.php";
            return;
        } else {
            ingreso = ingreso + 1;
        }

        if (ingreso == personal.length) {
            alert("Cédula o contraseña incorrectos.");
        }
    }
}