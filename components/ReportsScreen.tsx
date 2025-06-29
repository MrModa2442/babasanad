import React, { useState } from 'react';
import { User, Document, Report, Role } from '../types';
import { PaperAirplaneIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon } from './Icons';

interface ReportsScreenProps {
    user: User;
    documents: Document[];
    reports: Report[];
    allUsers: User[];
    onSendReport: (documentId: string, message: string) => void;
    onReplyToReport: (reportId: string, reply: string) => void;
    onSelectDocument: (doc: Document) => void;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ user, documents, reports, allUsers, onSendReport, onReplyToReport, onSelectDocument }) => {
    const [showNewReportForm, setShowNewReportForm] = useState(false);
    const [selectedDocumentId, setSelectedDocumentId] = useState<string>('');
    const [message, setMessage] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const handleSendReport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDocumentId || !message.trim()) {
            alert('لطفاً یک سند انتخاب کرده و پیام خود را بنویسید.');
            return;
        }
        onSendReport(selectedDocumentId, message);
        setShowNewReportForm(false);
        setMessage('');
        setSelectedDocumentId('');
    };
    
    const handleSendReply = (reportId: string) => {
        if (!replyMessage.trim()) {
            alert('پاسخ نمی‌تواند خالی باشد.');
            return;
        }
        onReplyToReport(reportId, replyMessage);
        setReplyMessage('');
        setSelectedReportId(null);
    };

    const findDocumentById = (docId: string) => documents.find(d => d.id === docId);

    const renderStatusBadge = (status: 'pending' | 'answered') => {
        const isPending = status === 'pending';
        return (
            <span className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full ${isPending ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>
                {isPending ? <ClockIcon className="w-4 h-4 ml-1" /> : <CheckCircleIcon className="w-4 h-4 ml-1" />}
                {isPending ? 'در انتظار پاسخ' : 'پاسخ داده شده'}
            </span>
        );
    };

    const renderProvincialView = () => {
        const myReports = reports.filter(r => r.senderId === user.id);
        
        const userMap = new Map<string, User>(allUsers.map(u => [u.id, u]));
        const documentsForSelection = documents.filter(doc => {
            const docNotary = userMap.get(doc.notaryId);
            return docNotary?.province === user.province;
        });

        return (
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">ثبت و پیگیری گزارشات</h1>
                    <button
                        onClick={() => setShowNewReportForm(!showNewReportForm)}
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                        {showNewReportForm ? 'انصراف' : 'ایجاد گزارش جدید'}
                    </button>
                </div>

                {showNewReportForm && (
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                        <form onSubmit={handleSendReport} className="space-y-4">
                            <div>
                                <label htmlFor="document" className="block text-sm font-medium text-slate-300 mb-1">انتخاب سند</label>
                                <select 
                                    id="document"
                                    value={selectedDocumentId}
                                    onChange={e => setSelectedDocumentId(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">یک سند را انتخاب کنید...</option>
                                    {documentsForSelection.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.subject} (شماره ثبت: {doc.registrationNumber})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">پیام / سوال حقوقی</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="سوال یا پیام خود در مورد سند انتخابی را اینجا بنویسید..."
                                ></textarea>
                            </div>
                            <div className="text-left">
                                <button type="submit" className="flex items-center justify-center bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors">
                                    <PaperAirplaneIcon className="w-5 h-5 ml-2 transform -rotate-45" />
                                    ارسال گزارش
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                 <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">گزارش‌های ارسالی شما</h2>
                    <div className="space-y-4">
                        {myReports.length > 0 ? myReports.map(report => (
                            <div key={report.id} className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
                               <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-100">
                                            موضوع سند: {findDocumentById(report.documentId)?.subject || 'سند حذف شده'}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            تاریخ ارسال: {new Date(report.timestamp).toLocaleDateString('fa-IR', {hour: '2-digit', minute: '2-digit'})}
                                        </p>
                                        <p className="mt-2 text-slate-300">{report.message}</p>
                                    </div>
                                    {renderStatusBadge(report.status)}
                               </div>
                               {report.status === 'answered' && (
                                   <div className="mt-4 pt-4 border-t border-slate-700 border-dashed">
                                       <p className="font-semibold text-green-400">پاسخ رئیس کل:</p>
                                       <p className="text-slate-300">{report.reply}</p>
                                   </div>
                               )}
                            </div>
                        )) : <p className="text-center text-slate-400">شما هنوز گزارشی ارسال نکرده‌اید.</p>}
                    </div>
                </div>
            </div>
        );
    };

    const renderNationalView = () => {
        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold text-white">صندوق ورودی گزارشات</h1>
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">گزارشات دریافتی از استان‌ها</h2>
                     <div className="space-y-4">
                        {reports.length > 0 ? reports.map(report => (
                            <div key={report.id} className="border border-slate-700 rounded-lg p-4 bg-slate-900/40">
                                <div className="flex justify-between items-start">
                                     <div>
                                        <p className="font-bold text-slate-100">
                                            موضوع سند: {findDocumentById(report.documentId)?.subject || 'سند حذف شده'}
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            ارسال شده توسط: {report.senderName} | تاریخ: {new Date(report.timestamp).toLocaleDateString('fa-IR')}
                                        </p>
                                     </div>
                                     {renderStatusBadge(report.status)}
                                </div>
                                <p className="mt-2 text-slate-200 bg-slate-800/50 p-3 rounded-md">{report.message}</p>
                                <div className="mt-4 flex gap-4">
                                     <button 
                                        onClick={() => {
                                            const doc = findDocumentById(report.documentId);
                                            if (doc) onSelectDocument(doc);
                                        }}
                                        className="flex items-center text-indigo-400 font-semibold text-sm hover:underline"
                                    >
                                        <DocumentTextIcon className="w-5 h-5 ml-1" />
                                        مشاهده سند ضمیمه
                                    </button>
                                </div>
                                
                                {report.status === 'answered' ? (
                                    <div className="mt-4 pt-4 border-t border-slate-700 border-dashed">
                                       <p className="font-semibold text-green-400">پاسخ شما:</p>
                                       <p className="text-slate-300">{report.reply}</p>
                                   </div>
                                ) : (
                                   <div className="mt-4 pt-4 border-t border-slate-700">
                                        {selectedReportId === report.id ? (
                                            <form onSubmit={(e) => { e.preventDefault(); handleSendReply(report.id); }} className="space-y-2">
                                                <label htmlFor={`reply-${report.id}`} className="font-semibold text-slate-200">ارسال پاسخ:</label>
                                                <textarea 
                                                    id={`reply-${report.id}`}
                                                    rows={3} 
                                                    value={replyMessage}
                                                    onChange={e => setReplyMessage(e.target.value)}
                                                    className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" className="bg-green-600 text-white font-bold py-1 px-4 rounded-lg">ارسال</button>
                                                    <button type="button" onClick={() => setSelectedReportId(null)} className="bg-slate-600 py-1 px-4 rounded-lg">لغو</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button onClick={() => setSelectedReportId(report.id)} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">
                                                پاسخ به گزارش
                                            </button>
                                        )}
                                   </div>
                                )}
                            </div>
                        )) : <p className="text-center text-slate-400">هیچ گزارشی برای نمایش وجود ندارد.</p>}
                    </div>
                </div>
            </div>
        );
    };

    return user.role === Role.ProvincialHead ? renderProvincialView() : renderNationalView();
};

export default ReportsScreen;