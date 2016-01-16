set var.month = '2015-10-31' ;

create extension tablefunc;

select * from crosstab(
'select ''HA-Intl'' Vertical,
	Card_Type,
	cast(sum(Total_Fees)/sum(Txn_Amount)*100 as decimal(10,2)) as Rate
from
	globalpayments
where
	--Month in (''2015-10-31'')
	 Month in ( cast(current_setting(''var.month'') as date) )
	--  and Transaction_Type in (''Refund'') 
group by
	Card_Type'
,$$SELECT unnest('{Credit,Debit}'::text[])$$)
as ct("Vertical"text,"Credit"text,"Debit"text);







