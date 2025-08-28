import { calculateBotTradeDecision } from './botTradingService.js';

console.log('🤖 Testing Bot Trading Auto-Accept Functionality\n');

// Test various trade scenarios to ensure bot always accepts
const testCases = [
  { userPrice: 100, botPrice: 200, scenario: 'User gives cheap, bot gives expensive' },
  { userPrice: 500, botPrice: 300, scenario: 'User gives expensive, bot gives cheap' },
  { userPrice: 150, botPrice: 150, scenario: 'Equal value trade' },
  { userPrice: 50, botPrice: 1000, scenario: 'Huge profit for user' },
  { userPrice: 1000, botPrice: 50, scenario: 'Huge profit for bot' },
  { userPrice: 0, botPrice: 500, scenario: 'Free knife for user' },
  { userPrice: 500, botPrice: 0, scenario: 'Free knife for bot' }
];

console.log('Running automated trade acceptance tests...\n');

let allPassed = true;

testCases.forEach((test, index) => {
  console.log(`Test ${index + 1}: ${test.scenario}`);
  console.log(`  User knife: $${test.userPrice} → Bot knife: $${test.botPrice}`);
  
  const result = calculateBotTradeDecision(test.userPrice, test.botPrice);
  
  if (result === true) {
    console.log(`  ✅ PASSED - Bot accepted the trade\n`);
  } else {
    console.log(`  ❌ FAILED - Bot rejected the trade\n`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('🎉 ALL TESTS PASSED! Bot is now in automatic acceptance mode.');
  console.log('🔄 The bot will accept ANY trade offer automatically.');
} else {
  console.log('⚠️  Some tests failed. Bot may not be in full automatic mode.');
}

console.log('\n' + '='.repeat(60));
console.log('Bot Trading System Status: AUTOMATIC MODE ACTIVE');
console.log('='.repeat(60));
