import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const isError = false;
    expect(cn('base', isActive && 'active', isError && 'error')).toBe('base active');
  });

  it('should override conflicting Tailwind classes correctly (tailwind-merge behavior)', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle mixed conditional and static classes', () => {
    const hasMargin = true;
    expect(cn('font-bold', hasMargin && 'mt-4', 'text-lg')).toBe('font-bold mt-4 text-lg');
  });

  it('should return empty string for no inputs', () => {
    expect(cn()).toBe('');
  });

  it('should ignore falsy values', () => {
    expect(cn('base', null, undefined, false, 'another')).toBe('base another');
  });
});
