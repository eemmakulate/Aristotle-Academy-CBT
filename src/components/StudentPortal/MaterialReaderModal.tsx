import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  CheckCircle2, 
  HelpCircle, 
  Bookmark, 
  Sparkles,
  FileText
} from 'lucide-react';
import { LearningMaterial } from '../../types';

interface MaterialReaderModalProps {
  material: LearningMaterial;
  onClose: () => void;
}

export const MaterialReaderModal: React.FC<MaterialReaderModalProps> = ({
  material,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState(0);

  // Curated content modules based on the selected material
  const isLifeChanger = material.title.toLowerCase().includes('life changer');
  const isMathFormula = material.title.toLowerCase().includes('formula');

  const contentSections = isLifeChanger
    ? [
        {
          title: 'Chapter 1: The Admission & Ummi’s Family',
          content: `In the introductory chapter, Ummi welcomes her daughter Jamila who has just passed her UTME exams with high marks. While celebrating, Jamila’s siblings (Bint, Omar, Teemah) gather in their living room. Omar proudly reveals he has gained admission to study Law at Kongo Campus, Ahmadu Bello University (ABU), Zaria. Ummi begins sharing real-world advice to prepare Omar and his sisters for the realities of university life.`,
          examTakeaway: `Key Question: Why did Omar request freedom upon his admission? Answer: He believed university life meant complete autonomy without parental interference.`,
        },
        {
          title: 'Chapter 2: Salma’s Registration & Deception',
          content: `Salma, a proud and sophisticated freshman, arrives for screening and registration. Unwilling to wait in the long queue, she attempts to bribe a male student she assumes is a junior, only to discover he is Dr. Dabo, an unyielding and principled university lecturer. Dr. Dabo reprimands her for improper behavior.`,
          examTakeaway: `Character Analysis: Salma represents the superficial allure of campus vanity and peer pressure, which leads to academic jeopardy.`,
        },
        {
          title: 'Chapter 3: The Hostel Roommates & Tomiwa',
          content: `Salma is allocated to Queen Amina Hall where she rooms with three girls: Tomiwa (from Oyo State), Ngozi (from Umunze, Imo State), and Ada (from Benue State). Despite their different ethnic and religious origins, they live harmoniously, highlighting national unity and religious tolerance.`,
          examTakeaway: `Theme of National Cohesion: Khadija Abubakar Jalli uses the room to depict how tertiary education can foster inter-ethnic brotherhood.`,
        },
        {
          title: 'Likely UTME 2026 Examination Questions with Answers',
          content: `1. Question: What is the full title of the novel written by Khadija Abubakar Jalli?
Answer: "The Life Changer" (Prescribed JAMB Compulsory Literature).

2. Question: Which university campus does Omar gain admission into?
Answer: Kongo Campus (Law Faculty), Ahmadu Bello University, Zaria.

3. Question: Who among the roommates was known for exceptional culinary skills?
Answer: Tomiwa, who cooked delicious meals for her roommates.

4. Question: What moral principle does Ummi emphasize throughout the novel?
Answer: That genuine education requires personal integrity, honesty, and moral vigilance.`,
          examTakeaway: `Candidates are advised to review all character names, secondary themes, and regional references for the 10-15 compulsory English questions.`,
        },
      ]
    : isMathFormula
    ? [
        {
          title: '1. Calculus: Differentiation & Derivatives',
          content: `• Power Rule: d/dx(xⁿ) = n·xⁿ⁻¹
• Product Rule: d/dx(u·v) = u·(dv/dx) + v·(du/dx)
• Quotient Rule: d/dx(u/v) = [v·(du/dx) - u·(dv/dx)] / v²
• Chain Rule: dy/dx = (dy/du) · (du/dx)
• Standard Trig Derivatives:
  - d/dx(sin x) = cos x
  - d/dx(cos x) = -sin x
  - d/dx(tan x) = sec² x`,
          examTakeaway: `Max/Min Turning Points: Occur where f'(x) = 0. If f''(x) < 0, it is a Local Maximum; if f''(x) > 0, it is a Local Minimum.`,
        },
        {
          title: '2. Integration & Definite Areas',
          content: `• Standard Integral: ∫ xⁿ dx = (xⁿ⁺¹)/(n + 1) + C  (for n ≠ -1)
• Area under a curve: A = ∫[a to b] y dx
• Volume of solid of revolution (x-axis): V = π ∫[a to b] y² dx
• Integration by Substitution: Let u = g(x), du = g'(x)dx.`,
          examTakeaway: `Area between curves y₁ and y₂: A = ∫[a to b] |y₁ - y₂| dx.`,
        },
        {
          title: '3. Coordinate Geometry & Circle Equations',
          content: `• Equation of a straight line: y - y₁ = m(x - x₁)
• Perpendicular lines condition: m₁ · m₂ = -1
• General Circle Equation: x² + y² + 2gx + 2fy + c = 0
  - Center: (-g, -f)
  - Radius: r = √(g² + f² - c)`,
          examTakeaway: `Distance between two points: d = √[(x₂ - x₁)² + (y₂ - y₁)²].`,
        },
        {
          title: '4. Matrices, Determinants & Permutations',
          content: `• 2×2 Matrix Determinant: det |[a, b], [c, d]| = ad - bc
• Permutations (Order matters): ⁿPᵣ = n! / (n - r)!
• Combinations (Selection): ⁿCᵣ = n! / [r! · (n - r)!]`,
          examTakeaway: `Identity Matrix: I = [[1, 0], [0, 1]]. For any invertible matrix A, A · A⁻¹ = I.`,
        },
      ]
    : [
        {
          title: `Curriculum Module Overview: ${material.title}`,
          content: material.description,
          examTakeaway: `Essential knowledge required for UTME performance in ${material.subject}.`,
        },
        {
          title: 'Core Concepts & Exam Trends',
          content: `This document contains the complete official syllabi guidelines for ${material.subject} as specified by the Joint Admissions and Matriculation Board. Ensure mastery of definitions, numerical derivations, and historical chronology.`,
          examTakeaway: `Focus on frequent past exam question types from 2015 - 2025.`,
        },
      ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40">
              <BookOpen className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono block">
                {material.subject} • {material.durationOrPages}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                {material.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloaded full ${material.durationOrPages} document archive for offline studying.`)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Layout: Left Navigation + Right Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Section List Left Bar */}
          <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Document Sections:
            </span>
            {contentSections.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeSection === idx
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-mono ${
                    activeSection === idx ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Reading View */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-blue-700 font-mono">
                Section #{activeSection + 1}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {contentSections[activeSection].title}
              </h3>
            </div>

            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
              {contentSections[activeSection].content}
            </div>

            {/* High-Yield Exam Takeaway Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>JAMB UTME Examiner Focus & Takeaway</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-900">
                {contentSections[activeSection].examTakeaway}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Aristotle Academy Official High-Yield Academic Library
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
