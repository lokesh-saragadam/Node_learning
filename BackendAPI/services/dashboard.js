/**
 * dashboard/service.js
 *
 * Contains all data-access (repository-style) and business-logic
 * (service-style) functions needed to power the Dashboard feature:
 *   - Overview cards (totals, difficulty counts, streaks, platforms, last sync)
 *   - Recent activity feed
 *   - Mutations (marking problems solved, managing platform handles)
 *
 * NOTE ON STRUCTURE
 * ------------------
 * Everything lives in one file per your request, but it's split into two
 * clearly-labeled sections:
 *   1. REPOSITORY LAYER  -> only Prisma queries, no business logic
 *   2. SERVICE LAYER      -> composes repository calls, does calculations
 *                            (streaks, formatting, aggregation)
 * If you later want the controller/service/repository folder structure,
 * you can lift section 1 into repository.js and section 2 into service.js
 * with no logic changes.
 */
 

const { prisma } = require('../database/db')

const { Difficulty } = require('@prisma/client');

//Functions
const log = require("../utils/logger");
// const prisma = new PrismaClient();
 
const MS_PER_DAY = 24 * 60 * 60 * 1000;
 
/* ============================================================
 * 1. REPOSITORY LAYER — raw data access, no business logic
 * ============================================================ */
 
/**
 * Total number of problems a user has solved.
 * COUNT(*) equivalent.
 */
async function getTotalSolvedCount(userId) {
  return prisma.solvedProblem.count({
    where: { userid: userId },
  });
}
 
/**
 * Solved counts grouped by difficulty in a single query.
 * Returns e.g. { Easy: 320, Medium: 410, Hard: 113 }
 *
 * Difficulty lives on Problem, not SolvedProblem, so we join through
 * the relation.
 */
async function getSolvedCountsByDifficulty(userId) {
  const grouped = await prisma.solvedProblem.groupBy({
    by: ['problemid'],
    where: { userid: userId },
  });
  //all problems in solvedProblem table.
  
  // groupBy on problemid alone doesn't give us difficulty directly since
  // difficulty is on the related Problem model. Prisma can't groupBy across
  // a relation, so we fetch solved problemids + join difficulty instead.
  const solved = await prisma.solvedProblem.findMany({
    where: { userid: userId },
    select: {
      problem: {
        select: { difficulty: true },
      },
    },
  });
 
  const counts = { Easy: 0, Medium: 0, Hard: 0 };
  for (const { problem } of solved) {
    if (problem?.difficulty && counts[problem.difficulty] !== undefined) {
      counts[problem.difficulty]++;
    }
  }
  return counts;
}
 
/**
 * Fetch every distinct calendar date (YYYY-MM-DD, in local/server time)
 * on which the user solved at least one problem, sorted descending
 * (most recent first). Used for streak calculations.
 */
async function getDistinctSolvedDates(userId) {
  const rows = await prisma.solvedProblem.findMany({
    where: {
      userid: userId,
      solvedat: { not: null },
    },
    select: { solvedat: true },
    orderBy: { solvedat: 'desc' },
  });
 
  const dateSet = new Set();
  for (const row of rows) {
    dateSet.add(toDateOnlyString(row.solvedat));
  }
 
  return Array.from(dateSet).sort((a, b) => (a < b ? 1 : -1)); // desc
}
 
/**
 * Number of distinct platforms the user has connected a handle for.
 */
async function getConnectedPlatformsCount(userId) {
  return prisma.userHandle.count({
    where: { userid: userId },
  });
}
 
/**
 * Names of platforms the user has connected, e.g. ["LeetCode", "Codeforces"]
 */
async function getConnectedPlatformNames(userId) {
  const handles = await prisma.userHandle.findMany({
    where: { userid: userId },
    select: { platform: { select: { name: true } } },
  });
  return handles.map((h) => h.platform.name);
}
 
/**
 * Most recent solved-problem timestamp for the user.
 * Used as a stand-in for "last sync" until a dedicated sync-log table exists.
 */
async function getLastSolvedTimestamp(userId) {
  const latest = await prisma.solvedProblem.findFirst({
    where: { userid: userId, solvedat: { not: null } },
    orderBy: { solvedat: 'desc' },
    select: { solvedat: true },
  });
  return latest?.solvedat ?? null;
}
 
/**
 * Most recent N solved problems with problem + platform info attached.
 */
async function getRecentActivity(userId, limit = 10) {
  const rows = await prisma.solvedProblem.findMany({
    where: { userid: userId },
    orderBy: { solvedat: 'desc' },
    take: limit,
    select: {
      problemid: true,
      solvedat: true,
      status: true,
      language: true,
      problem: {
        select: {
          problemtitle: true,
          difficulty: true,
          rating: true,
          platform: { select: { name: true } },
        },
      },
    },
  });
 
  return rows.map((row) => ({
    problemId: row.problemid,
    title: row.problem.problemtitle,
    difficulty: row.problem.difficulty ?? null,
    rating: row.problem.rating ?? null,
    platform: row.problem.platform.name,
    language: row.language,
    solvedAt: row.solvedat,
  }));
}
 
/* ------------------------------------------------------------
 * Mutation queries (the "modifications" side of the service)
 * ------------------------------------------------------------ */
 
/**
 * Mark a problem as solved for a user (creates or updates the
 * SolvedProblem row — unique on [userid, problemid]).
 */
async function markProblemSolved({
  userId,
  problemId,
  status = 'Accepted',
  language = null,
  solvedAt = new Date(),
}) {

    log("dashboard.js","markProblemSolved","Request recieved");
  return prisma.solvedProblem.upsert({
    where: {
      userid_problemid: { userid: userId, problemid: problemId },
    },
    update: { status, language, solvedat: solvedAt },
    create: {
      userid: userId,
      problemid: problemId,
      status,
      language,
      solvedat: solvedAt,
    },
  });
  log("dashboard.js","markProblemSolved","Request resolved");
}
 
/**
 * Undo a solved-problem record (rarely needed, but useful for corrections
 * or if a sync pulls in a false positive).
 */
async function unmarkProblemSolved(userId, problemId) {
    log("dashboard.js","unmarkProblemSolved","Request recieved");
  return prisma.solvedProblem.delete({
    where: {
      userid_problemid: { userid: userId, problemid: problemId },
    },
  });
    log("dashboard.js","unmarkProblemSolved","Request resolved");

}
 
/**
 * Create or update a Problem row (e.g. when syncing problems in from a
 * platform's API). Unique on [platformid, problemcode].
 */
async function upsertProblem({
  platformId,
  problemCode,
  problemTitle,
  difficulty = null, // Difficulty enum, LeetCode only
  rating = null, // Codeforces only
  tags = [],
}) {
    log("dashboard.js","upsertProblem","Request recieved");

  return prisma.problem.upsert({
    where: {
      platformid_problemcode: {
        platformid: platformId,
        problemcode: problemCode,
      },
    },
    update: { problemtitle: problemTitle, difficulty, rating, tags },
    create: {
      platformid: platformId,
      problemcode: problemCode,
      problemtitle: problemTitle,
      difficulty,
      rating,
      tags,
    },
  });
    log("dashboard.js","upsertProblem","Request resolved");

}
 
/**
 * Connect a new platform handle for a user (e.g. linking their
 * LeetCode username). Unique on [userid, platformid].
 */
async function addUserHandle({ userId, platformId, handle, rating = null }) {
  return prisma.userHandle.create({
    data: {
      userid: userId,
      platformid: platformId,
      handle,
      rating,
    },
  });
}
 
/**
 * Update the cached rating for an existing handle (e.g. after a
 * periodic sync pulls the user's latest Codeforces rating).
 */
async function updateUserHandleRating(handleId, rating) {
  return prisma.userHandle.update({
    where: { handleid: handleId },
    data: { rating },
  });
}
 
/**
 * Disconnect a platform handle.
 */
async function removeUserHandle(handleId) {
  return prisma.userHandle.delete({
    where: { handleid: handleId },
  });
}
 
/* ============================================================
 * 2. SERVICE LAYER — business logic, calculations, composition
 * ============================================================ */
 
/**
 * Convert a Date to a "YYYY-MM-DD" string (day granularity only).
 */
function toDateOnlyString(date) {
  return new Date(date).toISOString().split('T')[0];
}
 
/**
 * Subtract `days` days from a "YYYY-MM-DD" string, returning a new
 * "YYYY-MM-DD" string.
 */
function subtractDays(dateString, days) {
  const d = new Date(`${dateString}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return toDateOnlyString(d);
}
 
/**
 * Current streak, per the spec:
 *   today = today's date
 *   while solved(today): streak++, today -= 1 day
 * If the user hasn't solved anything today, the streak is 0
 * (no grace day — matches the algorithm as given).
 *
 * @param {string[]} solvedDatesDesc - distinct solved dates, "YYYY-MM-DD", descending
 */
function calculateCurrentStreak(solvedDatesDesc) {
  const solvedSet = new Set(solvedDatesDesc);
  let streak = 0;
  let cursor = toDateOnlyString(new Date());
 
  while (solvedSet.has(cursor)) {
    streak++;
    cursor = subtractDays(cursor, 1);
  }
  
  return streak;
}
 
/**
 * Longest streak ever, found by scanning the full solved-date history
 * once and tracking the longest run of consecutive calendar days.
 *
 * @param {string[]} solvedDatesDesc - distinct solved dates, "YYYY-MM-DD", descending
 */
function calculateLongestStreak(solvedDatesDesc) {
  if (solvedDatesDesc.length === 0) return 0;
 
  // Work ascending so we can walk forward day-by-day.
  const datesAsc = [...solvedDatesDesc].reverse();
 
  let longest = 1;
  let current = 1;
 
  for (let i = 1; i < datesAsc.length; i++) {
    const prevMs = Date.parse(`${datesAsc[i - 1]}T00:00:00.000Z`);
    const currMs = Date.parse(`${datesAsc[i]}T00:00:00.000Z`);
    const dayDiff = Math.round((currMs - prevMs) / MS_PER_DAY);
 
    if (dayDiff === 1) {
      current++;
    } else if (dayDiff > 1) {
      current = 1; // streak broken, reset
    }
    // dayDiff === 0 shouldn't happen since dates are deduped, but if it
    // did we'd just ignore it (same day, no change to streak).
 
    longest = Math.max(longest, current);
  }
 
  return longest;
}
 
/**
 * Human-friendly relative time, e.g. "3 minutes ago", "Yesterday", "5 days ago".
 */
function formatRelativeTime(date) {
  if (!date) return null;
 
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
 
  const minutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  const days = Math.floor(diffMs / MS_PER_DAY);
 
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}
 
/**
 * Builds the "overview" section of the dashboard response:
 * totals, difficulty breakdown, streaks, platforms, last sync.
 */
async function getDashboardOverview(userId) {
  const [totalSolved, difficultyCounts, solvedDates, platformsConnected, lastSolvedAt] =
    await Promise.all([
      getTotalSolvedCount(userId),
      getSolvedCountsByDifficulty(userId),
      getDistinctSolvedDates(userId),
      getConnectedPlatformsCount(userId),
      getLastSolvedTimestamp(userId),
    ]);

  return {
    totalSolved,
    easy: difficultyCounts.Easy,
    medium: difficultyCounts.Medium,
    hard: difficultyCounts.Hard,
    currentStreak: calculateCurrentStreak(solvedDates),
    longestStreak: calculateLongestStreak(solvedDates),
    platformsConnected,
    lastSync: formatRelativeTime(lastSolvedAt),
  };
}
 
/**
 * Builds the full single-call dashboard payload:
 *   { overview: {...}, recentActivity: [...] }
 *
 * This is what the /dashboard endpoint's controller should call.
 */
async function getDashboardData(userId, { recentActivityLimit = 10 } = {}) {
  const [overview, recentActivityRaw] = await Promise.all([
    getDashboardOverview(userId),
    getRecentActivity(userId, recentActivityLimit),
  ]);
 
  const recentActivity = recentActivityRaw.map((item) => ({
    ...item,
    solvedAtRelative: formatRelativeTime(item.solvedAt),
  }));
 
  return { overview, recentActivity };
}
 
/* ============================================================
 * Exports
 * ============================================================ */
 
module.exports = {
  // Repository layer (pure data access)
  getTotalSolvedCount,
  getSolvedCountsByDifficulty,
  getDistinctSolvedDates,
  getConnectedPlatformsCount,
  getConnectedPlatformNames,
  getLastSolvedTimestamp,
  getRecentActivity,
  markProblemSolved,
  unmarkProblemSolved,
  upsertProblem,
  addUserHandle,
  updateUserHandleRating,
  removeUserHandle,
 
  // Service layer (business logic / composition)
  calculateCurrentStreak,
  calculateLongestStreak,
  formatRelativeTime,
  getDashboardOverview,
  getDashboardData,
};