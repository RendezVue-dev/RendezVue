import { pool } from "../config/database.js";
const hobbyScore = async (user1_id, user2_id) => {
  if (!user1_id || !user2_id) return 0;

  const hobbiesUser1 = await pool.query(`
      SELECT COUNT(*) AS hobby_num
      FROM user_hobby
      WHERE user_id = $1
  `, [user1_id]);

  const hobbiesUser1Size = Number(hobbiesUser1.rows[0].hobby_num);

  const hobbiesUser2 = await pool.query(`
      SELECT COUNT(*) AS hobby_num
      FROM user_hobby
      WHERE user_id = $1
  `, [user2_id]);

  const hobbiesUser2Size = Number(hobbiesUser2.rows[0].hobby_num);
  
  const hobbiesIntersection = await pool.query(`
      SELECT COUNT(*) AS shared_num
      FROM (
        SELECT *
        FROM user_hobby
        WHERE user_id = $1
      ) AS u1
      JOIN (
        SELECT *
        FROM user_hobby
        WHERE user_id = $2
      ) AS u2
      ON u1.hobby_id = u2.hobby_id
  `, [user1_id, user2_id]);
  
  // Handle division by zero: if both users have no hobbies, return 0
  if (hobbiesUser1Size === 0 && hobbiesUser2Size === 0) return 0;
  
  // Calculate hobby score: shared hobbies / max hobbies (Jaccard-like similarity)
  // This ensures float division in JavaScript
  const sharedNum = Number(hobbiesIntersection.rows[0].shared_num);
  const maxHobbies = Math.max(hobbiesUser1Size, hobbiesUser2Size);
  
  // Additional safety check (shouldn't happen due to line above, but just in case)
  if (maxHobbies === 0) return 0;
  
  return sharedNum / maxHobbies;
}
export default {hobbyScore}
