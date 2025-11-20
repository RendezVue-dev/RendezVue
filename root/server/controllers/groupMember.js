import { pool } from "../config/database.js";
import FormatCurrentDateTimeService from "../services/formatCurrentTimeService.js";
import InsightService from "../services/insightService.js";

// GET /groupMembers
const getAllGroupMembers = async (_req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM group_member ORDER BY group_id, user_id`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /groupMembers/user/:userId
const getGroupMemberByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query(
        `SELECT *
            FROM group_member
            WHERE user_id = $1`,
        [Number(userId)]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /groupMembers/group/:groupId
const getGroupMemberByGroupId = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const result = await pool.query(
        `SELECT *
            FROM group_member
            WHERE group_id = $1`, [Number(groupId)]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /groupMembers
const createGroupMember = async (req, res) => {
  try {
    const { groupId, userId, admin = false } = req.body;
    if (!groupId || !userId) {
      return res.status(400).json({ error: "groupId and userId required" });
    }

    // Check if user is already a member
    const existingCheck = await pool.query(
      `SELECT * FROM group_member WHERE group_id = $1 AND user_id = $2`,
      [Number(groupId), Number(userId)]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(409).json({ error: "User is already a member of this group" });
    }

    const currentTime = FormatCurrentDateTimeService.formatCurrentDateTime();
    const result = await pool.query(
      `INSERT INTO group_member (group_id, user_id, admin, joined_at)
       VALUES ($1, $2, $3, $4)
       RETURNING group_id, user_id, admin, joined_at`,
      [Number(groupId), Number(userId), Boolean(admin), currentTime]
    );
    await InsightService.updateInsights(userId);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /groupMembers/:groupId/:userId
const updateGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const { admin } = req.body;
    if (admin === undefined) {
      return res.status(400).json({ error: "admin flag required" });
    }
    const result = await pool.query(
      `UPDATE group_member
       SET admin = $1
       WHERE group_id = $2 AND user_id = $3
       RETURNING group_id, user_id, admin, joined_at`,
      [Boolean(admin), Number(groupId), Number(userId)]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    await InsightService.updateInsights(userId);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /groupMembers/:groupId/:userId
const deleteGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const result = await pool.query(
      `DELETE FROM group_member
       WHERE group_id = $1 AND user_id = $2
       RETURNING group_id, user_id, admin, joined_at`,
      [Number(groupId), Number(userId)]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Not found" });
    await InsightService.updateInsights(userId);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllGroupMembers,
  getGroupMemberByGroupId,
  getGroupMemberByUserId,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
};