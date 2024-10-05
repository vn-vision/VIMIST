-- script creates payment tables
-- refereces sales table


CREATE TABLE IF NOT EXISTS payments(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	sale_id INT NOT NULL,
	FOREIGN KEY(sale_id) REFERENCES sales(id),
	amount_paid DECIMAL(10,2) NOT NULL,
	payment_date DATE NOT NULL,
	payment_method ENUM('Cash', 'Mpesa', 'Credit') NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
