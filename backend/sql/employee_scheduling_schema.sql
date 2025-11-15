CREATE DATABASE IF NOT EXISTS EmployeeSchedulingDB;
USE EmployeeSchedulingDB;

-- 1) Employees
CREATE TABLE IF NOT EXISTS Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    birthday   DATE NOT NULL,
    start_date DATE NOT NULL,
    working_status ENUM('Working', 'Terminated', 'Seasonal') NOT NULL DEFAULT 'Working',
    preferred_shift ENUM('Opening', 'Midday', 'Afternoon', 'Closing') NOT NULL,
    password VARCHAR(20) GENERATED ALWAYS AS (DATE_FORMAT(birthday, '%Y%m%d')) STORED
);

-- 2) DaysOfWeek
CREATE TABLE IF NOT EXISTS DaysOfWeek (
    day_id INT AUTO_INCREMENT PRIMARY KEY,
    day_name ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL
);

INSERT INTO DaysOfWeek (day_name) VALUES
('Monday'),
('Tuesday'),
('Wednesday'),
('Thursday'),
('Friday'),
('Saturday'),
('Sunday');

-- 3) EmployeePreferredDays (bridge table)
CREATE TABLE IF NOT EXISTS EmployeePreferredDays (
    employee_id INT NOT NULL,
    day_id INT NOT NULL,
    PRIMARY KEY (employee_id, day_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (day_id) REFERENCES DaysOfWeek(day_id) ON DELETE CASCADE
);

-- 4) Schedule (actual shifts)
CREATE TABLE IF NOT EXISTS Schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    shift_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    shift_type ENUM('Opening','Midday','Afternoon','Closing') NOT NULL,
    hours DECIMAL(5,2) GENERATED ALWAYS AS (
        TIME_TO_SEC(TIMEDIFF(end_time, start_time)) / 3600
    ) STORED,
    UNIQUE KEY uq_emp_date_start (employee_id, shift_date, start_time),
    INDEX ix_emp_date (employee_id, shift_date),
    CONSTRAINT fk_sched_emp FOREIGN KEY (employee_id)
      REFERENCES Employees(employee_id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

INSERT INTO Employees (first_name, last_name, birthday, start_date, preferred_shift, working_status)
VALUES
('James', 'Harris',  '2001-05-14', '2020-01-01', 'Opening',  'Working'),
('Rayan', 'Rashid',  '2001-12-10', '2020-01-01', 'Midday',   'Working'),
('Vidhi', 'Patel',   '2002-02-10', '2020-01-01', 'Afternoon','Working'),
('Chatcha','Mantapaneewat','2001-12-02','2020-01-01','Afternoon','Working'),
('Michael','Monroe', '2000-07-05', '2020-01-01', 'Closing',  'Working'),
('Justin', 'Tan',    '2002-03-18', '2020-01-01', 'Opening',  'Working'),
('Natalie','Tran',   '2001-09-25', '2020-01-01', 'Midday',   'Working'),
('Mari',   'Lisa',   '1999-03-01', '2020-01-01', 'Opening',  'Working');

INSERT INTO EmployeePreferredDays (employee_id, day_id) VALUES
(1, 1), (1, 3),
(2, 2), (2, 4),
(3, 3), (3, 5),
(4, 4), (4, 6),
(5, 5), (5, 7),
(6, 1), (6, 2),
(7, 2), (7, 6),
(8, 1), (8, 5);
