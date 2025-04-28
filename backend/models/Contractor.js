const db = require('../config/db');

class Contractor {
  static async create(newContractor) {
    const [result] = await db.query('INSERT INTO contractors SET ?', [newContractor]);
    return result;
  }

  static async findById(contractorId) {
    const [rows] = await db.query('SELECT * FROM contractors WHERE contractor_id = ?', [contractorId]);
    return rows[0];
  }

  static async getByProject(projectId) {
    const [rows] = await db.query('SELECT * FROM contractors WHERE project_id = ?', [projectId]);
    return rows;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM contractors');
    return rows;
  }

  static async update(contractorId, contractor) {
    const [result] = await db.query(
      'UPDATE contractors SET ? WHERE contractor_id = ?',
      [contractor, contractorId]
    );
    return result;
  }

  static async delete(contractorId) {
    const [result] = await db.query('DELETE FROM contractors WHERE contractor_id = ?', [contractorId]);
    return result;
  }
}

module.exports = Contractor;