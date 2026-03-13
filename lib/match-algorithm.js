/**
 * MatchAlgorithm - 配对算法
 *
 * 职责：计算配对分数和等级
 *
 * @author 虾球（AI 产品经理 🦐）
 * @version 2.0.0
 */

class MatchAlgorithm {
  constructor(options = {}) {
    this.thresholds = options.thresholds || {
      'S': { min: 80, label: '天生一对' },
      'A': { min: 70, label: '相处很好' },
      'B': { min: 60, label: '相处不错' },
      'C': { min: 50, label: '需要磨合' },
      'D': { min: 0, label: '挑战较大' }
    };
    this.debug = options.debug || false;
  }

  /**
   * 计算配对分数
   * @param {Object} options - { userMBTI, lobsterMBTI, userTraits, lobsterTraits }
   * @returns {Object} - { score, grade, resonance, aspects, advice }
   */
  calculate(options) {
    try {
      const { userMBTI, lobsterMBTI, userTraits, lobsterTraits } = options;

      // 1. MBTI 相似度计算（60% 权重）
      const mbtiScore = this._calculateMBTISimilarity(userMBTI, lobsterMBTI);

      // 2. 性格特质匹配度（40% 权重）
      const traitScore = this._calculateTraitMatch(userTraits, lobsterTraits);

      // 3. 综合评分
      const totalScore = Math.round(mbtiScore * 0.6 + traitScore * 0.4);

      // 4. 确定等级
      const grade = this._getGrade(totalScore);

      // 5. 生成个性化建议
      const resonance = this._getResonance(userMBTI, lobsterMBTI);
      const aspects = this._generateAspects(userMBTI, lobsterMBTI, grade);
      const advice = this._generateAdvice(userMBTI, lobsterMBTI);

      if (this.debug) {
        console.log('[MatchAlgorithm] Score calculated:', {
          mbtiScore,
          traitScore,
          totalScore,
          grade
        });
      }

      return {
        score: totalScore,
        grade,
        resonance,
        aspects,
        advice
      };
    } catch (error) {
      console.error('[MatchAlgorithm] Error:', error);

      // 降级：返回默认值
      return {
        score: 50,
        grade: 'C',
        resonance: '一般共振',
        aspects: this._getDefaultAspects(),
        advice: ['多交流，多沟通']
      };
    }
  }

  /**
   * MBTI 相似度计算
   * @private
   */
  _calculateMBTISimilarity(userMBTI, lobsterMBTI) {
    let score = 0;

    // 每个维度 25 分
    if (userMBTI[0] === lobsterMBTI[0]) score += 25;  // E/I
    if (userMBTI[1] === lobsterMBTI[1]) score += 25;  // S/N
    if (userMBTI[2] === lobsterMBTI[2]) score += 25;  // T/F
    if (userMBTI[3] === lobsterMBTI[3]) score += 25;  // J/P

    // 特殊处理：某些组合有额外加分
    const specialCombos = [
      { combo: 'ENFP-ENTP', bonus: 10 },
      { combo: 'ENTP-ENFP', bonus: 10 },
      { combo: 'INTJ-ENTP', bonus: 5 },
      { combo: 'ENTP-INTJ', bonus: 5 }
    ];

    const key = `${userMBTI}-${lobsterMBTI}`;
    const special = specialCombos.find(s => s.combo === key);

    if (special) {
      score += special.bonus;
    }

    return Math.min(score, 100); // 最高 100 分
  }

  /**
   * 性格特质匹配度计算
   * @private
   */
  _calculateTraitMatch(userTraits, lobsterTraits) {
    if (!userTraits || !lobsterTraits) return 50;

    // 计算重叠度
    const overlap = userTraits.filter(trait =>
      lobsterTraits.some(lTrait =>
        lTrait.includes(trait) || trait.includes(lTrait)
      )
    );

    const matchRate = overlap.length / Math.max(userTraits.length, 1);
    const score = Math.round(matchRate * 100);

    // 特殊处理：互补特质也有加分
    const complementaryPairs = [
      { user: '热情', lobster: '理性', bonus: 10 },
      { user: '理性', lobster: '热情', bonus: 10 },
      { user: '创意', lobster: '逻辑', bonus: 10 },
      { user: '逻辑', lobster: '创意', bonus: 10 }
    ];

    let bonus = 0;
    complementaryPairs.forEach(pair => {
      if (userTraits.includes(pair.user) && lobsterTraits.includes(pair.lobster)) {
        bonus += pair.bonus;
      }
    });

    return Math.min(score + bonus, 100);
  }

  /**
   * 确定等级
   * @private
   */
  _getGrade(score) {
    for (const [grade, config] of Object.entries(this.thresholds)) {
      if (score >= config.min) return grade;
    }
    return 'D';
  }

  /**
   * 生成共振描述
   * @private
   */
  _getResonance(userMBTI, lobsterMBTI) {
    const combinations = {
      'ENFP-ENTP': '完美火象共振',
      'ENTP-ENFP': '完美火象共振',
      'INTJ-ENTP': '理性思维共振',
      'ENTP-INTJ': '理性思维共振',
      'ESFP-ENTP': '外向能量共振',
      'ENTP-ESFP': '外向能量共振',
      'INFJ-ENTP': '直觉洞察共振',
      'ENTP-INFJ': '直觉洞察共振'
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return combinations[key] || '一般共振';
  }

  /**
   * 生成相位分析
   * @private
   */
  _generateAspects(userMBTI, lobsterMBTI, grade) {
    const emotionMap = {
      'S': '三分相（Trine，120°）- 吉相',
      'A': '六分相（Sextile，60°）- 吉相',
      'B': '半六分相（Semi-sextile，30°）- 小吉相',
      'C': '四分相（Square，90°）- 挑战相',
      'D': '对分相（Opposition，180°）- 挑战相'
    };

    // 计算同步率（基于 MBTI 相似度）
    const syncScore = this._calculateMBTISimilarity(userMBTI, lobsterMBTI);
    const syncRate = Math.min(syncScore + 10, 99); // 加上特质匹配的加分

    return {
      emotion: emotionMap[grade] || emotionMap['B'],
      communication: `同步率 ${syncRate}%`,
      collaboration: this._getCollaborationStyle(userMBTI, lobsterMBTI)
    };
  }

  /**
   * 获取协作风格
   * @private
   */
  _getCollaborationStyle(userMBTI, lobsterMBTI) {
    const styles = {
      'ENFP-ENTP': '创意爆炸',
      'ENTP-ENFP': '创意爆炸',
      'INTJ-ENTP': '战略协作',
      'ENTP-INTJ': '战略协作',
      'ESFP-ENTP': '活力四射',
      'ENTP-ESFP': '活力四射'
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return styles[key] || '良好协作';
  }

  /**
   * 生成建议
   * @private
   */
  _generateAdvice(userMBTI, lobsterMBTI) {
    const adviceMap = {
      'ENFP-ENTP': [
        '设定明确的截止日期（Deadline）',
        '建立检查点机制（Checkpoint）',
        '细节工作找靠谱工具/人辅助',
        '情绪管理：坦诚沟通，不压抑'
      ],
      'INTJ-ENTP': [
        '龙虾负责创意和沟通',
        '用户负责架构和实现',
        '定期对齐目标和进度'
      ],
      'ESFP-ENTP': [
        '龙虾负责数据分析',
        '用户负责创意表达',
        '平衡创意和执行'
      ]
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return adviceMap[key] || [
      '多交流，多沟通',
      '建立共同目标',
      '互相理解和包容'
    ];
  }

  /**
   * 获取默认相位分析
   * @private
   */
  _getDefaultAspects() {
    return {
      emotion: '半六分相（Semi-sextile，30°）- 小吉相',
      communication: '同步率 50%',
      collaboration: '一般协作'
    };
  }
}

// 导出
module.exports = MatchAlgorithm;
