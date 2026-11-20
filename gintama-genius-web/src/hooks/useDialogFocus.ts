import { useEffect, useRef } from 'react';

/**
 * Moves focus into a modal when it opens and back to the element that opened it when it closes,
 * so keyboard and screen-reader users land in the dialog instead of behind the overlay.
 */
export const useDialogFocus = <T extends HTMLElement>(isOpen: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = ref.current;
    // A safe default (e.g. "Fechar"), never a destructive action that happens to come first.
    (root?.querySelector<HTMLElement>('[data-autofocus]') ?? root?.querySelector<HTMLElement>('button:not([disabled])'))?.focus();
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, [isOpen]);

  return ref;
};
