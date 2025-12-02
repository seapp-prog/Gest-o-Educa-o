
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { Student, ClassRoom, School } from '../types';
import { Button, Input, Select, Modal, TableHeader, Badge } from '../components/ui';
import { Plus, Edit2, Archive, Search, Download } from 'lucide-react';

export const StudentsView: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ 
        name: '', 
        cpf: '', 
        birthDate: '', 
        guardianName: '', 
        matricula: '', 
        classId: '',
        schoolId: '' 
    });

    const loadData = () => {
        setStudents(db.getStudents());
        setClasses(db.getClasses());
        setSchools(db.getSchools());
    };

    useEffect(() => { loadData(); }, []);

    const filtered = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.matricula.includes(searchTerm)
    );

    const getClassDetails = (id: string) => {
        const c = classes.find(cl => cl.id === id);
        return c ? `${c.name} (${c.grade})` : 'Não alocado';
    };

    const getSchoolName = (id: string) => {
        const s = schools.find(sc => sc.id === id);
        return s ? s.name : '-';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) db.updateStudent(editingId, formData);
        else db.addStudent({ ...formData, active: true });
        setIsModalOpen(false);
        resetForm();
        loadData();
    };

    const handleEdit = (s: Student) => {
        setFormData({ 
            name: s.name, cpf: s.cpf, birthDate: s.birthDate, 
            guardianName: s.guardianName, matricula: s.matricula, 
            classId: s.classId, schoolId: s.schoolId || '' 
        });
        setEditingId(s.id);
        setIsModalOpen(true);
    };

    const handleToggleStatus = (id: string) => {
        db.toggleStudentStatus(id);
        loadData();
    };

    const resetForm = () => {
        setFormData({ name: '', cpf: '', birthDate: '', guardianName: '', matricula: '', classId: '', schoolId: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Alunos</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={() => db.exportToCSV('student')}>Exportar</Button>
                    <Button icon={Plus} onClick={() => { resetForm(); setIsModalOpen(true); }}>Novo Aluno</Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="text" placeholder="Buscar por nome ou matrícula..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Status', 'Matrícula', 'Nome', 'Escola', 'Turma', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.map(s => (
                                <tr key={s.id} className={`hover:bg-slate-50 ${!s.active ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="px-6 py-4"><Badge active={s.active} /></td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{s.matricula}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{s.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{getSchoolName(s.schoolId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{getClassDetails(s.classId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 flex gap-2">
                                        <button onClick={() => handleEdit(s)} className="text-blue-600"><Edit2 size={18} /></button>
                                        <button onClick={() => handleToggleStatus(s.id)} className={`${s.active ? 'text-red-600' : 'text-green-600'}`}>
                                            <Archive size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Aluno" : "Novo Aluno"}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Matrícula" required value={formData.matricula} onChange={e => setFormData({...formData, matricula: e.target.value})} />
                        <Input label="CPF" required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} placeholder="000.000.000-00" />
                    </div>
                    <Input label="Nome Completo" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="Data de Nascimento" type="date" required value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                    <Input label="Nome do Responsável" required value={formData.guardianName} onChange={e => setFormData({...formData, guardianName: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Select 
                            label="Escola Vinculada" 
                            required 
                            value={formData.schoolId} 
                            onChange={e => setFormData({...formData, schoolId: e.target.value})}
                            options={schools.map(s => ({ value: s.id, label: s.name }))}
                        />
                        <Select 
                            label="Turma Atual" 
                            required 
                            value={formData.classId} 
                            onChange={e => setFormData({...formData, classId: e.target.value})}
                            options={classes.map(c => ({ value: c.id, label: `${c.name} - ${c.grade}` }))}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
