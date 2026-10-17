require('dotenv').config();
const prisma = require('../src/config/database');

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

async function seed() {
  console.log('🌱 Seeding CBT Question Bank for St. Lawrence CBT System...');
  let added = 0;
  for (const q of CBT_QUESTIONS) {
    const existing = await prisma.cbtQuestion.findFirst({
      where: {
        questionText: q.questionText,
        subject: q.subject
      }
    });
    if (!existing) {
      await prisma.cbtQuestion.create({ data: q });
      added++;
    }
  }
  const total = await prisma.cbtQuestion.count();
  console.log(`✅ CBT Question Bank ready! (${added} newly added, ${total} total questions in database).`);
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
