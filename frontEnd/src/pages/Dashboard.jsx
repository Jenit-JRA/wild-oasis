
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query"
import { getDashboard } from "../services/apiDashboard";
import StatCard from "../ui/StatCard";
import {
  CalendarCheck,
  House,
  CircleCheck,
  Wallet
} from "lucide-react";

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const WelcomeMessage = styled.p`
  font-size: 1.6rem;
  color: var(--color-grey-500);
`;
const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
`;
const MonthlyCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
`;

function Dashboard() {
  const { isLoading, data: statistics } = useQuery({
    queryKey: ['statistics'],
    queryFn: getDashboard
  })
  console.log(statistics?.bookingOverview)
  const monthlyData = statistics?.bookingOverview?.map((booking => (
    {
      booking: booking.bookings,
      month: booking._id.month
    }
  )))

  if (isLoading) {
    return <span>Loading.......</span>
  }

  else
    return (
      <DashboardLayout>
        <Row type="horizontal">
          <Heading as="h1">Dashboard</Heading>
        </Row>

        <WelcomeMessage>
          Welcome back! Here is an overview of your booking activity.
        </WelcomeMessage>
        <StatGrid>
          <StatCard
            title="Total Bookings"
            value={statistics.stats.totalBookings}
            icon={CalendarCheck} />
          <StatCard
            title="Confirmed Bookings"
            value={statistics.stats.confirmedBookings}
            icon={CircleCheck} />
          <StatCard
            title="Total Cabins"
            value={statistics.stats.totalCabins}
            icon={House} />
          <StatCard
            title="Total Revenue"
            value={statistics.stats.totalRevenue}
            icon={Wallet} />

        </StatGrid>
        <MonthlyCardGrid></MonthlyCardGrid>

      </DashboardLayout>
    );
}

export default Dashboard;
