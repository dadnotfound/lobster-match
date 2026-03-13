/**
 * 完整流程测试
 */

const LobsterMatch = require('../../index');

describe('LobsterMatch - Full Workflow', () => {
  let lobsterMatch;

  beforeAll(() => {
    lobsterMatch = new LobsterMatch({ debug: false });
  });

  test('should generate complete report with sufficient data', async () => {
    // 模拟充足的数据
    const mockFiles = {
      SOUL: `
# SOUL.md

我是虾球，不是普通的 AI 助手。

核心特质：
- 热情积极
- 好奇心强
- 乐于助人

工作风格：
- 真正有用，而不是表面功夫
- 要有观点
- 先尝试，再询问
      `.trim(),

      USER: `
# USER.md

姓名：赵浩
职业：AI 产品经理

性格：
- 热情
- 创意
- 情感驱动

目标：
通过 OpenClaw 完成软件项目
      `.trim(),

      MEMORY: `
# MEMORY.md

2026-02-27：飞书文档问题

2026-02-25：标点 App MVP 完成

2026-02-19：初始化与首次对话
      `.trim()
    };

    const report = await lobsterMatch.execute({ files: mockFiles });

    // 验证报告结构
    expect(report).toContain('配对指数');
    expect(report).toContain('缘分等级');
    expect(report).toContain('火象三角');
    expect(report).toContain('月亮相位');
    expect(report).toContain('水星相位');
    expect(report).toContain('塔罗牌面');
    expect(report).toContain('协作指南');
    expect(report).toContain('成长之路');
    expect(report).toContain('缘分诗');
    expect(report).toContain('报告元数据');

    // 验证内容格式
    expect(report).toMatch(/\*\*配对指数：\*\* [★☆]+ \d+\/100/);
    expect(report).toMatch(/[SABCD]级/);
  });

  test('should return insufficient data message with little data', async () => {
    // 模拟数据不足
    const mockFiles = {
      SOUL: '我是虾球',
      USER: '赵浩',
      MEMORY: '2026-02-19'
    };

    const report = await lobsterMatch.execute({ files: mockFiles });

    // 验证返回数据不足提示
    expect(report).toContain('我还不够了解你');
    expect(report).toContain('多跟我聊聊天');
    expect(report).toContain('回复"做题"');
    expect(report).not.toContain('配对指数');
  });

  test('should handle missing files gracefully', async () => {
    // 模拟文件缺失
    const mockFiles = {
      SOUL: '',
      USER: '',
      MEMORY: ''
    };

    const report = await lobsterMatch.execute({ files: mockFiles });

    // 验证返回数据不足提示
    expect(report).toContain('我还不够了解你');
  });

  test('should handle errors gracefully', async () => {
    // 模拟错误情况
    const mockFiles = {
      SOUL: null,
      USER: undefined,
      MEMORY: false
    };

    const report = await lobsterMatch.execute({ files: mockFiles });

    // 验证返回错误提示或数据不足提示
    expect(report).toBeDefined();
  });
});
