'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import AuthLayout from '../../components/auth/AuthLayout';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                    }
                }
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="ایجاد حساب کاربری جدید"
            linkText="وارد حساب موجود شوید"
            linkHref="/login"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                نام
                            </label>
                            <input
                                {...register('firstName', {
                                    required: 'نام الزامی است',
                                    minLength: {
                                        value: 2,
                                        message: 'نام باید حداقل ۲ کاراکتر باشد'
                                    }
                                })}
                                type="text"
                                autoComplete="given-name"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="نام"
                            />
                            {errors.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                نام خانوادگی
                            </label>
                            <input
                                {...register('lastName', {
                                    required: 'نام خانوادگی الزامی است',
                                    minLength: {
                                        value: 2,
                                        message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد'
                                    }
                                })}
                                type="text"
                                autoComplete="family-name"
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="نام خانوادگی"
                            />
                            {errors.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            آدرس ایمیل
                        </label>
                        <input
                            {...register('email', {
                                required: 'ایمیل الزامی است',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'ایمیل معتبر نیست'
                                }
                            })}
                            type="email"
                            autoComplete="email"
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="آدرس ایمیل"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            رمز عبور
                        </label>
                        <input
                            {...register('password', {
                                required: 'رمز عبور الزامی است',
                                minLength: {
                                    value: 6,
                                    message: 'رمز عبور باید حداقل ۶ کاراکتر باشد'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: 'رمز عبور باید شامل حروف بزرگ، کوچک و عدد باشد'
                                }
                            })}
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="رمز عبور"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            تأیید رمز عبور
                        </label>
                        <input
                            {...register('confirmPassword', {
                                required: 'تأیید رمز عبور الزامی است',
                                validate: (value) => value === password || 'رمزهای عبور مطابقت ندارند'
                            })}
                            type="password"
                            autoComplete="new-password"
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="تأیید رمز عبور"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-700">
                            ثبت نام با موفقیت انجام شد! لطفاً ایمیل خود را بررسی کنید و روی لینک تأیید کلیک کنید.
                        </div>
                    </div>
                )}

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                <div className="flex items-center">
                    <input
                        id="agree-terms"
                        name="agree-terms"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="agree-terms" className="mr-2 block text-sm text-gray-900">
                        با{' '}
                        <a href="#" className="text-indigo-600 hover:text-indigo-500">
                            شرایط و قوانین
                        </a>{' '}
                        موافقم
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'در حال ثبت نام...' : 'ثبت نام'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
