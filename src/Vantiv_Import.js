var fs 					= require('fs'),
	path 					= require('path'),
	csv 					= require('csv'),
	dirPath 			= './../data/Vantiv/txt',
	txtFile 			= 'VantivSmall.txt',
	MonthNumber 	= '06',
	Month 				= '2015'+MonthNumber+'30',
	inTXT 				= path.join(dirPath, txtFile),
	inTXT_Stream 	= fs.createReadStream(inTXT).setEncoding('utf-8'),
	values 				= [], insert = [], data = '', 
	parse = true, imprt = false, stream = false, 
	rl 						= require('readline').createInterface({
		input: inTXT_Stream
	});

var parseIntP = function (number) { var regex = /^\$?\(?[\d,\.]*\)?$/;
	if ( number.match(regex) ) { return parseFloat('-' + number.replace(/[\(\)]/g,'').replace(/,/g,"") ); }
	else{ if (typeof number === "string") { return parseFloat(number.replace(/,/g,"")); } else { return parseFloat(number); } }
};

if (parse) {
	rl.on('line', function(line) {

		if( isValidLine(line) ) parseLine(line);

	});
}

var isValidLine = function(line) {
	var lineitems 				= line.split(''), 
		Qualification_Code 	= parse(lineitems, 21, 66),
		Txn_Count 					= parseInt(parse(lineitems, 67, 78).replace(/,/,'')),
		Merchant_Id 				= isMerchantId(line)
	;

	if ( Qualification_Code === '' || isNaN(Txn_Count) || !isMerchantId  ) {
		return false;
	} else {
		return true;
	}
};

var isMerchantId = function(line) {
	var lineitems 				= line.split(''),
		regex = /^4445[0-9]$/,
		Merchant_Id 				= parse(lineitems, 97, 110);

		console.log(Merchant_Id);


	if ( regex.test(Merchant_Id) ) {
		console.log(Merchant_Id);
		return true;
	}

};

var parse = function(line, start, finish) {
	var tempArray = []
		,	parsed = [];

	for (i = start; i < finish; i++) {
		tempArray.push(line[i]);
		parsed = tempArray.join('');
	}

	return parsed.trim();
};

var parseLine = function(line) {
	var lineitems 	= line.split(''),
		result = [],
		Auto_Increment 				= null,
		Qualification_Code 		= parse(lineitems, 21, 66),
		Txn_Count 						= parseInt(parse(lineitems, 67, 78).replace(/,/,'')),
		Txn_Amount 						= parseFloat(parse(lineitems, 80, 97).replace(/,/,'')).toFixed(2),
		Interchange 					= parseFloat(parse(lineitems, 99, 111).replace(/,/,'')).toFixed(2),
		Merchant_Id 					= isMerchantId(line)
	;

	result.push(Qualification_Code,  Txn_Count, Txn_Amount, Interchange );

	// console.log(result);

	return result;
};


// if (parse) 
// { 
// 	inTXT_Stream.on('end', function() {
// 		csv.parse(data, {auto_parse: true, trim: true}, function(err, data){
// 			values.push(data);
// 			transform();
// 		});
// 	});
// }






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


	if (imprt) SQLinsert(insert);
};








var	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	}),
	table 			= 'Vantiv'
	;

if (imprt) connection.connect();

var sql = 'insert into ' + table +
	'(idVantiv, Month, Fee_Description, Transaction_Type, Qualification_Code, Card_Type, ' +
	'Network, Txn_Count, Txn_Amount, Interchange) values ?';

var SQLinsert = function(record) {
	connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  connection.end();
	});
};


