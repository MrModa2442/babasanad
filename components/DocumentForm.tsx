import React, { useState, useEffect } from 'react';
import { Document, DocumentStatus } from '../types';
import { DOCUMENT_TEMPLATES, DocumentTemplate, DOCUMENT_STATUS_OPTIONS } from '../constants';
import { PaperClipIcon, DownloadIcon } from './Icons';

interface DocumentFormProps {
    document: Document | null;
    onSave: (doc: Document) => void;
    onCancel: () => void;
    readOnly: boolean;
}

const emptyDocument: Omit<Document, 'id'> = {
    notaryId: '',
    officeName: '',
    type: '',
    parties: { seller: '', buyer: '' },
    subject: '',
    content: '',
    registrationNumber: '',
    registrationDate: new Date().toISOString().split('T')[0],
    value: 0,
    status: 'پیش‌نویس',
    attachmentName: undefined,
};


const FormInput: React.FC<{
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly: boolean;
    type?: string;
    required?: boolean;
}> = ({ label, id, value, onChange, readOnly, type = "text", required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label} {required && !readOnly && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            required={required}
            className={`w-full p-2.5 rounded-lg transition-colors text-slate-100 ${readOnly ? 'bg-slate-800/60 border-slate-700 cursor-not-allowed' : 'bg-slate-900/70 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
        />
    </div>
);

const FormTextarea: React.FC<{
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    readOnly: boolean;
    rows?: number;
}> = ({ label, id, value, onChange, readOnly, rows = 5 }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            rows={rows}
            className={`w-full p-2.5 rounded-lg transition-colors text-slate-100 ${readOnly ? 'bg-slate-800/60 border-slate-700 cursor-not-allowed' : 'bg-slate-900/70 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
        />
    </div>
);


const DocumentForm: React.FC<DocumentFormProps> = ({ document, onSave, onCancel, readOnly }) => {
    const [formData, setFormData] = useState<Omit<Document, 'id'> | Document>(document || emptyDocument);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');

    useEffect(() => {
        setFormData(document || emptyDocument);
        if (!document) {
            setSelectedTemplate('');
        }
    }, [document]);

    useEffect(() => {
        if (selectedTemplate && !readOnly) {
            const template = DOCUMENT_TEMPLATES.find(t => t.name === selectedTemplate);
            if (template) {
                setFormData(prev => ({
                    ...prev,
                    type: template.type,
                    subject: template.subject,
                    content: template.content,
                }));
            }
        }
    }, [selectedTemplate, readOnly]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { // @ts-ignore
                    ...prev[parent],
                    [child]: value,
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'value' ? parseFloat(value) || 0 : value }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, attachmentName: file.name }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Document);
    };

    const isEditing = document && !readOnly;
    const isViewing = readOnly;
    const isCreating = !document;

    const getTitle = () => {
        if (isViewing) return 'مشاهده جزئیات سند';
        if (isEditing) return 'ویرایش سند';
        return 'ثبت سند جدید';
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
                {getTitle()}
            </h1>

            {isCreating && (
                <div className="mb-6 bg-indigo-900/30 p-4 rounded-lg border border-indigo-700">
                    <label htmlFor="template-select" className="block text-sm font-medium text-indigo-200 mb-2">
                        استفاده از قالب آماده (اختیاری)
                    </label>
                    <select
                        id="template-select"
                        value={selectedTemplate}
                        onChange={e => setSelectedTemplate(e.target.value)}
                        className="w-full p-2.5 rounded-lg bg-slate-900/70 border border-slate-600 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">-- بدون قالب --</option>
                        {DOCUMENT_TEMPLATES.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="border-b border-slate-700 pb-6">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">اطلاعات پایه سند</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="نوع سند" id="type" value={formData.type} onChange={handleChange} readOnly={readOnly} required/>
                        <FormInput label="شماره ثبت" id="registrationNumber" value={formData.registrationNumber} onChange={handleChange} readOnly={readOnly} required/>
                    </div>
                 </div>
                
                <div className="border-b border-slate-700 pb-6">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">طرفین قرارداد</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="طرف اول (فروشنده/موکل)" id="parties.seller" value={formData.parties.seller} onChange={handleChange} readOnly={readOnly} required/>
                        <FormInput label="طرف دوم (خریدار/وکیل)" id="parties.buyer" value={formData.parties.buyer} onChange={handleChange} readOnly={readOnly} required/>
                    </div>
                </div>

                <div className="border-b border-slate-700 pb-6">
                     <h2 className="text-xl font-semibold text-slate-200 mb-4">جزئیات و محتوای سند</h2>
                    <div className="space-y-4">
                        <FormInput label="موضوع سند" id="subject" value={formData.subject} onChange={handleChange} readOnly={readOnly} required/>
                        <FormTextarea label="متن کامل سند" id="content" value={formData.content} onChange={handleChange} readOnly={readOnly} rows={8} />
                    </div>
                </div>

                <div className="border-b border-slate-700 pb-6">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">اطلاعات مالی و اداری</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput label="ارزش سند (ریال)" id="value" type="number" value={formData.value} onChange={handleChange} readOnly={readOnly} required/>
                         <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">وضعیت سند</label>
                            <select 
                                id="status" 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                disabled={readOnly}
                                className={`w-full p-2.5 rounded-lg transition-colors text-slate-100 ${readOnly ? 'bg-slate-800/60 border-slate-700 cursor-not-allowed' : 'bg-slate-900/70 border border-slate-600 focus:ring-indigo-500 focus:border-indigo-500'}`}
                            >
                               {Object.entries(DOCUMENT_STATUS_OPTIONS).map(([key, value]) => (
                                   <option key={key} value={key}>{value}</option>
                               ))}
                            </select>
                         </div>
                    </div>
                </div>

                <div className="border-b border-slate-700 pb-6">
                    <h2 className="text-xl font-semibold text-slate-200 mb-4">فایل پیوست</h2>
                    {readOnly ? (
                        formData.attachmentName ? (
                            <div className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg">
                                <div className='flex items-center'>
                                    <PaperClipIcon className="w-5 h-5 ml-3 text-slate-400"/>
                                    <span className="text-slate-200">{formData.attachmentName}</span>
                                </div>
                                <button type="button" className="flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                                    <DownloadIcon className="w-5 h-5 ml-1"/>
                                    دانلود
                                </button>
                            </div>
                        ) : <p className="text-slate-400">فایلی پیوست نشده است.</p>
                    ) : (
                        <div>
                             <label htmlFor="attachment-file" className="w-full flex items-center justify-center p-4 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700/50 hover:border-indigo-500 transition-colors">
                                <PaperClipIcon className="w-6 h-6 ml-3 text-slate-400"/>
                                <span className="text-slate-300">{formData.attachmentName || 'برای انتخاب فایل کلیک کنید یا فایل را اینجا بکشید'}</span>
                                <input id="attachment-file" type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-slate-700/80 text-slate-200 font-bold py-2 px-6 rounded-lg hover:bg-slate-600/90 transition-colors"
                    >
                        {readOnly ? 'بازگشت' : 'انصراف'}
                    </button>
                    {!readOnly && (
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                            {isCreating ? 'ذخیره سند' : 'ذخیره تغییرات'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DocumentForm;