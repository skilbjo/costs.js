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
	Merchant_Id 	= 4445,
	parse = true, imprt = false, stream = false, 
	rl 						= require('readline').createInterface({
		input: inTXT_Stream
	});

if (parse) {
	rl.on('line', function(line) {
		tagMerchantId(line);

		if( isValidLine(line) ) { 
			parseLine(line);
		}
	});
}

var isValidLine = function(line) {
	var lineitems 				= line.split(''), 
		subTotalRegex				= /INTCH\/OTHER FEES/,
		Qualification_Code 	= parse(lineitems, 21, 66),
		Txn_Count 					= parseInt(parse(lineitems, 67, 78).replace(/,/,''))
	;

	if ( Qualification_Code === '' || isNaN(Txn_Count) || subTotalRegex.test(Qualification_Code)  ) {
		return false;
	} else {
		return true;
	}
};

var tagMerchantId = function(line) {
	var lineitems 				= line.split(''),
		regex 							= /^4445[0-9]+$/,
		maybeMerchant_Id 		= parse(lineitems, 97, 110);

	if ( regex.test(maybeMerchant_Id) ) { Merchant_Id = maybeMerchant_Id; }
};

var isNegative = function(chr){
	return chr === '-' ? true : false;	
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
		Txn_Count		 					= parseInt(parse(lineitems, 67, 78).replace(/,/,'')),
		Txn_Amount 						= parse(lineitems, 80, 97), //parseFloat(parse(lineitems, 80, 97)) , //.replace(/,/,'')), //.toFixed(2),
		Interchange 					= parseFloat(parse(lineitems, 99, 111).replace(/,/,'')).toFixed(2)
	;

	Txn_Count 	= isNegative(lineitems[78]) 	?	Txn_Count 		*= -1 : Txn_Count;
	Txn_Amount 	= isNegative(lineitems[97]) 	?	'-'+Txn_Amount  		: Txn_Amount;
	Interchange = isNegative(lineitems[111])	? '-'+Interchange	 		: Interchange;

	// console.log(Interchange);

	result.push(Merchant_Id, Qualification_Code,  Txn_Count, Txn_Amount, Interchange );
	// console.log(result);

	var string = "";
	result.forEach(function(element){
	    string += element+ '\t';
	});

	console.log(string);
	
	return insert.push(result);
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


