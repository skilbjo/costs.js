var 
	psql = require('./../lib/config/database.js')
	;


psql.connect(function(err){
	if(err) console.log(err);

	psql.query('select now() as "the time"',function(err,result){
		if(err) console.log(err);
		console.log(result.rows);
		psql.end();
	});
});

// create table Vantiv (
// 	id serial primary key,
// 	Month date,
// 	Merchant_Id varchar(45),
// 	Merchant_Descriptor varchar(45),
// 	Network varchar(45),
// 	Qualification_Code varchar(45),
// 	Transaction_Type varchar(45),
// 	Issuer_Type varchar(45),
// 	Card_Type varchar(45),
// 	Txn_Count integer,
// 	Txn_Amount decimal(48,2),
// 	Interchange decimal(48,2)
// );