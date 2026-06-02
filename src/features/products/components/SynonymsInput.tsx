import { X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}

// Input de "chips" para sinónimos / palabras relacionadas. El usuario escribe
// un término y lo confirma con Enter o coma. Sirven para que el producto
// aparezca al buscar palabras alternativas (ej. "zapato" → "calzado").
export function SynonymsInput({ value, onChange, disabled = false }: Props) {
  const [draft, setDraft] = useState('');

  const addTerm = (raw: string) => {
    const term = raw.trim();
    if (term === '') return;
    const exists = value.some((v) => v.toLowerCase() === term.toLowerCase());
    if (exists) {
      setDraft('');
      return;
    }
    onChange([...value, term]);
    setDraft('');
  };

  const removeTerm = (term: string) => {
    onChange(value.filter((v) => v !== term));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTerm(draft);
    } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      const last = value[value.length - 1];
      if (last !== undefined) removeTerm(last);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-border bg-input-background min-h-11">
        {value.map((term) => (
          <span
            key={term}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
          >
            {term}
            <button
              type="button"
              onClick={() => removeTerm(term)}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive disabled:opacity-30"
              aria-label={`Quitar ${term}`}
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => addTerm(draft)}
          disabled={disabled}
          placeholder={
            value.length === 0 ? 'Ej: calzado, championes, tenis' : 'Agregar otro…'
          }
          className="flex-1 min-w-35 bg-transparent outline-none text-sm px-1"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Palabras alternativas con las que el cliente podría buscar este producto.
        Escribe y presiona Enter o coma para agregar cada una. Opcional.
      </p>
    </div>
  );
}
