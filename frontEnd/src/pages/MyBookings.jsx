import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMyBookings, manageBooking } from "../services/apiBookings";
import "./MyBooking.css";

function MyBookings() {
    const queryClient = useQueryClient();
    console.log(queryClient)


    const {
        data: bookings,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["my-bookings"],
        queryFn: getMyBookings,
    });

    const { mutate: cancelBooking, isPending } = useMutation({
        mutationFn: manageBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-bookings"],
            })
        }
    })

    if (isLoading) {
        return <p className="bookings-message">Loading your bookings...</p>;
    }

    if (isError) {
        return (
            <p className="bookings-message bookings-error">
                {error.message}
            </p>
        );
    }

    if (!bookings || bookings.length === 0) {
        return (
            <section className="my-bookings">
                <h1>My Bookings</h1>
                <div className="bookings-empty">
                    <h2>No bookings yet</h2>
                    <p>Your next getaway is waiting for you.</p>
                    <Link to="/guest/cabins" className="bookings-browse-btn">
                        Explore cabins
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="my-bookings">
            <header className="bookings-header">
                <p className="bookings-eyebrow">YOUR STAYS</p>
                <h1>My Bookings</h1>
                <p>View the details of your upcoming and past stays.</p>
            </header>

            <div className="bookings-list">
                {bookings.map((booking) => {
                    const cabin = booking.cabin;
                    const status = booking.status?.toUpperCase();

                    return (
                        <article className="booking-card" key={booking._id}>
                            <div className="booking-card-top">
                                <div className="booking-cabin">
                                    {cabin?.image && (
                                        <img
                                            src={cabin.image}
                                            alt={cabin.name || "Cabin"}
                                            className="booking-cabin-image"
                                        />
                                    )}

                                    <div>
                                        <h2>{cabin?.name || "Cabin"}</h2>
                                        <p>
                                            {booking.noOfGuests}{" "}
                                            {booking.noOfGuests === 1 ? "guest" : "guests"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`booking-status ${status === "CONFIRMED"
                                        ? "status-confirmed"
                                        : status === "CANCELLED"
                                            ? "status-cancelled"
                                            : "status-unknown"
                                        }`}
                                >
                                    {status || "UNKNOWN"}
                                </span>
                            </div>

                            <div className="booking-details">
                                <div>
                                    <span className="booking-label">Check-in</span>
                                    <strong>
                                        {new Date(booking.startDate).toLocaleDateString("en-IN")}
                                    </strong>
                                </div>

                                <div>
                                    <span className="booking-label">Check-out</span>
                                    <strong>
                                        {new Date(booking.endDate).toLocaleDateString("en-IN")}
                                    </strong>
                                </div>

                                <div>
                                    <span className="booking-label">Total price</span>
                                    <strong>
                                        {new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            maximumFractionDigits: 2,
                                        }).format(booking.totalPrice)}
                                    </strong>
                                </div>
                            </div>
                            {status === "CONFIRMED" && (
                                <div className="booking-actions">
                                    <button
                                        type="button"
                                        className="cancel-booking-btn"
                                        onClick={() => { cancelBooking(booking._id) }}
                                    >
                                        {isPending ? 'Cancelling' : 'Cancel Booking'}
                                    </button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

export default MyBookings;