
import React, { useState, useEffect } from 'react';
import { db } from '../services/storage';
import { School } from '../types';
import { Button, Input, Modal, TableHeader } from '../components/ui';
import { Plus, Edit2, Trash2, Search, Download, Filter, X } from 'lucide-react';

export const SchoolsView: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    
    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [inepFilter, setInepFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', inep: '', address: '', phone: '', email: '' });

    const loadData = () => {
        setSchools(db.getSchools());
    };

    useEffect(() => {
        loadData();
    }, []);

    const filtered = schools.filter(s => {
        // General Search (Name or ID or Loose INEP)
        const matchesSearch = searchTerm === '' || 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (s.inep && s.inep.includes(searchTerm)) ||
            s.id.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Specific Advanced Filter (Strict INEP)
        const matchesInep = inepFilter === '' || (s.inep && s.inep.includes(inepFilter));

        return matchesSearch && matchesInep;
    });

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

    const clearFilters = () => {
        setSearchTerm('');
        setInepFilter('');
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

            <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant={showFilters ? 'primary' : 'secondary'} 
                        icon={Filter} 
                        onClick={() => setShowFilters(!showFilters)}
                        title="Filtros Avançados"
                    >
                        {showFilters ? 'Filtros' : 'Filtros'}
                    </Button>
                    {(searchTerm || inepFilter) && (
                        <Button variant="ghost" icon={X} onClick={clearFilters} title="Limpar busca">
                            Limpar
                        </Button>
                    )}
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <Filter size={16} /> Filtros Avançados
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input 
                                label="Código INEP" 
                                placeholder="Digite o código exato..." 
                                value={inepFilter}
                                onChange={e => setInepFilter(e.target.value)}
                                className="bg-white"
                            />
                            {/* Placeholder for future filters (e.g., City, State) */}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <TableHeader headers={['INEP', 'Nome', 'Endereço', 'Telefone', 'Email', 'Ações']} />
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                                        Nenhum registro encontrado para os filtros selecionados.
                                    </td>
                                </tr>
                            ) : filtered.map(school => (
                                <tr key={school.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600 bg-slate-50/50">
                                        {school.inep || <span className="text-slate-400 italic">Sem INEP</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{school.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{school.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(school)} className="text-teal-600 hover:text-teal-900"><Edit2 size={18} /></button>
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