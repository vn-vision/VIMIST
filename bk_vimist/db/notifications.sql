-- notifications table,
-- records low stock, payment overdue, Top-Up Reminder


CREATE TABLE IF NOT EXISTS notifications(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	type ENUM('Low Stock', 'Reorder Stock', 'Restocked', 'Payment Due', 'Top-Up Reminder'),
	message TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	read_at TIMESTAMP NULL
);
