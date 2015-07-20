select Month , 
	Currency, count(*) ,
    format(sum(Txn_Amount),2) as TPV, 
    format(sum(Total_Fees),2) as Total_Cost ,
    sum(Total_Fees)/sum(Txn_Amount) as '%_age'
from 
	Costs.GlobalPayments
where
	Currency in ('CAD')
    and Region in ('Foreign - REST','Foreign - MASTER')
group by Month ,
	Currency