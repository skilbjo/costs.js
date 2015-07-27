select *, Avg_Interchange/Avg_Txn_Amount as '%' from (
select  
	month,  sum(txn_amount)/sum(txn_count) Avg_Txn_Amount, sum(abs(Interchange))/sum(txn_count) Avg_Interchange

from 
	-- Costs.Paymentech
	Costs.Homeaway
where
	card_type in ('credit')

group by
	month
) src



