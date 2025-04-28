-- Create the contract_flow database if it doesn't exist
CREATE DATABASE IF NOT EXISTS contract_flow;
USE contract_flow;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    project_no VARCHAR(50) NOT NULL UNIQUE,
    project_description TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    ds_division VARCHAR(100) NOT NULL,
    fund_source VARCHAR(100) NOT NULL,
    vote_details VARCHAR(100) NOT NULL,
    total_cost_estimate DECIMAL(15, 2) NOT NULL,
    beneficiaries INT NOT NULL,
    output TEXT NOT NULL,
    outcome TEXT NOT NULL,
    feasibility_studies TEXT NOT NULL,
    relevant_pc VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contractors table
CREATE TABLE IF NOT EXISTS contractors (
    contractor_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    contractor_name VARCHAR(255) NOT NULL,
    contract_no VARCHAR(50) NOT NULL UNIQUE,
    contract_amount DECIMAL(15, 2) NOT NULL,
    date_awarded DATE NOT NULL,
    vat_details TEXT NOT NULL,
    contract_period VARCHAR(100) NOT NULL,
    performance_bond_bank VARCHAR(255) NOT NULL,
    performance_bond_amount DECIMAL(15, 2) NOT NULL,
    performance_bond_expiry DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Advance payments table
CREATE TABLE IF NOT EXISTS advance_payments (
    advance_payment_id INT AUTO_INCREMENT PRIMARY KEY,
    contractor_id INT NOT NULL,
    date_of_payment DATE NOT NULL,
    amount_paid DECIMAL(15, 2) NOT NULL,
    advance_bond_bank VARCHAR(255) NOT NULL,
    advance_bond_amount DECIMAL(15, 2) NOT NULL,
    advance_bond_expiry DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id) ON DELETE CASCADE
);

-- Bill payments table
CREATE TABLE IF NOT EXISTS bill_payments (
    bill_payment_id INT AUTO_INCREMENT PRIMARY KEY,
    contractor_id INT NOT NULL,
    date_of_payment DATE NOT NULL,
    bill_no VARCHAR(50) NOT NULL UNIQUE,
    bill_amount DECIMAL(15, 2) NOT NULL,
    recovery_advance DECIMAL(15, 2) DEFAULT 0,
    recovery_liquidity_damages DECIMAL(15, 2) DEFAULT 0,
    recovery_others DECIMAL(15, 2) DEFAULT 0,
    recovery_retention DECIMAL(15, 2) DEFAULT 0,
    net_payment DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id) ON DELETE CASCADE
);

-- Adjustments table
CREATE TABLE IF NOT EXISTS adjustments (
    adjustment_id INT AUTO_INCREMENT PRIMARY KEY,
    contractor_id INT NOT NULL,
    contract_extension_date DATE,
    contract_extension_details TEXT,
    advance_bond_extension_date DATE,
    advance_bond_extension_details TEXT,
    performance_bond_extension_date DATE,
    performance_bond_extension_details TEXT,
    variation_date DATE,
    variation_amount DECIMAL(15, 2),
    variation_percentage DECIMAL(5, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id) ON DELETE CASCADE
);