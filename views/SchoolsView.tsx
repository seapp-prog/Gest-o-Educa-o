
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { School } from '../types';
import { Button, Input, Modal, TableHeader } from '../components/ui';
import { Plus, Edit2, Trash2, Search, Download } from 'lucide-react';

export const SchoolsView: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    
    // Form State
    const [formData, setFormData] = useState({ name: '', inep: '', address: '', phone: '', email: '' });

    const loadData = () => {
        setSchools(db.getSchools());
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = schools.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.inep?.includes(searchTerm) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            db.updateSchool(editingId, formData);
        } else {
            db.addSchool(formData);
        }
        setIsModalOpen(false);
        resetForm();
        loadData();
    };

    const handleEdit = (school: School) => {
        setFormData({ name: school.name, inep: school.inep || '', address: school.address, phone: school.phone, email: school.email });
        setEditingId(school.id);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja remover esta escola? Esta ação pode afetar turmas e professores vinculados.')) {
            db.deleteSchool(id);
            loadData();
        }
    };

    const resetForm = () => {
        setFormData({ name: '', inep: '', address: '', phone: '', email: '' });
        setEditingId(null);
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Escolas</h2>
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Download} onClick={() => db.exportToCSV('school')}>Exportar</Button>
                    <Button icon={Plus} onClick={openCreateModal}>Nova Escola</Button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou INEP..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['INEP', 'Nome', 'Endereço', 'Telefone', 'Email', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-slate-500">Nenhum registro encontrado.</td>
                                </tr>
                            ) : filtered.map(school => (
                                <tr key={school.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{school.inep || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{school.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(school)} className="text-blue-600 hover:text-blue-900"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(school.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Escola" : "Nova Escola"}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <Input label="Nome da Escola" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <Input label="INEP" value={formData.inep} onChange={e => setFormData({...formData, inep: e.target.value})} placeholder="00000000" />
                    </div>
                    <Input label="Endereço" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Telefone" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <Input label="Email de Contato" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
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
