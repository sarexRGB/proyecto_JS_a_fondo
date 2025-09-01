import { sendSolicitud, getSolicitudes } from "../services/crudSolicitudes.js";

const nombre = document.getElementById("nombre");
const sede = document.getElementById("sede");
const salida = document.getElementById("salida");
const regreso = document.getElementById("regreso");
const codigo = document.getElementById("codigo");
const checkBox = document.getElementById("acceptConditions");
const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Cargar nombre de usuario guardado en locaStorage al iniciar sesión //
window.addEventListener("load", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        nombre.value = usuario.nombre;
        nombre.readOnly = true;
        document.getElementById("saludoUsuario").textContent = `👋 Hola, ${usuario.nombre}`;
    } else {
        alert("Debes iniciar sesión primero");
        window.location.replace("../pages/login.html");
    }
});

// Enviar Solicitud //
sendBtn.addEventListener("click", async () => {
    const nombreVal = nombre.value.trim();
    const sedeVal = sede.value;
    const salidaVal = salida.value;
    const regresoVal = regreso.value;
    const codigoVal = codigo.value.trim();
    const acceptConditions = checkBox.checked;

    // Validar que no falten datos //
    if (!nombreVal || !sedeVal || !salidaVal || !regresoVal || !codigoVal) {
        Swal.fire("⚠️ Por favor completa todos los campos.")
        return;
    };

    // Validar que la fecha de regreso del equipo sea despues de la fecha de salida //
     if (new Date(regresoVal) <= new Date(salidaVal)) {
        Swal.fire("⚠️ La fecha de regreso debe ser posterior a la fecha de salida.");
        return;
    }

    if (!acceptConditions) {
        Swal.fire("⚠️ Debes aceptar las condiciones antes de enviar.");
        return;
    };

    // Validar que el equipo esté disponible //
     try {
        const solicitudesExistentes = await getSolicitudes();
        const codigoDuplicado = solicitudesExistentes.some(s => s.codigo === codigoVal && s.estado === "Pendiente");
        if (codigoDuplicado) {
            Swal.fire("⚠️ Este código de computadora ya tiene una solicitud pendiente.");
            return;
        }
    } catch (error) {
        console.error("Error al validar código:", error);
        Swal.fire("❌ Ocurrió un error al validar la solicitud");
        return;
    }

    // Creación de objeto guardado en bd.json //
    const solicitud = {
        nombre: nombreVal,
        sede: sedeVal,
        salida: salidaVal,
        regreso: regresoVal,
        codigo: codigoVal,
        estado: "Pendiente",
        fechaSolicitud: new Date().toISOString()

    };

    try {
        const newsolicitud = await sendSolicitud(solicitud);
        console.log("Solicitud enviada");
        Swal.fire("✅ Formulario enviado correctamente");

        // Limpiar datos luego de enviar Solicitud //
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

// Logout //
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.replace("../pages/login.html");
})