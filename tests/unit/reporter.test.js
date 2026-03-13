/**
 * Reporter Unit Tests
 */

const Reporter = require('../../lib/reporter');
const fs = require('fs');
const path = require('path');

describe('Reporter', () => {
  let reporter;
  let profile;
  let thresholds;

  beforeEach(() => {
    reporter = new Reporter();
    
    // Load config files
    profile = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../config/lobster-profile.json'))
    );
    thresholds = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../../config/thresholds.json'))
    );
  });

  test('should generate report with all sections', () => {
    const report = reporter.generate({
      userMBTI: 'ENFP',
      lobsterMBTI: 'ENTP',
      score: 85,
      profile,
      thresholds
    });

    expect(report).toContain('🦐');
    expect(report).toContain('配对度');
    expect(report).toContain('85/100');
    expect(report).toContain('ENFP');
    expect(report).toContain('ENTP');
  });

  test('should show high score grade for 85', () => {
    const report = reporter.generate({
      userMBTI: 'ENFP',
      lobsterMBTI: 'ENTP',
      score: 85,
      profile,
      thresholds
    });

    expect(report).toContain('🎉'); // S grade emoji
    expect(report).toContain('天生一对'); // S grade label
  });

  test('should show medium score grade for 65', () => {
    const report = reporter.generate({
      userMBTI: 'ISFJ',
      lobsterMBTI: 'ENTP',
      score: 65,
      profile,
      thresholds
    });

    expect(report).toContain('😊'); // B grade emoji
    expect(report).toContain('相处不错'); // B grade label
  });

  test('should include dimension comparison', () => {
    const report = reporter.generate({
      userMBTI: 'ENFP',
      lobsterMBTI: 'ENTP',
      score: 85,
      profile,
      thresholds
    });

    expect(report).toContain('性格对比');
  });

  test('should include advice', () => {
    const report = reporter.generate({
      userMBTI: 'ENFP',
      lobsterMBTI: 'ENTP',
      score: 85,
      profile,
      thresholds
    });

    expect(report).toContain('相处建议');
    expect(report).toContain('优化建议');
  });
});
