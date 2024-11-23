import { genId } from '../../../src/core/utils';
import { resolveValue } from '../../../src/core/types';

describe('Utility Functions', () => {
  it('generates unique IDs', () => {
    const id1 = genId();
    const id2 = genId();
    expect(id1).not.toBe(id2);
  });

  it('resolves values correctly', () => {
    const value = resolveValue('Static Value', {});
    const dynamicValue = resolveValue((data) => `Dynamic: ${data}`, 'Test');
    expect(value).toBe('Static Value');
    expect(dynamicValue).toBe('Dynamic: Test');
  });
});
