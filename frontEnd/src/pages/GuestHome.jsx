
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getCabins } from "../services/apiCabins";
import { HiOutlineUserCircle, HiArrowRightOnRectangle } from "react-icons/hi2";
import { useAuth } from "../context/AuthContext";

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
  gap: 24px;
  background: #fffdf7;
  border-bottom: 1px solid #e9e6dc;

  @media (max-width: 800px) {
    padding: 14px 5%;
    flex-wrap: wrap;
    gap: 14px;
  }
`;

const Logo = styled(Link)`
  color: #29412c;
  font: bold 24px Georgia, serif;
  letter-spacing: 2px;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 20px;
    letter-spacing: 1px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;

  a {
    color: #39453a;
    text-decoration: none;
    font-size: 14px;
    white-space: nowrap;
  }

  a:hover {
    color: #a17a25;
  }

  @media (max-width: 800px) {
    order: 3;
    width: 100%;
    justify-content: space-between;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid #e9e6dc;

    a {
      font-size: 13px;
    }
  }

  @media (max-width: 360px) {
    gap: 8px;

    a {
      font-size: 11px;
    }
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  color: #29412c;

  .profile-icon {
    width: 27px;
    height: 27px;
    flex-shrink: 0;
  }

  .user-name {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 800px) {
    margin-left: auto;
    gap: 7px;

    .profile-icon {
      width: 24px;
      height: 24px;
    }

    .user-name {
      max-width: 100px;
      font-size: 12px;
    }
  }

  @media (max-width: 360px) {
    gap: 5px;

    .user-name {
      max-width: 70px;
    }
  }
`;

const LogoutButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 11px;
  border: 1px solid #d8ddcf;
  border-radius: 8px;
  background: transparent;
  color: #29412c;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  &:hover {
    background: #e9eee4;
  }

  @media (max-width: 800px) {
    padding: 7px;

    .logout-text {
      display: none;
    }
  }
`;


const Hero = styled.section`
  min-height: 410px;
  margin: 28px auto 0;
  width: 90%;
  max-width: 1400px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;

  background:
    linear-gradient(90deg, rgba(17, 29, 19, 0.85), rgba(17, 29, 19, 0.15)),
    url("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=2000&q=85")
      center / cover no-repeat;

  @media (max-width: 600px) {
    min-height: 350px;
    width: 92%;
  }
`;

const HeroContent = styled.div`
  max-width: 590px;
  padding: 48px;
  color: #fffdf7;

  h1 {
    font: 48px/1.12 Georgia, serif;
    margin: 0 0 18px;
  }

  p {
    line-height: 1.7;
    margin-bottom: 28px;
    color: #f0eee5;
  }

  @media (max-width: 600px) {
    padding: 28px;

    h1 {
      font-size: 36px;
    }
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 13px 23px;
  border-radius: 7px;
  background: #c5a34b;
  color: #17271a;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: #d7b75e;
  }
`;

const Section = styled.section`
  max-width: 1400px;
  width: 90%;
  margin: 48px auto 64px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;

  h2 {
    font: 30px Georgia, serif;
    margin: 0;
  }

  a {
    color: #36543a;
    font-weight: 600;
    text-decoration: none;
  }
`;

const CabinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 850px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const CabinCard = styled(Link)`
  overflow: hidden;
  border: 1px solid #e8e3d7;
  border-radius: 10px;
  background: #fffdf7;
  color: inherit;
  text-decoration: none;
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
`;

const CabinInfo = styled.div`
  padding: 18px;

  h3 {
    margin: 0 0 12px;
    font-size: 19px;
  }
`;

const Capacity = styled.p`
  margin: 0 0 12px;
  color: #6b7069;
  font-size: 13px;
`;

const Price = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;

  span {
    font-weight: 400;
    color: #777b72;
  }
`;

const Message = styled.p`
  padding: 30px;
  text-align: center;
  color: #596257;
`;

function GuestHome() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const {
    data: cabins,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const featuredCabins = cabins?.slice(0, 3) ?? [];

  return (
    <Page>
      <Navbar>
        <Logo to="/home">WILD OASIS</Logo>

        <NavLinks>
          <Link to="/home">Home</Link>
          <Link to="/guest/cabins">Cabins</Link>
          <Link to="/guest/bookings">My Bookings</Link>
        </NavLinks>

        <UserMenu>
          <HiOutlineUserCircle />
          <span>{user?.name}</span>

          <LogoutButton onClick={handleLogout}>
            <HiArrowRightOnRectangle />
            <span>Logout</span>
          </LogoutButton>
        </UserMenu>
      </Navbar>

      <Hero>
        <HeroContent>
          <h1>Find Your Perfect Cabin</h1>
          <p>
            Unwind in nature. Experience comfort.
            Discover your own peaceful escape and create
            unforgettable memories.
          </p>

          <PrimaryButton to="/guest/cabins">
            Explore Cabins →
          </PrimaryButton>
        </HeroContent>
      </Hero>

      <Section>
        <SectionHeader>
          <h2>Featured Cabins</h2>
          <Link to="/guest/cabins">View all →</Link>
        </SectionHeader>

        {isLoading && <Message>Loading cabins...</Message>}

        {isError && (
          <Message>
            We could not load the cabins. Please try again.
          </Message>
        )}

        {!isLoading && !isError && featuredCabins.length === 0 && (
          <Message>No cabins available right now.</Message>
        )}

        {!isLoading && !isError && featuredCabins.length > 0 && (
          <CabinGrid>
            {featuredCabins.map((cabin) => {
              const finalPrice =
                Number(cabin.regularPrice) *
                (1 - Number(cabin.discount || 0) / 100);

              return (
                <CabinCard
                  to={`/guest/cabins/${cabin._id}`}
                  key={cabin._id}
                >
                  <CabinImage
                    src={cabin.image}
                    alt={cabin.name}
                  />

                  <CabinInfo>
                    <h3>{cabin.name}</h3>

                    <Capacity>
                      ♙ Max {cabin.maxCapacity}{" "}
                      {Number(cabin.maxCapacity) === 1 ? "guest" : "guests"}
                    </Capacity>

                    <Price>
                      ₹{finalPrice.toLocaleString("en-IN")}{" "}
                      <span>per night</span>
                    </Price>
                  </CabinInfo>
                </CabinCard>
              );
            })}
          </CabinGrid>
        )}
      </Section>
    </Page>
  );
}

export default GuestHome;
