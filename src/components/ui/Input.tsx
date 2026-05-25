import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    const isPassword = type === 'password';
    const [revealed, setRevealed] = useState(false);
    const effectiveType = isPassword && revealed ? 'text' : type;

    const inputEl = (
      <input
        ref={ref}
        type={effectiveType}
        className={cn(
          'w-full h-[38px] px-4 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
          error && 'border-destructive focus:ring-destructive',
          isPassword && 'pr-10',
          className,
        )}
        {...props}
      />
    );

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm text-muted-foreground">
            {label}
          </label>
        )}
        {isPassword ? (
          <div className="relative">
            {inputEl}
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              tabIndex={-1}
              aria-label={
                revealed ? 'Ocultar contraseña' : 'Mostrar contraseña'
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        ) : (
          inputEl
        )}
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
