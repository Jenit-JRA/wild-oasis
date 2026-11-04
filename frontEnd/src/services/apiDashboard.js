
export async function getDashboard() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/api/v1/dashboard", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    const { data } = await res.json();
    return data;
}
