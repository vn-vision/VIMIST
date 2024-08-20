-- trigger sends notification to customers to top up their credit balance
-- sends trigger if outstanding balance is past a certain threshold
DELIMITER //

CREATE TRIGGER top_up_reminder
BEFORE INSERT ON credit_sales
FOR EACH ROW
	BEGIN
		-- declare a variable for the threshold
		DECLARE threshold DECIMAl(10,2);

		-- retrieve the current threshold value from the config table
		SELECT value INTO threshold
		FROM config
		WHERE key_name = 'credit_threshold';

		-- check if the customer's outstanding balance exceeds
		IF (SELECT IFNULL(outstanding_balance, 0) FROM credit_sales
			WHERE customer_id = NEW.customer_id
			ORDER BY created_at DESC LIMIT 1) > threshold THEN
				-- send notification about high outstanding bl
				INSERT INTO notifications(type, message, created_at)
				VALUES('Top-Up Reminder', CONCAT('customer ', NEW.customer_id,
						' has an outstanding balance above ', threshold), CURRENT_TIMESTAMP);

				-- prevent the new credit sale by signaling error
				SIGNAL SQLSTATE '45000'
				SET MESSAGE_TEXT = 'Credit sale cannot be processed due to outstanding balance.';
		END IF;
	END
//
DELIMITER ;
