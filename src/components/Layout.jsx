import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Divider, Tooltip } from '@nextui-org/react';
import { Menu, X, Ticket, LogOut, Home, LogIn, User } from 'lucide-react';

export default function Layout({ children }) {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  const menuItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/',
      color: 'default',
    },
    {
      label: 'Tickets',
      icon: Ticket,
      path: userRole === 'agent' ? '/agent' : '/customer',
      color: 'primary',
    },
    {
      label: 'SignIn',
      icon: LogIn,
      path: '/login',
      color: 'secondary',
    },
    {
      label: 'SignUp',
      icon: User,
      path: '/signup',
      color: 'secondary',
    },
  ];

  const NavButton = ({ item, isMobile = false }) => (
    <Button
      fullWidth={isMobile}
      variant={location.pathname === item.path ? 'solid' : 'light'}
      color={location.pathname === item.path ? item.color : 'default'}
      className={`justify-start gap-2 ${isMobile ? 'mb-2' : ''}`}
      startContent={<item.icon className="w-5 h-5" />}
      onPress={() => {
        navigate(item.path);
        setIsDrawerOpen(false);
      }}
    >
      {item.label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Large Screen Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <span className="w-10 h-10 p-4 mr-3 rounded-full bg-blue-500" />
            <h2 className="text-2xl font-bold text-primary">Support System</h2>
          </div>

          <Divider className="mb-4" />

          <nav className="space-y-2">
            {menuItems.map(item => (
              <NavButton key={item.label} item={item} />
            ))}
          </nav>

          <Divider className="my-4" />

          <Tooltip content="Logout" placement="right">
            <Button
              fullWidth
              color="danger"
              variant="light"
              startContent={<LogOut className="w-5 h-5" />}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden my-2 mx-4 z-50 ">
        <Button
          isIconOnly
          variant="light"
          onPress={() => setIsDrawerOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="fixed left-0 top-0 w-64 h-full bg-white shadow-xl z-60"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <span className="w-10 h-10 p-4 mr-3 rounded-full bg-blue-500" />

                  <h2 className="text-2xl font-bold text-primary">
                    Support System
                  </h2>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setIsDrawerOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <Divider className="mb-4" />

              <nav className="space-y-2">
                {menuItems.map(item => (
                  <NavButton key={item.label} item={item} isMobile />
                ))}
              </nav>

              <Divider className="my-4" />

              <Button
                fullWidth
                color="danger"
                variant="light"
                startContent={<LogOut className="w-5 h-5" />}
                onPress={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-gray-50 p-2">{children}</main>
    </div>
  );
}
