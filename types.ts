
export interface Entity {
    id: string;
    createdAt: string;
}

export interface School extends Entity {
    name: string;
    inep: string;
    address: string;
    phone: string;
    email: string;
}

export interface ClassRoom extends Entity {
    name: string;
    grade: string; // Série/Ano
    schoolId: string;
}

export interface JobRole extends Entity {
    name: string;
    description: string;
}

export interface Teacher extends Entity {
    name: string;
    email: string;
    specialty: string;
    roleId: string; // Link to JobRole
    schoolId: string; // Link to School (Primary affiliation)
    admissionDate: string; // Data de Admissão
    contest: string; // Concurso
    classIds: string[]; // Many-to-Many via array of IDs
    active: boolean; // Logical delete
}

export interface Student extends Entity {
    name: string;
    cpf: string;
    birthDate: string;
    guardianName: string; // Responsável
    matricula: string;
    classId: string;
    schoolId: string; // Added: Link to School
    active: boolean; // Logical delete
}

export enum ViewState {
    DASHBOARD = 'DASHBOARD',
    SCHOOLS = 'SCHOOLS',
    CLASSES = 'CLASSES',
    TEACHERS = 'TEACHERS',
    STUDENTS = 'STUDENTS',
    ROLES = 'ROLES'
}

export type EntityType = 'school' | 'class' | 'teacher' | 'student' | 'role';
