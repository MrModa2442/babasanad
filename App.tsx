import React, { useState, useEffect } from 'react';
import { User, Role, Document, View, Report } from './types';
import { USER_PROFILES } from './constants';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotaryDashboard from './components/NotaryDashboard';
import DocumentForm from './components/DocumentForm';
import ProvincialDashboard from './components/ProvincialDashboard';
import NationalDashboard from './components/NationalDashboard';
import RegistrationForm from './components/RegistrationForm';
import ReportsScreen from './components/ReportsScreen';
import RoleLoginScreen from './components/RoleLoginScreen';

const APP_DATA_KEY = 'notary_app_data';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>('dashboard');
    const [registrationRole, setRegistrationRole] = useState<Role | null>(null);
    const [previousView, setPreviousView] = useState<View>('dashboard');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Load data from localStorage on initial render
    useEffect(() => {
        try {
            const savedDataJSON = localStorage.getItem(APP_DATA_KEY);
            if (savedDataJSON) {
                const savedData = JSON.parse(savedDataJSON);
                if (savedData.currentUser) {
                    setCurrentUser(savedData.currentUser);
                }
                setDocuments(savedData.documents || []);
                setRegisteredUsers(savedData.registeredUsers || []);
                setReports(savedData.reports || []);
            }
        } catch (error) {
            console.error("خطا در بارگیری اطلاعات از حافظه محلی:", error);
            localStorage.removeItem(APP_DATA_KEY);
        } finally {
            setIsDataLoaded(true);
        }
    }, []);

    // Save data to localStorage whenever it changes
    useEffect(() => {
        if (isDataLoaded) {
            try {
                const appData = { currentUser, documents, registeredUsers, reports };
                localStorage.setItem(APP_DATA_KEY, JSON.stringify(appData));
            } catch (error) {
                console.error("خطا در ذخیره اطلاعات در حافظه محلی:", error);
            }
        }
    }, [currentUser, documents, registeredUsers, reports, isDataLoaded]);

    const handleLogin = (role: Role) => {
        if (role === Role.NationalHead) {
            setCurrentUser(USER_PROFILES[role]);
            setView('dashboard');
        } else {
            setRegistrationRole(role);
            setView('role_login');
        }
    };
    
    const handleRegister = (data: { name: string; province: string; city?: string; officeName?: string }) => {
        if (!registrationRole) return;
        const newUser: User = {
            id: `user-${Date.now()}`,
            name: data.name,
            role: registrationRole,
            roleName: registrationRole === Role.Notary ? 'سردفتر' : 'رئیس دفترخانه‌های استان',
            province: data.province,
            city: data.city,
            officeName: data.officeName,
        };
        setRegisteredUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        setRegistrationRole(null);
        setView('dashboard');
    };
    
    const handleSelectExistingUser = (user: User) => {
        setCurrentUser(user);
        setView('dashboard');
        setRegistrationRole(null);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('dashboard');
        setRegistrationRole(null);
    };

    const handleSystemReset = () => {
        if (window.confirm('آیا مطمئن هستید که می‌خواهید سامانه را ریست کنید؟ تمام کاربران ثبت‌شده (سردفتران و روسای استانی)، اسناد و گزارشات حذف خواهند شد. این عمل غیرقابل بازگشت است.')) {
             try {
                // Construct the new state with only the current user (National Head) preserved.
                const newAppData = {
                    currentUser,
                    documents: [],
                    registeredUsers: [],
                    reports: []
                };

                // Directly save the reset state to localStorage.
                localStorage.setItem(APP_DATA_KEY, JSON.stringify(newAppData));
                
                // Alert the user and reload the page to apply changes from the clean localStorage.
                alert('سامانه با موفقیت ریست شد. صفحه برای اعمال تغییرات مجدداً بارگیری می‌شود.');
                window.location.reload();

            } catch (error) {
                console.error("خطا در هنگام ریست کردن اطلاعات در حافظه محلی:", error);
                alert('متاسفانه در هنگام ریست کردن سامانه خطایی رخ داد.');
            }
        }
    };

    const handleNavigation = (newView: View) => {
        setView(newView);
        setSelectedDocument(null);
    };

    const handleSelectDocument = (doc: Document) => {
        setPreviousView(view);
        setSelectedDocument(doc);
        setView('document_form');
    };
    
    const handleSaveDocument = (doc: Document) => {
        if (!currentUser) return;
        
        if (doc.id) {
            setDocuments(docs => docs.map(d => d.id === doc.id ? doc : d));
        } else {
            const newDoc = { 
                ...doc, 
                id: `doc-${Date.now()}`, 
                registrationDate: new Date().toISOString().split('T')[0],
                notaryId: currentUser.id,
                officeName: currentUser.officeName || 'نامشخص'
            };
            setDocuments(docs => [newDoc, ...docs]);
        }
        setView('dashboard');
        setSelectedDocument(null);
    };
    
    const handleCancelForm = () => {
        setView(previousView);
        setSelectedDocument(null);
    }

    const handleSendReport = (documentId: string, message: string) => {
        if (!currentUser) return;
        const newReport: Report = {
            id: `report-${Date.now()}`,
            documentId,
            message,
            senderId: currentUser.id,
            senderName: currentUser.name,
            status: 'pending',
            timestamp: new Date().toISOString(),
        };
        setReports(prev => [newReport, ...prev]);
        setView('reports');
    };

    const handleReplyToReport = (reportId: string, reply: string) => {
        setReports(prev => prev.map(report => 
            report.id === reportId ? { ...report, reply, status: 'answered' } : report
        ));
    };


    if (!isDataLoaded) {
        return <div className="w-full h-screen flex justify-center items-center text-white">...درحال بارگذاری</div>
    }

    if (!currentUser) {
        if (view === 'role_login' && registrationRole) {
            const usersForRole = registeredUsers.filter(u => u.role === registrationRole);
            return (
                <RoleLoginScreen
                    role={registrationRole}
                    users={usersForRole}
                    onSelectUser={handleSelectExistingUser}
                    onRegisterNew={() => setView('registration')}
                    onBack={() => { setView('dashboard'); setRegistrationRole(null); }}
                />
            );
        }
        if (view === 'registration' && registrationRole) {
            return <RegistrationForm onRegister={handleRegister} role={registrationRole} onBack={() => setView('role_login')} />;
        }
        return <LoginScreen onLogin={handleLogin} />;
    }

    const renderContent = () => {
        switch (view) {
            case 'document_form':
                return (
                    <DocumentForm
                        document={selectedDocument}
                        onSave={handleSaveDocument}
                        onCancel={handleCancelForm}
                        readOnly={!!selectedDocument && currentUser.role !== Role.Notary}
                    />
                );
            case 'reports':
                return (
                    <ReportsScreen 
                        user={currentUser}
                        documents={documents}
                        reports={reports}
                        allUsers={registeredUsers}
                        onSendReport={handleSendReport}
                        onReplyToReport={handleReplyToReport}
                        onSelectDocument={handleSelectDocument}
                    />
                );
            case 'dashboard':
            default:
                switch (currentUser.role) {
                    case Role.Notary:
                        return (
                            <NotaryDashboard
                                user={currentUser}
                                documents={documents.filter(d => d.notaryId === currentUser.id)}
                                onNewDocument={() => handleNavigation('document_form')}
                                onSelectDocument={handleSelectDocument}
                            />
                        );
                    case Role.ProvincialHead:
                        const notariesInProvince = registeredUsers.filter(u => u.role === Role.Notary && u.province === currentUser.province);
                        const notaryIdsInProvince = new Set(notariesInProvince.map(n => n.id));
                        const documentsInProvince = documents.filter(d => notaryIdsInProvince.has(d.notaryId));
                        
                        return <ProvincialDashboard 
                                    user={currentUser} 
                                    documents={documentsInProvince} 
                                    notaries={notariesInProvince}
                                    onSelectDocument={handleSelectDocument}
                                />;
                    case Role.NationalHead:
                        const allRegisteredNotaries = registeredUsers.filter(u => u.role === Role.Notary);
                        return <NationalDashboard 
                                    documents={documents} 
                                    notaries={allRegisteredNotaries} 
                                    onSelectDocument={handleSelectDocument}
                                    onSystemReset={handleSystemReset}
                                />;
                    default:
                        return <div>نقش کاربر نامعتبر است</div>;
                }
        }
    };

    return (
        <div className="flex h-screen text-gray-200">
            <Sidebar user={currentUser} onNavigate={handleNavigation} currentView={view} />
            <div className="flex-1 flex flex-col">
                <Header user={currentUser} onLogout={handleLogout} />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;