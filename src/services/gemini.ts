import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface HabitSummary {
  totalHabits: number;
  completedToday: number;
  streak: number;
  topCategory: string;
  completionRate: number;
}

/**
 * Generates a short, editorial AI coaching insight.
 * Tone: calm authority — Kinetic Sanctuary brand voice.
 */
export async function generateCoachInsight(summary: HabitSummary): Promise<string> {
  const prompt = `You are an AI performance coach for "Kinetic Sanctuary" — a premium habit tracking app.
Your voice is calm, authoritative, and precise. Never generic. Never motivational-poster clichéd.
Think: a high-performance coach who has analyzed the user's actual data.

User data:
- Total protocols: ${summary.totalHabits}
- Completed today: ${summary.completedToday} / ${summary.totalHabits}
- Current streak: ${summary.streak} days
- Top category: ${summary.topCategory}
- 7-day completion rate: ${summary.completionRate}%

Generate ONE short insight (2–3 sentences max). 
- Be specific to their data.
- Mention a concrete behavioral pattern or recommendation.
- Do NOT use exclamation marks.
- Do NOT say "Great job" or "Keep it up".
- Reference their streak or completion rate as a data point.
- Sound like it was written, not generated.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

/**
 * Generates a milestone message for streak achievements.
 * Used in §7.8 Quiet Win system.
 */
export async function generateMilestoneMessage(streak: number, habitName: string): Promise<string> {
  const prompt = `You are writing a milestone notification for a habit tracker called "Kinetic Sanctuary".
The user has hit a ${streak}-day streak on their habit: "${habitName}".

Write ONE sentence. 
- Manrope editorial voice — calm, precise, quietly powerful
- Reference the specific number (${streak}) and ideally the habit
- No exclamation marks. No emojis. No "Amazing!" or "You did it!"
- Should feel like it was carved, not typed
- Max 12 words

Examples of the right tone:
- "14 days. The neural pathway is forming."
- "66 days. This is no longer a habit. It's you."
- "100 wins. Velocity confirmed."`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim().replace(/^"|"$/g, '');
}

/**
 * Asks Gemini to suggest a new habit based on existing ones.
 */
export async function suggestNextHabit(existingHabits: string[], topCategory: string): Promise<string> {
  const prompt = `You are a behavioral design expert for "Kinetic Sanctuary".
Existing habits: ${existingHabits.slice(0, 5).join(', ')}.
User's strongest category: ${topCategory}.

Suggest ONE new habit that:
1. Complements their existing protocols (no duplicates)
2. Uses habit stacking principles (can be linked to an existing one)  
3. Is specific and measurable ("Read 10 pages" not "Read more")
4. Is achievable daily

Respond with ONLY the habit name. Nothing else. Max 6 words.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim().replace(/^"|"$/g, '');
}
