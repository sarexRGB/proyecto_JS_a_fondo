async function sendSolicitud(solicitud) {
    try {
        const response = await fetch('http://localhost:3001/solicitudes',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(solicitud)
        });

        const newsolicitud = await response.json();

        return newsolicitud;

    } catch (error) {
        console.error("Hay un error al enviar la solicitud", error)
        throw error
    }
}

async function getSolicitudes() {
    try {
        const response = await fetch('http://localhost:3001/solicitudes',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const solicitudes = await response.json();

        return solicitudes;

    } catch (error) {
        console.error("Hay un error al obtener las solicitudes", error)
        throw error
    }
}

async function getSolicitudesPendientes() {
    try {
        const response = await fetch('http://localhost:3001/solicitudes',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const solicitudes = await response.json();

        const pendientes = solicitudes.filter(s => s.estado.toLowerCase() === "pendiente");
        return pendientes;

    } catch (error) {
        console.error("Hay un error al obtener las solicitudes pendientes", error)
        throw error
    }
}


async function updateSolicitud(id, data) {
    try {
        const response = await fetch(`http://localhost:3001/solicitudes/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const updatesolicitud = await response.json();

        return updatesolicitud;

    } catch (error) {
        console.error("Hay un error al actualizar la solicitud", error)
        throw error
    }
}

async function deleteSolicitud(id) {
    try {
        const response = await fetch(`http://localhost:3001/solicitudes/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error("Hay un error al eliminar la solicitud", error);
        throw error;
    }
}

export {sendSolicitud, getSolicitudes,getSolicitudesPendientes, updateSolicitud, deleteSolicitud}