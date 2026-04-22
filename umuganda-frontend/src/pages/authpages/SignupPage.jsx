import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { showSuccess, showError } from '../../utils/toastUtils';
import authService from '../../services/authService';
import locationService from '../../services/locationService';

// Validation Schema
const signupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  locationId: z.string().nullable().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAllLocations();
        // Filtering only villages for the signup if possible, or just all locations
        // For simplicity in this demo, showing all as options
        setLocations(data.map(loc => ({
          value: loc.id,
          label: `${loc.name} (${loc.type})`
        })));
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };
    fetchLocations();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const signupData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: 'VILLAGER', // Default role for signup
        locationId: data.locationId || null
      };

      await authService.register(signupData);
      showSuccess('Account created successfully! Please verify your email with the OTP sent.');
      navigate('/verify-otp', { state: { email: data.email, type: 'signup' } });
    } catch (error) {
      const message = error.response?.data || 'Failed to create account. Please try again.';
      showError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Join the community and start making a difference
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            icon={User}
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            icon={User}
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+250 788 000 000"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Village/Location (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('locationId')}
              className={`block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all appearance-none bg-white dark:bg-gray-800 dark:border-gray-700
                ${errors.locationId
                  ? 'border-red-300 focus:ring-red-100 dark:border-red-900/50'
                  : 'border-gray-300 focus:ring-blue-100 focus:border-blue-400 dark:border-gray-700 dark:focus:ring-blue-900/20'}`}
            >
              <option value="">Select your location</option>
              {locations.map(loc => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
          {errors.locationId && (
            <p className="text-xs text-red-500 mt-1">{errors.locationId.message}</p>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <p>By clicking "Sign Up", you agree to our <a href="#" className='text-blue-600 hover:underline'>Terms</a> and <a href="#" className='text-blue-600 hover:underline'>Privacy Policy</a>.</p>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;