import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCommand } from '../useCommand';

describe('useCommand', () => {
  it('calls callback when correct key is pressed', () => {
    const callback = vi.fn();
    const key = 's';

    renderHook(() => useCommand(key, callback));

    const event = new KeyboardEvent('keydown', { key, metaKey: true });
    window.dispatchEvent(event);

    expect(callback).toHaveBeenCalled();
  });

  it('does not call callback when incorrect key is pressed', () => {
    const callback = vi.fn();
    const key = 's';

    renderHook(() => useCommand(key, callback));

    const event = new KeyboardEvent('keydown', { key: 'a', metaKey: true });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });

  it('does not call callback when key is pressed without modifier', () => {
    const callback = vi.fn();
    const key = 's';

    renderHook(() => useCommand(key, callback));

    const event = new KeyboardEvent('keydown', { key });
    window.dispatchEvent(event);

    expect(callback).not.toHaveBeenCalled();
  });
});
