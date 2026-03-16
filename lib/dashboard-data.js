import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data', 'dashboard');

async function readJson(file) {
  const filePath = path.join(dataDir, file);
  const contents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(contents);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function groupJobsByLane(jobs) {
  const lanes = ['Now', 'Next', 'Ready', 'Blocked'];
  return lanes.map((lane) => ({
    lane,
    jobs: jobs.filter((job) => job.lane === lane),
  }));
}

async function enrichMemory(memory) {
  const checks = await Promise.all(
    (memory.checks || []).map(async (check) => ({
      ...check,
      exists: await pathExists(check.path),
    })),
  );

  const existingChecks = checks.filter((check) => check.exists).length;

  return {
    ...memory,
    checks,
    scaffoldScore: `${existingChecks}/${checks.length}`,
    longTermReady: checks.find((check) => check.label === 'MEMORY.md')?.exists ?? false,
    dailyReady: checks.find((check) => check.label === 'memory/ directory')?.exists ?? false,
  };
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

  const enrichedMemory = await enrichMemory(memory);

  return {
    overview,
    businesses,
    jobs,
    jobLanes: groupJobsByLane(jobs),
    agents,
    activity,
    memory: enrichedMemory,
  };
}
