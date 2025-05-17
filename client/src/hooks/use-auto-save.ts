import { useState, useEffect, useRef } from "react";

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 5000,
  enabled = true,
}: AutoSaveOptions<T>) {
  const [autoSaveIndicatorVisible, setAutoSaveIndicatorVisible] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T | null>(null);

  // Check if data has changed
  const hasDataChanged = () => {
    if (!previousDataRef.current) return true;
    
    const currentKeys = Object.keys(data);
    const previousKeys = Object.keys(previousDataRef.current);
    
    if (currentKeys.length !== previousKeys.length) return true;
    
    for (const key of currentKeys) {
      // @ts-ignore - dynamic key access
      if (data[key] !== previousDataRef.current[key]) return true;
    }
    
    return false;
  };

  // Auto-save effect
  useEffect(() => {
    // Skip if auto-save is disabled or no data changes
    if (!enabled || !hasDataChanged()) return;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        setAutoSaveIndicatorVisible(true);
        
        // Update previous data reference
        previousDataRef.current = { ...data };
        
        // Hide indicator after some time
        setTimeout(() => {
          setAutoSaveIndicatorVisible(false);
        }, 3000);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, debounceMs);
    
    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, onSave, debounceMs, enabled]);

  return {
    autoSaveIndicatorVisible,
  };
}
