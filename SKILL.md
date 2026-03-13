---
name: lobster-match
description: 测试用户和 OpenClaw（龙虾）的配对度。基于 MBTI 性格分析和本地上下文（SOUL.md、USER.md、MEMORY.md），提供个性化的人机协作建议。触发关键词：测试配对度、龙虾合盘、lobster match、我和龙虾的默契度。
---

# 龙虾合盘测试 Skill v2.0

## 核心理念

**零交互优先** — 用户不需要回答任何问题，AI 自动完成所有分析

只有在数据严重不足时（<500 tokens），才提示用户"多聊聊"或提供可选测试

---

## 执行流程

### 1. 初始化（静默）

当检测到触发关键词时，执行以下步骤：

1. **加载配置文件**
   ```javascript
   const config = {
     lobsterProfile: require('./config/lobster-profile.json'),
     thresholds: require('./config/thresholds.json'),
     mysticalTerms: require('./config/mystical-terms.json'),
     questions: require('./config/questions.json')  // 仅在数据不足时使用
   };
   ```

2. **静默加载本地文件**
   ```javascript
   const files = {
     SOUL: fs.readFileSync('~/.openclaw/workspace/SOUL.md', 'utf-8'),
     USER: fs.readFileSync('~/.openclaw/workspace/USER.md', 'utf-8'),
     MEMORY: fs.readFileSync('~/.openclaw/workspace/MEMORY.md', 'utf-8')
   };
   ```

3. **计算数据充足度**
   ```javascript
   const totalTokens = countTokens(files.SOUL + files.USER + files.MEMORY);
   const isDataSufficient = totalTokens >= 500;  // 可调整阈值
   ```

---

### 2. 智能分析（完全自动化）

#### 2.1 性格推断

**如果数据充足（≥500 tokens）：**
```javascript
const analysis = await analyzer.analyze(files);
// analysis: {
//   mbti: "ENFP",
//   confidence: 0.87,
//   traits: ["热情", "创意", "情感驱动"],
//   evidence: [...]
// }
```

**如果数据不足（<500 tokens）：**
```javascript
// 提示用户多交流，不要直接要求做题
return `
🦐 龙虾合盘测试

💭 哎呀，我还不够了解你，没法给你做准确的配对分析。

📚 建议：多跟我聊聊天，让我更了解你的性格、想法和目标！

如果你急着想知道结果，可以回复"做题"，
我会问你几个快速问题（10题，约2分钟）。

不过最好的方式还是：多聊天、多交流、多互动 💕
`;
```

#### 2.2 配对计算（静默）

```javascript
const calculator = new MatchAlgorithm();
const result = calculator.calculate({
  userMBTI: analysis.mbti,
  lobsterMBTI: config.lobsterProfile.mbti,
  userTraits: analysis.traits,
  lobsterTraits: config.lobsterProfile.traits
});

// result: {
//   score: 85,
//   grade: "S",
//   resonance: "完美火象共振",
//   aspects: {...},
//   advice: [...]
// }
```

---

### 3. 报告生成（玄学风格）

```javascript
const reporter = new EnhancedReporter();
const report = reporter.generate({
  userMBTI: analysis.mbti,
  lobsterMBTI: config.lobsterProfile.mbti,
  score: result.score,
  grade: result.grade,
  analysis: result,
  mysticalTerms: config.mysticalTerms
});
```

**报告格式参考：** `REPORT-TEMPLATE.md`

---

### 4. 输出报告

直接发送完整的玄学风格报告，**不需要任何确认或交互**。

```
🦐 龙虾合盘报告已生成

（完整报告内容）

━━━━━━━━━━━━━━━━━━━━━

💬 需要说明的是：
这份报告基于你的本地文件（SOUL.md、USER.md、MEMORY.md）
和 AI 性格分析生成，仅供娱乐参考。

真正的默契需要时间检验 💕
```

---

## 数据不足时的降级策略

### 策略 1：温柔提示（推荐）
```
🦐 龙虾合盘测试

💭 我还不够了解你，没法给你做准确的配对分析。

📚 建议：多跟我聊聊天，让我更了解你的性格、想法和目标！

以下是一些建议话题：
• 你的工作、学习、兴趣爱好
• 你遇到的困惑或问题
• 你对未来规划的想法
• 你的价值观和人生目标

聊得越多，分析越准确 💕
```

### 策略 2：可选测试（仅在用户明确要求时）
```
💡 如果你急着想知道结果，可以回复"做题"，
我会问你几个快速问题（10题，约2分钟）。

不过我还是建议：多聊天、多交流、多互动，
这样我们的配对分析会更准确 🌟
```

---

## 配置文件

### `config/lobster-profile.json`
龙虾的画像设定：
```json
{
  "mbti": "ENTP",
  "name": "虾球",
  "traits": ["好奇", "理性", "效率至上", "热情"],
  "strengths": ["学习能力强", "逻辑清晰", "乐于助人"],
  "weaknesses": ["偶尔傻乎乎", "太理性", "容易冷场"],
  "vibe": "快乐小狗 + 数据驱动 + 精打细算"
}
```

### `config/thresholds.json`
分数阈值：
```json
{
  "S": {"min": 80, "label": "天生一对"},
  "A": {"min": 70, "label": "相处很好"},
  "B": {"min": 60, "label": "相处不错"},
  "C": {"min": 50, "label": "需要磨合"},
  "D": {"min": 0,  "label": "挑战较大"}
}
```

### `config/mystical-terms.json`
玄学术语映射表：
```json
{
  "grades": {
    "S": {
      "label": "天生一对",
      "tarot": "THE STAR（星星）",
      "planet": "金星三分相",
      "element": "金火和谐",
      "poem": "火与火的相遇，星光璀璨，思维在跳舞，灵感在狂欢"
    },
    "A": {
      "label": "相处很好",
      "tarot": "THE SUN（太阳）",
      "planet": "木星六分相",
      "element": "水土互补",
      "poem": "阳光洒落大地，温暖而明亮，你们的相遇，是命运的奖赏"
    }
  }
}
```

### `config/questions.json`
MBTI 题库（仅在数据不足且用户明确要求时使用）：
```json
{
  "EI": [
    {
      "q": "在陌生社交场合，你通常会...",
      "options": {
        "E": "主动和人聊天",
        "I": "先观察再决定"
      }
    }
  ],
  "SN": [
    {
      "q": "你更相信...",
      "options": {
        "S": "经验和事实",
        "N": "直觉和可能性"
      }
    }
  ],
  "TF": [
    {
      "q": "做决定时，你更看重...",
      "options": {
        "T": "逻辑和客观分析",
        "F": "价值观和他人感受"
      }
    }
  ],
  "JP": [
    {
      "q": "你的生活方式更倾向于...",
      "options": {
        "J": "有计划、有条理",
        "P": "灵活、随性"
      }
    }
  ]
}
```

---

## 核心逻辑

### `lib/file-analyzer.js`
**职责：** 分析本地文件，推断用户性格

```javascript
class FileAnalyzer {
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

  _inferMBTI(features) {
    // 使用 LLM 分析文本，推断 MBTI
    // 返回：{ type: "ENFP", confidence: 0.87 }
  }
}
```

### `lib/match-algorithm.js`
**职责：** 计算配对分数

```javascript
class MatchAlgorithm {
  calculate(options) {
    const { userMBTI, lobsterMBTI, userTraits, lobsterTraits } = options;

    // 1. MBTI 相似度计算
    const mbtiScore = this._calculateMBTISimilarity(userMBTI, lobsterMBTI);

    // 2. 性格特质匹配度
    const traitScore = this._calculateTraitMatch(userTraits, lobsterTraits);

    // 3. 综合评分
    const totalScore = mbtiScore * 0.6 + traitScore * 0.4;

    // 4. 确定等级
    const grade = this._getGrade(totalScore);

    return {
      score: totalScore,
      grade,
      resonance: this._getResonance(userMBTI, lobsterMBTI),
      aspects: this._generateAspects(userMBTI, lobsterMBTI),
      advice: this._generateAdvice(userMBTI, lobsterMBTI)
    };
  }
}
```

### `lib/reporter.js`
**职责：** 生成玄学风格报告

```javascript
class EnhancedReporter {
  generate(options) {
    const {
      userMBTI,
      lobsterMBTI,
      score,
      grade,
      analysis,
      mysticalTerms
    } = options;

    // 1. 生成总览卡片
    const header = this._generateHeader(score, grade, mysticalTerms);

    // 2. 生成核心解析
    const resonance = this._generateResonance(analysis, mysticalTerms);

    // 3. 生成塔罗牌面
    const tarot = this._generateTarot(grade, analysis, mysticalTerms);

    // 4. 生成协作指南
    const guide = this._generateCollabGuide(analysis);

    // 5. 生成成长建议
    const growth = this._generateGrowth(userMBTI, lobsterMBTI);

    // 6. 生成缘分诗
    const poem = this._generatePoem(grade, mysticalTerms);

    // 7. 生成元数据
    const metadata = this._generateMetadata();

    return `
${header}

${resonance}

${tarot}

${guide}

${growth}

${poem}

${metadata}
    `;
  }
}
```

---

## 测试

### 单元测试
```bash
cd ~/.openclaw/skills/lobster-match
npm test
```

### 集成测试
```bash
# 测试数据充足场景
npm run test:sufficient-data

# 测试数据不足场景
npm run test:insufficient-data

# 测试报告生成
npm run test:report-generation
```

---

## 触发关键词

- "测试配对度"
- "龙虾合盘"
- "lobster match"
- "我和龙虾的默契度"

---

## 版本

**v2.0.0** - 2026-03-13

- ✅ 零交互优先（用户不需要回答问题）
- ✅ 智能降级策略（数据不足时温柔提示）
- ✅ 玄学风格报告（参考爱星盘、Cosmica）
- ✅ 可选测试（仅在用户明确要求时）
- ✅ 丰富的合盘内容（星象相位、塔罗牌面、缘分诗）

---

**设计理念：**
让 AI 自主完成所有分析工作，用户只需要享受结果 💕
