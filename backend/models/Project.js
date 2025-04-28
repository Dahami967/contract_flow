const db = require('../config/db');

class Project {
  static async create(newProject) {
    const [result] = await db.query('INSERT INTO projects SET ?', [newProject]);
    return result;
  }

  static async findById(projectId) {
    const [rows] = await db.query('SELECT * FROM projects WHERE project_id = ?', [projectId]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.query('SELECT * FROM projects');
    return rows;
  }

  static async update(projectId, project) {
    const [result] = await db.query(
      'UPDATE projects SET ? WHERE project_id = ?',
      [project, projectId]
    );
    return result;
  }

  static async delete(projectId) {
    const [result] = await db.query('DELETE FROM projects WHERE project_id = ?', [projectId]);
    return result;
  }
}

module.exports = Project;