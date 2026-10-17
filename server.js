require('dotenv').config();

const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB_NAME || 'tracknext';
const MONGODB_REQUIRED = process.env.MONGODB_REQUIRED === 'true';

const opportunities = [
  {
    id: 1,
    title: 'Frontend Developer Internship',
    category: 'Internship',
    organizer: 'DVEIN Innovations',
    date: '2026-10-10',
    location: 'Chennai',
    price: '₹5,000/month',
    format: 'Offline',
    description: 'Work with a product engineering team building modern customer-facing interfaces, prototypes, and front-end components for real business use cases.',
    eligibility: 'Students in B.E./B.Tech, design & coding skills, portfolio or mini-project required.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '⌂',
    highlight: 'Featured'
  },
  {
    id: 2,
    title: 'AI Product Hackathon',
    category: 'Hackathon',
    organizer: 'Build for Bharat',
    date: '2026-10-14',
    location: 'Remote',
    price: '₹25,000 prize pool',
    format: 'Online',
    description: 'Develop an AI or no-code solution for a civic or student-focused challenge and present your idea to mentors and industry judges.',
    eligibility: 'Any college student; team of 2-4 members preferred.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '✦',
    highlight: 'Trending'
  },
  {
    id: 3,
    title: 'GenAI to Agentic AI Workshop',
    category: 'Workshop',
    organizer: 'Microsoft Office Chennai AI Community',
    date: '2026-10-12',
    location: 'Online',
    price: 'Free',
    format: 'Online',
    description: 'Explore prompt engineering, AI agent design, and workflow automation through real demos and practical hands-on learning.',
    eligibility: 'Open to all students interested in AI and automation.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '✎',
    highlight: 'Popular'
  },
  {
    id: 4,
    title: 'Build for Bharat Tech Event',
    category: 'Technical Event',
    organizer: 'TechConnect Hub',
    date: '2026-10-20',
    location: 'Hyderabad',
    price: '₹3,000 entry pass',
    format: 'Offline',
    description: 'A one-day technology showcase featuring expert talks, product demos, and networking with founders, engineers, and student innovators.',
    eligibility: 'Students and early-stage builders encouraged to participate.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '◈',
    highlight: 'Featured'
  },
  {
    id: 5,
    title: 'Cyber Security Quiz & Debug',
    category: 'Competition',
    organizer: 'CipherSpark Labs',
    date: '2026-10-18',
    location: 'Bengaluru',
    price: 'Free',
    format: 'Offline',
    description: 'Test your cybersecurity fundamentals, debugging ability, and problem-solving mindset in a competitive lab-based format.',
    eligibility: 'Open to computer science and cyber-focused students.',
    applicationLabel: 'Sample registration',
    applicationUrl: '#sample-registration',
    illustration: '◍',
    highlight: 'Challenge'
  },
  {
    id: 6,
    title: 'Machine Learning Foundation Course',
    category: 'Course',
    organizer: 'SkillForge Academy',
    date: '2026-10-28',
    location: 'Online',
    price: '₹4,499',
    format: 'Online',
    description: 'A structured learning path covering Python, model training, evaluation, and practical ML use cases for career readiness.',
    eligibility: 'Students with basic programming experience preferred.',
    applicationLabel: 'Sample enrollment',
    applicationUrl: '#sample-enrollment',
    illustration: '◐',
    highlight: 'New'
  },
  {
    id: 7,
    title: 'Software Engineer Campus Job',
    category: 'Job',
    organizer: 'NexaStack',
    date: '2026-10-25',
    location: 'Bengaluru',
    price: '₹18,000/month',
    format: 'Offline',
    description: 'Join an engineering team focused on web products, cloud services, and digital experience improvements for campus hires.',
    eligibility: 'Final-year students with strong DSA, JavaScript, and communication skills.',
    applicationLabel: 'Sample application',
    applicationUrl: '#sample-application',
    illustration: '◫',
    highlight: 'Role'
  },
  {
    id: 8,
    title: 'Merit Scholarship for STEM Students',
    category: 'Scholarship',
    organizer: 'STEM Future Foundation',
    date: '2026-10-30',
    location: 'Remote',
    price: '₹50,000 grant',
    format: 'Online',
    description: 'A merit-based funding opportunity for students pursuing STEM fields with strong academic achievement and leadership potential.',
    eligibility: 'Students from recognized colleges with a strong academic profile.',
    applicationLabel: 'Sample form',
    applicationUrl: '#sample-form',
    illustration: '★',
    highlight: 'Award'
  }
];

let mongoClient = null;
let mongoDb = null;
let mongoConnected = false;

async function connectToMongo() {
  if (!MONGODB_URI) {
    if (MONGODB_REQUIRED) {
      throw new Error('MONGODB_URI is required when MONGODB_REQUIRED=true.');
    }

    console.log('MongoDB not configured. Using sample in-memory data.');
    return false;
  }

  try {
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    mongoDb = mongoClient.db(DB_NAME);
    await mongoDb.command({ ping: 1 });

    const collection = mongoDb.collection('opportunities');
    await collection.createIndex({ id: 1 }, { unique: true });

    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(opportunities);
    }

    console.log(`MongoDB connected successfully to database: ${DB_NAME}`);
    mongoConnected = true;
    return true;
  } catch (error) {
    console.warn(
      MONGODB_REQUIRED
        ? 'MongoDB connection failed; refusing to start.'
        : 'MongoDB connection failed. Falling back to sample data.',
      error.message
    );
    await mongoClient?.close().catch(() => {});
    mongoClient = null;
    mongoDb = null;
    mongoConnected = false;
    if (MONGODB_REQUIRED) {
      throw error;
    }
    return false;
  }
}

function sanitizeOpportunity(item) {
  if (!item) return null;
  const { _id, ...rest } = item;
  return rest;
}

async function getOpportunityRecords() {
  if (mongoDb) {
    const docs = await mongoDb.collection('opportunities').find({}).sort({ id: 1 }).toArray();
    return docs.map(sanitizeOpportunity);
  }

  return opportunities;
}

async function getOpportunityById(id) {
  if (mongoDb) {
    const doc = await mongoDb.collection('opportunities').findOne({ id: Number(id) });
    return sanitizeOpportunity(doc);
  }

  const opportunity = opportunities.find((item) => item.id === Number(id));
  return opportunity || null;
}

app.use(express.json());

app.get('/api/health', async (req, res) => {
  let databaseConnected = mongoConnected;

  if (databaseConnected && mongoDb) {
    try {
      await mongoDb.command({ ping: 1 });
    } catch (error) {
      console.error('MongoDB health check failed:', error.message);
      databaseConnected = false;
    }
  }

  const healthy = !MONGODB_REQUIRED || databaseConnected;
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'unhealthy',
    database: databaseConnected ? 'mongodb' : 'sample-data',
    mongoConnected: databaseConnected
  });
});

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

app.get('/api/opportunities', async (req, res) => {
  const docs = await getOpportunityRecords();
  res.json({ opportunities: docs });
});

app.get('/api/opportunities/:id', async (req, res) => {
  const opportunity = await getOpportunityById(req.params.id);
  if (!opportunity) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json({ opportunity });
});

app.get('/rss.xml', async (req, res) => {
  const docs = await getOpportunityRecords();
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const items = docs
    .slice(0, 12)
    .map((item) => {
      const itemUrl = `${baseUrl}/#${item.id}`;
      return `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(itemUrl)}</link>
      <guid>${escapeXml(String(item.id))}</guid>
      <pubDate>${new Date(item.date || Date.now()).toUTCString()}</pubDate>
      <description>${escapeXml(item.description || '')}</description>
      <category>${escapeXml(item.category || 'Opportunity')}</category>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>TrackNext Opportunity Feed</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Latest internships, hackathons, workshops, jobs, and scholarships for students.</description>
    <language>en-us</language>
    ${items}
  </channel>
</rss>`;

  res.type('application/rss+xml').send(xml);
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

async function startServer() {
  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`TrackNext backend is running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('TrackNext startup failed.', error);
  process.exitCode = 1;
});
