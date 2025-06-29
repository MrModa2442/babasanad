import React, { useState } from 'react';
import { User, Document, DocumentStatus } from '../types';
import { DocumentTextIcon, CollectionIcon, DocumentAddIcon, CalendarIcon, SearchIcon } from './Icons';

interface NotaryDashboardProps {
    user: User;
    documents: Document[];
    onNewDocument: () => void;
    onSelectDocument: (doc: Document) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg flex items-center">
        <div className="bg-indigo-500/20 text-indigo-300 p-3 rounded-full mr-4">{icon}</div>
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


const NotaryDashboard: React.FC<NotaryDashboardProps> = ({ user, documents, onNewDocument, onSelectDocument }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const totalDocuments = documents.length;
    const totalValue = documents.reduce((sum, d) => sum + (d.value || 0), 0);

    const filteredDocuments = documents.filter(doc => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            (doc.registrationNumber || '').toLowerCase().includes(query) ||
            (doc.type || '').toLowerCase().includes(query) ||
            (doc.subject || '').toLowerCase().includes(query) ||
            (doc.parties.seller || '').toLowerCase().includes(query) ||
            (doc.parties.buyer || '').toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">داشبورد سردفتر</h1>
                <button
                    onClick={onNewDocument}
                    className="flex items-center bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                >
                    <DocumentAddIcon className="w-6 h-6 ml-2"/>
                    ثبت سند جدید
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="تعداد کل اسناد شما" value={totalDocuments.toLocaleString('fa-IR')} icon={<CollectionIcon className="w-6 h-6" />} />
                <StatCard title="اسناد ماه جاری" value={'۰'} icon={<CalendarIcon className="w-6 h-6" />} />
                <StatCard title="ارزش کل اسناد (ریال)" value={totalValue.toLocaleString('fa-IR')} icon={<DocumentTextIcon className="w-6 h-6" />} />
            </div>

            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">سوابق اسناد ثبت شده توسط شما</h2>
                
                <div className="mb-4 relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-slate-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="جستجو در اسناد (بر اساس شماره، نوع، موضوع، طرفین...)"
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
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">طرفین قرارداد</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">وضعیت</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">تاریخ ثبت</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-slate-300">عملیات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.length > 0 ? filteredDocuments.map((doc, index) => (
                                <tr key={doc.id} className="border-b border-slate-800 hover:bg-slate-700/50">
                                    <td className="p-3 text-sm text-slate-200">{doc.registrationNumber}</td>
                                    <td className="p-3 text-sm text-slate-200">{doc.type}</td>
                                    <td className="p-3 text-sm text-slate-200">{`${doc.parties.seller} / ${doc.parties.buyer}`}</td>
                                    <td className="p-3 text-sm text-slate-200">{getStatusBadge(doc.status)}</td>
                                    <td className="p-3 text-sm text-slate-200">{new Date(doc.registrationDate).toLocaleDateString('fa-IR')}</td>
                                    <td className="p-3 text-sm">
                                        <button
                                            onClick={() => onSelectDocument(doc)}
                                            className="text-indigo-400 hover:text-indigo-300 font-semibold"
                                        >
                                            مشاهده / ویرایش
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-slate-400">{searchQuery ? 'هیچ سندی با مشخصات مورد نظر یافت نشد.' : 'شما هنوز هیچ سندی ثبت نکرده‌اید.'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NotaryDashboard;