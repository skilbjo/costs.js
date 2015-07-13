var fs 					= require('fs'),
	path 					= require('path'),
	csv 					= require('csv'),
	dirPath 			= './../data/GlobalPayments/csv',
	csvFile 			= 'may2015.csv',
	inCSV 				= path.join(dirPath, csvFile),
	inCSV_Stream 	= fs.createReadStream(inCSV).setEncoding('utf-8'),
	values 				= [], insert = [], data = '', 
	parse = true, imprt = true,
	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	});

/*
=TEXT(EOMONTH(DATE(2014,4,1),0),"YYYYMMDD")
*/

if (imprt) connection.connect();

if (parse) inCSV_Stream.on('data', function(chunk){ data+=chunk; });

if (parse) 
{ 
	inCSV_Stream.on('end', function() {
		csv.parse(data, {auto_parse: true, trim: true}, function(err, data){
			values.push(data);
			transform();
		});
	});
}

var transform = function() {
	var parsedData = 	values[0];

	parsedData.filter(function(item, iterator){/* skip headers */ if (iterator === 0) { return false; } else { return true; }
	}).map(function(item, iterator){
		var result 							= [],
			Auto_Increment 				= null,
			Month 								= item[0],
			Txn_Count 						= item[2],
			Currency 							= item[3],
			Txn_Amount 						= item[4],
			Network 							= item[6],
			Region 								= item[9],
			Interchange 					= item[13],
			Geographical_Location = item[16],
			Card_Type 						= item[18],
			Assessments 					= item[20],
			Service_Charge 				= item[21],
			Total_Fees 						= item[22];

		if (typeof Txn_Count === 'string') 		Txn_Count 	= parseFloat(Txn_Count.replace(/,/g,""));
		if (typeof Txn_Amount === 'string') 	Txn_Amount 	= parseFloat(Txn_Amount.replace(/,/g,""));
		if (typeof Interchange === 'string') 	Interchange = parseFloat(Interchange.replace(/,/g,""));
		if (typeof Total_Fees === 'string') 	Total_Fees 	= parseFloat(Total_Fees.replace(/,/g,""));

		result.push(Auto_Increment, Month, Txn_Count, Currency, Txn_Amount, Network, Region, Interchange, Geographical_Location, Card_Type, Assessments, Service_Charge, Total_Fees);

		// console.log(result);

		return insert.push(result);


	});


	// console.log(insert[1852]);
	// console.log(insert[1853]);

	if (imprt) SQLinsert(insert);
};

var sql = 'insert into GlobalPayments' +
	'(idGlobalPayments, Month, Txn_Count, Currency, Txn_Amount, Network, ' +
	'Region, Interchange, Geographical_Location, Card_Type, ' +
	'Assessments, Service_Charge, Total_Fees) values ?';

var SQLinsert = function(record) {
	connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  connection.end();
	});
};
