var fs 					= require('fs'),
	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'costs'
	}),
	csv 					= require('csv'),
	inCSV 				= './data/GlobalPayments/february.csv',
	rl 						= require('readline').createInterface({
		input	: fs.createReadStream(inCSV),
		output: process.stdout
	}),
	values 				= []
	;

connection.connect();

rl.on('line', function(line) {
	parseLine(line);
});

var parseLine = function(line){
	csv.parse(line, function(err, data){
		var data 	= data[0],
			result 								= [],
			Auto_Increment 				= null,
			Month 								= data[0],
			Txn_Count 						= data[2],
			Currency 							= data[3],
			Txn_Amount 						= data[4],
			Network 							= data[6],
			Region 								= data[9],
			Interchange 					= data[13],
			Geographical_Location = data[16],
			Card_Type 						= data[18],
			Assessments 					= data[20],
			Service_Charge 				= data[21],
			Total_Fees 						= data[22]
			;

		result.push(Auto_Increment, Month, Txn_Count, Currency, Txn_Amount, Network, 
			Region, Interchange, Geographical_Location, Card_Type, 
			Assessments, Service_Charge, Total_Fees);

		values.push(result);
	});
};

rl.on('close', function() {
	insert();
});

var sql = 'insert into GlobalPayments' +
	'(idGlobalPayments, Month, Txn_Count, Currency, Txn_Amount, Network, ' +
	'Region, Geographical_Location, Card_Type, Interchange, ' +
	'Assessments, Service_Charge, Total_Fees) values ?';

var insert = function() {
	connection.query(sql, [values], function(err, rows, fields) {
	  if (err) throw err;
	  console.log('Data has been inserted !');
	  connection.end();
	});
};