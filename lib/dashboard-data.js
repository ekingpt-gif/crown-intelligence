import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'dashboard');

async function readJson(file) {
  const filePath = path.join(dataDir, file);
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

export async function getDashboardData() {
  const [overview, businesses, jobs, agents, activity, memory] = await Promise.all([
    readJson('overview.json'),
    readJson('businesses.json'),
    readJson('jobs.json'),
    readJson('agents.json'),
    readJson('activity.json'),
    readJson('memory.json'),
  ]);

  return { overview, businesses, jobs, agents, activity, memory };
}
