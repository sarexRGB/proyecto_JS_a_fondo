import { getProfesores, postUser, deleteUser } from "../services/crudUser.js";

const backBTn = document.getElementById("backBtn");
const addProfesorBtn = document.getElementById("addProfesorBtn");
const profesoresTable = document.getElementById("profesoresTable");
const logoutBtn = document.getElementById("logoutBtn");

backBTn.addEventListener("click", () => {
    window.location.replace("../pages/admin.html");
});

addProfesorBtn.addEventListener("click", () => {
    Swal.fire({
        title: "Agregar Profesor",
         html: `
            <label>Nombre</label>
            <input type="text" id="swal-nombre" required>
            <br>
            <label>Sede</label>
            <select id="swal-sede" required>
                <option value="">--Selecciona una sede--</option>
                <option value="Capri">Capri</option>
                <option value="Puntarenas">Puntarenas</option>
            </select>
            <label>Correo</label>
            <input type="email" id="swal-correo" required>
            <br>
            <label>Contraseña</label>
            <input type="password" id="swal-password" required>
        `,
        confirmButtonText: "Registrar",
        showCancelButton: true,
        preConfirm: () => {
            const nombre = document.getElementById("swal-nombre").value.trim();
            const correo = document.getElementById("swal-correo").value.trim();
            const password = document.getElementById("swal-password").value.trim();
            const sede = document.getElementById("swal-sede").value;

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!nombre || !correo || !password || !sede) {
                Swal.showValidationMessage("Todos los campos son obligatorios");
                return false;
            }
            if (!emailRegex.test(correo)) {
                Swal.showValidationMessage("Correo no válido");
                return false;
            }

            return { nombre, correo, password, tipo: "Profesor", sede };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await postUser(result.value);
                Swal.fire("✅ Profesor agregado", "El profesor ha sido registrado correctamente", "success");
                cargarProfesores();
            } catch (error) {
                console.error("Error al agregar profesor:", error);
                Swal.fire("❌ Error", "No se pudo agregar el profesor", "error");
            }
        }
    });
});

async function cargarProfesores() {
    try {
        const profesores = await getProfesores();
        profesoresTable.innerHTML = "";

        if (!profesores || profesores.length === 0) {
            profesoresTable.innerHTML = `<tr><td colspan="4">No hay profesores registrados</td></tr>`;
            return;
        }

        profesores.forEach(profesor => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td data-label="Nombre">${profesor.nombre}</td>
                <td data-label="Correo">${profesor.correo}</td>
                <td data-label="Acciones">
                    <button class="eliminarBtn" data-id="${profesor.id}">Eliminar</button>
                </td>
            `;
            profesoresTable.appendChild(tr);
        });

        const eliminarBtns = document.getElementsByClassName("eliminarBtn");
        Array.from(eliminarBtns).forEach(btn => {
            btn.addEventListener("click", async () => {
                const idProfesor = btn.dataset.id;

                const confirm = await Swal.fire({
                    title: "¿Deseas eliminar a este profesor?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí",
                    cancelButtonText: "Cancelar"
                });

                if (confirm.isConfirmed) {
                    try {
                        await deleteUser(idProfesor);
                        Swal.fire("✅ Eliminado", "El profesor ha sido eliminado", "success");
                        cargarProfesores();
                    } catch (error) {
                        console.error("Error al eliminar profesor:", error);
                        Swal.fire("❌ Error", "No se pudo eliminar el profesor", "error");
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error cargando profesores:", error);
        Swal.fire("❌ Error", "No se pudieron cargar los profesores", "error");
    }
}

cargarProfesores();


logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("usuario")
    window.location.replace("../pages/login.html");
})