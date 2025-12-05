
import React, { useState } from 'react';
import { ViewState } from './types';
import { db } from './services/storage';
import { DashboardView } from './views/Dashboard';
import { SchoolsView } from './views/SchoolsView';
import { ClassesView } from './views/ClassesView';
import { TeachersView } from './views/TeachersView';
import { StudentsView } from './views/StudentsView';
import { RolesView } from './views/RolesView';
import { LoginView } from './views/LoginView';
import { LayoutDashboard, School as SchoolIcon, BookOpen, GraduationCap, Users, Menu, X, Briefcase, LogOut } from 'lucide-react';

const SidebarItem: React.FC<{ 
    label: string; 
    icon: any; 
    active: boolean; 
    onClick: () => void 
}> = ({ label, icon: Icon, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1
        ${active ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
    >
        <Icon size={20} />
        {label}
    </button>
);

interface Session {
    user: string;
    schoolId: string;
    schoolName: string;
}

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [session, setSession] = useState<Session | null>(null);

    const handleLogin = (schoolId: string, user: string) => {
        const schools = db.getSchools();
        const schoolName = schools.find(s => s.id === schoolId)?.name || 'Escola Desconhecida';
        setSession({ user, schoolId, schoolName });
    };

    const handleLogout = () => {
        setSession(null);
        setCurrentView(ViewState.DASHBOARD);
    };

    const renderContent = () => {
        switch (currentView) {
            case ViewState.DASHBOARD: return <DashboardView />;
            case ViewState.SCHOOLS: return <SchoolsView />;
            case ViewState.CLASSES: return <ClassesView />;
            case ViewState.TEACHERS: return <TeachersView />;
            case ViewState.STUDENTS: return <StudentsView />;
            case ViewState.ROLES: return <RolesView />;
            default: return <DashboardView />;
        }
    };

    const navItems = [
        { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
        { view: ViewState.SCHOOLS, label: 'Escolas', icon: SchoolIcon },
        { view: ViewState.CLASSES, label: 'Turmas', icon: BookOpen },
        { view: ViewState.TEACHERS, label: 'Professores', icon: GraduationCap },
        { view: ViewState.STUDENTS, label: 'Alunos', icon: Users },
        { view: ViewState.ROLES, label: 'Funções', icon: Briefcase },
    ];

    // If not authenticated, show Login View
    if (!session) {
        return <LoginView onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white p-4 flex flex-col transition-transform duration-300
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex justify-between items-center mb-8 px-2">
                    <h1 className="text-xl font-bold tracking-tight">EduGestão</h1>
                    <button className="lg:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="mb-6 px-4 py-3 bg-slate-800 rounded-lg">
                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Logado em</p>
                    <p className="text-sm font-semibold text-white truncate">{session.schoolName}</p>
                    <p className="text-xs text-slate-400 mt-1">Usuário: {session.user}</p>
                </div>

                <nav className="flex-1">
                    {navItems.map(item => (
                        <SidebarItem 
                            key={item.view}
                            label={item.label}
                            icon={item.icon}
                            active={currentView === item.view}
                            onClick={() => {
                                setCurrentView(item.view);
                                setMobileMenuOpen(false);
                            }}
                        />
                    ))}
                </nav>

                <div className="pt-4 border-t border-slate-800">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors rounded-lg"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                    <div className="text-xs text-slate-500 text-center mt-4">
                        v1.2.0 &copy; 2024
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 lg:hidden">
                    <button className="text-slate-600" onClick={() => setMobileMenuOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-semibold text-slate-800">EduGestão</span>
                </header>
                
                <div className="flex-1 overflow-auto p-4 sm:p-8">
                    <div className="max-w-6xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;