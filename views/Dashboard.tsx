import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { generateSchoolReport } from '../services/gemini';
import { Button } from '../components/ui';
import { Users, GraduationCap, School as SchoolIcon, BookOpen, Sparkles, Loader2 } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: number | string; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
            <Icon className={`text-${color.replace('bg-', '')}`} size={24} />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

export const DashboardView: React.FC = () => {
    const [counts, setCounts] = useState({ schools: 0, classes: 0, teachers: 0, students: 0 });
    const [aiReport, setAiReport] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        setCounts({
            schools: db.getSchools().length,
            classes: db.getClasses().length,
            teachers: db.getTeachers().length,
            students: db.getStudents().length
        });
    }, []);

    const handleGenerateReport = async () => {
        setLoadingAi(true);
        setAiReport('');
        const report = await generateSchoolReport();
        setAiReport(report);
        setLoadingAi(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
                <p className="text-slate-500">Bem-vindo ao EduGestão. Aqui estão os números do seu sistema.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Escolas" value={counts.schools} icon={SchoolIcon} color="bg-blue-100 text-blue-600" />
                <StatCard title="Turmas" value={counts.classes} icon={BookOpen} color="bg-indigo-100 text-indigo-600" />
                <StatCard title="Professores" value={counts.teachers} icon={GraduationCap} color="bg-purple-100 text-purple-600" />
                <StatCard title="Alunos" value={counts.students} icon={Users} color="bg-green-100 text-green-600" />
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-yellow-500" />
                        <h3 className="text-lg font-bold text-slate-800">Análise Inteligente (IA)</h3>
                    </div>
                    <Button onClick={handleGenerateReport} disabled={loadingAi} className="w-full sm:w-auto">
                        {loadingAi ? <><Loader2 className="animate-spin" size={18}/> Gerando...</> : 'Gerar Relatório com Gemini'}
                    </Button>
                </div>
                
                {aiReport ? (
                    <div className="prose prose-slate max-w-none bg-slate-50 p-6 rounded-lg border border-slate-200">
                         {/* Simple markdown rendering simulation */}
                         {aiReport.split('\n').map((line, i) => (
                             <p key={i} className="mb-2 text-slate-700 leading-relaxed">
                                 {line.startsWith('#') ? <strong className="text-slate-900 block text-lg mt-4 mb-2">{line.replace(/#/g, '')}</strong> : line}
                             </p>
                         ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p>Clique no botão acima para que a IA analise seus dados escolares.</p>
                    </div>
                )}
            </div>
        </div>
    );
};