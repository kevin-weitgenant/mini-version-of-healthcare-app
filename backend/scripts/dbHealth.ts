import { checkDatabaseHealth } from '../src/config/db.js';

(async () => {
  try {
    console.log('🔍 Checking database connection...');
    
    const result = await checkDatabaseHealth();
    
    if (result.ok) {
      console.log('✅ Database connection OK');
      console.log(`📅 Timestamp: ${result.timestamp}`);
      console.log(`🔗 Response:`, result.result);
      process.exit(0);
    } else {
      console.error('❌ Database connection FAILED');
      console.error(`📅 Timestamp: ${result.timestamp}`);
      console.error(`💥 Error: ${result.error}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Database connection FAILED');
    console.error('💥 Error:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
})();
