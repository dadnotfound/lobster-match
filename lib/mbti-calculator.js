/**
 * MBTI Calculator
 * 
 * Calculates MBTI type from user answers
 */

class MBTICalculator {
  constructor(config = {}) {
    this.method = config.method || 'simple';
  }

  /**
   * Calculate MBTI from answers
   * @param {Object} answers - { EI: ['E', 'I'], SN: [...], TF: [...], JP: [...] }
   * @returns {string} - MBTI type (e.g., "ENFP")
   */
  calculate(answers) {
    const counts = this._countAnswers(answers);
    const type = this._determineType(counts);
    this._validate(type);
    return type;
  }

  /**
   * Count answers for each dimension
   * @private
   */
  _countAnswers(answers) {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    for (const values of Object.values(answers)) {
      for (const value of values) {
        if (counts.hasOwnProperty(value)) {
          counts[value]++;
        }
      }
    }

    return counts;
  }

  /**
   * Determine MBTI type from counts
   * @private
   */
  _determineType(counts) {
    return [
      counts.E > counts.I ? 'E' : 'I',
      counts.S > counts.N ? 'S' : 'N',
      counts.T > counts.F ? 'T' : 'F',
      counts.J > counts.P ? 'J' : 'P'
    ].join('');
  }

  /**
   * Validate MBTI type
   * @private
   */
  _validate(type) {
    const valid = /^[EI][NS][TF][JP]$/.test(type);
    if (!valid) {
      throw new Error(`Invalid MBTI type: ${type}`);
    }
  }
}

module.exports = MBTICalculator;
