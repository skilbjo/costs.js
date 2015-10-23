var fs 					= require('fs'),
	path 					= require('path'),
	csv 					= require('csv'),
	dirPath 			= './../data/Paymentech/excel',
	csvFile 			= 'junesalem.xlsx',
	inCSV 				= path.join(dirPath, csvFile),
	inCSV_Stream 	= fs.createReadStream(inCSV).setEncoding('utf-8'),
	values 				= [], insert = [], data = '', 
	parse = true, imprt = false,
	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	}),
	table 			= 'Paymentech'
	;

var parseIntP = function (number) {
	var regex = /^\$?\(?[\d,\.]*\)?$/;

		if ( number.match(regex) ) {
			// console.log('match', number, parseFloat('-' + number.replace(/[\(\)]/g,'').replace(/,/g,"") ) );
			return parseFloat('-' + number.replace(/[\(\)]/g,'').replace(/,/g,"") );
		}
		else{
			if (typeof number === "string") {
				return parseFloat(number.replace(/,/g,""));
			} else {
				return parseFloat(number);
			}
		}

};


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
	// console.log(parsedData[2]);

	parsedData.filter(function(item, iterator){
		/* skip headers */ 
		if (iterator === 0) { return false; } else { return true; }
	})
	.filter(function(item) {
		/* only import interchange */
		if (item[2] === 'Interchange') 
		{ return true; } else { return false; }
	}).map(function(item, iterator){
		var result 							= [],
			Auto_Increment 				= null,
			Month 								= item[0], 
			Fee_Description 			= item[2], 
			Transaction_Type 			= item[3], 
			Qualification_Code 		= item[12],
			Card_Type 						= item[13],
			Network 							= item[4],
			Txn_Count 						= item[7],
			Txn_Amount 						= item[9],
			Interchange 					= item[11];

		if (typeof Txn_Count === 'string') 		Txn_Count 	= parseFloat(Txn_Count.replace(/,/g,""));
		if (typeof Txn_Amount === 'string') 	Txn_Amount 	= parseIntP(Txn_Amount);
		if (typeof Interchange === 'string') 	Interchange = parseIntP(Interchange);

		result.push(Auto_Increment, Month, Fee_Description, Transaction_Type, Qualification_Code, Card_Type, Network, Txn_Count, Txn_Amount, Interchange);

		// if ( isNaN( Interchange ) ) console.log( Month, Qualification_Code, Card_Type );

		return insert.push(result);

	});

	// console.log(insert[3]);
	// console.log(insert[1853]);

	if (imprt) SQLinsert(insert);
};

var sql = 'insert into ' + table +
	'(idPaymentech, Month, Fee_Description, Transaction_Type, Qualification_Code, Card_Type, ' +
	'Network, Txn_Count, Txn_Amount, Interchange) values ?';

var SQLinsert = function(record) {
	connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  connection.end();
	});
};


