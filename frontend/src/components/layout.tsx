import { Outlet, Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { Calendar, Ticket, Home } from 'lucide-react';

export default function Layout() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                EventFlow
              </Link>

              {/* Nav Links */}
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <Home size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/events"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <Calendar size={20} />
                  <span>Events</span>
                </Link>
                <Link
                  to="/my-tickets"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  <Ticket size={20} />
                  <span>My Tickets</span>
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}