// Datos ficticios de usuarios
const usuarios = [
    { username: "admin", password: "1234" },
    { username: "usuario", password: "pass123" }
];

// Manejar el formulario de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('usuario').value;
    const password = document.getElementById('contraseña').value;
    const errorMessage = document.getElementById('error-mensaje');

    // Verificar si el usuario existe
    const usuarioValido = usuarios.find(user => user.username === username && user.password === password);

    if (usuarioValido) {
        window.location.href = "pages/matriz.html"; // Redirecciona a la matriz de riesgo
    } else {
        errorMessage.textContent = "Usuario o contraseña incorrectos";
        errorMessage.style.display = 'block';
    }
});
