require('dotenv').config();
const prisma = require('./src/config/database');

const CBT_QUESTIONS = [
  // ── MATHEMATICS ──
  {
    examType: "JAMB",
    subject: "Mathematics",
    targetClass: "JAMB",
    topic: "Algebra & Quadratic Equations",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "If the roots of the quadratic equation 2x² - 5x + k = 0 are equal, find the value of k.",
    options: [
      { id: "A", text: "25/8" },
      { id: "B", text: "5/4" },
      { id: "C", text: "-25/8" },
      { id: "D", text: "25/4" }
    ],
    correctOption: "A",
    explanation: "For equal roots in ax² + bx + c = 0, the discriminant Δ = b² - 4ac must equal 0. Here a = 2, b = -5, c = k. Thus: (-5)² - 4(2)(k) = 0 => 25 - 8k = 0 => 8k = 25 => k = 25/8."
  },
  {
    examType: "JAMB",
    subject: "Mathematics",
    targetClass: "JAMB",
    topic: "Logarithms",
    year: 2023,
    difficulty: "MEDIUM",
    questionText: "Evaluate log₁₀(25) + log₁₀(4) without using mathematical tables.",
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "100" }
    ],
    correctOption: "B",
    explanation: "Using the product law of logarithms: log₁₀(a) + log₁₀(b) = log₁₀(a × b). Hence, log₁₀(25) + log₁₀(4) = log₁₀(25 × 4) = log₁₀(100) = log₁₀(10²) = 2."
  },
  {
    examType: "WAEC",
    subject: "Mathematics",
    targetClass: "SSS 3",
    topic: "Trigonometry",
    year: 2024,
    difficulty: "EASY",
    questionText: "In a right-angled triangle ABC with angle B = 90°, if sin A = 3/5, what is the value of tan A?",
    options: [
      { id: "A", text: "3/4" },
      { id: "B", text: "4/3" },
      { id: "C", text: "4/5" },
      { id: "D", text: "5/3" }
    ],
    correctOption: "A",
    explanation: "In a right triangle with sin A = opposite/hypotenuse = 3/5, by Pythagoras theorem, adjacent = √(5² - 3²) = √(25 - 9) = √16 = 4. tan A = opposite/adjacent = 3/4."
  },
  {
    examType: "WAEC",
    subject: "Mathematics",
    targetClass: "SSS 3",
    topic: "Calculus - Differentiation",
    year: 2023,
    difficulty: "MEDIUM",
    questionText: "Find the derivative dy/dx if y = 4x³ - 5x² + 7x - 9.",
    options: [
      { id: "A", text: "12x² - 10x + 7" },
      { id: "B", text: "12x² - 5x + 7" },
      { id: "C", text: "4x² - 10x + 7" },
      { id: "D", text: "12x³ - 10x² + 7" }
    ],
    correctOption: "A",
    explanation: "Apply the power rule d/dx(axⁿ) = a·n·xⁿ⁻¹. For 4x³ => 12x²; for -5x² => -10x; for 7x => 7; constant -9 vanishes. Thus, dy/dx = 12x² - 10x + 7."
  },
  {
    examType: "JAMB",
    subject: "Mathematics",
    targetClass: "JAMB",
    topic: "Sequences & Series (AP & GP)",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "The 3rd term of an Arithmetic Progression (A.P.) is 10 and the 8th term is 25. Find the common difference d.",
    options: [
      { id: "A", text: "2" },
      { id: "B", text: "3" },
      { id: "C", text: "4" },
      { id: "D", text: "5" }
    ],
    correctOption: "B",
    explanation: "T₃ = a + 2d = 10, T₈ = a + 7d = 25. Subtracting equation (1) from (2): 5d = 15 => d = 3."
  },

  // ── ENGLISH LANGUAGE ──
  {
    examType: "JAMB",
    subject: "English Language",
    targetClass: "JAMB",
    topic: "Grammar & Concord",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "Neither the principal nor the teachers _______ present at the regional symposium.",
    options: [
      { id: "A", text: "was" },
      { id: "B", text: "were" },
      { id: "C", text: "is" },
      { id: "D", text: "has been" }
    ],
    correctOption: "B",
    explanation: "Rule of Proximity: When subjects are joined by 'neither... nor' or 'either... or', the verb agrees in number with the closer subject. 'Teachers' is plural and closer to the verb, so the plural past verb 'were' is required."
  },
  {
    examType: "JAMB",
    subject: "English Language",
    targetClass: "JAMB",
    topic: "Vocabulary & Antonyms",
    year: 2023,
    difficulty: "HARD",
    questionText: "Choose the option most nearly opposite in meaning to the italicized word: 'The senator made a very METICULOUS presentation.'",
    options: [
      { id: "A", text: "Careless" },
      { id: "B", text: "Detailed" },
      { id: "C", text: "Thorough" },
      { id: "D", text: "Eloquent" }
    ],
    correctOption: "A",
    explanation: "'Meticulous' means showing great attention to detail, very careful and precise. The direct opposite is 'careless'."
  },
  {
    examType: "WAEC",
    subject: "English Language",
    targetClass: "SSS 3",
    topic: "Stress & Phonetics",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "In the word 'PHOTOGRAPHY', which syllable carries the primary stress?",
    options: [
      { id: "A", text: "First (PHO-)" },
      { id: "B", text: "Second (-TOG-)" },
      { id: "C", text: "Third (-RAPH-)" },
      { id: "D", text: "Fourth (-Y)" }
    ],
    correctOption: "B",
    explanation: "Words ending in '-graphy' place primary stress on the antepenultimate syllable (third from the end): pho-TOG-ra-phy (2nd syllable)."
  },

  // ── PHYSICS ──
  {
    examType: "JAMB",
    subject: "Physics",
    targetClass: "JAMB",
    topic: "Mechanics - Motion Under Gravity",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "A stone is dropped from the top of a building 45m high. How long does it take to reach the ground? (Take g = 10 m/s²).",
    options: [
      { id: "A", text: "2 seconds" },
      { id: "B", text: "3 seconds" },
      { id: "C", text: "4.5 seconds" },
      { id: "D", text: "9 seconds" }
    ],
    correctOption: "B",
    explanation: "Using equation of motion: s = ut + ½gt². Since it is dropped from rest, initial velocity u = 0. Thus: 45 = ½(10)t² => 45 = 5t² => t² = 9 => t = 3 seconds."
  },
  {
    examType: "WAEC",
    subject: "Physics",
    targetClass: "SSS 3",
    topic: "Electricity & Ohm's Law",
    year: 2024,
    difficulty: "EASY",
    questionText: "Two resistors of 6Ω and 3Ω are connected in parallel. What is their effective resistance?",
    options: [
      { id: "A", text: "9Ω" },
      { id: "B", text: "2Ω" },
      { id: "C", text: "0.5Ω" },
      { id: "D", text: "18Ω" }
    ],
    correctOption: "B",
    explanation: "For two resistors in parallel: R_eff = (R₁ × R₂) / (R₁ + R₂) = (6 × 3) / (6 + 3) = 18 / 9 = 2Ω."
  },

  // ── CHEMISTRY ──
  {
    examType: "JAMB",
    subject: "Chemistry",
    targetClass: "JAMB",
    topic: "Stoichiometry & Mole Concept",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "What volume of oxygen at s.t.p. is required to burn completely 2.24 dm³ of methane (CH₄)? (Equation: CH₄ + 2O₂ → CO₂ + 2H₂O)",
    options: [
      { id: "A", text: "1.12 dm³" },
      { id: "B", text: "2.24 dm³" },
      { id: "C", text: "4.48 dm³" },
      { id: "D", text: "8.96 dm³" }
    ],
    correctOption: "C",
    explanation: "From the balanced equation, 1 mole (or volume) of CH₄ reacts with 2 moles (or volumes) of O₂. Volume of O₂ required = 2 × 2.24 dm³ = 4.48 dm³."
  },
  {
    examType: "WAEC",
    subject: "Chemistry",
    targetClass: "SSS 3",
    topic: "Acids, Bases and Salts",
    year: 2023,
    difficulty: "EASY",
    questionText: "What is the pH of a neutral aqueous solution at 25°C?",
    options: [
      { id: "A", text: "0" },
      { id: "B", text: "1" },
      { id: "C", text: "7" },
      { id: "D", text: "14" }
    ],
    correctOption: "C",
    explanation: "At 25°C, [H⁺] = [OH⁻] = 1.0 × 10⁻⁷ mol/dm³, which gives a neutral pH = -log(10⁻⁷) = 7."
  },

  // ── BIOLOGY ──
  {
    examType: "JAMB",
    subject: "Biology",
    targetClass: "JAMB",
    topic: "Genetics & Inheritance",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "In a monohybrid cross between two heterozygous tall pea plants (Tt × Tt), what proportion of the offspring will be dwarf (tt)?",
    options: [
      { id: "A", text: "1/4 (25%)" },
      { id: "B", text: "1/2 (50%)" },
      { id: "C", text: "3/4 (75%)" },
      { id: "D", text: "0% (All tall)" }
    ],
    correctOption: "A",
    explanation: "Crossing Tt × Tt gives genotypes TT, Tt, Tt, tt in the ratio 1:2:1. Only homozygous recessive 'tt' produces the dwarf phenotype, which is 1 out of 4 (25%)."
  },
  {
    examType: "WAEC",
    subject: "Biology",
    targetClass: "SSS 3",
    topic: "Cell Biology & Organelles",
    year: 2024,
    difficulty: "EASY",
    questionText: "Which organelle is universally referred to as the 'powerhouse of the cell' due to its role in ATP synthesis?",
    options: [
      { id: "A", text: "Golgi apparatus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondrion" },
      { id: "D", text: "Endoplasmic reticulum" }
    ],
    correctOption: "C",
    explanation: "The mitochondrion carries out aerobic cellular respiration, generating the adenosine triphosphate (ATP) that powers the cell's metabolic activities."
  },

  // ── ECONOMICS ──
  {
    examType: "WAEC",
    subject: "Economics",
    targetClass: "SSS 3",
    topic: "Price Elasticity of Demand",
    year: 2024,
    difficulty: "MEDIUM",
    questionText: "When the percentage change in quantity demanded is exactly equal to the percentage change in price, elasticity of demand is described as:",
    options: [
      { id: "A", text: "Perfectively elastic" },
      { id: "B", text: "Unitary elastic" },
      { id: "C", text: "Inelastic" },
      { id: "D", text: "Perfectively inelastic" }
    ],
    correctOption: "B",
    explanation: "Unitary elasticity occurs when Price Elasticity of Demand (PED) = 1, meaning the percentage change in quantity demanded equals the percentage change in price."
  }
];

const TIPS_ITEMS = [
  {
    title: "The Proximity Rule in Subject-Verb Concord",
    subject: "English Language",
    category: "Grammar & Concord",
    keyIdea: "When subjects are paired with 'either... or' or 'neither... nor', the verb must always agree with the subject closest to it.",
    explanation: "Many students mistakenly look at the first subject or think 'neither' always requires a singular verb. The correct standard rule is proximity: whichever subject sits right next to the verb dictates whether that verb is singular or plural.",
    example: "Neither the captain nor the PLAYERS WERE satisfied with the referee. (Players is plural and closer, so 'were' is correct).",
    memoryTrick: "Think 'Close is Boss' — The closer noun bosses the verb!",
    formulaOrRule: "Either/Neither [Subject 1] or/nor [Subject 2] + Verb agreeing strictly with [Subject 2].",
    commonMistake: "Writing 'Neither the teacher nor the students WAS happy' instead of 'WERE happy'.",
    quickRecall: {
      question: "Choose the correct verb: 'Neither the manager nor his assistants _______ willing to sign.'",
      options: ["is", "was", "were", "has been"],
      answer: "were"
    }
  },
  {
    title: "Quadratic Roots & The Discriminant Δ",
    subject: "Mathematics",
    category: "Algebra",
    keyIdea: "The discriminant Δ = b² - 4ac reveals the nature of quadratic roots before you ever solve the equation.",
    explanation: "For any quadratic ax² + bx + c = 0, Δ tells you immediately whether you have real distinct roots (Δ > 0), real equal roots (Δ = 0), or complex imaginary roots (Δ < 0). Perfect square Δ means rational roots.",
    example: "For x² - 6x + 9 = 0: Δ = (-6)² - 4(1)(9) = 36 - 36 = 0. Therefore, the roots are real and equal (x = 3).",
    memoryTrick: "Zero means One (repeated root); Positive means Two; Negative means None (real roots).",
    formulaOrRule: "Δ = b² - 4ac. If Δ = 0 => Equal roots. If Δ > 0 => 2 Distinct real roots. If Δ < 0 => No real roots.",
    commonMistake: "Forgetting to square the negative sign in (-b)², which leads to wrong negative numbers instead of positive.",
    quickRecall: {
      question: "If b² - 4ac = 0 in a quadratic equation, what is the nature of its roots?",
      options: ["Real and unequal", "Real and equal", "Imaginary", "Undefined"],
      answer: "Real and equal"
    }
  },
  {
    title: "SOH CAH TOA for Right-Angled Triangles",
    subject: "Mathematics",
    category: "Trigonometry",
    keyIdea: "Sine, Cosine, and Tangent relate acute angles to ratios of triangle sides in every right triangle.",
    explanation: "Sine is Opposite over Hypotenuse; Cosine is Adjacent over Hypotenuse; Tangent is Opposite over Adjacent. Never mix up Adjacent with Hypotenuse (Hypotenuse is always opposite the 90° angle).",
    example: "If Opposite = 3 and Hypotenuse = 5, sin θ = 3/5, and cos θ = 4/5.",
    memoryTrick: "SOH - CAH - TOA (Some Old Horses Can Always Hear Their Owners Approach).",
    formulaOrRule: "sin θ = O/H, cos θ = A/H, tan θ = O/A.",
    commonMistake: "Confusing Opposite and Adjacent when the triangle is rotated upside down.",
    quickRecall: {
      question: "In a right triangle, what ratio defines tan θ?",
      options: ["Opposite / Hypotenuse", "Adjacent / Hypotenuse", "Opposite / Adjacent", "Hypotenuse / Opposite"],
      answer: "Opposite / Adjacent"
    }
  },
  {
    title: "Equations of Linear Motion Made Simple",
    subject: "Physics",
    category: "Mechanics",
    keyIdea: "Pick the right motion equation by looking at which variable is MISSING in your problem.",
    explanation: "The 4 kinematic equations: (1) v = u + at (no distance s), (2) s = ut + ½at² (no final velocity v), (3) v² = u² + 2as (no time t), (4) s = ½(u + v)t (no acceleration a). Look for what's NOT mentioned to pick your formula in 2 seconds.",
    example: "A car accelerates from rest at 2m/s² for 5 seconds. Distance s? No final velocity v mentioned => use s = ut + ½at² => s = 0 + ½(2)(25) = 25m.",
    memoryTrick: "No v? Use s = ut + ½at². No t? Use v² = u² + 2as. No s? Use v = u + at.",
    formulaOrRule: "1. v = u + at | 2. s = ut + ½at² | 3. v² = u² + 2as | 4. s = ½(u + v)t",
    commonMistake: "Forgetting that 'starts from rest' means initial velocity u = 0, and 'comes to a halt' means final velocity v = 0.",
    quickRecall: {
      question: "Which formula has NO time (t) parameter?",
      options: ["v = u + at", "s = ut + ½at²", "v² = u² + 2as", "s = ½(u+v)t"],
      answer: "v² = u² + 2as"
    }
  },
  {
    title: "Balancing Chemical Equations by Inspection",
    subject: "Chemistry",
    category: "Chemical Reactions",
    keyIdea: "Balance Metals first, then Non-metals, then Hydrogen, and finish with Oxygen (MINHO order).",
    explanation: "Oxygen and Hydrogen appear in multiple molecules and confuse students if tackled first. By balancing Metals, then non-metals like Carbon or Nitrogen, and saving Oxygen for last, the numbers almost always balance naturally.",
    example: "Combustion of Propane: C₃H₈ + O₂ → CO₂ + H₂O. (1) Carbon (non-metal): 3 CO₂. (2) Hydrogen: 4 H₂O. (3) Oxygen: 3(2) + 4(1) = 10 O => 5 O₂. Result: C₃H₈ + 5O₂ → 3CO₂ + 4H₂O.",
    memoryTrick: "M-I-N-H-O: Metal → Ion/Non-metal → Hydrogen → Oxygen.",
    formulaOrRule: "Atoms of each element on Reactant side must equal Atoms on Product side. Never change chemical subscripts!",
    commonMistake: "Changing subscripts like H₂O into H₂O₂ instead of changing the stoichiometric coefficient in front.",
    quickRecall: {
      question: "In the MINHO rule for balancing equations, which element is balanced LAST?",
      options: ["Metals", "Carbon", "Hydrogen", "Oxygen"],
      answer: "Oxygen"
    }
  },
  {
    title: "Genetics: Solving Monohybrid Cross Ratios",
    subject: "Biology",
    category: "Genetics",
    keyIdea: "A heterozygous cross (Tt × Tt) ALWAYS yields a 3:1 phenotypic ratio and 1:2:1 genotypic ratio.",
    explanation: "Whenever two hybrid organisms carrying dominant and recessive alleles mate, three-quarters express the dominant physical trait, while exactly one-quarter express the recessive trait.",
    example: "Tall plant (Tt) × Tall plant (Tt) produces 75% Tall plants and 25% Short/Dwarf plants.",
    memoryTrick: "Heterozygous parents = 3 Dominant to 1 Recessive, guaranteed.",
    formulaOrRule: "Tt × Tt = 1 TT (homozygous dominant) : 2 Tt (heterozygous) : 1 tt (homozygous recessive).",
    commonMistake: "Confusing Genotype ratio (1:2:1) with Phenotype ratio (3:1).",
    quickRecall: {
      question: "What is the phenotypic ratio in a standard monohybrid heterozygous cross?",
      options: ["1:1", "3:1", "9:3:3:1", "1:2:1"],
      answer: "3:1"
    }
  }
];

const RESOURCES = [
  {
    title: "JAMB UTME Complete Mathematics Formula Sheet",
    subject: "Mathematics",
    targetClass: "JAMB",
    resourceType: "PDF",
    description: "High-yield comprehensive formula summary covering Algebra, Calculus, Trigonometry, Coordinate Geometry, and Statistics for quick revision.",
    fileUrl: "https://stlawrencenga.edu.ng/resources/jamb-mathematics-formula-sheet.pdf"
  },
  {
    title: "WAEC SSCE Essential Use of English Concord Rules",
    subject: "English Language",
    targetClass: "SSS 3",
    resourceType: "NOTE",
    description: "24 cardinal rules of concord explained with past question drills, common pitfalls, and examiner tips.",
    fileUrl: "https://stlawrencenga.edu.ng/resources/waec-english-concord-guide.pdf"
  },
  {
    title: "Physics Mechanics & Kinematics Quick Review Pack",
    subject: "Physics",
    targetClass: "SSS 3",
    resourceType: "REVISION",
    description: "Step-by-step worked examples on Newton's laws, projectile motion, circular motion, and friction.",
    fileUrl: "https://stlawrencenga.edu.ng/resources/physics-mechanics-revision-pack.pdf"
  },
  {
    title: "Senior Secondary Chemistry Stoichiometry & Mole Concept Guide",
    subject: "Chemistry",
    targetClass: "SSS 2-3",
    resourceType: "WORKSHEET",
    description: "Worked problems and practice drills on gas volumes at s.t.p., molar mass, empirical formulas, and titration calculations.",
    fileUrl: "https://stlawrencenga.edu.ng/resources/chemistry-mole-concept-worksheet.pdf"
  },
  {
    title: "Biology Genetics & Heredity Revision Flashcards & Summary",
    subject: "Biology",
    targetClass: "JAMB",
    resourceType: "GUIDE",
    description: "Mendelian genetics, sex-linked traits, blood group inheritance, and pedigree charts clearly broken down.",
    fileUrl: "https://stlawrencenga.edu.ng/resources/biology-genetics-summary.pdf"
  }
];

const DEFAULT_ASSIGNMENTS = [
  {
    title: "Weekly Practice Drill: Quadratic Discriminant & Roots",
    subject: "Mathematics",
    targetClass: "SSS 3",
    description: "Solve questions 1 through 10 on quadratic nature of roots from your syllabus. Show full working for each question.",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    fileUrl: "https://stlawrencenga.edu.ng/assignments/math-drill-1.pdf"
  },
  {
    title: "Essay Drill: The Impact of Digital Technology on Education",
    subject: "English Language",
    targetClass: "SSS 3",
    description: "Write an expository essay of not less than 350 words discussing how online learning platforms enhance student achievement in secondary schools.",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    fileUrl: null
  }
];

async function seedLearningPlatform() {
  console.log('🌱 Starting St. Lawrence NextGen Learning Platform Database Seeding...');

  // 1. Seed CBT Questions
  console.log('  -> Seeding Central Question Bank...');
  for (const q of CBT_QUESTIONS) {
    const existing = await prisma.cbtQuestion.findFirst({
      where: {
        questionText: q.questionText,
        subject: q.subject
      }
    });
    if (!existing) {
      await prisma.cbtQuestion.create({ data: q });
    }
  }
  const qCount = await prisma.cbtQuestion.count();
  console.log(`  ✅ Question Bank verified (${qCount} total questions in database).`);

  // 2. Seed TIPS Items
  console.log('  -> Seeding TIPS Learning System...');
  for (const tip of TIPS_ITEMS) {
    const existing = await prisma.tip.findFirst({
      where: { title: tip.title }
    });
    if (!existing) {
      await prisma.tip.create({ data: tip });
    }
  }
  const tipCount = await prisma.tip.count();
  console.log(`  ✅ TIPS verified (${tipCount} total TIPS in database).`);

  // 3. Seed Educational Resources
  console.log('  -> Seeding Educational Resource Library...');
  for (const res of RESOURCES) {
    const existing = await prisma.resource.findFirst({
      where: { title: res.title }
    });
    if (!existing) {
      await prisma.resource.create({ data: res });
    }
  }
  const resCount = await prisma.resource.count();
  console.log(`  ✅ Resource Library verified (${resCount} total resources in database).`);

  // 4. Seed Initial Assignments
  console.log('  -> Seeding Sample Assignments...');
  for (const a of DEFAULT_ASSIGNMENTS) {
    const existing = await prisma.assignment.findFirst({
      where: { title: a.title }
    });
    if (!existing) {
      await prisma.assignment.create({
        data: {
          ...a,
          teacherId: 'academic-team'
        }
      });
    }
  }
  const assignCount = await prisma.assignment.count();
  console.log(`  ✅ Assignments verified (${assignCount} active assignments in database).`);

  console.log('🎉 St. Lawrence NextGen Learning Platform successfully seeded into database!');
  await prisma.$disconnect();
}

seedLearningPlatform().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
