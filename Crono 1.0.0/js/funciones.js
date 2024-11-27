const usuarios = {
    "Nicolas": "12345",
    "Maria": "abcde",
    "Juan": "password",
    "Ana": "qwerty",
    "Luis": "letmein"
};

function login(event) {
    event.preventDefault()

    let nom = document.getElementById("nombre").value;
    let contra = document.getElementById("contraseña").value;

    if (usuarios[nom] && usuarios[nom] === contra) {
        alert("¡Ingresaste!");
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}