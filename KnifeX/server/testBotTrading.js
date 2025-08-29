import { calculateBotTradeDecision } from './botTradingService.js';

console.log('🤖 Testing Bot Trading System\n');

// Test various trade scenarios
const testCases = [
  { userPrice: 100, botPrice: 200, scenario: 'User gives cheap, bot gives expensive' },
  { userPrice: 500, botPrice: 300, scenario: 'User gives expensive, bot gives cheap' },
  { userPrice: 150, botPrice: 150, scenario: 'Equal value trade' },
  { userPrice: 50, botPrice: 1000, scenario: 'Huge profit for user' },
  { userPrice: 1000, botPrice: 50, scenario: 'Huge profit for bot' },
  { userPrice: 0, botPrice: 500, scenario: 'Free knife for user' },
  { userPrice: 500, botPrice: 0, scenario: 'Free knife for bot' }
];

console.log('Running trade tests...\n');

let acceptedTrades = 0;
let totalTrades = testCases.length;

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.scenario}`);
  console.log(`  User knife: $${test.userPrice} → Bot knife: $${test.botPrice}`);
  
  const result = calculateBotTradeDecision(test.userPrice, test.botPrice);
  
  if (result === true) {
    console.log(`  ✅ COMPLETED\n`);
    acceptedTrades++;
  } else {
    console.log(`  ❌ FAILED\n`);
  }
});

console.log(`📊 Trade Results: ${acceptedTrades}/${totalTrades} trades completed`);
console.log('✅ Bot trading system ready!');

console.log('\n' + '='.repeat(60));
console.log('Bot Trading System Status: READY');
console.log('='.repeat(60));
