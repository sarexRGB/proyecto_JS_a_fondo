import { postUser, loginUser } from "../services/crudUser.js";

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");

function redirigirUsuario(user) {
    if (user.tipo.toLowerCase() === "administrador") {
        window.location.replace("../pages/historial.html");
    } else {
        window.location.replace("../pages/home.html");
    }
}

// Login //
loginBtn.addEventListener("click", async () => {
    const correoVal = correo.value.trim();
    const passwordVal = password.value.trim();

    // Validar que no falten datos //
    if (!correoVal || !passwordVal) {
        Swal.fire("⚠️ Campos vacíos", "Debes llenar todos los campos", "warning");
        return;
    }

    try {
        const user = await loginUser(correoVal, passwordVal);

    // Guardar nombre de usuario en localStorage para usarlo luego //
        if (user) {
            localStorage.setItem("usuario", JSON.stringify(user));

            Swal.fire("✅ Bienvenido", `Hola ${user.nombre}`, "success").then(() => {
                redirigirUsuario(user);
            });
        } else {
            Swal.fire("❌ Error", "Correo o contraseña incorrectos", "error");
        }
    } catch (error) {
        console.error("Error en login:", error);
        Swal.fire("❌ Error", "Ocurrió un problema al iniciar sesión", "error");
    }
});

// Registro mostrado en popup de sweetAlert // 
signUpBtn.addEventListener("click", function () {
    Swal.fire({
        title: "Regístrate aquí",
        html: `
            <label for="nombre">Nombre</label>
            <br>
            <input type="text" name="nombre" id="swal-nombre" required>
            <br>
            <label for="correo">Correo</label>
            <br>
            <input type="email" name="correo" id="swal-correo"required>
            <br>
            <label for="password">Contraseña</label>
            <br>
            <input type="password" name="password" id="swal-password">
        `,
        confirmButtonText: "Registrar",
        showCancelButton: true,
        customClass: {
            popup: "swal-popup",
            title: "swal-title",
            confirmButton: "swal-confirm",
            cancelButton: "swal-cancel"
        },
        preConfirm: () => {
            const nombre = document.getElementById("swal-nombre").value.trim();
            const correo = document.getElementById("swal-correo").value.trim();
            const password = document.getElementById("swal-password").value.trim();

            if (!nombre || !correo || !password) {
                Swal.showValidationMessage("⚠️ Todos los campos son obligatorios");
                return false;
            }

            return { nombre, correo, password, tipo: "Estudiante" };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            postUser(result.value)
            .then(newUser => {
                Swal.fire("✅ Registrado", "Tu cuenta ha sido creada", "success");
                console.log("Usuario guardado:", newUser);
            })
            .catch(err => {
                Swal.fire("❌ Error", "No se pudo registrar", "error");
                console.error(err);
            });
        }
    });
});