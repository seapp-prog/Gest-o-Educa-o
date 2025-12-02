import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { ClassRoom, School } from '../types';
import { Button, Input, Select, Modal, TableHeader } from '../components/ui';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

export const ClassesView: React.FC = () => {
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', grade: '', schoolId: '' });

    const loadData = () => {
        setClasses(db.getClasses());
        setSchools(db.getSchools());
    };

    useEffect(() => { loadData(); }, []);

    const filtered = classes.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.grade.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || 'N/A';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) db.updateClass(editingId, formData);
        else db.addClass(formData);
        setIsModalOpen(false);
        resetForm();
        loadData();
    };

    const handleEdit = (cls: ClassRoom) => {
        setFormData({ name: cls.name, grade: cls.grade, schoolId: cls.schoolId });
        setEditingId(cls.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Confirmar exclusão desta turma?')) {
            db.deleteClass(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', grade: '', schoolId: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Turmas</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={() => db.exportToCSV('class')}>Exportar</Button>
                    <Button icon={Plus} onClick={() => { resetForm(); setIsModalOpen(true); }}>Nova Turma</Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="text" placeholder="Buscar turma..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Nome', 'Série/Ano', 'Escola Vinculada', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.map(cls => (
                                <tr key={cls.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{cls.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{cls.grade}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{getSchoolName(cls.schoolId)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 flex gap-2">
                                        <button onClick={() => handleEdit(cls)} className="text-blue-600"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(cls.id)} className="text-red-600"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Turma" : "Nova Turma"}>
                <form onSubmit={handleSubmit}>
                    <Input label="Nome da Turma" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: 1º Ano A" />
                    <Input label="Série/Ano" required value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="Ex: 1º Ano" />
                    <Select 
                        label="Escola" 
                        required 
                        value={formData.schoolId} 
                        onChange={e => setFormData({...formData, schoolId: e.target.value})}
                        options={schools.map(s => ({ value: s.id, label: s.name }))}
                    />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};