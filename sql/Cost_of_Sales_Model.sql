set  var.month = '2015-12-31' ; 

select  	
	mids.Vertical, Network, Card_Type, Issuer_Type,     	
	sum(Txn_Count), sum(Txn_Amount), sum(Interchange)
from  vantiv   	
	inner join (  	
		select  Vertical, ProcessorMid  	
		from    mids  	
		where   Processor in ('Vantiv')  	
		group by Vertical, ProcessorMid    	
	) mids on mids.ProcessorMid = vantiv.Merchant_Id 
where  Month in ( cast(current_setting('var.month') as date) )     	
	and Merchant_Descriptor not like 'PAY*PENDING%'
group by  	
	mids.Vertical, 	Network, Card_Type, Issuer_Type;
