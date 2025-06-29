import React, { useState } from 'react';
import { Document, User, DocumentStatus } from '../types';
import { CollectionIcon, LocationMarkerIcon, BuildingLibraryIcon, SearchIcon, TrashIcon } from './Icons';

interface NationalDashboardProps {
    documents: Document[];
    notaries: User[];
    onSelectDocument: (doc: Document) => void;
    onSystemReset: () => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center">
        <div className="bg-purple-500/20 text-purple-300 p-3 rounded-full mr-4">{icon}</div>
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

const NationalDashboard: React.FC<NationalDashboardProps> = ({ documents, notaries, onSelectDocument, onSystemReset }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const totalDocuments = documents.length;
    const totalNotaries = notaries.length;
    const notaryMap = new Map<string, User>(notaries.map(n => [n.id, n]));

    const activeProvinces = new Set(notaries.map(n => n.province).filter(Boolean as any));
    const totalActiveProvinces = activeProvinces.size;

    const filteredDocuments = documents.filter(doc => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        const notary = notaryMap.get(doc.notaryId);
        return (
            (doc.registrationNumber || '').toLowerCase().includes(query) ||
            (doc.type || '').toLowerCase().includes(query) ||
            (doc.subject || '').toLowerCase().includes(query) ||
            (doc.officeName || '').toLowerCase().includes(query) ||
            (notary?.province && notary.province.toLowerCase().includes(query)) ||
            (doc.parties.seller || '').toLowerCase().includes(query) ||
            (doc.parties.buyer || '').toLowerCase().includes(query)
        );
    });

    const documentsByProvince = documents.reduce((acc, doc) => {
        const notary = notaryMap.get(doc.notaryId);
        const province = notary?.province;
        if (province) {
            acc[province] = (acc[province] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const provinceStats = Object.entries(documentsByProvince)
        .map(([province, count]) => ({ province, count }))
        .sort((a, b) => b.count - a.count);

    const maxDocs = provinceStats.length > 0 ? Math.max(...provinceStats.map(s => s.count)) : 1;

    return (
        <div className="space-y-8">
             <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-white">داشبورد مدیریتی کل کشور</h1>
                 <button
                    onClick={onSystemReset}
                    className="flex items-center bg-red-600/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-600/30"
                    title="تمام کاربران (سردفتران و روسای استانی)، اسناد و گزارشات را حذف می‌کند."
                >
                    <TrashIcon className="w-5 h-5 ml-2" />
                    ریست کامل سامانه
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="تعداد کل اسناد کشور" value={totalDocuments.toLocaleString('fa-IR')} icon={<CollectionIcon className="w-6 h-6" />} />
                <StatCard title="تعداد استان‌های فعال" value={totalActiveProvinces.toLocaleString('fa-IR')} icon={<LocationMarkerIcon className="w-6 h-6" />} />
                <StatCard title="تعداد کل دفترخانه‌ها" value={totalNotaries.toLocaleString('fa-IR')} icon={<BuildingLibraryIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">آمار اسناد بر اساس استان</h2>
                     <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {provinceStats.length > 0 ? provinceStats.map(({ province, count }) => (
                            <div key={province} className="flex justify-between items-center gap-4">
                                <span className="font-semibold w-28 text-right truncate text-slate-300">{province}</span>
                                <div className="w-full bg-slate-700 rounded-full h-4">
                                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-4 rounded-full transition-all duration-500" style={{ width: `${(count / maxDocs) * 100}%` }}></div>
                                </div>
                                <span className="font-bold w-16 text-left text-white">{count.toLocaleString('fa-IR')}</span>
                            </div>
                        )) : (
                            <p className="text-center text-slate-400">داده‌ای برای نمایش آمار استانی وجود ندارد.</p>
                        )}
                     </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg xl:col-span-1 flex flex-col justify-center">
                     <h2 className="text-xl font-bold text-white mb-4">گزارش سریع</h2>
                      <p className="text-slate-300 leading-relaxed">در حال حاضر، <strong className="font-bold text-purple-400">{totalNotaries.toLocaleString('fa-IR')}</strong> دفترخانه فعال در <strong className="font-bold text-purple-400">{totalActiveProvinces.toLocaleString('fa-IR')}</strong> استان، مجموعاً <strong className="font-bold text-purple-400">{totalDocuments.toLocaleString('fa-IR')}</strong> سند را در سامانه به ثبت رسانده‌اند.</p>
                </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">لیست تمام اسناد کشور</h2>
                <div className="mb-4 relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="جستجو در تمام اسناد کشور (بر اساس شماره، نوع، دفترخانه، استان...)"
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
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">دفترخانه</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">استان</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">وضعیت</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">تاریخ ثبت</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.length > 0 ? filteredDocuments.map((doc, index) => {
                                const notary = notaryMap.get(doc.notaryId);
                                return (
                                    <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-700/50">
                                        <td className="p-3 text-sm text-slate-200">{doc.registrationNumber}</td>
                                        <td className="p-3 text-sm text-slate-200">{doc.type}</td>
                                        <td className="p-3 text-sm text-slate-200">{doc.officeName}</td>
                                        <td className="p-3 text-sm text-slate-200">{notary?.province || 'نامشخص'}</td>
                                        <td className="p-3 text-sm text-slate-200">{getStatusBadge(doc.status)}</td>
                                        <td className="p-3 text-sm text-slate-200">{new Date(doc.registrationDate).toLocaleDateString('fa-IR')}</td>
                                        <td className="p-3 text-sm">
                                            <button
                                                onClick={() => onSelectDocument(doc)}
                                                className="text-indigo-400 hover:text-indigo-300 font-semibold"
                                            >
                                                مشاهده جزئیات
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-4 text-slate-400">{searchQuery ? 'هیچ سندی با مشخصات مورد نظر یافت نشد.' : 'هیچ سندی در سامانه ثبت نشده است.'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NationalDashboard;