-- trigger sends notification if credit is overdue

DELIMITER //

CREATE TRIGGER overdue_payment
BEFORE INSERT ON credit_sales
FOR EACH ROW
	BEGIN
		IF NEW.outstanding_balance > 0
			AND NEW.due_date < CURRENT_DATE THEN
				INSERT INTO notifications(type, message, created_at)
				VALUES('Payment Due', CONCAT('Overdue payment for customer ', NEW.customer_id), CURRENT_TIMESTAMP);
		END IF;
	END
//

DELIMITER ;
