import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Login() {
  document.title = 'Sign In - Support Ticketing System';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!role) {
      setError('Please select a role');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await login(email, password);

      // Verify user role
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      // const userData = userDoc.data();
      if (userData?.role !== role) {
        setError('Invalid role for this account');
        return;
      }

      navigate(role === 'agent' ? '/agent' : '/customer');
    } catch (error) {
      setError('Failed to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center ">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Support Ticket System</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Select
              label="Select Role"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
            >
              <SelectItem key="customer" value="customer">
                Customer
              </SelectItem>
              <SelectItem key="agent" value="agent">
                Support Agent
              </SelectItem>
            </Select>
            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
            <div className="text-center text-sm text-gray-500">
              <p>
                Customer - Email : customer@support.com Password - customer123
              </p>
              <p>
                Support Agent - Email : agent@support.com Pasword - agent123
              </p>
            </div>
            <div className="text-center">
              <Button
                color="secondary"
                variant="light"
                onPress={() => navigate('/signup')}
              >
                Need an account? Sign Up
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
