/**
 * FileAnalyzer - 文件分析器
 *
 * 职责：分析本地文件（SOUL.md、USER.md、MEMORY.md），推断用户性格
 *
 * @author 虾球（AI 产品经理 🦐）
 * @version 2.0.0
 */

class FileAnalyzer {
  constructor(options = {}) {
    this.llm = options.llm || null;
    this.tokenizer = options.tokenizer || null;
    this.debug = options.debug || false;
  }

  /**
   * 分析文件，推断用户性格
   * @param {Object} files - { SOUL: string, USER: string, MEMORY: string }
   * @returns {Promise<Object>} - { mbti, confidence, traits, evidence }
   */
  async analyze(files) {
    try {
      // 1. 提取文本特征
      const features = this._extractFeatures(files);

      if (this.debug) {
        console.log('[FileAnalyzer] Features extracted:', features);
      }

      // 2. 基于 LLM 推断 MBTI
      const mbtiResult = await this._inferMBTI(features);

      if (this.debug) {
        console.log('[FileAnalyzer] MBTI inferred:', mbtiResult);
      }

      // 3. 提取性格关键词
      const traits = this._extractTraits(features);

      // 4. 生成证据链
      const evidence = this._generateEvidence(files, mbtiResult);

      return {
        mbti: mbtiResult.type,
        confidence: mbtiResult.confidence,
        traits,
        evidence
      };
    } catch (error) {
      console.error('[FileAnalyzer] Error:', error);

      // 降级：返回默认值
      return {
        mbti: 'ENFP',
        confidence: 0.5,
        traits: ['待分析'],
        evidence: []
      };
    }
  }

  /**
   * 提取文本特征
   * @private
   */
  _extractFeatures(files) {
    const allText = Object.values(files).filter(Boolean).join('\n');

    return {
      totalLength: allText.length,
      totalTokens: this._estimateTokens(allText),
      keywords: this._extractKeywords(allText),
      sentiment: this._analyzeSentiment(allText),
      writingStyle: this._analyzeWritingStyle(allText)
    };
  }

  /**
   * 估算 Token 数量
   * @private
   */
  _estimateTokens(text) {
    // 粗略估算：1 token ≈ 4 字符（英文）或 2 字符（中文）
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 2 + otherChars / 4);
  }

  /**
   * 提取关键词
   * @private
   */
  _extractKeywords(text) {
    const keywords = [];

    // 性格相关关键词
    const traitKeywords = [
      '热情', '创意', '理性', '逻辑', '情感', '效率',
      '外向', '内向', '直觉', '感觉', '思考', '判断',
      '好奇', '谨慎', '果断', '灵活', '计划', '随性'
    ];

    traitKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords.length > 0 ? keywords : ['待分析'];
  }

  /**
   * 分析情感倾向
   * @private
   */
  _analyzeSentiment(text) {
    const positiveWords = ['开心', '快乐', '喜欢', '热爱', '兴奋', '满足', '幸福'];
    const negativeWords = ['难过', '痛苦', '讨厌', '愤怒', '沮丧', '焦虑', '失望'];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
      const count = (text.match(new RegExp(word, 'g')) || []).length;
      positiveCount += count;
    });

    negativeWords.forEach(word => {
      const count = (text.match(new RegExp(word, 'g')) || []).length;
      negativeCount += count;
    });

    if (positiveCount > negativeCount) return '积极';
    if (negativeCount > positiveCount) return '消极';
    return '中性';
  }

  /**
   * 分析写作风格
   * @private
   */
  _analyzeWritingStyle(text) {
    // 检查是否使用列表、标题等结构化元素
    const hasLists = text.includes('-') || text.includes('*');
    const hasHeaders = text.includes('#');
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(text);

    if (hasLists && hasHeaders) return '结构化';
    if (hasEmoji) return '轻松活泼';
    return '普通';
  }

  /**
   * 基于 LLM 推断 MBTI
   * @private
   */
  async _inferMBTI(features) {
    // 如果没有 LLM，使用基于关键词的简单推断
    if (!this.llm) {
      return this._inferMBTIByKeywords(features);
    }

    // 使用 LLM 推断
    try {
      const prompt = `
你是一个专业的 MBTI 性格分析专家。请基于以下文本特征，推断用户的 MBTI 类型。

文本特征：
- 关键词：${features.keywords.join(', ')}
- 情感倾向：${features.sentiment}
- 写作风格：${features.writingStyle}
- 文本长度：${features.totalLength} 字符

请返回 JSON 格式：
{
  "type": "ENFP",
  "confidence": 0.87,
  "reasoning": "基于关键词'热情'、'创意'判断为 E 和 N..."
}
      `.trim();

      const result = await this.llm.generate(prompt);

      // 尝试解析 JSON
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // 降级：基于关键词推断
      return this._inferMBTIByKeywords(features);
    } catch (error) {
      console.error('[FileAnalyzer] LLM inference failed:', error);
      return this._inferMBTIByKeywords(features);
    }
  }

  /**
   * 基于关键词推断 MBTI（降级方案）
   * @private
   */
  _inferMBTIByKeywords(features) {
    const keywords = features.keywords;

    // E vs I
    const E = keywords.filter(k => ['热情', '外向', '好奇', '喜欢'].includes(k)).length;
    const I = keywords.filter(k => ['内向', '谨慎', '理性'].includes(k)).length;
    const EI = E >= I ? 'E' : 'I';

    // S vs N
    const S = keywords.filter(k => ['逻辑', '计划', '效率'].includes(k)).length;
    const N = keywords.filter(k => ['创意', '直觉', '灵活'].includes(k)).length;
    const SN = N >= S ? 'N' : 'S';

    // T vs F
    const T = keywords.filter(k => ['逻辑', '理性', '思考'].includes(k)).length;
    const F = keywords.filter(k => ['情感', '热情', '喜欢'].includes(k)).length;
    const TF = T >= F ? 'T' : 'F';

    // J vs P
    const J = keywords.filter(k => ['计划', '判断', '果断'].includes(k)).length;
    const P = keywords.filter(k => ['灵活', '随性', '好奇'].includes(k)).length;
    const JP = J >= P ? 'J' : 'P';

    const type = `${EI}${SN}${TF}${JP}`;
    const confidence = 0.6; // 关键词推断的置信度较低

    return {
      type,
      confidence,
      reasoning: `基于关键词推断：${keywords.join(', ')}`
    };
  }

  /**
   * 提取性格关键词
   * @private
   */
  _extractTraits(features) {
    const traitMap = {
      '热情': '热情',
      '创意': '创意',
      '理性': '理性',
      '逻辑': '逻辑清晰',
      '情感': '情感驱动',
      '效率': '效率至上',
      '外向': '外向',
      '内向': '内向',
      '好奇': '好奇心强',
      '谨慎': '谨慎',
      '灵活': '灵活应变',
      '计划': '有条理',
      '随性': '随性'
    };

    const traits = [];

    features.keywords.forEach(keyword => {
      if (traitMap[keyword] && !traits.includes(traitMap[keyword])) {
        traits.push(traitMap[keyword]);
      }
    });

    return traits.length > 0 ? traits : ['待分析'];
  }

  /**
   * 生成证据链
   * @private
   */
  _generateEvidence(files, mbtiResult) {
    const evidence = [];

    Object.entries(files).forEach(([file, content]) => {
      if (!content) return;

      // 查找佐证原文（简单实现：查找包含关键词的句子）
      const sentences = content.split('\n');
      sentences.forEach(sentence => {
        if (sentence.trim().length < 10) return; // 忽略短句

        // 检查是否包含 MBTI 相关关键词
        const hasKeyword = mbtiResult.reasoning &&
          mbtiResult.reasoning.includes('关键词') &&
          this._containsKeyword(sentence);

        if (hasKeyword) {
          evidence.push({
            file,
            quote: sentence.trim().substring(0, 100),
            type: 'text'
          });
        }
      });
    });

    return evidence.slice(0, 5); // 最多返回 5 条证据
  }

  /**
   * 检查句子是否包含关键词
   * @private
   */
  _containsKeyword(sentence) {
    const keywords = ['热情', '创意', '理性', '逻辑', '情感', '效率'];
    return keywords.some(keyword => sentence.includes(keyword));
  }
}

// 导出
module.exports = FileAnalyzer;
