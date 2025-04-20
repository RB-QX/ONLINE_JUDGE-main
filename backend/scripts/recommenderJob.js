const cron = require('node-cron');
const { DBConnection } = require('../database/db');
const User = require('../model/User');
const recommendationService = require('../services/recommendationService');

async function startCron() {
  // 1. Connect to MongoDB
  await DBConnection();
  console.log('🕒 Recommendation cron job initialized');

  // 2. Schedule: every day at 03:00 AM Asia/Kolkata
  cron.schedule('0 3 * * *', async () => {
    console.log(`🔄 Recommendation job started at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

    try {
      // 3. Find all users whose recommendations are marked stale
      const usersToRecalc = await User.find({ 'flags.recsStale': true }).lean();

      if (usersToRecalc.length === 0) {
        console.log('ℹ️ No users require recommendation refresh');
        return;
      }

      // 4. Refresh recommendations for each user
      for (const u of usersToRecalc) {
        // Note: fetch full user document so service has all fields
        const user = await User.findById(u._id);
        await recommendationService.generateForUser(user);

        // 5. Clear the stale flag
        user.flags.recsStale = false;
        await user.save();

        console.log(`✅ Refreshed recommendations for user "${user.username}" (${user._id})`);
      }

      console.log('🔄 Recommendation job completed successfully');
    } catch (err) {
      console.error('❌ Error during recommendation job:', err);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
  });
}

// Initialize on script load
startCron().catch(err => {
  console.error('❌ Failed to start recommendation cron:', err);
  process.exit(1);
});
