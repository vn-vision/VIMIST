-- trigger sends notification if goods in stock go below the set level
-- set level is recoreded as reorder_level in table products

DELIMITER //

CREATE TRIGGER reorder_stock
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
        IF NEW.quantity_in_stock <= NEW.reorder_level THEN
                INSERT INTO notifications(type, message, created_at)
                VALUES('Reorder Stock', CONCAT('Reorder stock for ', NEW.name), CURRENT_TIMESTAMP);
        END IF;
END
//

DELIMITER ;


-- trigger send notification onces goods have been restocked
-- must be higher than set restock level

DELIMITER //

CREATE TRIGGER restocked
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
        IF NEW.quantity_in_stock > NEW.reorder_level
                AND NEW.quantity_in_stock > OLD.quantity_in_stock THEN
                INSERT INTO notifications(type, message, created_at)
                VALUES('Restocked', CONCAT('Restocked order for ', NEW.name), CURRENT_TIMESTAMP);
        END IF;
END
//

DELIMITER ;
