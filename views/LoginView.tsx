
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { School } from '../types';
import { Button, Input, Select } from '../components/ui';
import { GraduationCap } from 'lucide-react';

interface LoginViewProps {
    onLogin: (schoolId: string, username: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const [schools, setSchools] = useState<School[]>([]);
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        schoolId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        setSchools(db.getSchools());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.login || !formData.password || !formData.schoolId) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        // Mock authentication success
        onLogin(formData.schoolId, formData.login);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 border border-slate-200">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-teal-100 p-4 rounded-full mb-4">
                        <GraduationCap size={48} className="text-teal-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">EduGestão</h1>
                    <p className="text-slate-500">Sistema de Gestão Escolar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        label="Usuário" 
                        placeholder="admin"
                        value={formData.login} 
                        onChange={e => setFormData({...formData, login: e.target.value})}
                    />
                    <Input 
                        label="Senha" 
                        type="password"
                        placeholder="••••••"
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <Select 
                        label="Selecione a Escola" 
                        value={formData.schoolId}
                        onChange={e => setFormData({...formData, schoolId: e.target.value})}
                        options={schools.map(s => ({ value: s.id, label: s.name }))}
                    />

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full justify-center mt-4">
                        Entrar no Sistema
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    &copy; 2024 EduGestão Inc.
                </div>
            </div>
        </div>
    );
};