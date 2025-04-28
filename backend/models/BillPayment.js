const db = require('../config/db');

class BillPayment {
  static async create(newBillPayment) {
    const [result] = await db.query('INSERT INTO bill_payments SET ?', [newBillPayment]);
    return result;
  }

  static async findById(billPaymentId) {
    const [rows] = await db.query('SELECT * FROM bill_payments WHERE bill_payment_id = ?', [billPaymentId]);
    return rows[0];
  }

  static async getByContractor(contractorId) {
    const [rows] = await db.query('SELECT * FROM bill_payments WHERE contractor_id = ?', [contractorId]);
    return rows;
  }

  static async update(billPaymentId, billPayment) {
    const [result] = await db.query(
      'UPDATE bill_payments SET ? WHERE bill_payment_id = ?',
      [billPayment, billPaymentId]
    );
    return result;
  }

  static async delete(billPaymentId) {
    const [result] = await db.query('DELETE FROM bill_payments WHERE bill_payment_id = ?', [billPaymentId]);
    return result;
  }

  static async getTotalPaymentsByContractor(contractorId) {
    const [rows] = await db.query(
      'SELECT SUM(net_payment) as total_payments FROM bill_payments WHERE contractor_id = ?',
      [contractorId]
    );
    return rows[0];
  }
}

module.exports = BillPayment;