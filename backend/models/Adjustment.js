const db = require('../config/db');

class Adjustment {
  static async create(newAdjustment) {
    const [result] = await db.query('INSERT INTO adjustments SET ?', [newAdjustment]);
    return result;
  }

  static async findById(adjustmentId) {
    const [rows] = await db.query('SELECT * FROM adjustments WHERE adjustment_id = ?', [adjustmentId]);
    return rows[0];
  }

  static async getByContractor(contractorId) {
    const [rows] = await db.query('SELECT * FROM adjustments WHERE contractor_id = ?', [contractorId]);
    return rows;
  }

  static async update(adjustmentId, adjustment) {
    const [result] = await db.query(
      'UPDATE adjustments SET ? WHERE adjustment_id = ?',
      [adjustment, adjustmentId]
    );
    return result;
  }

  static async delete(adjustmentId) {
    const [result] = await db.query('DELETE FROM adjustments WHERE adjustment_id = ?', [adjustmentId]);
    return result;
  }

  static async getLatestAdjustments(contractorId) {
    const [rows] = await db.query(
      `SELECT * FROM adjustments 
       WHERE contractor_id = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [contractorId]
    );
    return rows[0];
  }
}

module.exports = Adjustment;