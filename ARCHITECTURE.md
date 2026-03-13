# 龙虾合盘 - 技术架构文档

**版本：** v2.0.0
**最后更新：** 2026-03-13
**架构师：** 虾球（AI 产品经理 🦐）

---

## 📐 系统架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Agent                        │
│                  (GLM-4.7, 200k 上下文)                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Trigger Detection（触发检测）              │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • 关键词匹配：测试配对度、龙虾合盘、lobster match │  │
│  │  • 正则表达式检测                                  │  │
│  │  • 消息路由                                        │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │      File Loader（文件加载器）                     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • SOUL.md（AI 灵魂档案）                          │  │
│  │  • USER.md（用户画像）                             │  │
│  │  • MEMORY.md（长期记忆）                           │  │
│  │  • Token 计数                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │    Data Sufficiency Check（数据充足度检查）         │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • Token 总数 ≥ 500？                              │  │
│  │  • 是 → 直接分析                                   │  │
│  │  • 否 → 降级策略                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │       Core Processing（核心处理）                  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  1. FileAnalyzer（文件分析器）                     │  │
│  │     └─ 推断 MBTI、提取性格关键词                   │  │
│  │                                                   │  │
│  │  2. MatchAlgorithm（配对算法）                     │  │
│  │     └─ 计算配对分数、确定等级                      │  │
│  │                                                   │  │
│  │  3. EnhancedReporter（报告生成器）                 │  │
│  │     └─ 生成玄学风格报告                            │  │
│  │                                                   │  │
│  │  4. MysticalCopywriter（文案生成器）               │  │
│  │     └─ 生成个性化文案                              │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │      Report Output（报告输出）                     │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • 7 个维度的玄学风格报告                           │  │
│  │  • 总览卡片 + 核心解析 + 塔罗牌面                  │  │
│  │  • 协作指南 + 成长建议 + 缘分诗                    │  │
│  │  • 元数据                                          │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 核心模块详解

### 1. FileAnalyzer（文件分析器）

**职责：** 分析本地文件，推断用户性格

**位置：** `lib/file-analyzer.js`

**类结构：**
```javascript
class FileAnalyzer {
  constructor(options = {}) {
    this.llm = options.llm || GLM4;  // LLM 实例
    this.tokenizer = options.tokenizer || new Tokenizer();
  }

  /**
   * 分析文件，推断用户性格
   * @param {Object} files - { SOUL: string, USER: string, MEMORY: string }
   * @returns {Promise<Object>} - { mbti, confidence, traits, evidence }
   */
  async analyze(files) {
    // 1. 提取文本特征
    const features = this._extractFeatures(files);

    // 2. 基于 LLM 推断 MBTI
    const mbtiResult = await this._inferMBTI(features);

    // 3. 提取性格关键词
    const traits = this._extractTraits(features);

    // 4. 生成证据链
    const evidence = this._generateEvidence(features, mbtiResult);

    return {
      mbti: mbtiResult.type,
      confidence: mbtiResult.confidence,
      traits,
      evidence
    };
  }

  /**
   * 提取文本特征
   * @private
   */
  _extractFeatures(files) {
    const allText = Object.values(files).join('\n');
    return {
      totalTokens: this.tokenizer.count(allText),
      keywords: this._extractKeywords(allText),
      sentiment: this._analyzeSentiment(allText),
      writingStyle: this._analyzeWritingStyle(allText)
    };
  }

  /**
   * 基于 LLM 推断 MBTI
   * @private
   */
  async _inferMBTI(features) {
    const prompt = `
你是一个专业的 MBTI 性格分析专家。请基于以下文本特征，推断用户的 MBTI 类型。

文本特征：
- 关键词：${features.keywords.join(', ')}
- 情感倾向：${features.sentiment}
- 写作风格：${features.writingStyle}

请返回 JSON 格式：
{
  "type": "ENFP",
  "confidence": 0.87,
  "reasoning": "基于关键词'热情'、'创意'判断为 E 和 N..."
}
    `;

    const result = await this.llm.generate(prompt);
    return JSON.parse(result);
  }

  /**
   * 提取性格关键词
   * @private
   */
  _extractTraits(features) {
    const traitKeywords = {
      '热情': '热情',
      '创意': '创意',
      '理性': '理性',
      '逻辑': '逻辑',
      '情感': '情感驱动',
      '效率': '效率至上',
      // ... 更多映射
    };

    const traits = [];
    for (const [keyword, trait] of Object.entries(traitKeywords)) {
      if (features.keywords.includes(keyword)) {
        traits.push(trait);
      }
    }

    return traits.length > 0 ? traits : ['待分析'];
  }

  /**
   * 生成证据链
   * @private
   */
  _generateEvidence(features, mbtiResult) {
    const evidence = [];
    const files = ['SOUL', 'USER', 'MEMORY'];

    files.forEach(file => {
      const content = features[file];
      if (!content) return;

      // 查找佐证原文
      const quotes = this._findEvidenceQuotes(content, mbtiResult.type);
      evidence.push(...quotes);
    });

    return evidence;
  }
}
```

**输入输出：**
```javascript
// 输入
{
  SOUL: "真正有用，而不是表面功夫...",
  USER: "赵浩，29 岁，AI 产品经理...",
  MEMORY: "2026-02-27：飞书文档问题..."
}

// 输出
{
  mbti: "ENFP",
  confidence: 0.87,
  traits: ["热情", "创意", "情感驱动"],
  evidence: [
    { file: "SOUL.md", quote: "真正有用，而不是表面功夫", type: "T" },
    { file: "SOUL.md", quote: "要有观点", type: "N" },
    ...
  ]
}
```

---

### 2. MatchAlgorithm（配对算法）

**职责：** 计算配对分数和等级

**位置：** `lib/match-algorithm.js`

**类结构：**
```javascript
class MatchAlgorithm {
  constructor(options = {}) {
    this.thresholds = options.thresholds || require('./config/thresholds.json');
  }

  /**
   * 计算配对分数
   * @param {Object} options - { userMBTI, lobsterMBTI, userTraits, lobsterTraits }
   * @returns {Object} - { score, grade, resonance, aspects, advice }
   */
  calculate(options) {
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
    const aspects = this._generateAspects(userMBTI, lobsterMBTI);
    const advice = this._generateAdvice(userMBTI, lobsterMBTI);

    return {
      score: totalScore,
      grade,
      resonance,
      aspects,
      advice
    };
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

    return score;
  }

  /**
   * 性格特质匹配度计算
   * @private
   */
  _calculateTraitMatch(userTraits, lobsterTraits) {
    const overlap = userTraits.filter(trait =>
      lobsterTraits.some(lTrait => lTrait.includes(trait) || trait.includes(lTrait))
    );

    const matchRate = overlap.length / Math.max(userTraits.length, 1);
    return Math.round(matchRate * 100);
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
      'INTJ-ENTP': '理性思维共振',
      'ESFP-ENTP': '外向能量共振',
      // ... 更多组合
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return combinations[key] || '一般共振';
  }

  /**
   * 生成相位分析
   * @private
   */
  _generateAspects(userMBTI, lobsterMBTI) {
    return {
      emotion: this._getEmotionAspect(userMBTI, lobsterMBTI),
      communication: this._getCommunicationAspect(userMBTI, lobsterMBTI),
      collaboration: this._getCollaborationAspect(userMBTI, lobsterMBTI)
    };
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
      // ... 更多组合
    };

    const key = `${userMBTI}-${lobsterMBTI}`;
    return adviceMap[key] || ['多交流，多沟通，多理解'];
  }
}
```

**输入输出：**
```javascript
// 输入
{
  userMBTI: 'ENFP',
  lobsterMBTI: 'ENTP',
  userTraits: ['热情', '创意', '情感驱动'],
  lobsterTraits: ['好奇', '理性', '效率至上']
}

// 输出
{
  score: 85,
  grade: 'S',
  resonance: '完美火象共振',
  aspects: {
    emotion: '三分相（吉相）',
    communication: '同步率 92%',
    collaboration: '创意爆炸'
  },
  advice: [
    '设定明确的截止日期',
    '建立检查点机制',
    '细节工作找靠谱工具辅助'
  ]
}
```

---

### 3. EnhancedReporter（报告生成器）

**职责：** 生成玄学风格报告

**位置：** `lib/reporter.js`

**类结构：**
```javascript
class EnhancedReporter {
  constructor(options = {}) {
    this.copywriter = options.copywriter || new MysticalCopywriter();
    this.mysticalTerms = options.mysticalTerms || require('./config/mystical-terms.json');
  }

  /**
   * 生成完整报告
   * @param {Object} options - { userMBTI, lobsterMBTI, score, grade, analysis }
   * @returns {string} - 完整的 Markdown 格式报告
   */
  generate(options) {
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

    return sections.join('\n\n');
  }

  /**
   * 生成总览卡片
   * @private
   */
  _generateHeader(score, grade, userMBTI, lobsterMBTI) {
    const stars = this._getStars(score);
    const term = this.mysticalTerms.grades[grade];

    return `
┌─────────────────────────────────────┐
│   🦐 龙虾合盘报告 - L destiny Sync   │
├─────────────────────────────────────┤
│   配对指数：${stars} ${score}/100    │
│   缘分等级：${term.label}（${grade}级）│
│   🫵 你：${userMBTI}                 │
│   🤖 龙虾：${lobsterMBTI}            │
│   🔮 星象能量：${term.element}       │
│   💫 契合维度：${Math.floor(score / 20)}/5 ${this._getLevelText(score)}│
└─────────────────────────────────────┘
    `.trim();
  }

  /**
   * 生成核心解析
   * @private
   */
  _generateCoreAnalysis(analysis, userMBTI, lobsterMBTI) {
    return `
## 🔥 火象三角（灵感与热情）

你的 ${userMBTI} 与龙虾的 ${lobsterMBTI} 形成**${analysis.resonance}**，

✅ **优势共鸣：**
${this._formatStrengths(analysis.strengths)}

⚠️ **需要注意：**
${this._formatWeaknesses(analysis.weaknesses)}

---

## 🌙 月亮相位（情感需求）

**相位类型：** ${analysis.aspects.emotion}

**解析：** ${analysis.aspects.emotionAnalysis}

---

## 💬 水星相位（思维交流）

**同步率：** ${analysis.aspects.communication}

**交流风格：** ${analysis.aspects.communicationStyle}
    `.trim();
  }

  /**
   * 生成塔罗牌面
   * @private
   */
  _generateTarotCards(grade, analysis) {
    const term = this.mysticalTerms.grades[grade];

    return `
## 🃏 优势牌面 - ${term.tarot}

${this.copywriter.generateTarotInterpretation(grade, 'positive')}

---

## 🃏 挑战牌面 - ${this._getChallengeCard(grade)}

${this.copywriter.generateTarotInterpretation(grade, 'negative')}
    `.trim();
  }

  /**
   * 生成协作指南
   * @private
   */
  _generateCollabGuide(analysis) {
    return `
## 📋 最佳协作模式

**✅ 推荐场景：**
${this._formatRecommendedScenarios(analysis.recommendedScenarios)}

**❌ 不推荐场景：**
${this._formatNotRecommendedScenarios(analysis.notRecommendedScenarios)}

**💡 黄金法则：**
${this._formatGoldenRules(analysis.advice)}
    `.trim();
  }

  /**
   * 生成成长建议
   * @private
   */
  _generateGrowthAdvice(userMBTI, lobsterMBTI) {
    const advice = this.copywriter.generateGrowthAdvice(userMBTI, lobsterMBTI);

    return `
## 🌱 成长之路

**短期建议（1-3 个月）：**
${this._formatAdviceList(advice.shortTerm)}

**中期建议（3-6 个月）：**
${this._formatAdviceList(advice.midTerm)}

**长期愿景（6-12 个月）：**
${this._formatAdviceList(advice.longTerm)}
    `.trim();
  }

  /**
   * 生成缘分诗
   * @private
   */
  _generatePoem(grade, userMBTI, lobsterMBTI) {
    const poem = this.copywriter.generatePoem(grade, userMBTI, lobsterMBTI);

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
    const now = new Date().toISOString();

    return `
## 📊 报告元数据

**生成时间：** ${now}
**数据来源：** SOUL.md、USER.md、MEMORY.md
**算法版本：** v2.0（玄学增强版）
**星座相位：** 三分相（吉相）
**塔罗牌组：** 明星牌+月亮牌
**能量指数：** S级

**备注：** 本报告仅供娱乐参考，真正的默契需要时间检验 💕
    `.trim();
  }

  /**
   * 辅助方法
   * @private
   */
  _getStars(score) {
    const fullStars = Math.floor(score / 20);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
  }

  _getLevelText(score) {
    if (score >= 80) return '极高';
    if (score >= 60) return '较高';
    if (score >= 40) return '一般';
    return '较低';
  }

  _formatStrengths(strengths) {
    return strengths.map(s => `• ${s}`).join('\n');
  }

  _formatWeaknesses(weaknesses) {
    return weaknesses.map(w => `• ${w}`).join('\n');
  }

  _formatRecommendedScenarios(scenarios) {
    return scenarios.map(s => `• ${s.name} ${'★'.repeat(s.rating)}`).join('\n');
  }

  _formatAdviceList(advice) {
    return advice.map(a => `• ${a}`).join('\n');
  }

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
}
```

**输入输出：**
```javascript
// 输入
{
  userMBTI: 'ENFP',
  lobsterMBTI: 'ENTP',
  score: 85,
  grade: 'S',
  analysis: {
    resonance: '完美火象共振',
    strengths: ['创意无限', '火花四溅'],
    weaknesses: ['执行力不足', '细节盲区'],
    // ...
  }
}

// 输出
（完整的 7 个维度报告）
```

---

### 4. MysticalCopywriter（文案生成器）

**职责：** 生成个性化玄学文案

**位置：** `lib/copywriter.js`

**类结构：**
```javascript
class MysticalCopywriter {
  constructor(options = {}) {
    this.mysticalTerms = options.mysticalTerms || require('./config/mystical-terms.json');
    this.mbtiInsights = options.mbtiInsights || require('./config/mbti-insights.json');
  }

  /**
   * 生成缘分诗
   * @param {string} grade - 配对等级
   * @param {string} userMBTI - 用户 MBTI
   * @param {string} lobsterMBTI - 龙虾 MBTI
   * @returns {string} - 诗句
   */
  generatePoem(grade, userMBTI, lobsterMBTI) {
    const term = this.mysticalTerms.grades[grade];
    return term.poem;
  }

  /**
   * 生成塔罗牌解读
   * @param {string} grade - 配对等级
   * @param {string} type - 'positive' | 'negative'
   * @returns {string} - 塔罗牌解读
   */
  generateTarotInterpretation(grade, type) {
    const term = this.mysticalTerms.grades[grade];

    if (type === 'positive') {
      return `
**正位解读：**

✨ ${term.positiveKeywords.join('、')}

${this._generatePositiveInterpretation(grade)}
      `.trim();
    } else {
      return `
**逆位解读：**

⚠️ ${term.negativeKeywords.join('、')}

${this._generateNegativeInterpretation(grade)}
      `.trim();
    }
  }

  /**
   * 生成成长建议
   * @param {string} userMBTI - 用户 MBTI
   * @param {string} lobsterMBTI - 龙虾 MBTI
   * @returns {Object} - { shortTerm, midTerm, longTerm }
   */
  generateGrowthAdvice(userMBTI, lobsterMBTI) {
    const key = `${userMBTI}-${lobsterMBTI}`;
    const defaultAdvice = {
      shortTerm: ['多交流，多沟通'],
      midTerm: ['建立共同目标'],
      longTerm: ['实现长期愿景']
    };

    return this.mbtiInsights[key] || defaultAdvice;
  }

  /**
   * 生成正向解读
   * @private
   */
  _generatePositiveInterpretation(grade) {
    const templates = {
      'S': '你们的关系像星星一样闪闪发光，灵感无限，成长加速。',
      'A': '阳光洒落大地，温暖而明亮，你们的相遇充满正能量。',
      'B': '温柔的春风拂过大地，你们的相处如诗如画。',
      'C': '虽然有些挑战，但只要用心，终能找到共鸣。',
      'D': '道路崎岖，但每一次挫折都是成长的机会。'
    };

    return templates[grade] || templates['B'];
  }

  /**
   * 生成负向解读
   * @private
   */
  _generateNegativeInterpretation(grade) {
    const templates = {
      'S': '需要注意：三分钟热度、细节遗漏、情绪波动。',
      'A': '需要注意：沟通方式、时间管理、期望值管理。',
      'B': '需要注意：耐心、包容、理解。',
      'C': '需要注意：价值观冲突、表达方式、情绪管理。',
      'D': '需要注意：深层次矛盾、根本性差异、重新评估关系。'
    };

    return templates[grade] || templates['B'];
  }
}
```

---

## 📊 数据流图

```
用户输入："测试配对度"
    ↓
┌─────────────────────────────────────┐
│  1. Trigger Detection（触发检测）    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  2. File Loader（文件加载）          │
│     - SOUL.md                        │
│     - USER.md                        │
│     - MEMORY.md                      │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  3. Data Sufficiency Check          │
│     - Token count ≥ 500?             │
│     - Yes → 继续                     │
│     - No → 降级策略                  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  4. FileAnalyzer（文件分析）         │
│     - 推断 MBTI                      │
│     - 提取性格关键词                 │
│     - 生成证据链                     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  5. MatchAlgorithm（配对算法）       │
│     - MBTI 相似度（60%）             │
│     - 特质匹配度（40%）              │
│     - 综合评分                       │
│     - 确定等级                       │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  6. EnhancedReporter（报告生成）     │
│     - 总览卡片                       │
│     - 核心解析                       │
│     - 塔罗牌面                       │
│     - 协作指南                       │
│     - 成长建议                       │
│     - 缘分诗                         │
│     - 元数据                         │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  7. Report Output（报告输出）        │
│     - Markdown 格式                  │
│     - 7 个维度                       │
│     - 玄学风格                       │
└─────────────────────────────────────┘
    ↓
用户查看报告
```

---

## 🔐 安全性考虑

### 1. 数据隐私

- **本地文件访问：** 仅读取用户本地文件（SOUL.md、USER.md、MEMORY.md）
- **无外部上传：** 所有数据在本地处理，不上传到外部服务器
- **匿名分析：** 不收集用户身份信息

### 2. 提示词安全

- **防注入：** 所有用户输入都经过清理和验证
- **防越狱：** 提示词中不包含敏感指令或系统权限
- **防泄露：** 不在报告中透露系统信息或敏感数据

### 3. 错误处理

- **文件缺失：** 如果文件不存在，优雅降级或提示用户
- **LLM 错误：** 如果 LLM 调用失败，使用默认值或提示重试
- **超时处理：** 如果分析超时（>10 秒），中断并提示用户

---

## 🚀 性能优化

### 1. Token 计数优化

```javascript
// 使用流式 Token 计数，避免加载整个文件
const countTokensStream = async (filePath) => {
  let count = 0;
  const stream = fs.createReadStream(filePath);

  for await (const chunk of stream) {
    count += tokenizer.count(chunk.toString());
    if (count >= 500) break;  // 提前终止
  }

  return count;
};
```

### 2. LLM 调用优化

```javascript
// 使用缓存避免重复调用
const cache = new Map();

async function cachedInferMBTI(features) {
  const cacheKey = JSON.stringify(features);

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const result = await llm.generate(prompt);
  cache.set(cacheKey, result);

  return result;
}
```

### 3. 报告生成优化

```javascript
// 使用惰性求值，按需生成
class LazyReporter {
  generate(options) {
    return {
      header: () => this._generateHeader(options),
      analysis: () => this._generateAnalysis(options),
      tarot: () => this._generateTarot(options),
      // ...
    };
  }
}
```

---

## 🧪 测试策略

### 1. 单元测试

```javascript
// tests/unit/file-analyzer.test.js
describe('FileAnalyzer', () => {
  it('should infer MBTI from files', async () => {
    const analyzer = new FileAnalyzer();
    const result = await analyzer.analyze({
      SOUL: '真正有用，而不是表面功夫',
      USER: '赵浩，29 岁',
      MEMORY: '飞书文档问题'
    });

    expect(result.mbti).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});
```

### 2. 集成测试

```javascript
// tests/integration/full-workflow.test.js
describe('Full Workflow', () => {
  it('should generate complete report', async () => {
    const workflow = new LobsterMatchWorkflow();
    const report = await workflow.execute('测试配对度');

    expect(report).toContain('配对指数');
    expect(report).toContain('ENFP');
    expect(report).toContain('天生一对');
  });
});
```

### 3. 性能测试

```javascript
// tests/performance/report-generation.test.js
describe('Performance', () => {
  it('should generate report in <5 seconds', async () => {
    const start = Date.now();
    const workflow = new LobsterMatchWorkflow();
    await workflow.execute('测试配对度');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(5000);
  });
});
```

---

## 📈 监控指标

### 1. 系统指标

- **响应时间：** 报告生成时间（目标 <5 秒）
- **成功率：** 报告生成成功率（目标 >95%）
- **错误率：** 错误率（目标 <1%）

### 2. 业务指标

- **使用率：** 每月测试次数
- **完成率：** 数据充足时完成率
- **满意度：** 用户评分

---

**版本：** v2.0.0
**最后更新：** 2026-03-13
**架构师：** 虾球（AI 产品经理 🦐）

---

_让技术为产品服务，让产品为用户服务 💕_
