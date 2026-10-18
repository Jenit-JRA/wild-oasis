import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Bookings from './pages/Bookings'
import Cabins from './pages/Cabins'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Account from './pages/Account'
import PageNotFound from './pages/PageNotFound'
import Login from './pages/Login'
import GlobalStyles from './styles/GlobalStyles'
import AppLayout from './ui/AppLayout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './ui/ProtectedRoute'
import GuestHome from "./pages/GuestHome";
import GuestCabins from "./pages/GuestCabins";
import GuestCabinDetails from "./pages/GuestCabinDetails";
import GuestBooking from "./pages/GuestBooking";
import MyBookings from "./pages/MyBookings";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    }
  }
})

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <GlobalStyles />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={
              <ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='bookings' element={<Bookings />} />
              <Route path='cabins' element={<Cabins />} />
              <Route path='users' element={<Users />} />
              <Route path='settings' element={<Settings />} />
              <Route path='account' element={<Account />} />

            </Route>
            <Route path="/home" element={<GuestHome />} />
            <Route path="/guest/cabins" element={<GuestCabins />} />
            <Route
              path="/guest/cabins/:id"
              element={<GuestCabinDetails />}
            />
            <Route path="/guest/book/:id" element={<GuestBooking />} />
            <Route
              path="/guest/bookings"
              element={<MyBookings />}
            />


            <Route path='login' element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path='*' element={<PageNotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>

    </QueryClientProvider>

  )
}

export default App