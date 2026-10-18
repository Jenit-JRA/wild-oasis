export async function getMyBookings() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your bookings.");
  }

  const response = await fetch(
    "http://localhost:3000/api/v1/bookings/my-bookings",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Bookings could not be loaded."
    );
  }

  return result.data.bookings;
}

export async function createBooking(payload) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in before making a booking.");
  }

  const response = await fetch("http://localhost:3000/api/v1/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Booking could not be created.");
  }

  return data;
}

export async function manageBooking(id) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your bookings.");
  }
  try {
    const result = await fetch(`http://localhost:3000/api/v1/bookings/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    return result

  }
  catch (e) {
    console.log(e)
    throw new Error(e)
  }

}