
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { Teacher, ClassRoom, School, JobRole } from '../types';
import { Button, Input, Select, Modal, TableHeader, Badge } from '../components/ui';
import { Plus, Edit2, Archive, Search, Download, CheckSquare, Square } from 'lucide-react';

export const TeachersView: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [roles, setRoles] = useState<JobRole[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        specialty: '', 
        schoolId: '',
        roleId: '',
        admissionDate: '',
        contest: '',
        classIds: [] as string[] 
    });

    const loadData = () => {
        setTeachers(db.getTeachers());
        setClasses(db.getClasses());
        setSchools(db.getSchools());
        setRoles(db.getRoles());
    };

    useEffect(() => { loadData(); }, []);

    const filtered = teachers.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || '-';
    const getRoleName = (id: string) => roles.find(r => r.id === id)?.name || '-';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) db.updateTeacher(editingId, formData);
        else db.addTeacher({ ...formData, active: true });
        setIsModalOpen(false);
        resetForm();
        loadData();
    };

    const toggleClassSelection = (classId: string) => {
        setFormData(prev => {
            if (prev.classIds.includes(classId)) {
                return { ...prev, classIds: prev.classIds.filter(id => id !== classId) };
            } else {
                return { ...prev, classIds: [...prev.classIds, classId] };
            }
        });
    };

    const handleEdit = (t: Teacher) => {
        setFormData({ 
            name: t.name, 
            email: t.email, 
            specialty: t.specialty, 
            schoolId: t.schoolId || '',
            roleId: t.roleId || '',
            admissionDate: t.admissionDate || '',
            contest: t.contest || '',
            classIds: t.classIds || [] 
        });
        setEditingId(t.id);
        setIsModalOpen(true);
    };

    const handleToggleStatus = (id: string) => {
        db.toggleTeacherStatus(id);
        loadData();
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', specialty: '', schoolId: '', roleId: '', admissionDate: '', contest: '', classIds: [] });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Professores</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={() => db.exportToCSV('teacher')}>Exportar</Button>
                    <Button icon={Plus} onClick={() => { resetForm(); setIsModalOpen(true); }}>Novo Professor</Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="text" placeholder="Buscar professor..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Status', 'Nome', 'Função', 'Lotação (Escola)', 'Turmas', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.map(t => (
                                <tr key={t.id} className={`hover:bg-slate-50 ${!t.active ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="px-6 py-4"><Badge active={t.active} /></td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                        {t.name}
                                        <div className="text-xs text-slate-500">{t.specialty}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{getRoleName(t.roleId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{getSchoolName(t.schoolId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{t.classIds.length} Turmas</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 flex gap-2">
                                        <button onClick={() => handleEdit(t)} className="text-teal-600" title="Editar"><Edit2 size={18} /></button>
                                        <button onClick={() => handleToggleStatus(t.id)} className={`${t.active ? 'text-red-600' : 'text-green-600'}`} title={t.active ? "Inativar" : "Ativar"}>
                                            <Archive size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Professor" : "Novo Professor"}>
                <form onSubmit={handleSubmit}>
                    <Input label="Nome Completo" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <Input label="Especialidade/Disciplina" placeholder="Ex: Matemática" required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select 
                            label="Função"
                            required
                            value={formData.roleId}
                            onChange={e => setFormData({...formData, roleId: e.target.value})}
                            options={roles.map(r => ({ value: r.id, label: r.name }))}
                        />
                        <Select 
                            label="Lotação (Escola)"
                            required
                            value={formData.schoolId}
                            onChange={e => setFormData({...formData, schoolId: e.target.value})}
                            options={schools.map(s => ({ value: s.id, label: s.name }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Data Admissão" type="date" value={formData.admissionDate} onChange={e => setFormData({...formData, admissionDate: e.target.value})} />
                        <Input label="Concurso" placeholder="Ex: Edital 01/2023" value={formData.contest} onChange={e => setFormData({...formData, contest: e.target.value})} />
                    </div>
                    
                    <div className="mb-4">
                        <label className="text-sm font-medium text-slate-700 block mb-2">Turmas Vinculadas</label>
                        <div className="border border-slate-300 rounded-md p-3 max-h-40 overflow-y-auto">
                            {classes.length === 0 ? <p className="text-sm text-slate-500">Nenhuma turma cadastrada.</p> : classes.map(cls => (
                                <div key={cls.id} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => toggleClassSelection(cls.id)}>
                                    {formData.classIds.includes(cls.id) ? <CheckSquare size={18} className="text-teal-600" /> : <Square size={18} className="text-slate-400" />}
                                    <span className="text-sm">{cls.name} <span className="text-xs text-slate-400">({cls.grade})</span></span>
                                </div>
                            ))}
                        </div>
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