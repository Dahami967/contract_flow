const db = require('../config/db');

class AdvancePayment {
  static async create(newAdvancePayment) {
    const [result] = await db.query('INSERT INTO advance_payments SET ?', [newAdvancePayment]);
    return result;
  }

  static async findById(advancePaymentId) {
    const [rows] = await db.query('SELECT * FROM advance_payments WHERE advance_payment_id = ?', [advancePaymentId]);
    return rows[0];
  }

  static async getByContractor(contractorId) {
    const [rows] = await db.query('SELECT * FROM advance_payments WHERE contractor_id = ?', [contractorId]);
    return rows;
  }

  static async update(advancePaymentId, advancePayment) {
    const [result] = await db.query(
      'UPDATE advance_payments SET ? WHERE advance_payment_id = ?',
      [advancePayment, advancePaymentId]
    );
    return result;
  }

  static async delete(advancePaymentId) {
    const [result] = await db.query('DELETE FROM advance_payments WHERE advance_payment_id = ?', [advancePaymentId]);
    return result;
  }
}

module.exports = AdvancePayment;