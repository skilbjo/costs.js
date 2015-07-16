var fs 					= require('fs'),
	path 					= require('path'),
	dirPath 			= './../data/Vantiv/txt',
	txtFile 			= 'Vantiv-June2015.txt',
	csv = require('csv'),
	MonthNumber 	= '06',
	Month 				= '2015'+MonthNumber+'30',
	inTXT 				= path.join(dirPath, txtFile),
	inTXT_Stream 	= fs.createReadStream(inTXT).setEncoding('utf-8'),
	values 				= [], insert = [], data = '', 
	Merchant_Id 	= 4445,
	parse = true, imprt = false, stream = false, 
	rl 						= require('readline').createInterface({
		input: inTXT_Stream
	}),
	connection 		= require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	}),
	table 				= 'Vantiv'
	;

if (parse) {
	rl.on('line', function(line) {
		tagMerchantId(line);

		if( isValidLine(line) ) { 
			parseLine(line);
		}
	});
}

if (imprt) {
	rl.on('close', function() {
		connection.connect();
		SQLinsert(insert);
	});
}

var isValidLine = function(line) {
	var lineitems 				= line.split(''), 
		Qualification_Code 	= parse(lineitems, 21, 66),
		Txn_Count 					= parseInt(parse(lineitems, 67, 78).replace(/,/,''))
	;

	if ( !isSubtotal(line)  ) {
		return false;
	} else {
		return true;
	}
};

var notMerchant = function() {
	var desiredMerchant = '4445018516955';

	return desiredMerchant === Merchant_Id ? false : true;
};

var notTabularData = function(line) {
	var lineitems					= line.split(''),
		Qualification_Code 	= parse(lineitems, 21, 66)
	;

	return Qualification_Code === '' ? true : false;
};

var isSubtotal = function(line) {
	var lineitems 		= line.split(''),
		subTotalRegex 	= /TOTAL INTCH\/OTHER FEES/,
		Qualification_Code 	= parse(lineitems, 21, 66)
	;

	return subTotalRegex.test(Qualification_Code);
};

var isSummaryTable = function(line) {
	var lineitems 				= line.split(''),
		divRegex 						= /^\*\*DIVISION SUMMARY\*\*$/,
		chainRegex 					= /^\*\*CHAIN SUMMARY\*\*$/,
		divSummary 					= parse(lineitems, 88, 108),
		chainSummary 				= parse(lineitems, 88, 105)
		;

	if ( divRegex.test(divSummary) || chainRegex.test(chainSummary) ) {
		Merchant_Id = 'SummaryTable';
	} 

	return Merchant_Id === 'SummaryTable' ? true : false;

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

	result.push(Auto_Increment, Month, Merchant_Id, Qualification_Code,  Txn_Count, Txn_Amount, Interchange );

	var string = "";
	result.forEach(function(el){
		string+=el+'\t';
    // csv.stringify(el, function(err, el){
    // 	string += el;
    // });
	});

	console.log(string);
	
	return insert.push(result);
};


var sql = 'insert into ' + table +
	'(idVantiv, Month, Merchant_Id, Qualification_Code, Txn_Count, Txn_Amount, ' +
	'Interchange) values ?';

var SQLinsert = function(record) {
	connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  connection.end();
	});
};


