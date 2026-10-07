import { Question } from '../types';

// Helper inline SVG generators for crisp diagrams without external dependencies
const CIRCLE_GEOMETRY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%"><rect width="400" height="240" fill="%23f8fafc" rx="8"/><line x1="40" y1="120" x2="360" y2="120" stroke="%2394a3b8" stroke-width="2"/><line x1="200" y1="20" x2="200" y2="220" stroke="%2394a3b8" stroke-width="2"/><circle cx="200" cy="120" r="70" stroke="%232563eb" stroke-width="3" fill="none"/><line x1="200" y1="120" x2="250" y2="70" stroke="%23dc2626" stroke-width="2.5" stroke-dasharray="4"/><circle cx="200" cy="120" r="4" fill="%231e3a8a"/><text x="205" y="115" font-family="sans-serif" font-size="12" fill="%231e3a8a" font-weight="bold">O (h,k)</text><text x="230" y="90" font-family="sans-serif" font-size="12" fill="%23dc2626" font-weight="bold">r = 5</text><text x="255" y="65" font-family="sans-serif" font-size="12" fill="%23047857" font-weight="bold">P (7, 6)</text><circle cx="250" cy="70" r="4" fill="%23047857"/><text x="345" y="112" font-family="sans-serif" font-size="12" fill="%2364748b">x</text><text x="206" y="32" font-family="sans-serif" font-size="12" fill="%2364748b">y</text></svg>`;

const PROJECTILE_MOTION_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="100%" height="100%"><rect width="420" height="220" fill="%23f8fafc" rx="8"/><line x1="30" y1="190" x2="390" y2="190" stroke="%23475569" stroke-width="2.5"/><path d="M 50 190 Q 200 20 350 190" stroke="%232563eb" stroke-width="3" fill="none"/><circle cx="50" cy="190" r="5" fill="%231e3a8a"/><line x1="50" y1="190" x2="110" y2="135" stroke="%23dc2626" stroke-width="2.5"/><polygon points="110,135 100,138 107,147" fill="%23dc2626"/><text x="115" y="135" font-family="sans-serif" font-size="12" fill="%23dc2626" font-weight="bold">v₀ = 25 m/s, θ = 45°</text><circle cx="200" cy="105" r="4" fill="%23047857"/><line x1="200" y1="105" x2="200" y2="190" stroke="%23047857" stroke-dasharray="4" stroke-width="1.5"/><text x="206" y="150" font-family="sans-serif" font-size="11" fill="%23047857">H_max</text><text x="195" y="208" font-family="sans-serif" font-size="11" fill="%23475569">Range (R)</text></svg>`;

const MITOCHONDRIA_ATP_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 220" width="100%" height="100%"><rect width="420" height="220" fill="%23f8fafc" rx="8"/><ellipse cx="210" cy="110" rx="170" ry="85" fill="%23fee2e2" stroke="%23b91c1c" stroke-width="3"/><ellipse cx="210" cy="110" rx="140" ry="65" fill="%23fef3c7" stroke="%23d97706" stroke-width="2"/><path d="M 120 110 Q 140 70 170 110 T 220 110 T 270 110" stroke="%23b45309" stroke-width="2" fill="none"/><text x="150" y="90" font-family="sans-serif" font-size="12" fill="%239a3412" font-weight="bold">Cristae / Inner Membrane</text><text x="140" y="140" font-family="sans-serif" font-size="11" fill="%231e3a8a">Matrix: High [H⁺] gradient driving ATP Synthase</text><circle cx="210" cy="110" r="10" fill="%2310b981"/><text x="225" y="114" font-family="sans-serif" font-size="11" fill="%23065f46" font-weight="bold">ATP Synthase</text></svg>`;

export const DEFAULT_QUESTIONS: Question[] = [
  // --- SAT Mathematics & EBRW ---
  {
    id: 'sat-m-1',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Heart of Algebra & Systems',
    difficulty: 'Medium',
    text: 'A company sells standard and premium software subscriptions. A standard subscription costs $25 per month, and a premium subscription costs $40 per month. Last month, 160 total subscriptions were sold for a total revenue of $5,050. How many premium subscriptions were sold?',
    options: {
      A: '70',
      B: '85',
      C: '90',
      D: '105',
    },
    correctOption: 'A',
    explanation:
      'Let s be standard subscriptions and p be premium subscriptions.\n1) s + p = 160 => s = 160 - p\n2) 25s + 40p = 5050\nSubstitute s: 25(160 - p) + 40p = 5050\n4000 - 25p + 40p = 5050\n15p = 1050 => p = 70. Thus, 70 premium subscriptions were sold.',
  },
  {
    id: 'sat-m-2',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Passport to Advanced Math',
    difficulty: 'Hard',
    text: 'If the quadratic equation 2x² - kx + 8 = 0 has exactly one real solution, which of the following is a possible value of k?',
    options: {
      A: 'k = 4',
      B: 'k = 8',
      C: 'k = 12',
      D: 'k = 16',
    },
    correctOption: 'B',
    explanation:
      'A quadratic equation ax² + bx + c = 0 has exactly one real solution when its discriminant Δ = b² - 4ac equals 0.\nHere a = 2, b = -k, c = 8.\nΔ = (-k)² - 4(2)(8) = k² - 64 = 0.\nk² = 64 => k = 8 or k = -8.\nAmong the options, k = 8 is option B.',
  },
  {
    id: 'sat-m-3',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Geometry & Circle Coordinate Plane',
    difficulty: 'Medium',
    imageUrl: CIRCLE_GEOMETRY_SVG,
    text: 'In the xy-plane shown, the circle with center (3, 2) has a radius of 5. A point P has coordinates (7, 5). Which of the following statements correctly identifies the location of point P relative to the circle?',
    options: {
      A: 'Point P lies strictly inside the circle.',
      B: 'Point P lies on the circumference of the circle.',
      C: 'Point P lies outside the circle.',
      D: 'Point P is collinear with the y-intercept of the circle.',
    },
    correctOption: 'B',
    explanation:
      'The distance from center (h, k) = (3, 2) to point (7, 5) is given by the distance formula:\nd = √((7 - 3)² + (5 - 2)²) = √(4² + 3²) = √(16 + 9) = √25 = 5.\nSince the distance from the center to point P is exactly equal to the circle radius (r = 5), point P lies right on the circumference of the circle.',
  },
  {
    id: 'sat-ebrw-1',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Reading & Textual Evidence',
    difficulty: 'Medium',
    text: '"The synthesis of chlorophyll in photosynthetic organisms requires specific enzyme cascades that remain highly conserved across varied phylogenetic kingdoms. While marine phytoplankton experience turbulent thermal currents, their molecular machinery demonstrates negligible thermodynamic deviation from terrestrial angiosperms."\n\nBased on the passage, what does the author suggest about chlorophyll synthesis?',
    options: {
      A: 'It evolved independently in marine and terrestrial organisms through divergent paths.',
      B: 'Marine phytoplankton have developed distinct metabolic pathways to counter water turbulence.',
      C: 'The underlying biochemical process has remained remarkably consistent across distinct ecological niches.',
      D: 'Temperature fluctuations invariably inhibit chlorophyll production in vascular plants.',
    },
    correctOption: 'C',
    explanation:
      'The text states the enzyme cascades are "highly conserved across varied phylogenetic kingdoms" and marine phytoplankton demonstrate "negligible thermodynamic deviation from terrestrial angiosperms." This directly supports option C: the underlying biochemical process is remarkably consistent across distinct environments.',
  },
  {
    id: 'sat-ebrw-2',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Standard English Conventions',
    difficulty: 'Easy',
    text: 'Select the option that best completes the sentence with correct grammatical punctuation and clause connection:\n\n"The research expedition collected over five hundred deep-sea microbial specimens _______ each specimen was carefully cataloged in cryogenic storage."',
    options: {
      A: 'furthermore,',
      B: '; and,',
      C: '; subsequently,',
      D: ', whereas',
    },
    correctOption: 'C',
    explanation:
      'The sentence consists of two independent clauses: "The research expedition collected..." and "each specimen was carefully cataloged...". Connecting two independent clauses requires a semicolon followed by a transitional adverb and comma ("; subsequently,"), making C grammatically sound and rhetorically precise.',
  },
  {
    id: 'sat-m-4',
    subject: 'SAT Mathematics & EBRW',
    subtopic: 'Problem Solving & Data Analysis',
    difficulty: 'Hard',
    text: 'A bacterial culture initially contains 1,200 organisms. The population triples every 4 hours. Which exponential model represents the population P after t hours?',
    options: {
      A: 'P(t) = 1200(3)^(4t)',
      B: 'P(t) = 1200(3)^(t/4)',
      C: 'P(t) = 1200(4)^(t/3)',
      D: 'P(t) = 3600^(t/4)',
    },
    correctOption: 'B',
    explanation:
      'The general exponential formula is P(t) = P₀ * (growth_factor)^(t / doubling_or_tripling_period).\nHere P₀ = 1200, growth factor = 3, and period = 4 hours. Therefore, P(t) = 1200(3)^(t/4). When t = 4, P(4) = 1200(3)¹ = 3600, which matches.',
  },

  // --- PTE Academic English ---
  {
    id: 'pte-eng-1',
    subject: 'PTE Academic English',
    subtopic: 'Reading & Writing: Fill in the Blanks',
    difficulty: 'Medium',
    text: 'Choose the word that best completes the academic statement:\n\n"The proliferation of autonomous algorithms in financial markets has raised fundamental questions about systemic vulnerability; when market volatility spikes, automated stop-losses can ________ cascading sell-offs across international exchanges."',
    options: {
      A: 'exacerbate',
      B: 'mitigate',
      C: 'alleviate',
      D: 'reconcile',
    },
    correctOption: 'A',
    explanation:
      '"Exacerbate" means to make a problem, situation, or negative feeling worse. In the context of "cascading sell-offs" during market spikes, automated selling worsens the panic. "Mitigate" and "alleviate" mean to lessen or relieve, which is contrary to the context.',
  },
  {
    id: 'pte-eng-2',
    subject: 'PTE Academic English',
    subtopic: 'Re-order Paragraphs & Cohesion',
    difficulty: 'Hard',
    text: 'Consider the four sentences below:\n[1] Consequently, cognitive fatigue quickly ensues when individuals attempt high-stakes multitasking.\n[2] The human prefrontal cortex is architecturally constrained in its executive processing capacity.\n[3] Despite popular beliefs regarding digital ubiquity, the brain operates primarily through sequential task switching.\n[4] This architectural limitation prevents concurrent deep semantic comprehension of distinct data streams.\n\nWhat is the most logically cohesive chronological sequence?',
    options: {
      A: '[3] → [2] → [4] → [1]',
      B: '[2] → [4] → [3] → [1]',
      C: '[1] → [3] → [2] → [4]',
      D: '[4] → [2] → [1] → [3]',
    },
    correctOption: 'A',
    explanation:
      'Logical flow:\n[3] Introduces the general topic and debunks the myth of multitasking.\n[2] Provides the physiological cause: the architecture of the prefrontal cortex.\n[4] Explains what this limitation specifically causes ("This architectural limitation...").\n[1] Synthesizes the conclusive outcome ("Consequently, cognitive fatigue..."). Sequence: 3 -> 2 -> 4 -> 1.',
  },
  {
    id: 'pte-eng-3',
    subject: 'PTE Academic English',
    subtopic: 'Multiple Choice: Academic Synthesis',
    difficulty: 'Medium',
    text: 'Read the excerpt:\n"While empirical data indicates that renewable energy generation expanded by 22% over the last fiscal biennium, grid integration bottlenecks and localized storage deficits continue to impede dispatchable transmission during peak grid load intervals."\n\nWhich statement can be inferred with highest certainty?',
    options: {
      A: 'Renewable energy infrastructure produces sufficient power to replace all fossil baseline loads immediately.',
      B: 'The expansion of renewable power generation has outpaced current transmission storage capabilities.',
      C: 'Grid operators have refused capital expenditure on battery energy storage systems.',
      D: 'Peak load intervals have decreased due to distributed residential rooftop photovoltaic systems.',
    },
    correctOption: 'B',
    explanation:
      'The text contrasts the 22% expansion in generation with "grid integration bottlenecks and localized storage deficits" that impede transmission. Hence, generation expansion has outpaced the storage and grid integration capacity.',
  },
  {
    id: 'pte-eng-4',
    subject: 'PTE Academic English',
    subtopic: 'Collocations & Lexical Resource',
    difficulty: 'Easy',
    text: 'Select the academic collocation that correctly completes the hypothesis:\n\n"The longitudinal epidemiological study yielded ________ evidence establishing a causal correlation between chronic sleep deprivation and cardiovascular morbidity."',
    options: {
      A: 'compelling',
      B: 'shrill',
      C: 'glamorous',
      D: 'hasty',
    },
    correctOption: 'A',
    explanation:
      '"Compelling evidence" is the standard academic collocation denoting evidence that is convincing, robust, and persuasive. "Shrill", "glamorous", and "hasty" are stylistically inappropriate in academic research reporting.',
  },
  {
    id: 'pte-eng-5',
    subject: 'PTE Academic English',
    subtopic: 'Sentence Correction & Syntax',
    difficulty: 'Hard',
    text: 'Identify the grammatically impeccable variant among the options:\n\n"Neither the lead principal investigator nor the laboratory assistants ________ aware that the calibration specimen had degraded overnight."',
    options: {
      A: 'was',
      B: 'were',
      C: 'has been',
      D: 'is being',
    },
    correctOption: 'B',
    explanation:
      'Rule of Proximity for correlative conjunctions ("neither ... nor"): When subjects differ in number (singular "principal investigator" vs. plural "laboratory assistants"), the verb agrees with the subject closer to the verb. "Laboratory assistants" is plural and past tense, so "were" is correct.',
  },

  // --- Senior Secondary Science / General Knowledge ---
  {
    id: 'sci-phys-1',
    subject: 'Senior Secondary Science',
    subtopic: 'Classical Mechanics & Kinematics',
    difficulty: 'Medium',
    imageUrl: PROJECTILE_MOTION_SVG,
    text: 'A projectile is launched from ground level with initial velocity v₀ = 25 m/s at an angle θ = 45° to the horizontal. Assuming gravitational acceleration g = 10 m/s² and negligible air resistance, what is the maximum vertical height (H_max) attained?',
    options: {
      A: '15.625 meters',
      B: '31.25 meters',
      C: '62.50 meters',
      D: '7.81 meters',
    },
    correctOption: 'A',
    explanation:
      'Formula for maximum height in projectile motion:\nH_max = (v₀ * sin θ)² / (2g)\nHere v₀ = 25 m/s, θ = 45°, sin(45°) = √2 / 2 ≈ 0.7071.\nv_y = 25 * (√2 / 2) = 17.677 m/s\n(v_y)² = 312.5\nH_max = 312.5 / (2 * 10) = 312.5 / 20 = 15.625 m. Option A is exact.',
  },
  {
    id: 'sci-chem-1',
    subject: 'Senior Secondary Science',
    subtopic: 'Chemical Equilibrium & Thermodynamics',
    difficulty: 'Hard',
    text: 'Consider the industrial Haber-Bosch reaction for ammonia synthesis:\nN₂(g) + 3H₂(g) ⇌ 2NH₃(g)   (ΔH° = -92.4 kJ/mol)\n\nAccording to Le Chatelier’s Principle, which combination of changes will definitively shift equilibrium to the right to maximize the yield of NH₃(g)?',
    options: {
      A: 'Increasing temperature and decreasing overall system pressure',
      B: 'Decreasing temperature and increasing overall system pressure',
      C: 'Increasing temperature and increasing overall system pressure',
      D: 'Decreasing temperature and introducing an inert gas at constant volume',
    },
    correctOption: 'B',
    explanation:
      '1) The reaction is exothermic (ΔH° < 0). Lowering the temperature favors the exothermic forward reaction.\n2) The reactants have 4 moles of gas (1 N₂ + 3 H₂) while products have 2 moles of gas (2 NH₃). Increasing the pressure favors the direction with fewer moles of gas (forward).\nTherefore, decreasing temperature and increasing pressure maximizes NH₃ yield.',
  },
  {
    id: 'sci-bio-1',
    subject: 'Senior Secondary Science',
    subtopic: 'Cellular Respiration & Biochemistry',
    difficulty: 'Medium',
    imageUrl: MITOCHONDRIA_ATP_SVG,
    text: 'In aerobic cellular respiration, which specific stage generates the largest net quantity of ATP molecules per molecule of glucose oxidized?',
    options: {
      A: 'Glycolysis in the cytosol',
      B: 'Pyruvate decarboxylation (link reaction)',
      C: 'Krebs (Citric Acid) Cycle in the mitochondrial matrix',
      D: 'Oxidative Phosphorylation via the electron transport chain and ATP synthase',
    },
    correctOption: 'D',
    explanation:
      'While glycolysis yields a net of 2 ATP and the Krebs cycle yields 2 ATP (or GTP), oxidative phosphorylation via chemiosmosis and ATP synthase generates approximately 26 to 28 ATP per glucose, making it by far the largest ATP producer.',
  },
  {
    id: 'sci-gk-1',
    subject: 'Senior Secondary Science',
    subtopic: 'Atmospheric Physics & Environmental Science',
    difficulty: 'Easy',
    text: 'In which layer of Earth’s atmosphere is the stratospheric ozone layer located, and what is its primary protective function?',
    options: {
      A: 'Troposphere; absorbs cosmic ionizing gamma radiation',
      B: 'Stratosphere; absorbs solar ultraviolet (UV-B and UV-C) radiation',
      C: 'Mesosphere; prevents infrared thermal escape into deep space',
      D: 'Thermosphere; reflects terrestrial radio waves back to Earth',
    },
    correctOption: 'B',
    explanation:
      'The ozone layer resides in the stratosphere (approximately 15 to 35 km above sea level) and absorbs high-energy ultraviolet radiation (primarily UV-C and UV-B), shielding terrestrial organisms from cellular and DNA damage.',
  },
  {
    id: 'sci-bio-2',
    subject: 'Senior Secondary Science',
    subtopic: 'Genetics & Mendelian Inheritance',
    difficulty: 'Hard',
    text: 'In a classic Mendelian dihybrid cross between two heterozygous pea plants with round yellow seeds (genotype RrYy × RrYy), what is the theoretical probability of obtaining an offspring that exhibits round green seeds?',
    options: {
      A: '9/16',
      B: '3/16',
      C: '1/16',
      D: '1/4',
    },
    correctOption: 'B',
    explanation:
      'In a dihybrid cross of RrYy × RrYy:\nRound (R_) probability = 3/4; Wrinkled (rr) = 1/4.\nYellow (Y_) probability = 3/4; Green (yy) = 1/4.\nProbability of Round Green (R_yy) = (3/4) * (1/4) = 3/16.',
  },
  {
    id: 'sci-phys-2',
    subject: 'Senior Secondary Science',
    subtopic: 'Electromagnetism & Wave Physics',
    difficulty: 'Medium',
    text: 'A circular copper loop is placed in a uniform magnetic field perpendicular to the loop. If the magnetic flux through the loop changes uniformly from 0.80 Weber to 0.20 Weber in 0.05 seconds, what is the magnitude of the induced electromotive force (EMF) according to Faraday’s Law?',
    options: {
      A: '6.0 Volts',
      B: '12.0 Volts',
      C: '24.0 Volts',
      D: '30.0 Volts',
    },
    correctOption: 'B',
    explanation:
      "Faraday's Law states induced EMF |ε| = |ΔΦ / Δt|.\nΔΦ = 0.20 Wb - 0.80 Wb = -0.60 Wb.\nΔt = 0.05 s.\n|ε| = |-0.60 / 0.05| = 12.0 Volts.",
  },
];

export const INITIAL_EXAM_CONFIG: Record<string, { durationMinutes: number }> = {
  'SAT Mathematics & EBRW': { durationMinutes: 25 },
  'PTE Academic English': { durationMinutes: 20 },
  'Senior Secondary Science': { durationMinutes: 30 },
  'Comprehensive All-Subjects Mock': { durationMinutes: 45 },
};
