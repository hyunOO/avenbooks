USE UNIVERSITY;

CREATE TRIGGER `finish_after_confirm`
  AFTER UPDATE ON TRADE
  FOR EACH ROW 
  BEGIN
    UPDATE SELLING SET FINISHED=true 
    WHERE SellingID = OLD.SellingID && BuyerID = OLD.BuyerID
  END;