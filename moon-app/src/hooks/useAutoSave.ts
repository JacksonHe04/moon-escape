'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

type UseAutoSaveParams = {
  delayMs?: number;
  isDirty: boolean;
  save: () => Promise<void>;
};

export function useAutoSave({ delayMs = 5000, isDirty, save }: UseAutoSaveParams) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const inFlight = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSave = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setStatus('saving');
    setError(null);
    try {
      await save();
      setStatus('saved');
      setLastSavedAt(new Date());
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      inFlight.current = false;
    }
  }, [save]);

  useEffect(() => {
    if (!isDirty) return;
    if (timer.current) clearTimeout(timer.current);
    setStatus((s) => (s === 'saving' ? s : 'dirty'));
    timer.current = setTimeout(() => { void runSave(); }, delayMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [isDirty, delayMs, runSave]);

  const saveNow = useCallback(() => { void runSave(); }, [runSave]);

  return { status, error, lastSavedAt, saveNow };
}
