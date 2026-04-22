import { motion, AnimatePresence } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { useState, type ReactNode, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface FiltersProps {
  children: ReactNode;
  onClear?: () => void;
  activeFiltersCount?: number;
}

export function Filters({ children, onClear, activeFiltersCount = 0 }: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Filter button */}
      <div className="relative flex-1 lg:flex-initial">
        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full lg:w-auto"
        >
          <Filter size={18} />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Desktop dropdown */}
        {!isMobile && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
                className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm">Filtros avanzados</h3>
                  <div className="flex items-center gap-2">
                    {onClear && activeFiltersCount > 0 && (
                      <button
                        onClick={onClear}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Limpiar
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">{children}</div>

                <div className="p-4 border-t border-border">
                  <Button onClick={() => setIsOpen(false)} className="w-full" size="sm">
                    Aplicar filtros
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile modal */}
      {isMobile && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Filtros avanzados"
          size="md"
        >
          <div className="space-y-5">{children}</div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            {onClear && activeFiltersCount > 0 && (
              <button
                onClick={onClear}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Limpiar filtros
              </button>
            )}
            <Button onClick={() => setIsOpen(false)} className="ml-auto" size="md">
              Aplicar filtros
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

interface FilterGroupProps {
  label: string;
  children: ReactNode;
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
