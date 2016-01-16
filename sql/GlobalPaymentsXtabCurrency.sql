select * from crosstab(
	'select
	month, currency,
	cast(sum(total_fees)/sum(txn_amount)*100 as decimal(48,2)) as perfee
from
	globalpayments
where
	transaction_type in (''Refund'')
group by
	month, currency
order by month'
	,$$SELECT unnest('{EUR,GBP,USD,CAD}'::text[])$$)
as ct("Month"text,"EUR"text,"GBP"text,"USD"text,"CAD"text);
