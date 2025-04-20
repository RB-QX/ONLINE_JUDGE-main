// backend/scripts/seedCFDetailed.js

require('dotenv').config();
const mongoose  = require('mongoose');
const puppeteer = require('puppeteer-extra');
const Stealth   = require('puppeteer-extra-plugin-stealth');
const cheerio   = require('cheerio');
const Problem   = require('../model/Problem');

puppeteer.use(Stealth());

const CF_API   = 'https://codeforces.com/api/problemset.problems';
const BASE_URL = 'https://codeforces.com/problemset/problem';

async function scrapeDetails(page, contestId, index) {
  const url = `${BASE_URL}/${contestId}/${index}`;
  await page.goto(url, { waitUntil: 'networkidle0' });

  const html = await page.content();
  const $ = cheerio.load(html);
  const stmt = $('.problem-statement');

  // Title + problem paragraphs
  const descLines = [];
  stmt.find('.header .title').each((i, el) => {
    descLines.push($(el).text().trim());
  });
  stmt.find('> p').each((i, el) => {
    descLines.push($(el).text().trim());
  });
  const description = descLines.join('\n\n') || 'No description.';

  // Time & memory limits
  const timeLimit   = stmt.find('.time-limit').text().replace('time limit per test','TL').trim();
  const memoryLimit = stmt.find('.memory-limit').text().replace('memory limit per test','ML').trim();
  const constraints  = [timeLimit, memoryLimit].filter(Boolean).join(' · ') || 'None';

  // Examples
  const inputExample  = stmt.find('.input pre').first().text().trim()  || 'N/A';
  const outputExample = stmt.find('.output pre').first().text().trim() || 'N/A';

  // Test cases
  const testCases = [];
  const inputs  = stmt.find('.example-test .input pre').toArray();
  const outputs = stmt.find('.example-test .output pre').toArray();
  inputs.forEach((ipEl, idx) => {
    testCases.push({
      input:  $(ipEl).text().trim(),
      output: outputs[idx] ? $(outputs[idx]).text().trim() : ''
    });
  });

  return { description, constraints, inputExample, outputExample, testCases };
}

async function seed() {
  // 1) Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('🟢 MongoDB connected');

  // 2) Fetch CF metadata
  const resJson = await (await fetch(CF_API)).json();
  const meta = resJson.result.problems.slice(0, 100);
  console.log(`🔄 Fetched ${meta.length} metadata entries`);

  // 3) Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page    = await browser.newPage();

  const allProblems = [];
  for (const p of meta) {
    const difficulty =
      p.rating < 1200 ? 'Easy' :
      p.rating < 1800 ? 'Medium' : 'Hard';

    let details = {};
    try {
      details = await scrapeDetails(page, p.contestId, p.index);
      console.log(`   ✅ Scraped ${p.contestId}${p.index}`);
    } catch (e) {
      console.warn(`   ⚠️ Failed ${p.contestId}${p.index}: ${e.message}`);
    }

    allProblems.push({
      contestId:     p.contestId,
      index:         p.index,
      title:         p.name,
      difficulty,
      topics:        p.tags,
      ...details
    });
  }

  await browser.close();

  // 4) Persist to MongoDB
  await Problem.deleteMany({});
  await Problem.insertMany(allProblems);
  console.log('✅ Seeded 100 problems with full details');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
