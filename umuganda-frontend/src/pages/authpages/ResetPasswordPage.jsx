import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useLocation } from 'react-router-dom';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { email, otp } = location.state || {};

    useEffect(() => {
        if (!email || !otp) {
            toast.error('Missing reset information. Please start over.');
            navigate('/forgot-password');
        }
    }, [email, otp, navigate]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await authService.resetPassword(email, otp, data.password);
            toast.success('Password reset successfully. Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Create a new strong password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="New Password"
                    type="password"
                    placeholder="New password"
                    icon={Lock}
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    icon={Lock}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                >
                    Reset Password
                </Button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
