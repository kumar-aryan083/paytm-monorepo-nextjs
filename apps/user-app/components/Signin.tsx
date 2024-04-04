// components/SignIn.tsx
"use client"
import { signIn } from 'next-auth/react';
import { useState } from 'react';

const SignIn: React.FC = () => {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn('credentials', {
                number,
                password,
                redirect: true, // Do not redirect as we handle it manually
            });
        } catch (error) {
            console.error('Sign-in error:', error);
            // Handle sign-in error here
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold text-center">Sign in</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            id="phone_number"
                            type="text"
                            autoComplete="phone"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-slate-900 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
