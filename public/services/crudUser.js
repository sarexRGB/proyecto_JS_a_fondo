async function getUser() {
    try {
        const response = await fetch('http://localhost:3001/users',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const users = await response.json()

        return users

    } catch (error) {
        console.error("Hay un error al obtener el usuario", error)
        throw error
    }
}

async function postUser(user) {
    try {
        const response = await fetch('http://localhost:3001/users',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const newUser = await response.json()

        return newUser

    } catch (error) {
        console.error("Hay un error al registrar usuario", error)
        throw error
    }
}

async function loginUser(correo, password) {
    try {
        const response = await fetch(`http://localhost:3001/users?correo=${correo}&password=${password}`);
        const users = await response.json();

        return users.length > 0 ? users[0] : null;
    } catch (error) {
        console.error("Error al iniciar sesión", error);
        throw error
    }
}

async function getProfesores() {
    try {
        const response = await fetch("http://localhost:3001/users");
        const users = await response.json();

        const profesores = users.filter(user => user.tipo.toLowerCase() === "profesor");
        return profesores;

    } catch (error) {
        console.error("Error obteniendo profesores:", error);
        throw error;
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(`http://localhost:3001/users/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        throw error;
    }
}

export{postUser, loginUser, getUser, getProfesores, deleteUser}