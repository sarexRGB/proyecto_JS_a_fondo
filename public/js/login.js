import { postUser, loginUser } from "../services/crudUser.js";

const correo = document.getElementById("correo");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signUpBtn = document.getElementById("signUpBtn");

loginBtn.addEventListener("click", async () => {
    const correoVal = correo.value.trim();
    const passwordVal = password.value.trim();

    if (!correoVal || !passwordVal) {
        Swal.fire("⚠️ Campos vacíos", "Debes llenar todos los campos", "warning");
        return;
    }

    const user = await loginUser(correoVal, passwordVal);

   if (user) {
    localStorage.setItem("usuario", JSON.stringify(user));
    
    Swal.fire("✅ Bienvenido", `Hola ${user.nombre}`, "success");

    if (user.tipo === "Administrador") {
        window.location.href = "./pages/admin.html";
    } else {
        window.location.href = "./pages/home.html";
    }
    } else {
    Swal.fire("❌ Error", "Correo o contraseña incorrectos", "error");
    }
})

signUpBtn.addEventListener("click", function () {
    Swal.fire({
        title: "Regístrate aquí",
        html: `
            <label for="nombre">Nombre</label>
            <input type="text" name="nombre" id="swal-nombre" required>
            <br>
            <label for="correo">Correo</label>
            <input type="email" name="correo" id="swal-correo"required>
            <br>
            <label for="password">Contraseña</label>
            <input type="password" name="password" id="swal-password">
        `,
        confirmButtonText: "Registrar",
        showCancelButton: true,
        customClass: {

        },
        preConfirm: () =>{
            return {
               nombre: document.getElementById("swal-nombre").value.trim(),
               correo: document.getElementById("swal-correo").value.trim(),
               password: document.getElementById("swal-password").value.trim(),
               tipo: "Estudiante"
            };
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