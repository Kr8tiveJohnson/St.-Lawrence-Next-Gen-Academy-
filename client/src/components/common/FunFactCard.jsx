const FACTS = [
  { emoji: "📚", fact: "The Pomodoro technique (25 min study, 5 min break) improves focus by 40%." },
  { emoji: "🧠", fact: "Teaching what you've learned to someone else is the most effective revision method." },
  { emoji: "💤", fact: "Sleep consolidates memory. Studying before bed improves retention overnight." },
  { emoji: "🎯", fact: "Students who set specific study goals score 20% higher on average." },
  { emoji: "🖊️", fact: "Handwriting notes encodes information more deeply than typing." },
  { emoji: "🌊", fact: "Spaced repetition — reviewing at increasing intervals — is the #1 memory technique." },
  { emoji: "💪", fact: "Exercise for 20 minutes before studying boosts concentration and creativity." }
];

export default function FunFactCard() {
  const todayIndex = Math.floor(Date.now() / 86400000) % FACTS.length;
  const { emoji, fact } = FACTS[todayIndex];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)',
      border: '1px solid rgba(10, 22, 40, 0.08)',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      gap: '16px',
      alignItems: 'flex-start'
    }}>
      <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--navy)', opacity: 0.5, marginBottom: '6px' }}>
          Daily Study Fact
        </div>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--navy)' }}>
          {fact}
        </p>
      </div>
    </div>
  );
}
