async function sendSolicitud(solicitud) {
    try {
        const response = await fetch('http://localhost:3001/solicitudes',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const newsolicitud = await response.json()

        return newsolicitud

    } catch (error) {
        console.error("Hay un error al enviar la solicitud", error)
        throw error
    }
}

export {sendSolicitud}