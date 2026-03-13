---
name: lobster-match
description: 测试用户和 OpenClaw（龙虾）的配对度。基于 MBTI 性格分析和本地上下文（SOUL.md、USER.md、MEMORY.md），提供个性化的人机协作建议。触发关键词：测试配对度、龙虾合盘、lobster match、我和龙虾的默契度。
---

# 龙虾合盘测试 Skill

## 执行流程

### 1. 初始化

当检测到触发关键词时，执行以下步骤：

1. **加载配置文件**
   - 读取 `config/lobster-profile.json` - 龙虾画像
   - 读取 `config/questions.json` - MBTI 题库
   - 读取 `config/thresholds.json` - 分数阈值

2. **检查本地文件**
   - 尝试读取 `~/.openclaw/workspace/SOUL.md`
   - 尝试读取 `~/.openclaw/workspace/USER.md`
   - 尝试读取 `~/.openclaw/workspace/MEMORY.md`

3. **确定测试模式**
   - 如果有本地文件：混合模式（本地分析 + 问答验证）
   - 如果无本地文件：纯问答模式

4. **确认开始**
   ```
   🦐 好的！让我来测试你和龙虾的默契度 🦐

   我会先分析你的本地文件（SOUL.md、USER.md、MEMORY.md），
   然后问几个问题验证我的分析。

   准备好了吗？回复"开始"我们就开始！
   ```

---

### 2. 分析阶段

#### 2.1 本地文件分析（如果有）

1. **加载 FileAnalyzer**
   - 使用 `lib/file-analyzer.js`
   - 分析本地文件内容

2. **推断性格**
   - 基于 LLM 或关键词匹配
   - 得到初步的 MBTI 类型

3. **输出分析结果**
   ```
   📊 正在分析你的本地文件...

   已读取：
   - SOUL.md（AI 助手的灵魂）
   - USER.md（用户信息）
   - MEMORY.md（长期记忆）

   基于我的分析，我推断你的性格可能是 **ENFP（竞选者型）**。
   ```

#### 2.2 问答验证

1. **加载问题**
   - 从 `config/questions.json` 加载问题
   - 选择 3-5 个关键问题

2. **逐一提问**
   ```
   让我问几个问题验证一下：

   Q1: 在陌生社交场合，你通常会...
   A. 主动和人聊天
   B. 先观察再决定

   请回复 A 或 B
   ```

3. **记录答案**
   - 等待用户回复（A 或 B）
   - 记录到答案列表

4. **重复直到完成**
   - 继续提问直到所有问题完成

---

### 3. 配对计算

1. **计算用户 MBTI**
   - 使用 `lib/mbti-calculator.js`
   - 基于问答答案计算 MBTI

2. **加载龙虾画像**
   - 从 `config/lobster-profile.json` 加载
   - 龙虾 MBTI: ENTP

3. **计算配对分数**
   - 使用 `lib/match-algorithm.js`
   - 计算配对分数（0-100）

4. **输出计算结果**
   ```
   🎉 测试完成！

   基于你的回答，我确认你的性格是 **ENFP（竞选者型）**。

   现在让我计算你和龙虾的配对度...
   ```

---

### 4. 结果输出

1. **生成报告**
   - 使用 `lib/reporter.js`
   - 生成完整的配对报告

2. **格式化输出**
   ```
   ━━━━━━━━━━━━━━━━━━━━━

   🦐 龙虾合盘测试报告

   ━━━━━━━━━━━━━━━━━━━━━

   📊 配对度：85/100

   💕 你的性格：ENFP
   🤖 龙虾性格：ENTP

   ━━━━━━━━━━━━━━━━━━━━━

   [详细报告内容...]

   ━━━━━━━━━━━━━━━━━━━━━
   ```

3. **保存选项**
   ```
   💬 想要保存这份报告吗？回复"保存"即可。
   ```

---

## 配置文件

### `config/lobster-profile.json`
龙虾的画像设定：
- MBTI: ENTP
- 性格特点
- 优势和短板

### `config/questions.json`
MBTI 题库：
- 4 个核心问题（EI, SN, TF, JP）
- 每题 2 个选项

### `config/thresholds.json`
分数阈值：
- S: 80-100（天生一对）
- A: 70-79（相处很好）
- B: 60-69（相处不错）
- C: 50-59（需要磨合）
- D: 0-49（挑战较大）

---

## 核心逻辑

### `lib/file-analyzer.js`
**职责：** 分析本地文件，推断用户性格

**使用方法：**
```javascript
const FileAnalyzer = require('./lib/file-analyzer');
const analyzer = new FileAnalyzer();

const files = {
  SOUL: soulContent,
  USER: userContent,
  MEMORY: memoryContent
};

const result = await analyzer.analyze(files);
// result: { type: "ENFP", confidence: {...}, ... }
```

---

### `lib/mbti-calculator.js`
**职责：** 计算用户的 MBTI 类型

**使用方法：**
```javascript
const MBTICalculator = require('./lib/mbti-calculator');
const calculator = new MBTICalculator();

const answers = {
  EI: ['E', 'E'],
  SN: ['N', 'N', 'N'],
  TF: ['F', 'F', 'F'],
  JP: ['P', 'P']
};

const mbti = calculator.calculate(answers);
// mbti: "ENFP"
```

---

### `lib/match-algorithm.js`
**职责：** 计算配对分数

**使用方法：**
```javascript
const MatchAlgorithm = require('./lib/match-algorithm');
const algorithm = new MatchAlgorithm();

const score = algorithm.calculate('ENFP', 'ENTP');
// score: 85
```

---

### `lib/reporter.js`
**职责：** 生成配对报告

**使用方法：**
```javascript
const Reporter = require('./lib/reporter');
const reporter = new Reporter();

const report = reporter.generate({
  userMBTI: 'ENFP',
  lobsterMBTI: 'ENTP',
  score: 85,
  profile: lobsterProfile,
  thresholds: thresholds
});
// report: formatted string
```

---

## 测试

### 单元测试
- `tests/unit/mbti-calculator.test.js` - MBTI 计算器测试
- `tests/unit/match-algorithm.test.js` - 配对算法测试
- `tests/unit/reporter.test.js` - 报告生成器测试

### 集成测试
- `tests/integration/full-workflow.test.js` - 完整流程测试

**运行测试：**
```bash
cd ~/.openclaw/skills/lobster-match
npm test
```

---

## 参考文档

- [docs/MBTI.md](docs/MBTI.md) - MBTI 理论参考
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - 架构说明

---

## 触发关键词

- "测试配对度"
- "龙虾合盘"
- "lobster match"
- "我和龙虾的默契度"

---

## 版本

**v1.0.0** - 2026-03-12

- 初始版本发布
- MBTI 配对测试
- 本地文件分析
- 问答验证
- 报告生成
