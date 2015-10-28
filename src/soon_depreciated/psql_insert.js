var 
	pg = require('pg'),
	conString = 'postgres://jskilbeck:5432@localhost/test',
	psql = new pg.Client(conString),
	data =  [ [ '20150930', '4445018858357', 'AnotherCafe', 'Discover', 'DS PREPAID PSL CARD NOT PRESENT/ECOMM',  'Gross',  'Domestic',  'Debit',  2,  '144.70',   '2.94' ],
	   [ '20150930', '4445018858357', 'AnotherCafe', 'Discover', 'DS PREPAID PSL REAL ESTATE', 'Gross',  'Domestic', 'Debit', 47, '25314.02', '278.67']	],
	sql = 'insert into Vantiv'+
    ' (Month, Merchant_Id, Merchant_Descriptor, Network, Qualification_Code, Transaction_Type, '+ 
    ' Issuer_Type, Card_Type, Txn_Count, Txn_Amount, ' +
    'Interchange) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)'
	;

psql.connect();

psql.query(sql, data, function(err,result){
	if(err) console.log(err);
	console.log(result);
});