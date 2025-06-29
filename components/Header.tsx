import React from 'react';
import { User } from '../types';
import { LogoutIcon, UserCircleIcon } from './Icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-slate-900/60 backdrop-blur-md border-b border-slate-700 p-4 flex justify-between items-center z-10">
            <div className="flex items-center">
                <UserCircleIcon className="w-10 h-10 text-indigo-400 mr-3" />
                <div>
                    <h2 className="text-lg font-bold text-gray-100">{user.name}</h2>
                    <p className="text-sm text-gray-400">{user.roleName} {user.officeName || user.province || ''}</p>
                </div>
            </div>
            <button
                onClick={onLogout}
                className="flex items-center bg-red-600/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
                <LogoutIcon className="w-5 h-5 ml-2" />
                خروج
            </button>
        </header>
    );
};

export default Header;