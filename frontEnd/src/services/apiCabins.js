
function AuthHeaders() {
    const token = localStorage.getItem("token")
    if (!token) {
        throw new Error("Please sign in to continue")
    }
    return {
        Authorization: `Bearer ${token}`
    }
}


export async function getCabins() {
    try {
        const result = await fetch(`http://localhost:3000/api/v1/cabins`, {
            headers: AuthHeaders()
        })
        if (!result.ok) {
            throw new Error("Cabins could not be loaded")
        }
        const data = await result.json()
        return data?.data

    }
    catch (e) {
        console.log(e)

    }
}
export async function createCabin(payload) {
    const formData = new FormData()
    formData.append("name", payload.name)
    formData.append("regularPrice", payload.regularPrice)
    formData.append("maxCapacity", payload.maxCapacity)
    formData.append("discount", payload.discount)
    formData.append("description", payload.description)
    formData.append("image", payload.image[0])
    for (const [key, value] of formData.entries()) {
        console.log(key, value)
    }
    try {
        const result = await fetch(`http://localhost:3000/api/v1/cabins`,
            {
                method: 'POST',
                headers: AuthHeaders(),
                body: formData

            })
        if (!result.ok) {
            throw new Error("Cabins could not be created")
        }
        const data = await result.json()
        return data?.data

    }
    catch (e) {
        console.log(e)

    }
}
export async function updateCabin(id, payload) {
    const formData = new FormData()
    formData.append("name", payload.name)
    formData.append("regularPrice", payload.regularPrice)
    formData.append("maxCapacity", payload.maxCapacity)
    formData.append("discount", payload.discount)
    formData.append("description", payload.description)
    if (payload.image[0]) {
        formData.append("image", payload.image[0])
    }

    try {
        const result = await fetch(`http://localhost:3000/api/v1/cabins/${id}`,
            {
                method: 'PATCH',
                headers: AuthHeaders(),
                body: formData

            })
        if (!result.ok) {
            throw new Error("Cabins could not be created")
        }
        const data = await result.json()
        return data?.data

    }
    catch (e) {
        console.log(e)

    }
}
export async function deleteCabin(id) {
    const result = await fetch(
        `http://localhost:3000/api/v1/cabins/${id}`,
        {
            method: "DELETE",
            headers: AuthHeaders(),
        }
    );

    if (!result.ok) {
        throw new Error("Cabin could not be deleted");
    }

    return true;
}