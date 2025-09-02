import { getSolicitudes, updateSolicitud } from "../services/crudSolicitudes.js";

const profesoresBtn = document.getElementById("profesoresBtn");
const logoutBtn = document.getElementById("logoutBtn");
const solicitudesTable = document.getElementById("solicitudesTable");

const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario || usuario.tipo.toLowerCase() !== "administrador") {
    Swal.fire("⚠️ Acceso denegado", "No tienes permisos para acceder a esta página", "error")
        .then(() => window.location.replace("../pages/login.html"));
}

profesoresBtn.addEventListener("click", () => {
    window.location.replace("../pages/adminProfesores.html");
})

async function cargarSolicitudes() {
    try {
        const solicitudes = await getSolicitudes();
        solicitudesTable.innerHTML = "";

        if (!solicitudes || solicitudes.length === 0) {
            solicitudesTable.innerHTML = `<tr><td colspan="4">No hay solicitudes disponibles</td></tr>`;
            return;
        }

        solicitudes.forEach(solicitud => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Nombre">${solicitud.nombre}</td>
                <td data-label="Sede">${solicitud.sede}</td>
                <td data-label="Estado">${solicitud.estado}</td>
                <td data-label="Acciones">
                    <button class="aceptarBtn" data-id="${solicitud.id}">Aceptar</button>
                    <button class="rechazarBtn" data-id="${solicitud.id}">Rechazar</button>
                </td>
            `;
            solicitudesTable.appendChild(tr);
        });

        const aceptarBtns = document.getElementsByClassName("aceptarBtn");
        const rechazarBtns = document.getElementsByClassName("rechazarBtn");

        Array.from(aceptarBtns).forEach(btn => {
            btn.addEventListener("click", () => {
                const idSolicitud = btn.dataset.id;
                cambiarEstado(idSolicitud, "Aceptada");
            });
        });

        Array.from(rechazarBtns).forEach(btn => {
            btn.addEventListener("click", () => {
                const idSolicitud = btn.dataset.id;
                cambiarEstado(idSolicitud, "Rechazada");
            });
        });

    } catch (error) {
        console.error("Error cargando solicitudes:", error);
        Swal.fire("❌ Error", "No se pudieron cargar las solicitudes", "error");
    }
}

cargarSolicitudes();

async function cambiarEstado(id, nuevoEstado) {
    const confirm = await Swal.fire({
        title: `¿Deseas ${nuevoEstado.toLowerCase()} esta solicitud?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
        try {
            await updateSolicitud(id, { estado: nuevoEstado });
            Swal.fire("✅ Hecho", `Solicitud ${nuevoEstado.toLowerCase()}`, "success");
            cargarSolicitudes();
        } catch (error) {
            console.error("Error actualizando solicitud:", error);
            Swal.fire("❌ Error", "No se pudo actualizar la solicitud", "error");
        }
    }
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.replace("../pages/login.html");
})
