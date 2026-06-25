import { describe, it, expect } from 'vitest';
import {
  parseSchemaString,
  generateSchemaString,
  padBytes32Value,
  ZERO_BYTES32,
  type SchemaField,
} from '../eas';

describe('parseSchemaString', () => {
  it('returns an empty array for empty input', () => {
    expect(parseSchemaString('')).toEqual([]);
    expect(parseSchemaString('   ')).toEqual([]);
  });

  it('parses a single field', () => {
    expect(parseSchemaString('string skill')).toEqual([
      { type: 'string', name: 'skill', required: true },
    ]);
  });

  it('parses multiple fields and trims whitespace', () => {
    expect(parseSchemaString('string skill,  uint256 score , bool verified')).toEqual([
      { type: 'string', name: 'skill', required: true },
      { type: 'uint256', name: 'score', required: true },
      { type: 'bool', name: 'verified', required: true },
    ]);
  });

  it('skips malformed segments', () => {
    expect(parseSchemaString('string skill, garbage, uint256 score')).toEqual([
      { type: 'string', name: 'skill', required: true },
      { type: 'uint256', name: 'score', required: true },
    ]);
  });
});

describe('generateSchemaString', () => {
  it('joins fields into a schema string', () => {
    const fields: SchemaField[] = [
      { type: 'string', name: 'skill', required: true },
      { type: 'uint256', name: 'score', required: false },
    ];
    expect(generateSchemaString(fields)).toBe('string skill, uint256 score');
  });

  it('round-trips with parseSchemaString', () => {
    const schema = 'string skill, uint256 score, bool verified';
    expect(generateSchemaString(parseSchemaString(schema))).toBe(schema);
  });
});

describe('padBytes32Value', () => {
  it('maps empty-ish values to the zero hash', () => {
    expect(padBytes32Value('')).toBe(ZERO_BYTES32);
    expect(padBytes32Value(undefined)).toBe(ZERO_BYTES32);
    expect(padBytes32Value(null)).toBe(ZERO_BYTES32);
  });

  it('left-pads a 20-byte address to 32 bytes (EVM word convention)', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const padded = padBytes32Value(address);
    expect(padded).toBe('0x000000000000000000000000' + address.slice(2));
    // 0x + 64 hex chars = 32 bytes
    expect((padded as string).length).toBe(66);
  });

  it('passes through values that are already bytes32', () => {
    const hash = '0xabc1230000000000000000000000000000000000000000000000000000000000';
    expect(padBytes32Value(hash)).toBe(hash);
  });

  it('passes through non-address strings untouched', () => {
    expect(padBytes32Value('hello')).toBe('hello');
  });
});
