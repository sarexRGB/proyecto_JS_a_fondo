import { getSolicitudes } from "../services/crudSolicitudes.js";

const historial = document.getElementById("historial");
const backBtn = document.getElementById("backBtn");

window.addEventListener("load", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        Swal.fire("Debes iniciar sesión primero");
        window.location.replace("../pages/login.html");
        return;
    }

    try {
        const solicitudes = await getSolicitudes();
        const misSolicitudes = solicitudes.filter(s => s.nombre === usuario.nombre);

        if (misSolicitudes.length === 0) {
            historial.innerHTML = "<p>No tienes solicitudes registradas.</p>";
            return;
        }

        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Salida</th>
                    <th>Regreso</th>
                    <th>Fecha de Solicitud</th>
                </tr>
            </thead>
            <tbody>
                ${misSolicitudes.map(s => `
                    <tr>
                        <td>${s.codigo}</td>
                        <td>${s.salida}</td>
                        <td>${s.regreso}</td>
                        <td>${new Date(s.fechaSolicitud).toLocaleDateString()}</td>
                    </tr>
                `).join("")}
            </tbody>
        `;
        historial.appendChild(table);

        const filas = table.querySelectorAll("tbody tr");
        filas.forEach((fila, index) => {
            fila.addEventListener("click", () => {
                const s = misSolicitudes[index];
                let icon = "info";

                if (s.estado.toLowerCase() === "aprobada") icon = "success";
                else if (s.estado.toLowerCase() === "rechazada") icon = "error";

                Swal.fire({
                    title: `📋 Solicitud de ${s.nombre}`,
                    html: `
                        <p><b>Código:</b> ${s.codigo}</p>
                        <p><b>Sede:</b> ${s.sede}</p>
                        <p><b>Salida:</b> ${s.salida}</p>
                        <p><b>Regreso:</b> ${s.regreso}</p>
                        <p><b>Estado:</b> ${s.estado}</p>
                        <p><b>Fecha Solicitud:</b> ${new Date(s.fechaSolicitud).toLocaleString()}</p>
                    `,
                    icon: icon,
                    confirmButtonText: "Cerrar"
                });
            });
        });

    } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        historial.innerHTML = "<p>Ocurrió un error al cargar tus solicitudes.</p>";
    }
});

backBtn.addEventListener("click", () => {
    window.location.href = "../pages/home.html";
});
