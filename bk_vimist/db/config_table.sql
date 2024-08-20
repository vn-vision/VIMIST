-- stores the threshold value that can be updated easily

CREATE TABLE IF NOT EXISTS config (
	key_name VARCHAR(255) NOT NULL PRIMARY KEY,
	value DECIMAL(10,2) NOT NULL
);


-- insert initial threshold value into the config table
INSERT INTO config(key_name, value) VALUES ('credit_threshold', 500.00)
ON DUPLICATE KEY UPDATE value =  VALUES(value);
