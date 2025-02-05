import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { logout, userRole } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 bg-white h-screen shadow-lg fixed">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-8">Support System</h2>
            <nav className="space-y-2">
              <Button
                className="w-full justify-start"
                variant="light"
                onPress={() =>
                  navigate(userRole === 'agent' ? '/agent' : '/customer')
                }
              >
                Tickets
              </Button>
              <Button
                className="w-full justify-start"
                color="danger"
                variant="light"
                onPress={handleLogout}
              >
                Logout
              </Button>
            </nav>
          </div>
        </div>

        {/* Drawer for smaller screens */}
        <div className="lg:hidden">
          <Button className="m-2" onPress={() => setIsDrawerOpen(true)}>
            Open Menu
          </Button>
          {isDrawerOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onPress={() => setIsDrawerOpen(false)}
            >
              <div className="fixed left-0 top-0 w-64 bg-white h-full shadow-lg z-50">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-8">Support System</h2>
                  <nav className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="light"
                      onPress={() => {
                        navigate(userRole === 'agent' ? '/agent' : '/customer');
                        setIsDrawerOpen(false);
                      }}
                    >
                      Tickets
                    </Button>
                    <Button
                      className="w-full justify-start"
                      color="danger"
                      variant="light"
                      onPress={() => {
                        handleLogout();
                        setIsDrawerOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="lg:ml-64 flex-1 px-2 py-2 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
