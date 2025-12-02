import { GoogleGenAI } from "@google/genai";
import { db } from "./storage";

export const generateSchoolReport = async (): Promise<string> => {
    if (!process.env.API_KEY) {
        return "Erro: API Key não configurada. Por favor, configure a chave de API.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Gather minimal data context to avoid token limits
    const schools = db.getSchools();
    const classes = db.getClasses();
    const teachers = db.getTeachers();
    const students = db.getStudents();

    const stats = {
        totalSchools: schools.length,
        totalClasses: classes.length,
        totalTeachers: teachers.length,
        activeTeachers: teachers.filter(t => t.active).length,
        totalStudents: students.length,
        activeStudents: students.filter(s => s.active).length,
        schoolsList: schools.map(s => s.name).join(', '),
    };

    const prompt = `
    Atue como um analista de dados educacionais. Analise os seguintes metadados de um sistema escolar e gere um relatório executivo curto e profissional (em Markdown).
    
    Dados do Sistema:
    ${JSON.stringify(stats, null, 2)}
    
    O relatório deve conter:
    1. Um resumo geral da saúde do cadastro.
    2. Análise da proporção (ex: alunos por escola).
    3. Sugestões de melhoria fictícias baseadas nos números (ex: se houver poucos professores para muitos alunos).
    
    Seja conciso.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Não foi possível gerar o relatório.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Ocorreu um erro ao conectar com a IA do Google Gemini. Verifique sua chave de API.";
    }
};