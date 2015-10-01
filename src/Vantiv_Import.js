var fs 					= require('fs'),
	path 					= require('path'),
	h 						= require('./3. Helper/helper.js'),
	dirPath 			= './../data/Vantiv/txt',
	txtFile 			= 'QTCSM00Y_MM-085_09-30-2015.txt',
	MonthNumber 	= '09',
	Month 				= '2015'+MonthNumber+'30',
	inTXT 				= path.join(dirPath, txtFile),
	inTXT_Stream 	= fs.createReadStream(inTXT).setEncoding('utf-8'),
	values 				= [], insert = [], data = '', 
	Merchant_Id 	= 4445, Merchant_Descriptor = '', 
	parse = true, imprt = true, filter = false,
	rl 						= require('readline').createInterface({
		input: inTXT_Stream
	}),
	table 				= 'Vantiv'
	;

if (parse) {
	rl.on('line', function(line) {
		tagMerchantId(line);
		tagMerchantDescriptor(line);

		if( isValidLine(line) ) { 
			parseLine(line);
		}
	});
}

if (imprt) {
	rl.on('close', function() {
		h.connection.connect();
		SQLinsert(insert);
	});
}

var isValidLine = function(line) {
	var lineitems 				= line.split(''), 
		Qualification_Code 	= parse(lineitems, 21, 66),
		Txn_Count 					= parseInt(parse(lineitems, 67, 78).replace(/,/,''))
	;

	if ( merchantFilter() || isSummaryTable(line) || notTabularData(line) || isNaN(Txn_Count) || isSubtotal(line)  ) {
		return false;
	} else {
		return true;
	}
};

var merchantFilter = function() {
	var desiredMerchant = '4445015871111';

	if (filter) {
		return desiredMerchant === Merchant_Id ? false : true;
	} else {
		return false;
	}

};

var notTabularData = function(line) {
	var lineitems					= line.split(''),
		Qualification_Code 	= parse(lineitems, 21, 66)
	;

	return Qualification_Code === '' ? true : false;
};

var isSubtotal = function(line) {
	var lineitems 		= line.split(''),
		subTotalRegex 	= /INTCH\/OTHER FEES/,
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

	if ( regex.test(maybeMerchant_Id) ) { 
		Merchant_Id = maybeMerchant_Id; 
	}
};

var tagMerchantDescriptor = function(line) {
	var lineitems 								= line.split(''),
		regex 											= /PAY*/,
		maybeMerchantDescriptor 		= parse(lineitems, 104, 132).trim();

	if ( regex.test(maybeMerchantDescriptor) ) { 
		Merchant_Descriptor = maybeMerchantDescriptor; 
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
		Network 							= h.Network(Qualification_Code),
		Txn_Count		 					= parseInt(parse(lineitems, 67, 78).replace(/,/g,'')),
		Txn_Amount 						= parse(lineitems, 80, 97).replace(/,/g,''), //parseFloat(parse(lineitems, 80, 97)) , //.replace(/,/,'')), //.toFixed(2),
		Interchange 					= parseFloat(parse(lineitems, 99, 111).replace(/,/g,'')).toFixed(2),
		Transaction_Type 			= h.TransactionType(lineitems[97]),
		Issuer_Type 					= h.IssuerType(Qualification_Code),
		Card_Type 						= h.CardType(Qualification_Code)
	;

	Txn_Count 	= h.isNegative(lineitems[78]) 	?	Txn_Count 		*= -1 : Txn_Count;
	Txn_Amount 	= h.isNegative(lineitems[97]) 	?	'-'+Txn_Amount  		: Txn_Amount;
	Interchange = h.isNegative(lineitems[111])	? '-'+Interchange	 		: Interchange;

	result.push(Auto_Increment, Month, Merchant_Id, Merchant_Descriptor, 
		Network, Qualification_Code, Transaction_Type, Issuer_Type, Card_Type,  
		Txn_Count, Txn_Amount, Interchange
	);

	var string = "";
	result.forEach(function(element){
	    string += element+ '\t';
	});

	console.log(string);
	
	return insert.push(result);
};


var sql = 'insert into ' + table +
	'(idVantiv, Month, Merchant_Id, Merchant_Descriptor, Network, Qualification_Code, Transaction_Type, '+ 
	' Issuer_Type, Card_Type, Txn_Count, Txn_Amount, ' +
	'Interchange) values ?';

var SQLinsert = function(record) {
	h.connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  h.connection.end();
	});
};


