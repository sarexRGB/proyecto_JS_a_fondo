import { getSolicitudesPendientes, updateSolicitud } from "../services/crudSolicitudes.js";

const tabla = document.getElementById("solicitudesTable");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");
const historialBtn = document.getElementById("historialBtn");

// Redirección a pag con Historial de Solicitudes //
historialBtn.addEventListener("click", () => {
    window.location.replace("../pages/historial.html")
})

// Logout //
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.replace("../pages/login.html");
});

// renderización de solicitude pendientes //
async function renderSolicitudes(filtro = "") {
    const solicitudes = await getSolicitudesPendientes();
    tabla.innerHTML = "";

    const filtradas = solicitudes.filter(s =>
        s.nombre.toLowerCase().includes(filtro) ||
        s.sede.toLowerCase().includes(filtro) ||
        s.codigo.toLowerCase().includes(filtro)
    );

    // En caso de no haber Solicitudes Pendientes se muestra un mensaje //
    if (filtradas.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px; color:white;">
                    No hay Solicitudes Pendientes
                </td>
            </tr>
        `;
        return;
    }

    // Datos a mostrar //
    filtradas.forEach(s => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td data-label="Nombre">${s.nombre}</td>
            <td data-label="Sede">${s.sede}</td>
            <td data-label="Salida">${s.salida}</td>
            <td data-label="Regreso">${s.regreso}</td>
            <td data-label="Código">${s.codigo}</td>
            <td data-label="Estado">${s.estado}</td>
            <td data-label="Acciones">
                <button class="aproveBtn" data-id="${s.id}">Aprobar</button>
                <button class="reyectBtn" data-id="${s.id}">Rechazar</button>
            </td>
        `;
        tabla.appendChild(fila);
    
    });

    // Aprovar Solicitud //
    const aproveBtns = document.getElementsByClassName("aproveBtn");
    for (const btn of aproveBtns) {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            await updateSolicitud(id, { estado: "Aprobada" });
            Swal.fire("✅ Solicitud aprobada", "El usuario ya puede retirar la computadora.", "success");
            renderSolicitudes(searchInput.value.toLowerCase());
        };
    }

    // Rechazar Solicitud //
    const reyectBtns = document.getElementsByClassName("reyectBtn");
    for (const btn of reyectBtns) {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            await updateSolicitud(id, { estado: "Rechazada" });
            Swal.fire("❌ Solicitud rechazada", "El usuario fue notificado del rechazo.", "error");
            renderSolicitudes(searchInput.value.toLowerCase());
        };
    }
}

// Buscador //
searchInput.addEventListener("input", () => {
    renderSolicitudes(searchInput.value.toLowerCase());
});

renderSolicitudes();

