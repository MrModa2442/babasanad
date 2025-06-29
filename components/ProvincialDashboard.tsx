import React, { useState } from 'react';
import { User, Document, DocumentStatus } from '../types';
import { CollectionIcon, BuildingLibraryIcon, UserGroupIcon, ArrowRightIcon, DocumentTextIcon, SearchIcon } from './Icons';

interface ProvincialDashboardProps {
    user: User;
    notaries: User[];
    documents: Document[];
    onSelectDocument: (doc: Document) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center">
        <div className="bg-teal-500/20 text-teal-300 p-3 rounded-full mr-4">{icon}</div>
        <div>
            <p className="text-sm text-slate-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
        case 'ثبت نهایی':
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300">ثبت نهایی</span>;
        case 'نیاز به بازبینی':
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-300">نیاز به بازبینی</span>;
        case 'پیش‌نویس':
        default:
            return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-500/20 text-slate-300">پیش‌نویس</span>;
    }
};

const ProvincialDashboard: React.FC<ProvincialDashboardProps> = ({ user, notaries, documents, onSelectDocument }) => {
    const [selectedNotary, setSelectedNotary] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    if (selectedNotary) {
        const notaryDocuments = documents.filter(doc => doc.notaryId === selectedNotary.id);
        const totalValue = notaryDocuments.reduce((sum, d) => sum + (d.value || 0), 0);
        
        const filteredDocuments = notaryDocuments.filter(doc => {
            const query = searchQuery.toLowerCase().trim();
            if (!query) return true;
            return (
                (doc.registrationNumber || '').toLowerCase().includes(query) ||
                (doc.type || '').toLowerCase().includes(query) ||
                (doc.subject || '').toLowerCase().includes(query)
            );
        });

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">
                        اسناد دفترخانه: {selectedNotary.officeName}
                    </h1>
                    <button
                        onClick={() => { setSelectedNotary(null); setSearchQuery(''); }}
                        className="flex items-center bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
                    >
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                        بازگشت به لیست دفترخانه‌ها
                    </button>
                </div>
                <p className="text-lg text-slate-300">سردفتر: {selectedNotary.name}</p>
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="تعداد کل اسناد" value={notaryDocuments.length.toLocaleString('fa-IR')} icon={<CollectionIcon className="w-6 h-6" />} />
                    <StatCard title="ارزش کل اسناد (ریال)" value={totalValue.toLocaleString('fa-IR')} icon={<DocumentTextIcon className="w-6 h-6" />} />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">لیست اسناد ثبت شده</h2>
                    <div className="mb-4 relative">
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-slate-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="جستجو در اسناد دفترخانه..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 rounded-lg bg-slate-900/70 border border-slate-600 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b-2 border-slate-700">
                                <tr>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">شماره ثبت</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">نوع سند</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">وضعیت</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">تاریخ ثبت</th>
                                    <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">عملیات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-700/50">
                                        <td className="p-3 text-sm text-slate-200">{doc.registrationNumber}</td>
                                        <td className="p-3 text-sm text-slate-200">{doc.type}</td>
                                        <td className="p-3 text-sm text-slate-200">{getStatusBadge(doc.status)}</td>
                                        <td className="p-3 text-sm text-slate-200">{new Date(doc.registrationDate).toLocaleDateString('fa-IR')}</td>
                                        <td className="p-3 text-sm">
                                            <button onClick={() => onSelectDocument(doc)} className="text-indigo-400 hover:text-indigo-300 font-semibold">
                                                مشاهده جزئیات
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={5} className="p-4 text-center text-slate-400">{searchQuery ? 'هیچ سندی با مشخصات مورد نظر یافت نشد.' : 'این سردفتر هنوز سندی ثبت نکرده است.'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">داشبورد مدیریتی استان {user.province}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="تعداد کل اسناد استان" value={documents.length.toLocaleString('fa-IR')} icon={<CollectionIcon className="w-6 h-6" />} />
                <StatCard title="تعداد دفترخانه‌های فعال" value={notaries.length.toLocaleString('fa-IR')} icon={<BuildingLibraryIcon className="w-6 h-6" />} />
                <StatCard title="تعداد سردفتران" value={notaries.length.toLocaleString('fa-IR')} icon={<UserGroupIcon className="w-6 h-6" />} />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">لیست سردفتران استان</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b-2 border-slate-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">نام سردفتر</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">دفترخانه</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">تعداد اسناد</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notaries.length > 0 ? notaries.map((notary) => (
                                <tr key={notary.id} className="cursor-pointer border-b border-slate-800 hover:bg-slate-700/50 transition-colors" onClick={() => { setSelectedNotary(notary); setSearchQuery(''); }}>
                                    <td className="p-3 text-sm font-semibold text-indigo-300">{notary.name}</td>
                                    <td className="p-3 text-sm text-slate-200">{notary.officeName}</td>
                                    <td className="p-3 text-sm text-slate-200">{documents.filter(d => d.notaryId === notary.id).length.toLocaleString('fa-IR')}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-slate-400">هیچ سردفتری در این استان ثبت‌نام نکرده است.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProvincialDashboard;