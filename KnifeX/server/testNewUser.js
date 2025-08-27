// Test script to create a new user and verify starter knives
const testNewUser = async () => {
  const testUser = {
    email: `testuser${Date.now()}@example.com`,
    username: `testuser${Date.now()}`,
    password: 'testpassword123'
  };

  try {
    // Create new user
    console.log('🧪 Creating new test user...');
    const registerResponse = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (!registerResponse.ok) {
      const error = await registerResponse.json();
      throw new Error(`Registration failed: ${error.error}`);
    }

    const userData = await registerResponse.json();
    console.log('✅ User created successfully:', userData.user.username);
    console.log('🔑 Token received:', userData.token.substring(0, 20) + '...');

    // Get user's inventory
    console.log('📦 Fetching user inventory...');
    const inventoryResponse = await fetch('http://localhost:3001/api/inventory', {
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    });

    if (!inventoryResponse.ok) {
      throw new Error('Failed to fetch inventory');
    }

    const inventory = await inventoryResponse.json();
    console.log(`✅ Inventory loaded: ${inventory.length} items`);
    
    if (inventory.length > 0) {
      console.log('🔪 Starter knives received:');
      inventory.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.knife.itemType} | ${item.knife.finishName}`);
        console.log(`     Condition: ${item.condition} | Float: ${item.floatValue?.toFixed(4)} | Price: $${item.price?.toFixed(2)}`);
        console.log(`     Available for trade: ${item.isForTrade ? 'Yes' : 'No'}`);
        console.log('');
      });
    } else {
      console.log('❌ No starter knives found in inventory');
    }

    // Get inventory count
    const countResponse = await fetch('http://localhost:3001/api/inventory/count', {
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    });

    if (countResponse.ok) {
      const countData = await countResponse.json();
      console.log(`📊 Total inventory count: ${countData.count}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testNewUser();
