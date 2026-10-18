
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getCabins } from "../services/apiCabins";

const Page = styled.main`
  min-height: 100vh;
  background: #faf8f1;
  color: #263629;
`;

const Navbar = styled.nav`
  min-height: 76px;
  padding: 0 7%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fffdf7;
  border-bottom: 1px solid #e9e6dc;

  @media (max-width: 600px) {
    padding: 16px 5%;
    gap: 16px;
    flex-wrap: wrap;
  }
`;

const Logo = styled(Link)`
  color: #29412c;
  font: bold 24px Georgia, serif;
  letter-spacing: 2px;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  a {
    color: #39453a;
    text-decoration: none;
    font-size: 14px;
  }

  a:hover,
  a.active {
    color: #29412c;
    text-decoration: underline;
    text-underline-offset: 8px;
  }

  @media (max-width: 600px) {
    gap: 14px;
    flex-wrap: wrap;
  }
`;


const Content = styled.section`
  width: 92%;
  max-width: 1400px;
  margin: 28px auto 48px;

  @media (min-width: 768px) {
    width: 90%;
    margin: 40px auto 64px;
  }

  @media (min-width: 1200px) {
    margin-top: 48px;
  }
`;


const Heading = styled.div`
  margin-bottom: 30px;

  h1 {
    margin: 0 0 10px;
    font: 38px Georgia, serif;
  }

  p {
    margin: 0;
    color: #73766d;
    line-height: 1.6;
  }
`;


const CabinGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;


const CabinCard = styled.article`
  overflow: hidden;
  border: 1px solid #e8e3d7;
  border-radius: 12px;
  background: #fffdf7;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(35, 48, 35, 0.1);
  }
`;


const CabinImage = styled.img`
  display: block;
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #e9e6dc;

  @media (min-width: 768px) {
    height: 230px;
  }
`;


const CabinInfo = styled.div`
  padding: 20px;

  h2 {
    margin: 0 0 14px;
    font-size: 21px;
  }
`;

const Capacity = styled.p`
  margin: 0 0 14px;
  color: #6b7069;
  font-size: 14px;
`;

const Price = styled.p`
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 700;

  span {
    font-weight: 400;
    color: #777b72;
  }
`;

const DetailsLink = styled(Link)`
  display: block;
  padding: 12px;
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

function GuestCabins() {
    const {
        data: cabins,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["cabins"],
        queryFn: getCabins,
    });

    return (
        <Page>
            <Navbar>
                <Logo to="/home">WILD OASIS</Logo>

                <NavLinks>
                    <Link to="/home">Home</Link>
                    <Link className="active" to="/guest/cabins">
                        Cabins
                    </Link>
                    <Link to="/guest/bookings">My Bookings</Link>
                </NavLinks>
            </Navbar>

            <Content>
                <Heading>
                    <h1>All Cabins</h1>
                    <p>
                        Choose from our handpicked selection of beautiful cabins
                        and find the perfect escape.
                    </p>
                </Heading>

                {isLoading && <Message>Loading cabins...</Message>}

                {isError && (
                    <Message>
                        We couldnot load the cabins.{" "}
                        <button type="button" onClick={() => refetch()}>
                            Try again
                        </button>
                    </Message>
                )}

                {!isLoading && !isError && cabins?.length === 0 && (
                    <Message>No cabins are available right now.</Message>
                )}

                {!isLoading && !isError && cabins?.length > 0 && (
                    <CabinGrid>
                        {cabins.map((cabin) => {
                            const regularPrice = Number(cabin.regularPrice);
                            const discount = Number(cabin.discount || 0);
                            const finalPrice =
                                regularPrice * (1 - discount / 100);

                            return (
                                <CabinCard key={cabin._id}>
                                    <CabinImage
                                        src={cabin.image}
                                        alt={cabin.name}
                                        loading="lazy"
                                    />

                                    <CabinInfo>
                                        <h2>{cabin.name}</h2>

                                        <Capacity>
                                            ♙ Max {cabin.maxCapacity}{" "}
                                            {Number(cabin.maxCapacity) === 1
                                                ? "guest"
                                                : "guests"}
                                        </Capacity>

                                        <Price>
                                            ₹{Math.round(finalPrice).toLocaleString("en-IN")}{" "}
                                            <span>per night</span>
                                        </Price>

                                        <DetailsLink to={`/guest/cabins/${cabin._id}`}>
                                            View cabin →
                                        </DetailsLink>
                                    </CabinInfo>
                                </CabinCard>
                            );
                        })}
                    </CabinGrid>
                )}
            </Content>
        </Page>
    );
}

export default GuestCabins;
