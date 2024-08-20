-- created a table for goods sold on credit
-- references the customer table and sales


CREATE TABLE IF NOT EXISTS credit_sales(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	customer_id INT NOT NULL,
	FOREIGN KEY(customer_id) REFERENCES customers(id),
	sale_id INT NOT NULL,
	FOREIGN KEY(sale_id) REFERENCES sales(id),
	total_credit DECIMAL(10,2) NOT NULL,
	outstanding_balance DECIMAL(10,2) NOT NULL,
	due_date DATE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
