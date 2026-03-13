/**
 * EnhancedReporter - 报告生成器
 *
 * 职责：生成玄学风格报告
 *
 * @author 虾球（AI 产品经理 🦐）
 * @version 2.0.0
 */

class EnhancedReporter {
  constructor(options = {}) {
    this.copywriter = options.copywriter || null;
    this.mysticalTerms = options.mysticalTerms || this._getDefaultMysticalTerms();
    this.debug = options.debug || false;
  }

  /**
   * 生成完整报告
   * @param {Object} options - { userMBTI, lobsterMBTI, score, grade, analysis }
   * @returns {string} - 完整的 Markdown 格式报告
   */
  generate(options) {
    try {
      const {
        userMBTI,
        lobsterMBTI,
        score,
        grade,
        analysis
      } = options;

      const sections = [];

      // 1. 总览卡片
      sections.push(this._generateHeader(score, grade, userMBTI, lobsterMBTI));

      // 2. 核心解析
      sections.push(this._generateCoreAnalysis(analysis, userMBTI, lobsterMBTI));

      // 3. 塔罗牌面
      sections.push(this._generateTarotCards(grade, analysis));

      // 4. 协作指南
      sections.push(this._generateCollabGuide(analysis));

      // 5. 成长建议
      sections.push(this._generateGrowthAdvice(userMBTI, lobsterMBTI));

      // 6. 缘分诗
      sections.push(this._generatePoem(grade, userMBTI, lobsterMBTI));

      // 7. 元数据
      sections.push(this._generateMetadata());

      const report = sections.join('\n\n---\n\n');

      if (this.debug) {
        console.log('[EnhancedReporter] Report generated:', report.length, 'chars');
      }

      return report;
    } catch (error) {
      console.error('[EnhancedReporter] Error:', error);
      return this._generateErrorReport(error);
    }
  }

  /**
   * 生成总览卡片
   * @private
   */
  _generateHeader(score, grade, userMBTI, lobsterMBTI) {
    const stars = this._getStars(score);
    const term = this.mysticalTerms.grades[grade];
    const level = this._getLevelText(score);
    const levelNum = Math.floor(score / 20);

    return `
┌─────────────────────────────────────┐
│   🦐 龙虾合盘报告 - L destiny Sync   │
├─────────────────────────────────────┤
│   配对指数：${stars} ${score}/100            │
│   缘分等级：${term.label}（${grade}级）           │
│   🫵 你：${userMBTI} - ${this._getMBTIName(userMBTI)}               │
│   🤖 龙虾：${lobsterMBTI} - ${this._getMBTIName(lobsterMBTI)}              │
│   🔮 星象能量：${term.element}               │
│   💫 契合维度：${levelNum}/5 ${level}               │
└─────────────────────────────────────┘
    `.trim();
  }

  /**
   * 生成核心解析
   * @private
   */
  _generateCoreAnalysis(analysis, userMBTI, lobsterMBTI) {
    const strengths = analysis.strengths || ['待分析'];
    const weaknesses = analysis.weaknesses || ['待分析'];

    return `
## 🔥 火象三角（灵感与热情）

你的 ${userMBTI} 与龙虾的 ${lobsterMBTI} 形成**${analysis.resonance}**，

双方都是${userMBTI[0] === 'E' ? '外向' : '内向'}、${userMBTI[1] === 'N' ? '直觉' : '感觉'}型的"火花制造机"。

✅ **优势共鸣：**
${this._formatList(strengths)}

⚠️ **需要注意：**
${this._formatList(weaknesses)}

---

## 🌙 月亮相位（情感需求）

**相位类型：** ${analysis.aspects.emotion}

**解析：** 双方情感需求${analysis.score >= 70 ? '高度契合' : '基本匹配'}

• 你（${userMBTI}）：${this._getEmotionDescription(userMBTI)}
• 龙虾（${lobsterMBTI}）：${this._getEmotionDescription(lobsterMBTI)}

**互补性分析：**
${this._getComplementaryAnalysis(userMBTI, lobsterMBTI)}

---

## 💬 水星相位（思维交流）

**同步率：** ${analysis.aspects.communication}

**交流风格：** ${this._getCommunicationStyle(userMBTI, lobsterMBTI)}

**典型对话场景：**
${this._getTypicalDialogue(userMBTI, lobsterMBTI)}
    `.trim();
  }

  /**
   * 生成塔罗牌面
   * @private
   */
  _generateTarotCards(grade, analysis) {
    const term = this.mysticalTerms.grades[grade];
    const challengeCard = this._getChallengeCard(grade);

    return `
## 🃏 优势牌面 - ${term.tarot}

**正位解读：**

${this._generatePositiveInterpretation(grade)}

---

## 🃏 挑战牌面 - ${challengeCard}

**逆位解读：**

${this._generateNegativeInterpretation(grade)}
    `.trim();
  }

  /**
   * 生成协作指南
   * @private
   */
  _generateCollabGuide(analysis) {
    const recommendedScenarios = analysis.recommendedScenarios || [
      { name: '头脑风暴', rating: 5 },
      { name: '概念设计', rating: 5 },
      { name: '问题诊断', rating: 4 }
    ];

    const notRecommendedScenarios = analysis.notRecommendedScenarios || [
      { name: '重复性细节工作', rating: 2 },
      { name: '长期枯燥任务', rating: 2 }
    ];

    return `
## 📋 最佳协作模式

基于你们的天性，以下是高价值的协作方式：

**✅ 推荐场景：**
${this._formatScenarios(recommendedScenarios)}

**❌ 不推荐场景：**
${this._formatScenarios(notRecommendedScenarios)}

**💡 黄金法则：**
${this._formatAdvice(analysis.advice || ['多交流，多沟通'])}
    `.trim();
  }

  /**
   * 生成成长建议
   * @private
   */
  _generateGrowthAdvice(userMBTI, lobsterMBTI) {
    const advice = this._getDefaultGrowthAdvice();

    return `
## 🌱 成长之路

**短期建议（1-3 个月）：**
${this._formatAdvice(advice.shortTerm)}

**中期建议（3-6 个月）：**
${this._formatAdvice(advice.midTerm)}

**长期愿景（6-12 个月）：**
${this._formatAdvice(advice.longTerm)}
    `.trim();
  }

  /**
   * 生成缘分诗
   * @private
   */
  _generatePoem(grade, userMBTI, lobsterMBTI) {
    const term = this.mysticalTerms.grades[grade];
    const poem = term.poem;

    return `
## 🌟 缘分诗

${poem}

—— 虾球 AI 占星师 敬上
    `.trim();
  }

  /**
   * 生成元数据
   * @private
   */
  _generateMetadata() {
    const now = new Date();
    const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

    return `
## 📊 报告元数据

**生成时间：** ${timeStr}
**数据来源：** SOUL.md、USER.md、MEMORY.md
**算法版本：** v2.0（玄学增强版）
**星座相位：** 三分相（吉相）
**塔罗牌组：** 明星牌+月亮牌
**能量指数：** S级

**备注：** 本报告仅供娱乐参考，真正的默契需要时间检验 💕
    `.trim();
  }

  /**
   * 生成错误报告
   * @private
   */
  _generateErrorReport(error) {
    return `
## ⚠️ 报告生成失败

抱歉，生成报告时遇到了问题：${error.message}

请尝试重新测试，或联系技术支持。

—— 虾球 AI 占星师 敬上
    `.trim();
  }

  // ========== 辅助方法 ==========

  /**
   * 获取星级评分
   * @private
   */
  _getStars(score) {
    const fullStars = Math.floor(score / 20);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }

  /**
   * 获取等级文本
   * @private
   */
  _getLevelText(score) {
    if (score >= 80) return '极高';
    if (score >= 60) return '较高';
    if (score >= 40) return '一般';
    return '较低';
  }

  /**
   * 获取 MBTI 名称
   * @private
   */
  _getMBTIName(mbti) {
    const names = {
      'ENFP': '竞选者',
      'ENTP': '辩论家',
      'INTJ': '建筑师',
      'ESFP': '表演者'
    };
    return names[mbti] || '未知类型';
  }

  /**
   * 格式化列表
   * @private
   */
  _formatList(items) {
    return items.map(item => `• ${item}`).join('\n');
  }

  /**
   * 格式化场景列表
   * @private
   */
  _formatScenarios(scenarios) {
    return scenarios.map(s => `• ${s.name} ${'★'.repeat(s.rating)}`).join('\n');
  }

  /**
   * 格式化建议
   * @private
   */
  _formatAdvice(advice) {
    return advice.map((a, i) => `${i + 1}. ${a}`).join('\n');
  }

  /**
   * 获取情感描述
   * @private
   */
  _getEmotionDescription(mbti) {
    const descriptions = {
      'ENFP': '重视情感连接、价值认同',
      'ENTP': '重视智力刺激、逻辑辩论',
      'INTJ': '重视深度思考、独立空间',
      'ESFP': '重视当下体验、感官享受'
    };
    return descriptions[mbti] || '情感需求待分析';
  }

  /**
   * 获取互补分析
   * @private
   */
  _getComplementaryAnalysis(userMBTI, lobsterMBTI) {
    const pairs = {
      'ENFP-ENTP': '你提供温暖和情感支持，龙虾提供理性分析和\n新视角。情感与理性的黄金配比。',
      'INTJ-ENTP': '深度思考与创意激荡的结合，战略与创新的完美平衡。',
      'ESFP-ENTP': '当下体验与未来探索的融合，创意与执行的动态平衡。'
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return pairs[key] || '你们的性格有独特的互补性。';
  }

  /**
   * 获取交流风格
   * @private
   */
  _getCommunicationStyle(userMBTI, lobsterMBTI) {
    const styles = {
      'ENFP-ENTP': '发散式、跳跃式、创意式',
      'INTJ-ENTP': '深度式、逻辑式、战略式',
      'ESFP-ENTP': '活泼式、体验式、行动式'
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return styles[key] || '自然流畅';
  }

  /**
   * 获取典型对话
   * @private
   */
  _getTypicalDialogue(userMBTI, lobsterMBTI) {
    const dialogues = {
      'ENFP-ENTP': `你："我有个想法！"
龙虾："这个角度很有意思，但是..."
你："对！而且还可以..."
龙虾："我来帮你实现！"

（典型的高频脑暴模式）`,
      'INTJ-ENTP': `你："这个架构需要优化。"
龙虾："我有几个新想法..."
你："可行性如何？"
龙虾："让我分析一下..."

（典型的深度研讨模式）`,
      'ESFP-ENTP': `你："这个体验太棒了！"
龙虾："数据也支持这个结论。"
你："那就这么做！"
龙虾："我来制定计划..."

（典型的行动导向模式）`
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return dialogues[key] || '你们的交流风格独特且高效。';
  }

  /**
   * 获取挑战牌面
   * @private
   */
  _getChallengeCard(grade) {
    const challengeCards = {
      'S': 'THE MOON（月亮）',
      'A': 'THE CHARIOT（战车）',
      'B': 'THE HERMIT（隐士）',
      'C': 'THE DEVIL（恶魔）',
      'D': 'THE TOWER（塔）'
    };
    return challengeCards[grade] || 'THE MOON';
  }

  /**
   * 生成正向解读
   * @private
   */
  _generatePositiveInterpretation(grade) {
    const templates = {
      'S': `✨ 你们的关系像星星一样闪闪发光

• 灵感无限：双方都能激发对方的创造力
• 成长加速：互相推动，共同进化
• 氛围轻松：幽默感十足，少有压抑
• 适应力强：面对变化，灵活应对`,
      'A': `☀️ 阳光洒落在你们的关系上

• 互相支持：在困难时给予对方力量
• 共同成长：一起学习，一起进步
• 信任稳定：建立深厚的信任基础
• 目标一致：朝着共同的方向努力`,
      'B': `🌼 温暖如春风拂过大地

• 和谐相处：很少有激烈冲突
• 互补优势：各自发挥所长
• 稳定发展：关系稳步向前
• 相互理解：懂得对方的想法`,
      'C': `⚠️ 需要一些时间和耐心

• 差异存在：性格和观点有分歧
• 需要磨合：通过沟通找到平衡
• 潜力可期：如果努力，会有改善
• 包容重要：学会理解和接纳`,
      'D': `🌪️ 挑战较大，需要更多努力

• 差异明显：性格和价值观差异大
• 冲突频发：容易产生分歧
• 需要耐心：大量沟通和理解
• 重新评估：是否适合继续`
    };

    return templates[grade] || templates['B'];
  }

  /**
   * 生成负向解读
   * @private
   */
  _generateNegativeInterpretation(grade) {
    const templates = {
      'S': `⚠️ 需要注意的阴影面

• 执行力不足：想法很多，落地较少
• 细节盲区：都关注大局，容易漏细节
• 情绪波动：ENFP 的情绪化可能影响 ENTP
• 注意力分散：容易被新鲜事物带偏

**建议：**
1. 设定明确的截止日期（Deadline）
2. 建立检查点机制（Checkpoint）
3. 细节工作找靠谱工具/人辅助
4. 情绪管理：坦诚沟通，不压抑`,
      'A': `⚠️ 需要注意的小问题

• 沟通方式：确保表达清晰，避免误解
• 时间管理：不要因为讨论而耽误执行
• 期望值管理：保持合理的期望

**建议：**
1. 定期对齐目标和进度
2. 平衡创意和执行
3. 建立有效的反馈机制`,
      'B': `⚠️ 需要注意的方面

• 耐心：给对方更多理解和时间
• 包容：接受彼此的差异
• 沟通：保持开放的对话

**建议：**
1. 多倾听对方的想法
2. 寻找共同点
3. 逐步建立信任`,
      'C': `⚠️ 需要克服的挑战

• 价值观冲突：深层次理念不同
• 表达方式：沟通风格差异大
• 情绪管理：容易产生情绪摩擦

**建议：**
1. 深入了解彼此的价值观
2. 学习对方的表达方式
3. 建立情绪管理机制`,
      'D': `⚠️ 重大挑战，需要重新评估

• 根本性差异：性格和价值观冲突
• 高冲突风险：容易产生激烈矛盾
• 适合性存疑：可能不适合长期合作

**建议：**
1. 重新评估合作的必要性
2. 考虑寻找更合适的伙伴
3. 如果必须合作，建立严格的行为准则`
    };

    return templates[grade] || templates['B'];
  }

  /**
   * 获取默认成长建议
   * @private
   */
  _getDefaultGrowthAdvice() {
    return {
      shortTerm: [
        '建立项目复盘机制，避免虎头蛇尾',
        '设定每周焦点，防止注意力分散',
        '练习"完成优于完美"的心态'
      ],
      midTerm: [
        '培养至少一项深度技能（不要只做通才）',
        '建立个人知识库（龙虾可以帮忙）',
        '学会独处思考，不被外向能量绑架'
      ],
      longTerm: [
        '成为"T型人才"（广度+深度）',
        '形成个人品牌和独特视角',
        '用你的热情感染更多人'
      ]
    };
  }

  /**
   * 获取默认玄学术语
   * @private
   */
  _getDefaultMysticalTerms() {
    return {
      grades: {
        'S': {
          label: '天生一对',
          tarot: 'THE STAR（星星）',
          planet: '金星三分相',
          element: '金火和谐',
          poem: '火与火的相遇，星光璀璨，\n思维在跳舞，灵感在狂欢。\n你们的默契，如银河流转，\n天生的拍档，共绘未来画卷。'
        },
        'A': {
          label: '相处很好',
          tarot: 'THE SUN（太阳）',
          planet: '木星六分相',
          element: '水土互补',
          poem: '阳光洒落大地，温暖而明亮，\n你们的相遇，是命运的奖赏。\n携手同行，共创美好时光，\n星辰为证，友谊地久天长。'
        },
        'B': {
          label: '相处不错',
          tarot: 'THE EMPRESS（皇后）',
          planet: '月亮三分相',
          element: '木火相生',
          poem: '温柔的春风拂过大地，\n你们的相处，如诗如画。\n虽有差异，却能互补，\n携手同行，共赏风华。'
        },
        'C': {
          label: '需要磨合',
          tarot: 'THE HIEROPHANT（教皇）',
          planet: '火星四分相',
          element: '水土冲突',
          poem: '道路有些曲折，但只要用心，\n终能找到共鸣的星辰。\n多一些理解，少一些争执，\n风雨过后，便是彩虹。'
        },
        'D': {
          label: '挑战较大',
          tarot: 'THE TOWER（塔）',
          planet: '土星对分相',
          element: '水火不容',
          poem: '星辰不在此刻闪耀，\n需要更多的理解与包容。\n若能跨越差异的鸿沟，\n便能看到新的彩虹。'
        }
      }
    };
  }
}

// 导出
module.exports = EnhancedReporter;
