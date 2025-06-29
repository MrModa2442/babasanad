import React, { useState } from 'react';
import { Role } from '../types';
import { LOGIN_CODES, USER_PROFILES } from '../constants';
import { KeyIcon } from './Icons';

interface LoginScreenProps {
    onLogin: (role: Role) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        const role = LOGIN_CODES[code];
        if (role) {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(`ورود موفقیت آمیز! در حال انتقال به پنل ${USER_PROFILES[role].roleName}...`);
            setTimeout(() => {
                onLogin(role);
            }, 1500); // 1.5 second delay
        } else {
            setError('کد ورود نامعتبر است. لطفا دوباره تلاش کنید.');
            setCode('');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2 pt-10">
                        سامانه هوشمند ثبت اسناد
                    </h1>
                    <p className="text-lg text-slate-300">
                        برای ورود، کد شناسایی خود را وارد نمایید
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl px-8 pt-6 pb-8">
                    <form onSubmit={handleSubmit}>
                        <fieldset disabled={isLoading}>
                            <div className="mb-4">
                                <label htmlFor="login-code" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                    کد ورود
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <KeyIcon className="h-5 w-5 text-slate-400" />
                                    </span>
                                    <input
                                        id="login-code"
                                        type="password"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        placeholder="••••"
                                        className="bg-slate-900/70 text-white placeholder-slate-400 shadow-sm appearance-none border border-slate-600 rounded-lg w-full py-3 px-10 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center tracking-widest"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="h-6 mb-4 text-center">
                               {successMessage ? (
                                    <p className="text-green-400 text-sm font-semibold">{successMessage}</p>
                                ) : error ? (
                                    <p className="text-red-400 text-xs italic">{error}</p>
                                ) : null}
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-indigo-800 disabled:text-slate-400 disabled:cursor-wait"
                                >
                                    {isLoading ? 'در حال بررسی...' : 'ورود به سامانه'}
                                </button>
                            </div>
                        </fieldset>
                    </form>
                    <div className="text-center mt-6">
                        <p className="text-xs text-slate-400">راهنمای کدهای تست:</p>
                        <div className="text-xs text-slate-400 flex justify-center gap-x-4 mt-1">
                            <span>سردفتر: <code className="font-mono text-slate-200 bg-slate-700 px-1 py-0.5 rounded">1234</code></span>
                            <span>رئیس استان: <code className="font-mono text-slate-200 bg-slate-700 px-1 py-0.5 rounded">5678</code></span>
                            <span>رئیس کل: <code className="font-mono text-slate-200 bg-slate-700 px-1 py-0.5 rounded">9012</code></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginScreen;