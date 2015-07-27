select 
	Month, Currency, Card_Type, sum(Txn_count) Txn_Count,  
	sum(Txn_Amount) TPV_Local, sum(Total_Fees) as Total_Costs_Local,
    sum(Txn_Amount
    * case when Currency in ('EUR') then 1.35 when Currency in ('GBP') then 1.60 when Currency in ('CAD') then 0.9 else 1 end) Txn_Amount_USD ,
    sum(Total_Fees
    * case when Currency in ('EUR') then 1.35 when Currency in ('GBP') then 1.60 when Currency in ('CAD') then 0.9 else 1 end) Total_Costs_USD 

from Costs.GlobalPayments 

where	1 = 1
	-- month  '2015-03-31'

group by
	Month, Currency, Card_Type;