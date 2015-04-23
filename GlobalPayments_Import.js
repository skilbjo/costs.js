var fs 					= require('fs'),
	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	}),
	csv 					= require('csv'),
	inCSV 				= './data/GlobalPayments/february.csv',
	inCSV_Stream 	= fs.createReadStream(inCSV).setEncoding('utf-8')
	values 				= [], insert = [], data = ''
	;

connection.connect();

inCSV_Stream.on('data', function(chunk){
	data+=chunk;
});

inCSV_Stream.on('end', function() {
	csv.parse(data, {auto_parse: true, trim: true}, function(err, data){
		values.push(data);
		transform();
	});
});

var transform = function() {
	var parsedData = 	values[0];

	parsedData.filter(function(item, iterator){
		// skip headers
		if (iterator === 0) {
			return false;
		} else {
			return true;
		}
	}).map(function(item, iterator){
		var result 							= []
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

		if (typeof Total_Fees === 'string') Total_Fees = parseFloat(Total_Fees.replace(/,/g,""));

		result.push(Auto_Increment, Month, Txn_Count, Currency, Txn_Amount, Network, 
			Region, Interchange, Geographical_Location, Card_Type, 
			Assessments, Service_Charge, Total_Fees);


		return insert.push(result);
	});

	// return console.log(insert[248]);
	SQLinsert(insert);

}

var sql = 'insert into GlobalPayments' +
	'(idGlobalPayments, Month, Txn_Count, Currency, Txn_Amount, Network, ' +
	'Region, Interchange, Geographical_Location, Card_Type, ' +
	'Assessments, Service_Charge, Total_Fees) values ?';

var SQLinsert = function(record) {
	connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err;
	  }
	  console.log('Data has been inserted !');
	  connection.end();
	});
};

// inCSV_Stream.on('data', function(line){
// 	// console.log(line);
// 	csv.parse(line, {auto_parse: false, trim: true},function(err, data){
// 		i++;
// 		var Month = data[i][0];
// 		console.log(Month, i);
// 		// var data = parsedLine[0],
// 		// 	Month = data[0];
// 		// console.log(parsedLine);
// 			// values.push(parsedLine);

// 	});
// });



// inCSV_Stream.on('end', function(){
// 	// console.log(values);
// 	// console.log(values.length)
// });





// rl.on('line', function(line) {
// 	parseLine(line);
// });

// var parseLine = function(line){
// 	csv.parse(line, function(err, data){
// 		var data 	= data[0],
// 			result 								= [],
// 			Auto_Increment 				= null,
// 			Month 								= data[0],
// 			Txn_Count 						= data[2],
// 			Currency 							= data[3],
// 			Txn_Amount 						= data[4],
// 			Network 							= data[6],
// 			Region 								= data[9],
// 			Interchange 					= data[13],
// 			Geographical_Location = data[16],
// 			Card_Type 						= data[18],
// 			Assessments 					= data[20],
// 			Service_Charge 				= data[21],
// 			Total_Fees 						= data[22]
// 			;

// 		result.push(Auto_Increment, Month, Txn_Count, Currency, Txn_Amount, Network, 
// 			Region, Interchange, Geographical_Location, Card_Type, 
// 			Assessments, Service_Charge, Total_Fees);

// 		values.push(result);
// 	});
// };

// rl.on('close', function() {
// 	insert();
// });



