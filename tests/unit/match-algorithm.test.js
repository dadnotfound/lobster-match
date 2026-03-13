/**
 * Match Algorithm Unit Tests
 */

const MatchAlgorithm = require('../../lib/match-algorithm');

describe('MatchAlgorithm', () => {
  let algorithm;

  beforeEach(() => {
    algorithm = new MatchAlgorithm();
  });

  test('should calculate high score for ENFP + ENTP', () => {
    const score = algorithm.calculate('ENFP', 'ENTP');
    expect(score).toBeGreaterThanOrEqual(80);
  });

  test('should calculate special combo bonus for INTJ + ENTP', () => {
    const score = algorithm.calculate('INTJ', 'ENTP');
    expect(score).toBeGreaterThan(70); // Should have +15 bonus
  });

  test('should calculate medium score for different types', () => {
    const score = algorithm.calculate('ISFJ', 'ENTP');
    expect(score).toBeGreaterThanOrEqual(50);
    expect(score).toBeLessThan(80);
  });

  test('should return score between 0 and 100', () => {
    const score = algorithm.calculate('XXXX', 'ENTP');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should calculate dimension similarity correctly', () => {
    // ENFP vs ENTP: E=N, N=N, T≠F, P=P -> 3 same dimensions
    const score1 = algorithm.calculate('ENFP', 'ENTP');
    // INTJ vs ENTP: I≠E, N=N, T=T, J≠P -> 2 same dimensions
    const score2 = algorithm.calculate('INTJ', 'ENTP');
    
    // ENFP should have higher score due to more similarities + special combo
    expect(score1).toBeGreaterThan(score2);
  });
});
