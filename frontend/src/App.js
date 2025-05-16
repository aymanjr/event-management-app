import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EventDetail from './pages/EventDetail';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Event from './pages/Events';
import CreateEvent from './pages/CreateEvent';

function AppWrapper() {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events" element={<Event />} />
        <Route path="/create-event" element={<CreateEvent />} />

      </Routes>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;