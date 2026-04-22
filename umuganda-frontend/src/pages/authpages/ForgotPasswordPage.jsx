import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { toast } from 'react-toastify';
import authService from '../../services/authService';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authService.forgotPassword(data.email);
            toast.success('Reset code sent to your email');
            navigate('/verify-otp', { state: { email: data.email } });
        } catch (error) {
            toast.error(error.response?.data || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Don't worry! It happens. Please enter the email associated with your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                >
                    Send Code
                </Button>
            </form>

            <div className="text-center text-sm">
                <Link
                    to="/login"
                    className="inline-flex items-center font-medium text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
