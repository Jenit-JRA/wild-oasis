
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getCabins } from "../services/apiCabins";
import { createBooking } from "../services/apiBookings";

const Page = styled.main`
  min-height: 100vh;
  padding-bottom: 48px;
  background: #faf8f1;
  color: #263629;
`;

const Navbar = styled.nav`
  min-height: 68px;
  padding: 16px 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  background: #fffdf7;
  border-bottom: 1px solid #e9e6dc;

  @media (min-width: 768px) {
    min-height: 76px;
    padding: 0 7%;
  }
`;

const Logo = styled(Link)`
  color: #29412c;
  font: bold 22px Georgia, serif;
  letter-spacing: 2px;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;

  a {
    color: #39453a;
    text-decoration: none;
    font-size: 13px;
  }

  @media (min-width: 768px) {
    gap: 28px;

    a {
      font-size: 14px;
    }
  }
`;

const Content = styled.div`
  width: 92%;
  max-width: 1050px;
  margin: 28px auto;

  @media (min-width: 768px) {
    width: 90%;
    margin: 44px auto;
  }
`;

const Heading = styled.div`
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font: 34px Georgia, serif;
  }

  p {
    color: #6b7069;
    line-height: 1.6;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;

  @media (min-width: 850px) {
    grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
    gap: 32px;
  }
`;

const FormCard = styled.form`
  padding: 22px;
  border: 1px solid #e8e3d7;
  border-radius: 12px;
  background: #fffdf7;

  @media (min-width: 600px) {
    padding: 32px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 22px;

  label {
    font-weight: 600;
    font-size: 14px;
  }

  input,
  select {
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    padding: 12px;
    border: 1px solid #d8d9d0;
    border-radius: 7px;
    background: white;
    color: #263629;
    font: inherit;
  }

  input:focus,
  select:focus {
    outline: 2px solid #c5a34b;
    outline-offset: 1px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  min-height: 50px;
  border: 0;
  border-radius: 7px;
  background: #304a32;
  color: white;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Summary = styled.aside`
  align-self: start;
  padding: 24px;
  border: 1px solid #e8e3d7;
  border-radius: 12px;
  background: #fffdf7;

  img {
    display: block;
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 18px;
  }

  h2 {
    margin: 0 0 10px;
    font: 25px Georgia, serif;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #e8e3d7;
  color: #596257;
`;

const TotalRow = styled(SummaryRow)`
  border-bottom: 0;
  color: #263629;
  font-weight: 700;
  font-size: 17px;
`;

const Message = styled.p`
  padding: 24px 0;
  color: #596257;
`;

const ErrorMessage = styled.p`
  padding: 12px;
  border-radius: 7px;
  background: #fcebea;
  color: #a12622;
  line-height: 1.5;
`;

function GuestBooking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [numGuests, setNumGuests] = useState("1");
    const [formError, setFormError] = useState("");

    const {
        data: cabins,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["cabins"],
        queryFn: getCabins,
    });

    const bookingMutation = useMutation({
        mutationFn: createBooking,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["my-bookings"],
            });

            navigate("/guest/bookings", {
                state: { bookingSuccess: true },
            });
        },
    });

    if (isLoading) {
        return <Page><Content><Message>Loading cabin...</Message></Content></Page>;
    }

    if (isError) {
        return <Page><Content><Message>Unable to load cabins. Please try again.</Message></Content></Page>;
    }

    const cabin = cabins?.find((item) => item._id === id);

    if (!cabin) {
        return (
            <Page>
                <Content>
                    <Message>Cabin not found.</Message>
                    <Link to="/guest/cabins">Back to cabins</Link>
                </Content>
            </Page>
        );
    }

    const nights =
        startDate && endDate && new Date(endDate) > new Date(startDate)
            ? Math.round(
                (new Date(`${endDate}T00:00:00`) -
                    new Date(`${startDate}T00:00:00`)) /
                (1000 * 60 * 60 * 24)
            )
            : 0;

    const regularPrice = Number(cabin.regularPrice);
    const discount = Number(cabin.discount || 0);
    const nightlyPrice = regularPrice * (1 - discount / 100);
    const totalPrice = nights * nightlyPrice;

    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0"),
    ].join("-");

    function handleSubmit(event) {
        event.preventDefault();
        setFormError("");

        if (!startDate || !endDate) {
            setFormError("Please select both check-in and check-out dates.");
            return;
        }

        if (startDate < localToday) {
            setFormError("Check-in cannot be in the past.");
            return;
        }

        if (endDate <= startDate) {
            setFormError("Check-out must be after check-in.");
            return;
        }

        bookingMutation.mutate({
            cabin: cabin._id,
            startDate,
            endDate,
            numGuests: Number(numGuests),
        });
    }

    return (
        <Page>
            <Navbar>
                <Logo to="/home">WILD OASIS</Logo>

                <NavLinks>
                    <Link to="/home">Home</Link>
                    <Link to="/guest/cabins">Cabins</Link>
                    <Link to="/guest/bookings">My Bookings</Link>
                </NavLinks>
            </Navbar>

            <Content>
                <Heading>
                    <h1>Book your stay</h1>
                    <p>Choose your dates and get ready for a peaceful escape.</p>
                </Heading>

                <Layout>
                    <FormCard onSubmit={handleSubmit}>
                        <Field>
                            <label htmlFor="check-in">Check-in</label>
                            <input
                                id="check-in"
                                type="date"
                                min={localToday}
                                value={startDate}
                                onChange={(event) => {
                                    setStartDate(event.target.value);

                                    if (
                                        endDate &&
                                        event.target.value >= endDate
                                    ) {
                                        setEndDate("");
                                    }
                                }}
                                required
                            />
                        </Field>

                        <Field>
                            <label htmlFor="check-out">Check-out</label>
                            <input
                                id="check-out"
                                type="date"
                                min={startDate || localToday}
                                value={endDate}
                                onChange={(event) => setEndDate(event.target.value)}
                                required
                            />
                        </Field>

                        <Field>
                            <label htmlFor="guests">Number of guests</label>
                            <select
                                id="guests"
                                value={numGuests}
                                onChange={(event) => setNumGuests(event.target.value)}
                            >
                                {Array.from(
                                    { length: Number(cabin.maxCapacity) },
                                    (_, index) => index + 1
                                ).map((count) => (
                                    <option key={count} value={count}>
                                        {count} {count === 1 ? "guest" : "guests"}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        {formError && <ErrorMessage>{formError}</ErrorMessage>}

                        {bookingMutation.isError && (
                            <ErrorMessage>{bookingMutation.error.message}</ErrorMessage>
                        )}

                        <SubmitButton
                            type="submit"
                            disabled={bookingMutation.isPending}
                        >
                            {bookingMutation.isPending
                                ? "Creating booking..."
                                : "Confirm booking"}
                        </SubmitButton>
                    </FormCard>

                    <Summary>
                        <img src={cabin.image} alt={cabin.name} />

                        <h2>{cabin.name}</h2>
                        <p>Maximum {cabin.maxCapacity} guests</p>

                        <SummaryRow>
                            <span>Price per night</span>
                            <span>₹{Math.round(nightlyPrice).toLocaleString("en-IN")}</span>
                        </SummaryRow>

                        <SummaryRow>
                            <span>Duration</span>
                            <span>
                                {nights} {nights === 1 ? "night" : "nights"}
                            </span>
                        </SummaryRow>

                        <TotalRow>
                            <span>Estimated total</span>
                            <span>₹{Math.round(totalPrice).toLocaleString("en-IN")}</span>
                        </TotalRow>

                        <Message>
                            Final price and availability are validated by the server.
                        </Message>
                    </Summary>
                </Layout>
            </Content>
        </Page>
    );
}

export default GuestBooking;
