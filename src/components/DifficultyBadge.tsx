export function DifficultyBadge({ level }: { level: number }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
      难度 {level}/10
    </span>
  );
}
