-- script creates the sales table
-- it has a one to one relation with payment, many to one with products


CREATE TABLE IF NOT EXISTS sales(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	product_id INT NOT NULL,
	FOREIGN KEY(product_id) REFERENCES products(id),
	customer_id INT NOT NULL,
	FOREIGN KEY(customer_id) REFERENCES customers(id),
	quantity_sold INT NOT NULL,
	total_price DECIMAL(10,2) NOT NULL,
	sale_date DATE NOT NULL,
	payment_type ENUM('Cash', 'Mpesa', 'Credit') NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
