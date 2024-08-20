-- this script represents the products table schema
-- It records the products including when they are created and/or updated


CREATE TABLE IF NOT EXISTS products(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),
	name VARCHAR(255) NOT NULL,
	category VARCHAR(255) NOT NULL,
	quantity_in_stock INT NOT NULL,
	unit_price DECIMAL(10,2) NOT NULL,
	reorder_level INT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
