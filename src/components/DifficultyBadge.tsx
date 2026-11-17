export function DifficultyBadge({ level }: { level: number }) {
  return <span className="difficulty-badge">难度 {level}/10</span>;
}
