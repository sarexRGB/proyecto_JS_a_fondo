import { postUser, loginUser } from "../services/crudUser.js";

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");

function redirigirUsuario(user) {
    if (user.tipo.toLowerCase() === "profesor") {
        window.location.replace("../pages/historialProfesor.html");
    } else if (user.tipo.toLowerCase() === "estudiante") {
        window.location.replace("../pages/home.html");
    } else {
        window.location.replace("../pages/admin.html")
    }
}

// Login //
loginBtn.addEventListener("click", async () => {
    const correoVal = correo.value.trim();
    const passwordVal = password.value.trim();
    const correoRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    // Validar que no falten datos //
    if (!correoVal || !passwordVal) {
        Swal.fire("⚠️ Campos vacíos", "Debes llenar todos los campos", "warning");
        return;
    }

    // Validar formato de correo //
     if (!correoRegex.test(correoVal)) {
        Swal.fire("⚠️ Correo inválido", "Por favor ingresa un correo válido", "warning");
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
            const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

            if (!nombre || !correo || !password) {
                Swal.showValidationMessage("⚠️ Todos los campos son obligatorios");
                return false;
            }

            if (!correoRegex.test(correo)) {
                Swal.showValidationMessage("⚠️ Ingresa un correo válido");
                return false;
            }

            if (!passwordRegex.test(password)) {
                Swal.showValidationMessage("⚠️ La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número");
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