import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
          Welcome to Finance Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Manage your finances effortlessly and stay on top of your expenses.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex space-x-4"
      >
        <Button
          onClick={handleLogin}
          className="px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          Login
        </Button>
        <Button
          onClick={handleRegister}
          className="px-6 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          Register
        </Button>
      </motion.div>
    </div>
  );
}

export default Dashboard;