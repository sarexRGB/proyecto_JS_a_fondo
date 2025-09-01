import { getSolicitudes } from "../services/crudSolicitudes.js";

const tabla = document.getElementById("solicitudesTable");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");
const pendientesBtn = document.getElementById("pendientesBtn");

let solicitudesCache = [];

// Redirección a pag con solicitudes pendientes //
pendientesBtn.addEventListener("click", () => {
    window.location.replace("../pages/admin.html");
});

// Logout //
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.replace("../pages/login.html");
});

// Renderizar solicitudes //
async function renderSolicitudes(filtro = "") {
    if (solicitudesCache.length === 0) {
        solicitudesCache = await getSolicitudes();
    }

    tabla.innerHTML = "";

   const filtradas = solicitudesCache.filter(s =>
        s.nombre.toLowerCase().includes(filtro) ||
        s.sede.toLowerCase().includes(filtro) ||
        s.estado.toLowerCase().includes(filtro)
    );

    filtradas.forEach(s => {
        const fila = document.createElement("tr");
        fila.dataset.nombre = s.nombre;
        fila.dataset.sede = s.sede;
        fila.dataset.estado = s.estado;
        fila.innerHTML = `
            <td>${s.nombre}</td>
            <td>${s.sede}</td>
            <td>${s.estado}</td>
        `;
        fila.solicitud = s;
        tabla.appendChild(fila);
    });
};

tabla.addEventListener("click", async (e) => {
    const fila = e.target.closest("tr");
    if (!fila || !fila.solicitud) return;

    const s = fila.solicitud;

    Swal.fire({
        title: `📋 Solicitud de ${s.nombre}`,
        html: `
            <p><b>Sede:</b> ${s.sede}</p>
            <p><b>Salida:</b> ${s.salida}</p>
            <p><b>Regreso:</b> ${s.regreso}</p>
            <p><b>Código PC:</b> ${s.codigo}</p>
            <p><b>Estado:</b> ${s.estado}</p>
            <p><b>Fecha Solicitud:</b> ${new Date(s.fechaSolicitud).toLocaleString()}</p>
        `,
        icon: "info",
        confirmButtonText: "Cerrar"
    });
});

// Buscador //
searchInput.addEventListener("input", () => {
    renderSolicitudes(searchInput.value.toLowerCase());
});

renderSolicitudes()

