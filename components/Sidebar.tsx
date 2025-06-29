import React from 'react';
import { User, Role, View } from '../types';
import { HomeIcon, DocumentAddIcon, InboxInIcon } from './Icons';

interface SidebarProps {
    user: User;
    onNavigate: (view: View) => void;
    currentView: View;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <li
        onClick={onClick}
        className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
            isActive
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span className="mr-3 font-semibold">{label}</span>
    </li>
);

const Sidebar: React.FC<SidebarProps> = ({ user, onNavigate, currentView }) => {
    const getReportsLabel = () => {
        if (user.role === Role.ProvincialHead) return "ثبت و پیگیری گزارش";
        if (user.role === Role.NationalHead) return "صندوق ورودی گزارشات";
        return "گزارشات";
    }

    return (
        <aside className="w-64 bg-slate-900/40 backdrop-blur-lg border-l border-slate-700 text-white flex flex-col p-4">
            <div className="text-center py-4 mb-4 border-b border-slate-700">
                 <img src="/logo.jpg" alt="لوگوی سامانه" className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-slate-600" />
                <h1 className="text-2xl font-bold text-white">سامانه اسناد</h1>
            </div>
            <nav className="flex-1">
                <ul>
                    <NavItem
                        icon={<HomeIcon className="w-6 h-6" />}
                        label="داشبورد"
                        isActive={currentView === 'dashboard'}
                        onClick={() => onNavigate('dashboard')}
                    />
                    {user.role === Role.Notary && (
                        <NavItem
                            icon={<DocumentAddIcon className="w-6 h-6" />}
                            label="ثبت سند جدید"
                            isActive={currentView === 'document_form'}
                            onClick={() => onNavigate('document_form')}
                        />
                    )}
                    {(user.role === Role.ProvincialHead || user.role === Role.NationalHead) && (
                         <NavItem
                            icon={<InboxInIcon className="w-6 h-6" />}
                            label={getReportsLabel()}
                            isActive={currentView === 'reports'}
                            onClick={() => onNavigate('reports')}
                        />
                    )}
                </ul>
            </nav>
            <div className="text-center text-xs text-slate-500 mt-auto pt-4">
                <p>نسخه ۱.۳.۰ - تم کهکشان</p>
            </div>
        </aside>
    );
};

export default Sidebar;