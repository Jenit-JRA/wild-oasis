export async function register(details) {

    const payload = {
        name: details.name,
        email: details.email,
        password: details.password
    }
    const result = await fetch(`http://localhost:3000/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    const data = await result?.json()
    if (!result.ok) {
        throw new Error(data.message)
    }
    return data

}

export async function login(details) {

    const payload = {
        email: details.email,
        password: details.password
    }
    const result = await fetch(`http://localhost:3000/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    const data = await result?.json()
    if (!result.ok) {
        throw new Error(data.message)
    }
    return data

}