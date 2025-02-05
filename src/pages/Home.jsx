import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Avatar,
  Chip,
} from '@nextui-org/react';
import {
  HelpCircle,
  User,
  UserPlus,
  Shield,
  Clock,
  MessageCircle,
  Headphones,
  HardHat,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-5xl shadow-2xl hover:shadow-4xl transition-shadow duration-300"
        isBlurred
      >
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center p-6 pb-0 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar
              isBordered
              color="primary"
              src="/api/placeholder/100/100"
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                Support Ticket System
              </h1>
              <Chip color="secondary" variant="dot" size="sm" className="mt-1">
                Efficient Support Management
              </Chip>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <HelpCircle className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-gray-500 text-xs sm:text-sm">
              Quick & Reliable
            </span>
          </div>
        </CardHeader>

        <Divider className="my-4" />

        <CardBody className="px-4 sm:px-6 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                Icon: Shield,
                title: 'Secure',
                description: 'Your data is protected',
              },
              {
                Icon: Clock,
                title: 'Fast',
                description: 'Quick ticket resolution',
              },
              {
                Icon: MessageCircle,
                title: 'Responsive',
                description: '24/7 support',
              },
            ].map(({ Icon, title, description }, index) => (
              <div
                key={title}
                className="bg-blue-50 p-4 rounded-xl flex flex-col items-center"
              >
                <Icon className="text-primary w-8 h-8 sm:w-12 sm:h-12 mb-2" />
                <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-gray-700 text-sm sm:text-base mb-6 max-w-2xl mx-auto px-2 sm:px-0">
            Welcome to our support ticket system. Streamline your customer
            support with our intuitive platform. Get started by selecting your
            role and signing in or creating a new account.
          </p>
        </CardBody>

        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <div className="flex-1">
              <Button
                color="primary"
                size="lg"
                startContent={<User />}
                onPress={() => navigate('/customer')}
                className="w-full mb-4 sm:mb-0"
                variant="shadow"
              >
                Customer
              </Button>
              <div className="text-center text-xs text-gray-600 mt-2">
                Sign In / Sign Up as a Customer
              </div>
            </div>

            <div className="flex-1">
              <Button
                color="secondary"
                size="lg"
                startContent={<Headphones />}
                onPress={() => navigate('/agent')}
                className="w-full"
                variant="bordered"
              >
                Support Agent
              </Button>
              <div className="text-center text-xs text-gray-600 mt-2">
                Sign In / Sign Up as a Support Agent
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
