import React, { useState, useEffect } from 'react';
import { Role } from '../types';
import { IRAN_DATA, PROVINCES } from '../constants';

interface RegistrationFormProps {
    onRegister: (data: { name: string; province: string; city?: string; officeName?: string; }) => void;
    role: Role;
    onBack: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, role, onBack }) => {
    const [name, setName] = useState('');
    const [officeName, setOfficeName] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const isNotary = role === Role.Notary;

    useEffect(() => {
        if (province) {
            setCities(IRAN_DATA[province as keyof typeof IRAN_DATA] || []);
            setCity(''); // Reset city on province change
        } else {
            setCities([]);
            setCity('');
        }
    }, [province]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !province || (isNotary && (!officeName.trim() || !city))) {
            alert('لطفاً تمام فیلدهای ستاره‌دار را پر کنید.');
            return;
        }
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
             onRegister({ 
                name, 
                province, 
                city: isNotary ? city : undefined, 
                officeName: isNotary ? officeName : undefined 
            });
        }, 1000);
    };
    
    const title = isNotary ? 'تکمیل ثبت‌نام سردفتر' : 'تکمیل ثبت‌نام رئیس استان';
    const subtitle = 'اطلاعات خود را برای ایجاد حساب کاربری وارد کنید.';

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-300">
                        {subtitle}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl px-8 pt-6 pb-8">
                    <fieldset disabled={isLoading} className="space-y-4">
                        <div>
                            <label htmlFor="full-name" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                نام و نام خانوادگی <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="full-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="مثال: علی محمدی"
                                className="bg-slate-900/70 border border-slate-600 text-white placeholder-slate-400 text-right shadow-sm appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                                autoFocus
                            />
                        </div>

                        <div>
                            <label htmlFor="province" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                استان <span className="text-red-400">*</span>
                            </label>
                            <select
                                id="province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="bg-slate-900/70 border border-slate-600 text-white text-right shadow-sm appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                <option value="">انتخاب استان...</option>
                                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        
                        {isNotary && (
                            <>
                                <div>
                                    <label htmlFor="city" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                        شهر <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="bg-slate-900/70 border border-slate-600 text-white text-right shadow-sm appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required={isNotary}
                                        disabled={!province}
                                    >
                                        <option value="">ابتدا استان را انتخاب کنید...</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="office-name" className="block text-slate-300 text-sm font-bold mb-2 text-right">
                                        شماره و نام دفترخانه <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="office-name"
                                        type="text"
                                        value={officeName}
                                        onChange={(e) => setOfficeName(e.target.value)}
                                        placeholder="مثال: دفترخانه ۱۲۳ تهران"
                                        className="bg-slate-900/70 border border-slate-600 text-white placeholder-slate-400 text-right shadow-sm appearance-none rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        required={isNotary}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex items-center justify-between pt-4">
                            <button
                                type="button"
                                onClick={onBack}
                                disabled={isLoading}
                                className="bg-slate-600/70 text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
                            >
                                بازگشت
                            </button>
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-indigo-800 disabled:text-slate-400 disabled:cursor-wait"
                            >
                                {isLoading ? 'در حال ثبت نام...' : 'ثبت نام و ورود'}
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;