
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { getCabins } from "../services/apiCabins";

const Page = styled.main`
  min-height: 100vh;
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

  @media (min-width: 768px) {
    font-size: 24px;
  }
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
  max-width: 1200px;
  margin: 24px auto 48px;

  @media (min-width: 768px) {
    width: 90%;
    margin: 40px auto 64px;
  }
`;

const Breadcrumb = styled.p`
  margin-bottom: 24px;
  color: #777b72;
  font-size: 13px;

  a {
    color: #36543a;
    text-decoration: none;
  }
`;

const CabinImage = styled.img`
  display: block;
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  background: #e9e6dc;

  @media (min-width: 768px) {
    height: 430px;
  }
`;

const DetailsLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  margin-top: 28px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.8fr);
    gap: 48px;
    margin-top: 36px;
  }
`;

const CabinInfo = styled.section`
  h1 {
    margin: 0 0 16px;
    font: 36px Georgia, serif;
  }

  @media (min-width: 768px) {
    h1 {
      font-size: 44px;
    }
  }
`;

const Description = styled.p`
  color: #656b61;
  line-height: 1.8;
  overflow-wrap: anywhere;
`;

const Capacity = styled.p`
  margin-top: 24px;
  color: #596257;
`;

const BookingCard = styled.aside`
  align-self: start;
  padding: 24px;
  border: 1px solid #e8e3d7;
  border-radius: 12px;
  background: #fffdf7;

  h2 {
    margin: 0 0 8px;
    font: 25px Georgia, serif;
  }
`;

const Price = styled.p`
  margin: 0 0 24px;
  color: #687065;

  strong {
    color: #263629;
    font-size: 23px;
  }
`;

const BookButton = styled(Link)`
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 18px;
  border-radius: 7px;
  background: #304a32;
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    background: #223925;
  }
`;

const Message = styled.p`
  padding: 36px 0;
  color: #596257;
`;

function GuestCabinDetails() {
    const { id } = useParams();

    const {
        data: cabins,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["cabins"],
        queryFn: getCabins,
    });

    if (isLoading) {
        return <Page><Content><Message>Loading cabin...</Message></Content></Page>;
    }

    if (isError) {
        return <Page><Content><Message>Unable to load cabin details. Please try again.</Message></Content></Page>;
    }

    const cabin = cabins?.find((item) => item._id === id);

    if (!cabin) {
        return (
            <Page>
                <Content>
                    <Message>Cabin not found.</Message>
                    <Link to="/guest/cabins">Back to all cabins</Link>
                </Content>
            </Page>
        );
    }

    const regularPrice = Number(cabin.regularPrice);
    const discount = Number(cabin.discount || 0);
    const finalPrice = regularPrice * (1 - discount / 100);

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
                <Breadcrumb>
                    <Link to="/home">Home</Link>
                    {" / "}
                    <Link to="/guest/cabins">Cabins</Link>
                    {" / "}
                    {cabin.name}
                </Breadcrumb>

                <CabinImage src={cabin.image} alt={cabin.name} />

                <DetailsLayout>
                    <CabinInfo>
                        <h1>{cabin.name}</h1>

                        <Description>
                            {cabin.description?.trim() ||
                                "A peaceful cabin stay surrounded by nature. Enjoy a comfortable space for your next getaway."}
                        </Description>

                        <Capacity>
                            ♙ Accommodates up to {cabin.maxCapacity}{" "}
                            {Number(cabin.maxCapacity) === 1 ? "guest" : "guests"}
                        </Capacity>
                    </CabinInfo>

                    <BookingCard>
                        <h2>Your getaway awaits</h2>

                        <Price>
                            <strong>
                                ₹{Math.round(finalPrice).toLocaleString("en-IN")}
                            </strong>{" "}
                            / night
                            {discount > 0 && (
                                <span> · {discount}% discount</span>
                            )}
                        </Price>

                        <BookButton to={`/guest/book/${cabin._id}`}>
                            Book this cabin →
                        </BookButton>
                    </BookingCard>
                </DetailsLayout>
            </Content>
        </Page>
    );
}

export default GuestCabinDetails;
