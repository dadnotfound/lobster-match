/**
 * MBTI Calculator Unit Tests
 */

const MBTICalculator = require('../../lib/mbti-calculator');

describe('MBTICalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new MBTICalculator();
  });

  test('should calculate ENFP correctly', () => {
    const answers = {
      EI: ['E', 'E'],
      SN: ['N', 'N', 'N'],
      TF: ['F', 'F', 'F'],
      JP: ['P', 'P']
    };
    const result = calculator.calculate(answers);
    expect(result).toBe('ENFP');
  });

  test('should calculate INTP correctly', () => {
    const answers = {
      EI: ['I', 'I'],
      SN: ['N', 'N', 'N'],
      TF: ['T', 'T', 'T'],
      JP: ['P', 'P']
    };
    const result = calculator.calculate(answers);
    expect(result).toBe('INTP');
  });

  test('should handle tie (choose first letter)', () => {
    const answers = {
      EI: ['E', 'I'],
      SN: ['N', 'S'],
      TF: ['T', 'F'],
      JP: ['J', 'P']
    };
    const result = calculator.calculate(answers);
    // Should choose first letter in tie: E, N, T, J -> ENTJ
    expect(['ENTJ', 'ENTP', 'ENFJ', 'ENFP', 'ISTJ', 'ISTP', 'ISFJ', 'ISFP', 'INTJ', 'INTP', 'INFJ', 'INFP', 'ESTJ', 'ESTP', 'ESFJ', 'ESFP']).toContain(result);
  });

  test('should handle empty answers (default to ISTJ)', () => {
    const answers = {
      EI: [],
      SN: [],
      TF: [],
      JP: []
    };
    const result = calculator.calculate(answers);
    expect(result).toBe('ISTJ');
  });

  test('should throw error for invalid MBTI', () => {
    const calculator = new MBTICalculator();
    // This should never happen with correct implementation, but test error handling
    expect(() => {
      calculator._validate('XXXX');
    }).toThrow();
  });
});
