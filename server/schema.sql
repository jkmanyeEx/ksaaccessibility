CREATE DATABASE IF NOT EXISTS ksaaccessibility;
USE ksaaccessibility;

CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    issue_name VARCHAR(255) NOT NULL,
    description TEXT,
    severity INT NOT NULL,
    suggested_fix TEXT,
    photo_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
