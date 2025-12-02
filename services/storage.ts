
import { School, ClassRoom, Teacher, Student, JobRole, EntityType } from '../types';

// Mock Data Generation Helpers
const generateId = () => Math.random().toString(36).substr(2, 9);
const now = () => new Date().toISOString();

const KEYS = {
    SCHOOLS: 'edugestao_schools',
    CLASSES: 'edugestao_classes',
    TEACHERS: 'edugestao_teachers',
    STUDENTS: 'edugestao_students',
    ROLES: 'edugestao_roles',
};

// Initial Seed Data
const seedData = () => {
    if (!localStorage.getItem(KEYS.SCHOOLS)) {
        const schoolId = generateId();
        const school: School = { id: schoolId, name: 'Escola Modelo Central', inep: '12345678', address: 'Av. Paulista, 1000', phone: '1199999999', email: 'contato@modelo.com', createdAt: now() };
        localStorage.setItem(KEYS.SCHOOLS, JSON.stringify([school]));

        const roleId = generateId();
        const role: JobRole = { id: roleId, name: 'Professor Regente', description: 'Docência em sala de aula', createdAt: now() };
        localStorage.setItem(KEYS.ROLES, JSON.stringify([role]));

        const classId = generateId();
        const classRoom: ClassRoom = { id: classId, name: '1º Ano A', grade: '1º Ano', schoolId: schoolId, createdAt: now() };
        localStorage.setItem(KEYS.CLASSES, JSON.stringify([classRoom]));

        const teacherId = generateId();
        const teacher: Teacher = { 
            id: teacherId, 
            name: 'Prof. Silva', 
            email: 'silva@modelo.com', 
            specialty: 'Matemática', 
            roleId: roleId,
            schoolId: schoolId,
            admissionDate: '2020-02-01',
            contest: 'Edital 01/2019',
            classIds: [classId], 
            active: true, 
            createdAt: now() 
        };
        localStorage.setItem(KEYS.TEACHERS, JSON.stringify([teacher]));

        const studentId = generateId();
        // Added schoolId to seed data
        const student: Student = { id: studentId, name: 'Joãozinho da Silva', cpf: '123.456.789-00', birthDate: '2015-05-10', guardianName: 'Maria Silva', matricula: '2024001', classId: classId, schoolId: schoolId, active: true, createdAt: now() };
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify([student]));
    }
};

seedData();

// Generic Storage Wrapper
class StorageService {
    
    // --- READ ---
    getSchools(): School[] {
        return JSON.parse(localStorage.getItem(KEYS.SCHOOLS) || '[]');
    }
    getClasses(): ClassRoom[] {
        return JSON.parse(localStorage.getItem(KEYS.CLASSES) || '[]');
    }
    getTeachers(): Teacher[] {
        return JSON.parse(localStorage.getItem(KEYS.TEACHERS) || '[]');
    }
    getStudents(): Student[] {
        return JSON.parse(localStorage.getItem(KEYS.STUDENTS) || '[]');
    }
    getRoles(): JobRole[] {
        return JSON.parse(localStorage.getItem(KEYS.ROLES) || '[]');
    }

    // --- CREATE ---
    addSchool(data: Omit<School, 'id' | 'createdAt'>): School {
        const list = this.getSchools();
        const newItem: School = { ...data, id: generateId(), createdAt: now() };
        localStorage.setItem(KEYS.SCHOOLS, JSON.stringify([...list, newItem]));
        return newItem;
    }
    addClass(data: Omit<ClassRoom, 'id' | 'createdAt'>): ClassRoom {
        const list = this.getClasses();
        const newItem: ClassRoom = { ...data, id: generateId(), createdAt: now() };
        localStorage.setItem(KEYS.CLASSES, JSON.stringify([...list, newItem]));
        return newItem;
    }
    addTeacher(data: Omit<Teacher, 'id' | 'createdAt'>): Teacher {
        const list = this.getTeachers();
        const newItem: Teacher = { ...data, id: generateId(), createdAt: now() };
        localStorage.setItem(KEYS.TEACHERS, JSON.stringify([...list, newItem]));
        return newItem;
    }
    addStudent(data: Omit<Student, 'id' | 'createdAt'>): Student {
        const list = this.getStudents();
        const newItem: Student = { ...data, id: generateId(), createdAt: now() };
        localStorage.setItem(KEYS.STUDENTS, JSON.stringify([...list, newItem]));
        return newItem;
    }
    addRole(data: Omit<JobRole, 'id' | 'createdAt'>): JobRole {
        const list = this.getRoles();
        const newItem: JobRole = { ...data, id: generateId(), createdAt: now() };
        localStorage.setItem(KEYS.ROLES, JSON.stringify([...list, newItem]));
        return newItem;
    }

    // --- UPDATE ---
    updateSchool(id: string, data: Partial<School>) {
        const list = this.getSchools();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(list));
        }
    }
    updateClass(id: string, data: Partial<ClassRoom>) {
        const list = this.getClasses();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            localStorage.setItem(KEYS.CLASSES, JSON.stringify(list));
        }
    }
    updateTeacher(id: string, data: Partial<Teacher>) {
        const list = this.getTeachers();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            localStorage.setItem(KEYS.TEACHERS, JSON.stringify(list));
        }
    }
    updateStudent(id: string, data: Partial<Student>) {
        const list = this.getStudents();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
        }
    }
    updateRole(id: string, data: Partial<JobRole>) {
        const list = this.getRoles();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            localStorage.setItem(KEYS.ROLES, JSON.stringify(list));
        }
    }

    // --- DELETE (Physical or Logical) ---
    deleteSchool(id: string) {
        // Physical delete
        const list = this.getSchools().filter(i => i.id !== id);
        localStorage.setItem(KEYS.SCHOOLS, JSON.stringify(list));
    }
    deleteClass(id: string) {
        const list = this.getClasses().filter(i => i.id !== id);
        localStorage.setItem(KEYS.CLASSES, JSON.stringify(list));
    }
    toggleTeacherStatus(id: string) {
        const list = this.getTeachers();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx].active = !list[idx].active;
            localStorage.setItem(KEYS.TEACHERS, JSON.stringify(list));
        }
    }
    toggleStudentStatus(id: string) {
        const list = this.getStudents();
        const idx = list.findIndex(i => i.id === id);
        if (idx !== -1) {
            list[idx].active = !list[idx].active;
            localStorage.setItem(KEYS.STUDENTS, JSON.stringify(list));
        }
    }
    deleteRole(id: string) {
        const list = this.getRoles().filter(i => i.id !== id);
        localStorage.setItem(KEYS.ROLES, JSON.stringify(list));
    }

    // --- EXPORT ---
    exportToCSV(type: EntityType) {
        let data: any[] = [];
        let filename = '';

        switch(type) {
            case 'school': data = this.getSchools(); filename = 'escolas.csv'; break;
            case 'class': data = this.getClasses(); filename = 'turmas.csv'; break;
            case 'teacher': data = this.getTeachers(); filename = 'professores.csv'; break;
            case 'student': data = this.getStudents(); filename = 'alunos.csv'; break;
            case 'role': data = this.getRoles(); filename = 'funcoes.csv'; break;
        }

        if (data.length === 0) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => 
            Object.values(obj).map(val => 
                typeof val === 'string' ? `"${val}"` : Array.isArray(val) ? `"[${val.length} items]"` : val
            ).join(',')
        ).join('\n');

        const csvContent = "data:text/csv;charset=utf-8," + headers + '\n' + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export const db = new StorageService();
