
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { JobRole } from '../types';
import { Button, Input, Modal, TableHeader } from '../components/ui';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

export const RolesView: React.FC = () => {
    const [roles, setRoles] = useState<JobRole[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const loadData = () => {
        setRoles(db.getRoles());
    };

    useEffect(() => { loadData(); }, []);

    const filtered = roles.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) db.updateRole(editingId, formData);
        else db.addRole(formData);
        setIsModalOpen(false);
        resetForm();
        loadData();
    };

    const handleEdit = (r: JobRole) => {
        setFormData({ name: r.name, description: r.description || '' });
        setEditingId(r.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja remover esta função?')) {
            db.deleteRole(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Funções / Cargos</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={() => db.exportToCSV('role')}>Exportar</Button>
                    <Button icon={Plus} onClick={() => { resetForm(); setIsModalOpen(true); }}>Nova Função</Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input type="text" placeholder="Buscar função..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['Nome da Função', 'Descrição', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={3} className="px-6 py-4 text-center text-slate-500">Nenhuma função cadastrada.</td></tr>
                            ) : filtered.map(r => (
                                <tr key={r.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{r.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{r.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 flex gap-2">
                                        <button onClick={() => handleEdit(r)} className="text-teal-600"><Edit2 size={18} /></button>
                                        <button onClick={() => handleDelete(r.id)} className="text-red-600"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Função" : "Nova Função"}>
                <form onSubmit={handleSubmit}>
                    <Input label="Nome da Função" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Professor Regente, Coordenador" />
                    <Input label="Descrição" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    <div className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};