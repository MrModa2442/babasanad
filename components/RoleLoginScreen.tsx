import React, { useState } from 'react';
import { Role, User } from '../types';
import { ArrowLeftIcon } from './Icons';

interface RoleLoginScreenProps {
    role: Role;
    users: User[];
    onSelectUser: (user: User) => void;
    onRegisterNew: () => void;
    onBack: () => void;
}

const RoleLoginScreen: React.FC<RoleLoginScreenProps> = ({ role, users, onSelectUser, onRegisterNew, onBack }) => {
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) {
            alert('لطفاً یک کاربر را برای ورود انتخاب کنید.');
            return;
        }
        const user = users.find(u => u.id === selectedUserId);
        if (user) {
            onSelectUser(user);
        }
    };

    const roleTitle = role === Role.Notary ? 'سردفتر' : 'رئیس استان';

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        ورود / ثبت‌نام {roleTitle}
                    </h1>
                    <p className="text-lg text-slate-300">
                        کاربر خود را انتخاب کرده یا یک حساب جدید بسازید.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl px-8 pt-6 pb-8 space-y-8">
                    {users.length > 0 ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label htmlFor="user-select" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                    ورود کاربر موجود
                                </label>
                                <select
                                    id="user-select"
                                    value={selectedUserId}
                                    onChange={(e) => setSelectedUserId(e.target.value)}
                                    className="bg-slate-900/70 border border-slate-600 text-white text-right shadow-sm appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">یک کاربر را انتخاب کنید...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.officeName || user.province})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedUserId}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-indigo-800 disabled:text-slate-400"
                            >
                                ورود به پنل
                            </button>
                        </form>
                    ) : (
                        <div className="text-center text-slate-400 p-4 border-2 border-dashed border-slate-600 rounded-lg">
                            <p>هنوز هیچ {roleTitle}ی ثبت‌نام نکرده است.</p>
                            <p>لطفاً یک کاربر جدید ثبت‌نام کنید.</p>
                        </div>
                    )}

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-800 text-slate-400">یا</span>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={onRegisterNew}
                            className="w-full flex justify-center items-center bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
                        >
                            ثبت نام {roleTitle} جدید
                        </button>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    className="w-full flex items-center justify-center text-slate-300 hover:text-indigo-400 font-semibold mt-6 transition-colors"
                >
                     <ArrowLeftIcon className="w-5 h-5 ml-2" />
                    بازگشت به صفحه اصلی
                </button>
            </div>
        </div>
    );
};

export default RoleLoginScreen;