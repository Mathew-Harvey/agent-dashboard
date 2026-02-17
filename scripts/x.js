#!/usr/bin/env node
const Twit = require('twitter-lite');
require('dotenv').config({ path: '/home/mat/.openclaw/workspace/.env' });

const client = new Twit({
  consumer_key: process.env.X_CONSUMER_KEY,
  consumer_secret: process.env.X_CONSUMER_SECRET,
  access_token_key: process.env.X_ACCESS_TOKEN,
  access_token_secret: process.env.X_ACCESS_TOKEN_SECRET,
});

const command = process.argv[2];
const args = process.argv.slice(3);

async function main() {
  try {
    switch (command) {
      case 'post':
        const text = args.join(' ');
        const tweet = await client.post('statuses/update', { status: text });
        console.log('✅ Tweet posted:', tweet.id_str);
        console.log('   https://x.com/user/status/' + tweet.id_str);
        break;
        
      case 'me':
        const me = await client.get('account/verify_credentials');
        console.log('👤 @' + me.screen_name, '-', me.name);
        console.log('   Followers:', me.followers_count);
        console.log('   Following:', me.friends_count);
        console.log('   Tweets:', me.statuses_count);
        break;
        
      case 'followers':
        const followers = await client.get('followers/list', { count: 10 });
        console.log('👥 Followers:');
        users.forEach(f => console.log('  @' + f.screen_name));
        break;
        
      case 'search':
        const query = args.join(' ');
        const results = await client.get('search/tweets', { q: query, count: 10 });
        console.log('🔍 Search results for:', query);
        results.statuses.forEach(t => console.log('  @' + t.user.screen_name + ': ' + t.text.substring(0, 80)));
        break;
        
      default:
        console.log('Usage:');
        console.log('  x post "Your tweet text"');
        console.log('  x me');
        console.log('  x followers');
        console.log('  x search "query"');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.data) console.error('   Details:', JSON.stringify(err.data));
    process.exit(1);
  }
}

main();
