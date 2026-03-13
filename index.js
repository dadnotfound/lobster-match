/**
 * 龙虾合盘 - 主入口
 *
 * @author 虾球（AI 产品经理 🦐）
 * @version 2.0.0
 */

const fs = require('fs');
const path = require('path');
const FileAnalyzer = require('./lib/file-analyzer');
const MatchAlgorithm = require('./lib/match-algorithm');
const EnhancedReporter = require('./lib/reporter');

class LobsterMatch {
  constructor(options = {}) {
    this.workspace = options.workspace || path.join(process.env.HOME, '.openclaw', 'workspace');
    this.debug = options.debug || false;

    // 加载配置
    this.lobsterProfile = this._loadConfig('config/lobster-profile.json');
    this.mysticalTerms = this._loadConfig('config/mystical-terms.json');
    this.thresholds = {
      'S': { min: 80, label: '天生一对' },
      'A': { min: 70, label: '相处很好' },
      'B': { min: 60, label: '相处不错' },
      'C': { min: 50, label: '需要磨合' },
      'D': { min: 0, label: '挑战较大' }
    };

    // 初始化核心模块
    this.fileAnalyzer = new FileAnalyzer({
      llm: options.llm || null,
      tokenizer: options.tokenizer || null,
      debug: this.debug
    });

    this.matchAlgorithm = new MatchAlgorithm({
      thresholds: this.thresholds,
      debug: this.debug
    });

    this.reporter = new EnhancedReporter({
      mysticalTerms: this.mysticalTerms,
      debug: this.debug
    });
  }

  /**
   * 执行完整的测试流程
   * @param {Object} options - { files, llm }
   * @returns {Promise<string>} - 完整报告
   */
  async execute(options = {}) {
    try {
      // 1. 加载文件
      const files = await this._loadFiles(options.files);

      if (this.debug) {
        console.log('[LobsterMatch] Files loaded:', Object.keys(files));
      }

      // 2. 检查数据充足度
      const totalTokens = this._estimateTotalTokens(files);
      const isDataSufficient = totalTokens >= 500;

      if (!isDataSufficient) {
        return this._generateInsufficientDataMessage(totalTokens);
      }

      // 3. 分析文件
      const analysis = await this.fileAnalyzer.analyze(files);

      if (this.debug) {
        console.log('[LobsterMatch] Analysis completed:', analysis);
      }

      // 4. 计算配对
      const matchResult = this.matchAlgorithm.calculate({
        userMBTI: analysis.mbti,
        lobsterMBTI: this.lobsterProfile.mbti,
        userTraits: analysis.traits,
        lobsterTraits: this.lobsterProfile.traits
      });

      if (this.debug) {
        console.log('[LobsterMatch] Match completed:', matchResult);
      }

      // 5. 生成报告
      const report = this.reporter.generate({
        userMBTI: analysis.mbti,
        lobsterMBTI: this.lobsterProfile.mbti,
        score: matchResult.score,
        grade: matchResult.grade,
        analysis: {
          ...analysis,
          ...matchResult
        }
      });

      return report;
    } catch (error) {
      console.error('[LobsterMatch] Error:', error);
      return this._generateErrorMessage(error);
    }
  }

  /**
   * 加载本地文件
   * @private
   */
  async _loadFiles(customFiles = {}) {
    const defaultFiles = {
      SOUL: '',
      USER: '',
      MEMORY: ''
    };

    // 如果提供了自定义文件，使用自定义文件
    if (Object.keys(customFiles).length > 0) {
      return { ...defaultFiles, ...customFiles };
    }

    // 否则从默认路径加载
    const filePaths = {
      SOUL: path.join(this.workspace, 'SOUL.md'),
      USER: path.join(this.workspace, 'USER.md'),
      MEMORY: path.join(this.workspace, 'MEMORY.md')
    };

    const files = { ...defaultFiles };

    for (const [key, filePath] of Object.entries(filePaths)) {
      try {
        if (fs.existsSync(filePath)) {
          files[key] = fs.readFileSync(filePath, 'utf-8');
        }
      } catch (error) {
        console.warn(`[LobsterMatch] Failed to load ${key}:`, error.message);
      }
    }

    return files;
  }

  /**
   * 估算总 Token 数量
   * @private
   */
  _estimateTotalTokens(files) {
    const allText = Object.values(files).join('\n');

    // 粗略估算：1 token ≈ 4 字符（英文）或 2 字符（中文）
    const chineseChars = (allText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = allText.length - chineseChars;

    return Math.ceil(chineseChars / 2 + otherChars / 4);
  }

  /**
   * 生成数据不足提示
   * @private
   */
  _generateInsufficientDataMessage(totalTokens) {
    return `
🦐 龙虾合盘测试

💭 我还不够了解你，没法给你做准确的配对分析。

**当前数据量：** 约 ${totalTokens} tokens
**建议数据量：** ≥ 500 tokens

📚 **建议：多跟我聊聊天，让我更了解你的性格、想法和目标！

以下是一些建议话题：
• 你的工作、学习、兴趣爱好
• 你遇到的困惑或问题
• 你对未来规划的想法
• 你的价值观和人生目标

**💡 如果你急着想知道结果，可以回复"做题"，**
**我会问你几个快速问题（10题，约2分钟）。**

不过我还是建议：多聊天、多交流、多互动，
这样我们的配对分析会更准确 🌟
    `.trim();
  }

  /**
   * 生成错误信息
   * @private
   */
  _generateErrorMessage(error) {
    return `
⚠️ 测试失败

抱歉，生成报告时遇到了问题：${error.message}

请尝试重新测试，或联系技术支持。

—— 虾球 AI 占星师 敬上
    `.trim();
  }

  /**
   * 加载配置文件
   * @private
   */
  _loadConfig(relativePath) {
    try {
      const fullPath = path.join(__dirname, relativePath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn(`[LobsterMatch] Failed to load config ${relativePath}:`, error.message);
      return {};
    }
  }
}

// 导出
module.exports = LobsterMatch;

// 如果直接运行此文件
if (require.main === module) {
  const lobsterMatch = new LobsterMatch({ debug: true });

  lobsterMatch.execute()
    .then(report => {
      console.log(report);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
