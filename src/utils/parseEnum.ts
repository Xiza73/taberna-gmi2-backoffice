/**
 * Type-safe parser for finite string unions from `<select>` / form values.
 *
 * Use instead of `e.target.value as MyUnion` at call sites: keeps the unsafe
 * narrowing isolated to this single helper and falls back to a known-good
 * value when something unexpected sneaks in (e.g. a stale option).
 *
 * @example
 *   const STATUS = ['all', 'active', 'inactive'] as const;
 *   type Status = typeof STATUS[number];
 *   onChange={(e) => onStatusChange(parseEnum(e.currentTarget.value, STATUS, 'all'))}
 */
export function parseEnum<T extends string>(
  value: string,
  allowed: readonly T[],
  fallback: T,
): T {
  // `allowed` is `readonly T[]` so `.includes` needs a widened type to accept
  // an arbitrary string at runtime.
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}
