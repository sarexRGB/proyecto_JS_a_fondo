import { sendSolicitud } from "../services/crudSolicitudes.js";

const nombre = document.getElementById("nombre");
const sede = document.getElementById("sede");
const salida = document.getElementById("salida");
const regreso = document.getElementById("regreso");
const codigo = document.getElementById("codigo");
const checkBox = document.getElementById("acceptConditions");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

window.addEventListener("load", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        nombre.value = usuario.nombre;
        nombre.readOnly = true;
        document.getElementById("saludoUsuario").textContent = `👋 Hola, ${usuario.nombre}`;
    } else {
        alert("Debes iniciar sesión primero");
        window.location.href = "../pages/login.html";
    }
});

sendBtn.addEventListener("click", async () => {
    const nombreVal = nombre.value.trim();
    const sedeVal = sede.value;
    const salidaVal = salida.value;
    const regresoVal = regreso.value;
    const codigoVal = codigo.value.trim();
    const acceptConditions = checkBox.checked;

    if (!nombreVal || !sedeVal || !salidaVal || !regresoVal || !codigoVal) {
        Swal.fire("⚠️ Por favor completa todos los campos.")
        return;
    };

    if (!acceptConditions) {
        Swal.fire("⚠️ Debes aceptar las condiciones antes de enviar.");
        return;
    };

    const solicitud = {
        nombre: nombreVal,
        sede: sedeVal,
        salida: salidaVal,
        regreso: regresoVal,
        codigo: codigoVal,
        condicion: "Pendiente",
        condicionesAceptadas: true
    };

    try {
        const newsolicitud = await sendSolicitud(solicitud);
        console.log("Solicitud enviada");
        Swal.fire("✅ Formulario enviado correctamente");

        sede.value = "";
        salida.value = "";
        regreso.value = "";
        codigo.value = "";
        checkBox.checked = false;

    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        Swal.fire("❌ Ocurrió un error al enviar la solicitud");
    }
});

logoutBtn.addEventListener("click", () => {
    window.location.href = "../pages/login.html";
})