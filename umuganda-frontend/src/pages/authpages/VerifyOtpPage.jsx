import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

import { toast } from 'react-toastify';
import authService from '../../services/authService';
import { useLocation } from 'react-router-dom';

const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
});

const VerifyOtpPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const email = location.state?.email;
    const type = location.state?.type || 'reset'; // 'reset' or 'signup'

    useEffect(() => {
        if (!email) {
            toast.error('Email not found. Please restart the process.');
            navigate(type === 'signup' ? '/signup' : '/forgot-password');
        }
    }, [email, navigate, type]);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(otpSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (type === 'signup') {
                await authService.verifyAccount(email, data.otp);
                toast.success('Account verified successfully! You can now login.');
                navigate('/login');
            } else {
                await authService.verifyResetOtp(email, data.otp);
                toast.success('OTP verified');
                navigate('/reset-password', { state: { email, otp: data.otp } });
            }
        } catch (error) {
            toast.error(error.response?.data || 'Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Verify OTP</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    We sent a code to your email. Enter it below to verify your identity.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="One-Time Password"
                    type="text"
                    placeholder="Enter 6-digit code"
                    icon={KeyRound}
                    maxLength={6}
                    className="text-center tracking-widest text-lg font-mono"
                    error={errors.otp?.message}
                    {...register('otp')}
                />

                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isLoading}
                >
                    Verify
                </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                    Resend
                </button>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
