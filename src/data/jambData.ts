import { 
  StudentUser, 
  MockExamSchedule, 
  LearningMaterial, 
  Assignment, 
  Question,
  OFFICIAL_JAMB_SUBJECTS
} from '../types';

export const ALL_JAMB_SUBJECTS = [...OFFICIAL_JAMB_SUBJECTS];

export const DEFAULT_STUDENTS: StudentUser[] = [
  {
    id: 'std-1',
    jambRegNo: 'JAMB2026/ENG01',
    fullName: 'Alexandria Vance',
    email: 'alexandria.vance@student.aristotle.edu',
    password: 'Aristotle@2026',
    isDefaultPassword: true, // Will prompt to change password on login!
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    facultyTrack: 'Engineering & Technology (Mechanical Eng.)',
    allocatedSubjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'],
    phone: '+234 803 123 4567',
    seatNumber: 'Seat LAB-01',
    isAuthorizedForExam: true, // Candidate seat authorization
    authorizedAt: '2026-10-06 08:30 AM',
    dateCreated: '2026-09-15',
  },
  {
    id: 'std-2',
    jambRegNo: 'JAMB2026/MED02',
    fullName: 'Chidi Okonkwo',
    email: 'chidi.okonkwo@student.aristotle.edu',
    password: 'Password123#',
    isDefaultPassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    facultyTrack: 'Medical Sciences (Medicine & Surgery)',
    allocatedSubjects: ['Use of English', 'Biology', 'Chemistry', 'Physics'],
    phone: '+234 802 987 6543',
    seatNumber: 'Seat LAB-02',
    isAuthorizedForExam: false, // Awaiting invigilator authorization
    dateCreated: '2026-09-18',
  },
  {
    id: 'std-3',
    jambRegNo: 'JAMB2026/LAW03',
    fullName: 'Amina Bello',
    email: 'amina.bello@student.aristotle.edu',
    password: 'Password123#',
    isDefaultPassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    facultyTrack: 'Faculty of Law (Common & Islamic Law)',
    allocatedSubjects: ['Use of English', 'Literature-in-English', 'Government', 'Christian Religious Studies (CRS)'],
    phone: '+234 814 555 1212',
    seatNumber: 'Seat LAB-03',
    isAuthorizedForExam: true,
    authorizedAt: '2026-10-06 08:35 AM',
    dateCreated: '2026-09-20',
  },
  {
    id: 'std-4',
    jambRegNo: 'JAMB2026/SOC04',
    fullName: 'David Adeleke',
    email: 'david.adeleke@student.aristotle.edu',
    password: 'Password123#',
    isDefaultPassword: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    facultyTrack: 'Social & Management Sciences (Economics & Finance)',
    allocatedSubjects: ['Use of English', 'Economics', 'Mathematics', 'Government'],
    phone: '+234 818 777 8899',
    seatNumber: 'Seat LAB-04',
    isAuthorizedForExam: false,
    dateCreated: '2026-09-22',
  },
];

export const DEFAULT_MONTHLY_EXAMS: MockExamSchedule[] = [
  {
    id: 'mock-2026-oct',
    title: 'October Statewide Comprehensive UTME Mock 2026',
    monthName: 'October 2026',
    status: 'active', // Toggleable by admin
    durationMinutes: 120, // 2 Hours
    questionsPerSubject: 10,
    passingScoreOutOf400: 200,
    scheduledDate: '2026-10-10 (Every Saturday 09:00 AM)',
    instructions: 'You are allocated 4 subjects based on your registered faculty. You have 120 minutes to attempt all questions. The exam requires presiding admin seat authorization. Keyboard shortcuts A, B, C, D, P, N, S and On-Screen Calculator are available.',
    targetBatch: 'October UTME Intensive Cohort',
    dateCreated: '2026-10-01',
  },
  {
    id: 'mock-2026-nov',
    title: 'November Mega National CBT Simulation 2026',
    monthName: 'November 2026',
    status: 'scheduled',
    durationMinutes: 120,
    questionsPerSubject: 10,
    passingScoreOutOf400: 220,
    scheduledDate: '2026-11-14 (09:00 AM)',
    instructions: 'Comprehensive pre-registration mock testing speed, accuracy, and novel comprehension.',
    targetBatch: 'November Final Preparation Cohort',
    dateCreated: '2026-10-05',
  },
];

export const DEFAULT_MOCK_SCHEDULE: MockExamSchedule = DEFAULT_MONTHLY_EXAMS[0];

export const DEFAULT_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat-1',
    title: 'The Life Changer — Full Chapter-by-Chapter Analytical Summary & Likely Questions',
    subject: 'Use of English',
    type: 'novel_summary',
    url: '#',
    durationOrPages: '48 Pages PDF',
    description: 'Comprehensive analysis of Khadija Abubakar Jalli’s compulsory JAMB literature text. Contains character profiles, themes, and 120 likely exam questions with solutions.',
    dateAdded: '2026-09-25',
  },
  {
    id: 'mat-2',
    title: 'JAMB Mathematics High-Yield Formula Sheet & Shortcut Hacks',
    subject: 'Mathematics',
    type: 'formula_sheet',
    url: '#',
    durationOrPages: '16 Pages PDF',
    description: 'Concise summary of calculus derivatives, circle theorems, trigonometry identities, matrices, and permutations with rapid elimination tricks.',
    dateAdded: '2026-09-28',
  },
  {
    id: 'mat-3',
    title: 'Mastering Organic Chemistry Reactions & IUPAC Nomenclature for UTME',
    subject: 'Chemistry',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationOrPages: '42 Mins Masterclass',
    description: 'Video walkthrough breaking down alkanes, alkenes, alcohols, alkanoic acids, saponification, and petroleum fractions commonly tested by JAMB.',
    dateAdded: '2026-10-01',
  },
  {
    id: 'mat-4',
    title: 'JAMB Physics: Optics, Lenses, & Wave-Particle Duality Solved Past Questions',
    subject: 'Physics',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    durationOrPages: '55 Mins Lecture',
    description: 'Detailed ray diagrams, refractive index derivations, lens equations, and photoelectric effect questions from past 10 years.',
    dateAdded: '2026-10-02',
  },
  {
    id: 'mat-5',
    title: 'Computer Studies & Data Processing High-Yield Review',
    subject: 'Computer Studies',
    type: 'pdf',
    url: '#',
    durationOrPages: '30 Pages PDF',
    description: 'Computer networking topology, database management, binary/hexadecimal conversions, logic gates, and cybersecurity fundamentals.',
    dateAdded: '2026-10-03',
  },
  {
    id: 'mat-6',
    title: 'Principles of Accounts & Balance Sheet Construction for UTME',
    subject: 'Accounting / Principles of Accounts',
    type: 'pdf',
    url: '#',
    durationOrPages: '36 Pages PDF',
    description: 'Double-entry bookkeeping, ledger reconciliation, trading profit and loss accounts, and partnership appropriation.',
    dateAdded: '2026-10-04',
  },
];

export const DEFAULT_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Use of English: Lexis, Structure & Sentence Completion Assignment',
    subject: 'Use of English',
    description: 'Solve the 25 exercises on idiomatic expressions and concord rules attached in Chapter 4 of the lecture notes. Justify your answer choices with grammatical rules.',
    dueDate: 'Friday, 11:59 PM',
    totalMarks: 20,
    submissions: {
      'std-1': {
        submittedAt: '2026-10-04 18:30',
        submissionText: 'I completed all 25 questions on Concord and Lexis. Key takeaway: correlative conjunctions require proximity agreement.',
        score: 18,
        feedback: 'Excellent grasp of neither...nor rule. Review question 14 on subjunctive mood.',
      },
    },
  },
  {
    id: 'asg-2',
    title: 'Mathematics: Differential Calculus & Curve Sketching Worksheet',
    subject: 'Mathematics',
    description: 'Find the maximum and minimum turning points of f(x) = 2x³ - 9x² + 12x - 5 and calculate the area bounded by the curve y = 4 - x² and the x-axis.',
    dueDate: 'Sunday, 08:00 PM',
    totalMarks: 30,
    submissions: {},
  },
  {
    id: 'asg-3',
    title: 'Physics & Chemistry: Thermodynamics & Gas Laws Problem Set',
    subject: 'Physics',
    description: 'Calculate root-mean-square speed of oxygen molecules at 300K and solve the 5 thermodynamic cycle questions in Section B.',
    dueDate: 'Monday, 10:00 PM',
    totalMarks: 25,
    submissions: {},
  },
];

// High quality separated and segmented JAMB UTME Subject Question Bank
export const JAMB_QUESTION_BANK: Question[] = [
  // --- USE OF ENGLISH ---
  {
    id: 'jamb-eng-1',
    subject: 'Use of English',
    subtopic: 'Concord & Grammatical Agreement',
    batchOrYear: 'Series A (2026 Core)',
    difficulty: 'Medium',
    text: 'Choose the option that best completes the sentence:\n\n"The principal, together with all the senior science teachers, _______ attending the national STEM accreditation conference in Abuja today."',
    options: {
      A: 'are',
      B: 'is',
      C: 'were',
      D: 'have been',
    },
    correctOption: 'B',
    explanation:
      'In English grammar, parenthetical expressions introduced by "together with", "as well as", or "in addition to" do not alter the number of the grammatical subject. The primary subject is singular ("The principal"), therefore the singular verb "is" is required.',
  },
  {
    id: 'jamb-eng-2',
    subject: 'Use of English',
    subtopic: 'The Life Changer — Literature Text',
    batchOrYear: 'Series A (2026 Core)',
    difficulty: 'Medium',
    text: 'In the prescribed novel "The Life Changer" by Khadija Abubakar Jalli, what primary life lesson did Ummi intend to convey to her daughter Jamila regarding university admission and societal temptations?',
    options: {
      A: 'That academic brilliance guarantees immediate wealth after graduation.',
      B: 'That freedom in tertiary institutions comes with absolute personal responsibility and moral vigilance.',
      C: 'That all campus roommates must be avoided to prevent peer pressure.',
      D: 'That university authorities are entirely responsible for student misconduct.',
    },
    correctOption: 'B',
    explanation:
      'Ummi’s narratives and reflections in "The Life Changer" emphasize that the newfound autonomy in the university requires integrity, personal accountability, and vigilance against deceptive peer influences.',
  },
  {
    id: 'jamb-eng-3',
    subject: 'Use of English',
    subtopic: 'Antonyms (Opposite in Meaning)',
    batchOrYear: 'Series B (Lexis Drill)',
    difficulty: 'Hard',
    text: 'Select the option that is nearest OPPOSITE in meaning to the underlined word:\n\n"The state governor delivered an <u>ephemeral</u> address during the emergency legislative convening."',
    options: {
      A: 'fleeting',
      B: 'transitory',
      C: 'enduring',
      D: 'concise',
    },
    correctOption: 'C',
    explanation:
      '"Ephemeral" means lasting for a very short time (fleeting, transitory). The opposite is "enduring", "permanent", or "long-lasting". Thus C is correct.',
  },
  {
    id: 'jamb-eng-4',
    subject: 'Use of English',
    subtopic: 'Idioms & Idiomatic Usage',
    batchOrYear: 'Series B (Lexis Drill)',
    difficulty: 'Easy',
    text: 'Identify the exact meaning of the idiom:\n\n"When the anti-corruption agency auditors arrived unannounced, the accountant <u>burned the midnight oil</u> to reconcile the discrepancies."',
    options: {
      A: 'Caused an electrical fire in the department.',
      B: 'Worked late into the night with intense focus.',
      C: 'Destroyed evidence using petroleum kerosene.',
      D: 'Requested an indefinite postponement of the audit.',
    },
    correctOption: 'B',
    explanation:
      'The idiom "burn the midnight oil" means to study, read, or work late into the night.',
  },

  // --- MATHEMATICS ---
  {
    id: 'jamb-math-1',
    subject: 'Mathematics',
    subtopic: 'Calculus: Integration & Definite Integrals',
    batchOrYear: 'Series A (Calculus)',
    difficulty: 'Hard',
    text: 'Evaluate the definite integral: ∫ from x = 1 to x = 3 of (3x² - 4x + 1) dx.',
    options: {
      A: '8',
      B: '12',
      C: '16',
      D: '20',
    },
    correctOption: 'B',
    explanation:
      'Integral of (3x² - 4x + 1) dx = x³ - 2x² + x.\nAt upper limit x = 3: 3³ - 2(3²) + 3 = 27 - 18 + 3 = 12.\nAt lower limit x = 1: 1³ - 2(1²) + 1 = 1 - 2 + 1 = 0.\nValue = 12 - 0 = 12.',
  },
  {
    id: 'jamb-math-2',
    subject: 'Mathematics',
    subtopic: 'Surds & Rationalisation',
    batchOrYear: 'Series A (Algebra)',
    difficulty: 'Medium',
    text: 'Simplify (√5 + √3) / (√5 - √3) by rationalising the denominator.',
    options: {
      A: '4 + √15',
      B: '8 + 2√15',
      C: '4 - √15',
      D: '2 + √15',
    },
    correctOption: 'A',
    explanation:
      'Multiply numerator and denominator by conjugate (√5 + √3):\nNumerator = (√5 + √3)² = 5 + 2√15 + 3 = 8 + 2√15.\nDenominator = (√5)² - (√3)² = 5 - 3 = 2.\nResult = (8 + 2√15) / 2 = 4 + √15.',
  },
  {
    id: 'jamb-math-3',
    subject: 'Mathematics',
    subtopic: 'Matrices & Determinants',
    batchOrYear: 'Series B (Matrices)',
    difficulty: 'Medium',
    text: 'Find the determinant of the 2×2 matrix: [ [4, -2], [3, 5] ].',
    options: {
      A: '14',
      B: '26',
      C: '20',
      D: '-6',
    },
    correctOption: 'B',
    explanation:
      'For matrix [[a, b], [c, d]], determinant det = (a*d) - (b*c).\nHere: (4 * 5) - (-2 * 3) = 20 - (-6) = 20 + 6 = 26.',
  },

  // --- PHYSICS ---
  {
    id: 'jamb-phy-1',
    subject: 'Physics',
    subtopic: 'Current Electricity & Ohm’s Law',
    batchOrYear: 'Series A (Electricity)',
    difficulty: 'Medium',
    text: 'Three identical resistors, each of resistance 6 Ω, are connected in parallel. This combination is then connected in series with a 4 Ω resistor. What is the total equivalent resistance of the entire circuit?',
    options: {
      A: '6 Ω',
      B: '10 Ω',
      C: '22 Ω',
      D: '2 Ω',
    },
    correctOption: 'A',
    explanation:
      'For three 6 Ω resistors in parallel: 1/R_p = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 => R_p = 2 Ω.\nNow in series with the 4 Ω resistor: R_total = 2 Ω + 4 Ω = 6 Ω.',
  },
  {
    id: 'jamb-phy-2',
    subject: 'Physics',
    subtopic: 'Optics & Refraction',
    batchOrYear: 'Series A (Optics)',
    difficulty: 'Easy',
    text: 'A ray of light travels from crown glass (refractive index n = 1.50) into air (n = 1.00). What is the critical angle for total internal reflection to occur at the glass-air boundary?',
    options: {
      A: '41.8°',
      B: '48.6°',
      C: '30.0°',
      D: '60.0°',
    },
    correctOption: 'A',
    explanation:
      'Formula for critical angle: sin(c) = 1 / n = 1 / 1.50 = 0.6667.\nc = arcsin(0.6667) ≈ 41.8°.',
  },

  // --- CHEMISTRY ---
  {
    id: 'jamb-chem-1',
    subject: 'Chemistry',
    subtopic: 'Periodic Table & Periodicity',
    batchOrYear: 'Series A (Inorganic)',
    difficulty: 'Easy',
    text: 'Which of the following elements has the highest first ionization energy across Period 2 of the Periodic Table?',
    options: {
      A: 'Lithium (Li)',
      B: 'Carbon (C)',
      C: 'Fluorine (F)',
      D: 'Neon (Ne)',
    },
    correctOption: 'D',
    explanation:
      'First ionization energy increases across a period due to increasing effective nuclear charge and decreasing atomic radius. Neon (Ne), being a noble gas with a completely filled valence octet (2s² 2p⁶), has the highest first ionization energy.',
  },
  {
    id: 'jamb-chem-2',
    subject: 'Chemistry',
    subtopic: 'Electrochemistry & Faraday’s Laws',
    batchOrYear: 'Series A (Physical Chem)',
    difficulty: 'Hard',
    text: 'Calculate the mass of copper deposited at the cathode when a constant electric current of 5.0 Amperes is passed through copper(II) tetraoxosulphate(VI) solution for 32 minutes and 10 seconds. [Cu = 64 g/mol, 1 Faraday = 96,500 C]',
    options: {
      A: '1.60 g',
      B: '3.20 g',
      C: '6.40 g',
      D: '0.80 g',
    },
    correctOption: 'B',
    explanation:
      'Time t = (32 * 60) + 10 = 1920 + 10 = 1930 seconds.\nQuantity of charge Q = I * t = 5.0 * 1930 = 9650 Coulombs.\nCu²⁺ + 2e⁻ -> Cu requires 2 Faradays (2 * 96500 C = 193000 C) to deposit 1 mole (64 g).\nMass = (64 * 9650) / 193000 = (64 * 1) / 20 = 3.20 g.',
  },

  // --- BIOLOGY ---
  {
    id: 'jamb-bio-1',
    subject: 'Biology',
    subtopic: 'Genetics & Blood Groups',
    batchOrYear: 'Series A (Genetics)',
    difficulty: 'Hard',
    text: 'A man with heterozygous blood group A (genotype I^A i) marries a woman with blood group AB (genotype I^A I^B). Which of the following blood groups CANNOT be found among their biological offspring?',
    options: {
      A: 'Blood Group A',
      B: 'Blood Group B',
      C: 'Blood Group AB',
      D: 'Blood Group O',
    },
    correctOption: 'D',
    explanation:
      'Cross I^A i × I^A I^B yields:\nI^A I^A (Group A), I^A I^B (Group AB), I^A i (Group A), and I^B i (Group B).\nBlood group O requires the genotype ii. Neither parent can donate the second recessive allele, so blood group O is impossible.',
  },

  // --- COMPUTER STUDIES ---
  {
    id: 'jamb-comp-1',
    subject: 'Computer Studies',
    subtopic: 'Computer Networking & Topologies',
    batchOrYear: 'Series A (Networking)',
    difficulty: 'Medium',
    text: 'In a local area network (LAN), which network topology utilizes a central hub or switch to connect every peripheral workstation independently, such that a cable failure at one workstation does not disrupt the rest of the network?',
    options: {
      A: 'Bus Topology',
      B: 'Ring Topology',
      C: 'Star Topology',
      D: 'Mesh Topology',
    },
    correctOption: 'C',
    explanation:
      'In a Star topology, all devices are connected directly to a central node (hub/switch). If a single cable drops, only that node is disconnected, preserving overall network integrity.',
  },
  {
    id: 'jamb-comp-2',
    subject: 'Computer Studies',
    subtopic: 'Data Representation & Logic Gates',
    batchOrYear: 'Series A (Logic Gates)',
    difficulty: 'Easy',
    text: 'Which logic gate produces a HIGH (1) output ONLY when all of its inputs are simultaneously HIGH (1)?',
    options: {
      A: 'OR Gate',
      B: 'AND Gate',
      C: 'XOR Gate',
      D: 'NOR Gate',
    },
    correctOption: 'B',
    explanation:
      'An AND gate implements logical conjunction: output is 1 if and only if input A = 1 and input B = 1.',
  },

  // --- ACCOUNTING / PRINCIPLES OF ACCOUNTS ---
  {
    id: 'jamb-acc-1',
    subject: 'Accounting / Principles of Accounts',
    subtopic: 'Double Entry System & Ledger',
    batchOrYear: 'Series A (Bookkeeping)',
    difficulty: 'Medium',
    text: 'A business enterprise purchased office equipment valued at ₦350,000 on credit from Chinedu & Sons. Which of the following entries correctly records this transaction in the books of accounts?',
    options: {
      A: 'Debit Cash Account; Credit Office Equipment Account',
      B: 'Debit Office Equipment Account; Credit Chinedu & Sons (Creditor)',
      C: 'Debit Purchases Account; Credit Office Equipment Account',
      D: 'Debit Chinedu & Sons; Credit Cash Account',
    },
    correctOption: 'B',
    explanation:
      'Office Equipment is a fixed non-current asset: Debit the asset account (Office Equipment) with ₦350,000. Chinedu & Sons is a creditor (liability): Credit the creditor’s account with ₦350,000.',
  },

  // --- COMMERCE ---
  {
    id: 'jamb-comm-1',
    subject: 'Commerce',
    subtopic: 'Aids to Trade & Warehousing',
    batchOrYear: 'Series A (Trade)',
    difficulty: 'Easy',
    text: 'Which type of warehouse is licensed by the government customs authority specifically for the storage of dutiable imported merchandise until customs import duties and taxes are settled?',
    options: {
      A: 'Private Warehouse',
      B: 'Bonded Warehouse',
      C: 'Public Warehouse',
      D: 'Cooperative Warehouse',
    },
    correctOption: 'B',
    explanation:
      'A Bonded Warehouse is licensed by customs authorities to store imported goods on which customs duty has not yet been paid.',
  },

  // --- AGRICULTURAL SCIENCE ---
  {
    id: 'jamb-agric-1',
    subject: 'Agricultural Science',
    subtopic: 'Soil Science & Plant Nutrition',
    batchOrYear: 'Series A (Soil Science)',
    difficulty: 'Medium',
    text: 'In crop production, which primary macronutrient is primarily responsible for robust root development, early plant maturity, and energy transfer via adenosine triphosphate (ATP)?',
    options: {
      A: 'Nitrogen (N)',
      B: 'Phosphorus (P)',
      C: 'Potassium (K)',
      D: 'Calcium (Ca)',
    },
    correctOption: 'B',
    explanation:
      'Phosphorus stimulates rapid root growth, flowering, seed formation, and is a vital component of ATP (energy transport molecules). Nitrogen promotes vegetative leaf growth, while potassium enhances disease resistance.',
  },

  // --- GEOGRAPHY ---
  {
    id: 'jamb-geo-1',
    subject: 'Geography',
    subtopic: 'Physical Geography & Rocks',
    batchOrYear: 'Series A (Physical Geo)',
    difficulty: 'Medium',
    text: 'Granite and basalt are prime examples of which major rock classification formed by the cooling and solidification of molten magma or lava?',
    options: {
      A: 'Sedimentary Rocks',
      B: 'Metamorphic Rocks',
      C: 'Igneous Rocks',
      D: 'Precipitated Rocks',
    },
    correctOption: 'C',
    explanation:
      'Igneous rocks are formed from the solidification of molten rock material (magma/lava). Granite is intrusive (plutonic), while basalt is extrusive (volcanic).',
  },

  // --- GOVERNMENT ---
  {
    id: 'jamb-gov-1',
    subject: 'Government',
    subtopic: 'Nigerian Constitutional Development',
    batchOrYear: 'Series A (Constitutions)',
    difficulty: 'Medium',
    text: 'Which constitutional conference or constitution first officially introduced the principle of federalism in Nigeria?',
    options: {
      A: 'Clifford Constitution of 1922',
      B: 'Richards Constitution of 1946',
      C: 'Macpherson Constitution of 1951',
      D: 'Lyttelton Constitution of 1954',
    },
    correctOption: 'D',
    explanation:
      'The Oliver Lyttelton Constitution of 1954 established Nigeria as a formal federation with division of powers between the central government and regional governments.',
  },

  // --- LITERATURE-IN-ENGLISH ---
  {
    id: 'jamb-lit-1',
    subject: 'Literature-in-English',
    subtopic: 'Literary Appreciation & Devices',
    batchOrYear: 'Series A (Literary Terms)',
    difficulty: 'Medium',
    text: '"The trees bowed their weary heads in the howling tempest." The dominant literary device employed here is:',
    options: {
      A: 'Hyperbole',
      B: 'Personification',
      C: 'Metonymy',
      D: 'Synecdoche',
    },
    correctOption: 'B',
    explanation:
      'Personification endows inanimate entities (trees) with human attributes (weary heads bowing).',
  },

  // --- CHRISTIAN RELIGIOUS STUDIES (CRS) ---
  {
    id: 'jamb-crs-1',
    subject: 'Christian Religious Studies (CRS)',
    subtopic: 'Biblical Teachings & Parables',
    batchOrYear: 'Series A (Gospels)',
    difficulty: 'Easy',
    text: 'In the Gospel of Saint Luke, the Parable of the Prodigal Son primarily demonstrates God’s:',
    options: {
      A: 'Divine retribution against disobedient youths',
      B: 'Boundless mercy, reconciliation, and unconditional fatherly love',
      C: 'Legalistic interpretation of ancient inheritance laws',
      D: 'Requirement for financial restitution prior to forgiveness',
    },
    correctOption: 'B',
    explanation:
      'The Parable of the Prodigal Son illustrates God’s overflowing compassion and joy in welcoming repentant sinners back into fellowship.',
  },

  // --- ISLAMIC STUDIES (IRS) ---
  {
    id: 'jamb-irs-1',
    subject: 'Islamic Studies (IRS)',
    subtopic: 'Tawhid & Pillars of Islam',
    batchOrYear: 'Series A (Tawhid)',
    difficulty: 'Easy',
    text: 'Which of the following constitutes the first and foremost pillar of Islam, declaring the indivisible oneness of Allah and the prophethood of Muhammad (PBUH)?',
    options: {
      A: 'Salat (Prayer)',
      B: 'Shahadah (Declaration of Faith)',
      C: 'Zakat (Almsgiving)',
      D: 'Sawm (Fasting)',
    },
    correctOption: 'B',
    explanation:
      'The Shahadah (testimony of faith: "There is no god but Allah, and Muhammad is His messenger") is the foundational pillar of Islam.',
  },

  // --- ECONOMICS ---
  {
    id: 'jamb-econ-1',
    subject: 'Economics',
    subtopic: 'Theory of Demand & Elasticity',
    batchOrYear: 'Series A (Microeconomics)',
    difficulty: 'Medium',
    text: 'If a 10% decrease in the price of petroleum motor spirit leads to a 25% increase in the quantity demanded, the price elasticity of demand is:',
    options: {
      A: '0.40 (Inelastic)',
      B: '1.00 (Unitary Elastic)',
      C: '2.50 (Elastic)',
      D: '3.50 (Perfect Elastic)',
    },
    correctOption: 'C',
    explanation:
      'Price Elasticity of Demand (PED) = (% Change in Q) / (% Change in Price) = 25% / 10% = 2.50. Since PED > 1, demand is elastic.',
  },
  {
    id: 'jamb-econ-2',
    subject: 'Economics',
    subtopic: 'National Income & Inflation',
    batchOrYear: 'Series B (Macroeconomics)',
    difficulty: 'Medium',
    text: 'A persistent and general increase in the price level of goods and services primarily caused by excessive growth in aggregate consumer and investment demand exceeding total output is termed:',
    options: {
      A: 'Cost-push inflation',
      B: 'Demand-pull inflation',
      C: 'Hyperinflation',
      D: 'Structural inflation',
    },
    correctOption: 'B',
    explanation:
      'Demand-pull inflation occurs when aggregate demand for goods and services in an economy exceeds aggregate supply ("too much money chasing too few goods").',
  },

  // --- ARABIC ---
  {
    id: 'jamb-ara-1',
    subject: 'Arabic',
    subtopic: 'Grammar (Nahw & Sarf)',
    batchOrYear: 'Series A (Grammar & Morphology)',
    difficulty: 'Medium',
    text: 'In classical Arabic grammar, what grammatical case (I’rab) is assigned to the subject of a nominal sentence (Mubtada’)?',
    options: {
      A: 'Marfoo’ (Nominative / Raf’)',
      B: 'Mansoub (Accusative / Nasb)',
      C: 'Majroor (Genitive / Jarr)',
      D: 'Majzoom (Jussive / Jazm)',
    },
    correctOption: 'A',
    explanation:
      'In Arabic grammar, both the Mubtada’ (subject) and Khabar (predicate) in an equational nominal sentence are inherently in the Marfoo’ (nominative) case, usually marked by a Dammah.',
  },
  {
    id: 'jamb-ara-2',
    subject: 'Arabic',
    subtopic: 'Literature & Composition',
    batchOrYear: 'Series B (Arabic Literature)',
    difficulty: 'Hard',
    text: 'The famous pre-Islamic ode collection known as the Mu’allaqat consists of poems that were traditionally:',
    options: {
      A: 'Written exclusively by Andalusian scholars in Cordoba',
      B: 'Suspended upon the curtains of the holy Ka’bah in Mecca',
      C: 'Composed during the Abbasid Golden Age in Baghdad',
      D: 'Translated from ancient Persian medical manuscripts',
    },
    correctOption: 'B',
    explanation:
      'The Mu’allaqat (The Suspended Odes) were celebrated classical qasidas authored by legendary pre-Islamic Arab poets like Imru’ al-Qais and hung upon the Ka’bah walls as prizes.',
  },

  // --- ART (FINE ART) ---
  {
    id: 'jamb-art-1',
    subject: 'Art (Fine Art)',
    subtopic: 'Nigerian Art History & Nok Culture',
    batchOrYear: 'Series A (Traditional Nigerian Art)',
    difficulty: 'Medium',
    text: 'The terracotta sculptures discovered in Nok, Kaduna State, dating back to 500 BC – 200 AD, are characterized by which distinctive artistic feature?',
    options: {
      A: 'Pierced triangular or oval-shaped pupils and elaborate hairstyles',
      B: 'Cast cire perdue bronze surfaces with geometric loops',
      C: 'Carved soapstone figurines with exaggerated limbs',
      D: 'Monolithic granite obelisks with hieroglyphics',
    },
    correctOption: 'A',
    explanation:
      'Nok terracotta sculptures are globally renowned for their hollow terracotta construction, cylindrical heads, and distinctive perforated/pierced triangular eyes and pupils.',
  },
  {
    id: 'jamb-art-2',
    subject: 'Art (Fine Art)',
    subtopic: 'Principles of Design & Color Theory',
    batchOrYear: 'Series B (Color & Form)',
    difficulty: 'Easy',
    text: 'Which color harmony is formed by combining three colors that are equidistant from each other on the standard 12-hue color wheel (e.g., Red, Yellow, and Blue)?',
    options: {
      A: 'Analogous harmony',
      B: 'Triadic harmony',
      C: 'Monochromatic harmony',
      D: 'Complementary harmony',
    },
    correctOption: 'B',
    explanation:
      'A triadic color scheme utilizes three colors situated at 120-degree intervals (an equilateral triangle) on the color wheel, creating balanced and vibrant contrast.',
  },

  // --- FRENCH ---
  {
    id: 'jamb-fre-1',
    subject: 'French',
    subtopic: 'Grammaire & Conjugaison',
    batchOrYear: 'Series A (Grammaire & Tenses)',
    difficulty: 'Medium',
    text: 'Complétez la phrase avec la forme verbale appropriée:\n\n"Si nous avions eu suffisamment de temps hier soir, nous _______ le musée national d’Abuja."',
    options: {
      A: 'visiterons',
      B: 'aurions visité',
      C: 'avions visité',
      D: 'visitions',
    },
    correctOption: 'B',
    explanation:
      'In French hypothetical conditionals: "Si + plus-que-parfait" (si nous avions eu) requires the "conditionnel passé" in the main clause (aurions visité).',
  },
  {
    id: 'jamb-fre-2',
    subject: 'French',
    subtopic: 'Vocabulaire & Expression',
    batchOrYear: 'Series B (Compréhension & Lexique)',
    difficulty: 'Easy',
    text: 'Quelle est la signification de l’expression française "Il pleut des cordes"?',
    options: {
      A: 'Il fait très chaud et sec',
      B: 'Il pleut abondamment / des torrents d’eau',
      C: 'Le ciel est tout bleu et ensoleillé',
      D: 'Il y a un grand vent violent sans pluie',
    },
    correctOption: 'B',
    explanation:
      '"Il pleut des cordes" is an idiomatic French expression equivalent to the English idiom "it is raining cats and dogs" (raining heavily).',
  },

  // --- HAUSA ---
  {
    id: 'jamb-hau-1',
    subject: 'Hausa',
    subtopic: 'Nahawun Hausa & Sarrafa Harshe',
    batchOrYear: 'Series A (Nahawu da Adabi)',
    difficulty: 'Medium',
    text: 'A cikin nahawun Hausa, kalmar da ke nuna aiki ko yanayi a cikin jimla ana kiranta da:',
    options: {
      A: 'Suna (Noun)',
      B: 'Aikatau (Verb)',
      C: 'Siffa (Adjective)',
      D: 'Bayanau (Adverb)',
    },
    correctOption: 'B',
    explanation:
      'A nahawun Hausa, "Aikatau" shine kalmar da ke bayyana aiki, nuni, ko faruwar wani abu a cikin jimla (verb).',
  },
  {
    id: 'jamb-hau-2',
    subject: 'Hausa',
    subtopic: 'Al’adu da Rayuwar Hausawa',
    batchOrYear: 'Series B (Al’adu)',
    difficulty: 'Easy',
    text: 'Wane biki ne na gargajiya mafi shahara a kasar Hausa wanda ake gudanarwa a karshen watan Ramadan da kuma kwanakin sallar Layya tare da hawan dawakai?',
    options: {
      A: 'Bikin Argungu',
      B: 'Hawan Daba (Durbar)',
      C: 'Bikin Kalankuwa',
      D: 'Bikin Kokawa',
    },
    correctOption: 'B',
    explanation:
      'Hawan Daba (Durbar festival) shine hawan dawakai na sarauta da kade-kade da ake gudanarwa a masarautun Hausa lokacin bikin Salla.',
  },

  // --- HISTORY ---
  {
    id: 'jamb-his-1',
    subject: 'History',
    subtopic: 'Pre-Colonial Kingdoms & Empires',
    batchOrYear: 'Series A (Pre-Colonial Nigeria)',
    difficulty: 'Medium',
    text: 'Which historical leader successfully unified the seven Hausa states and established the Sokoto Caliphate following the 1804 Jihad?',
    options: {
      A: 'Shehu Usman dan Fodio',
      B: 'Muhammad Bello',
      C: 'Mai Idris Alooma',
      D: 'Sultan Attahiru I',
    },
    correctOption: 'A',
    explanation:
      'Shehu Usman dan Fodio launched the 1804 Islamic reform movement (Jihad) which overthrew corrupt Hausa rulers and established the Sokoto Caliphate.',
  },
  {
    id: 'jamb-his-2',
    subject: 'History',
    subtopic: 'Colonial Administration & Nationalism',
    batchOrYear: 'Series B (Nationalist Struggle)',
    difficulty: 'Medium',
    text: 'The amalgamation of the Northern and Southern Protectorates of Nigeria into a single sovereign territory in 1914 was executed by:',
    options: {
      A: 'Lord Frederick Lugard',
      B: 'Sir Donald Cameron',
      C: 'Sir Arthur Richards',
      D: 'Sir John Macpherson',
    },
    correctOption: 'A',
    explanation:
      'Lord Frederick Lugard was the British Governor-General who presided over the historic January 1, 1914 amalgamation of Nigeria.',
  },

  // --- HOME ECONOMICS ---
  {
    id: 'jamb-home-1',
    subject: 'Home Economics',
    subtopic: 'Food & Nutrition',
    batchOrYear: 'Series A (Nutrition & Dietetics)',
    difficulty: 'Medium',
    text: 'Which vitamin is essential for blood coagulation (clotting) and the synthesis of prothrombin in the human liver?',
    options: {
      A: 'Vitamin A (Retinol)',
      B: 'Vitamin D (Calciferol)',
      C: 'Vitamin K (Phylloquinone)',
      D: 'Vitamin C (Ascorbic Acid)',
    },
    correctOption: 'C',
    explanation:
      'Vitamin K is an indispensable fat-soluble nutrient that acts as a cofactor in synthesizing prothrombin and other blood clotting factors in the liver.',
  },
  {
    id: 'jamb-home-2',
    subject: 'Home Economics',
    subtopic: 'Clothing & Textiles',
    batchOrYear: 'Series B (Textiles & Fashion)',
    difficulty: 'Easy',
    text: 'In garment construction, what type of stitch is used as a temporary holding stitch that is easily removed after final machine stitching?',
    options: {
      A: 'Basting / Tacking stitch',
      B: 'Backstitch',
      C: 'Hemming stitch',
      D: 'Overcasting stitch',
    },
    correctOption: 'A',
    explanation:
      'Basting (or tacking) is a long, loose running stitch utilized to temporarily hold fabric layers in alignment before permanent stitching.',
  },

  // --- IGBO ---
  {
    id: 'jamb-igbo-1',
    subject: 'Igbo',
    subtopic: 'Utoasusu Igbo & Oruokwu',
    batchOrYear: 'Series A (Utoasusu da Oruokwu)',
    difficulty: 'Medium',
    text: 'Kedu mkpuruokwu na-egosi onodu ma obu omume n’ime ahiriokwu n’utoasusu Igbo?',
    options: {
      A: 'Mkpookwu (Noun)',
      B: 'Ngwaa (Verb)',
      C: 'Nkowa (Adjective)',
      D: 'Mbuuzo (Preposition)',
    },
    correctOption: 'B',
    explanation:
      'Ngwaa (Verb) bu mkpuruokwu na-egosi ihe a na-eme, ihe na-eme, ma obu onodu ihe di n’ime ahiriokwu n’asusu Igbo.',
  },
  {
    id: 'jamb-igbo-2',
    subject: 'Igbo',
    subtopic: 'Omenaala na Ekwumekwu Ndị Igbo',
    batchOrYear: 'Series B (Omenaala)',
    difficulty: 'Easy',
    text: 'Kedu emume omenaala kacha nwee ugwu n’ala Igbo nke a na-eme n’oge owuwe ihe ubi iji kelee Chineke na ndi mmuo ala?',
    options: {
      A: 'Iwa Akwa',
      B: 'Iri Ji Ohuru (New Yam Festival)',
      C: 'Igbu Ehi',
      D: 'Ozo Title Initiation',
    },
    correctOption: 'B',
    explanation:
      'Iri Ji Ohuru (New Yam Festival) bu emume omenaala na-egosi mbido owuwe ihe ubi na ikele Chukwu maka nchedo na omumu n’ala Igbo.',
  },

  // --- MUSIC ---
  {
    id: 'jamb-mus-1',
    subject: 'Music',
    subtopic: 'Music Theory & Staff Notation',
    batchOrYear: 'Series A (Rudiments of Music)',
    difficulty: 'Medium',
    text: 'In the Treble (G) Clef stave, the note located on the second line counting from the bottom up is:',
    options: {
      A: 'E',
      B: 'G',
      C: 'B',
      D: 'D',
    },
    correctOption: 'B',
    explanation:
      'In treble clef staff notation, the lines from bottom to top are E - G - B - D - F. The second line is G, which is why the treble clef is also called the G-clef.',
  },
  {
    id: 'jamb-mus-2',
    subject: 'Music',
    subtopic: 'African & Nigerian Musical Instruments',
    batchOrYear: 'Series B (African Idiophones & Membranophones)',
    difficulty: 'Easy',
    text: 'The Yoruba "Dùndún" and Igbo "Ekwe" represent which two respective musical instrument classifications in Hornbostel-Sachs ethnomusicology?',
    options: {
      A: 'Membranophone and Idiophone',
      B: 'Chordophone and Aerophone',
      C: 'Aerophone and Membranophone',
      D: 'Idiophone and Chordophone',
    },
    correctOption: 'A',
    explanation:
      'Dùndún is a talking hourglass drum with vibrating skin membranes (Membranophone). Ekwe is a carved slit wooden drum that produces sound through the vibration of its solid body (Idiophone).',
  },

  // --- YORUBA ---
  {
    id: 'jamb-yor-1',
    subject: 'Yoruba',
    subtopic: 'Giramu & Eya Gbolohun',
    batchOrYear: 'Series A (Giramu Yoruba)',
    difficulty: 'Medium',
    text: 'Ninu giramu Yoruba, oro ti a n lo lati fi dipo oruko ki oruko ma ba a tun waye ninu gbolohun ni a n pe ni:',
    options: {
      A: 'Oro-oruko (Noun)',
      B: 'Oro-aropo-oruko (Pronoun)',
      C: 'Oro-ise (Verb)',
      D: 'Oro-apejuwe (Adjective)',
    },
    correctOption: 'B',
    explanation:
      'Oro-aropo-oruko (Pronoun) ni oro ti a n lo dipo oro-oruko lati dena atunso ti ko wulo ninu ede Yoruba (apeere: o, won, mi, wa).',
  },
  {
    id: 'jamb-yor-2',
    subject: 'Yoruba',
    subtopic: 'Asa ati Isese Ile Yoruba',
    batchOrYear: 'Series B (Asa ati Ise)',
    difficulty: 'Easy',
    text: 'Akiyesi asa wo ni o wopo julo nigba ti omokunrin ba n ki agba ninu asa Yoruba lati fi ibowofagba han?',
    options: {
      A: 'Idobale (Prostrating completely on the chest)',
      B: 'Ikunle (Kneeling down on both knees)',
      C: 'Fifi owo gba owo agba (Firm handshake)',
      D: 'Gigba agba mu ni ese (Grabbing the ankle)',
    },
    correctOption: 'A',
    explanation:
      'Ninu asa Yoruba, omokunrin maa n dobale gbalaja fun agbalagba gege bi ami ibowo ati eko ile, nigba ti obinrin maa n kunle.',
  },
];
