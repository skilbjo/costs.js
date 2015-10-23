var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	h = require('./../lib/helper.js'),
	txtFile = 'QTCSM00Y_MM-085_09-30-2015.txt',
	MonthNumber 	= '09', Month = '2015'+MonthNumber+'30',
	inTXT_Stream = fs.createReadStream(path.join('./../processor/Vantiv/txt', txtFile)).setEncoding('utf-8'),
	Merchant_Id = 4445, Merchant_Descriptor = '', large_array = [],
	imprt = true, filter = false, showConsole = false,
	rl = require('readline').createInterface({ input: inTXT_Stream }),
	table = 'Vantiv',
	psql = require('./../lib/config/database.js')
	;

/* TO DO... 
	-do error checking (ie any null data elements inserted?
	-use postgres database
*/

/* Globals... SQL statement, merchant filter (testing), MerchantId assignment, MerchnatDescriptor assignment */
var sql = 'insert into '+table+
	' (Month, Merchant_Id, Merchant_Descriptor, Network, Qualification_Code, Transaction_Type, '+ 
	' Issuer_Type, Card_Type, Txn_Count, Txn_Amount, ' +
	'Interchange) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)';

var tagMerchantId = function(line) {
	var lineitems = line.split(''),
		regex = /^4445[0-9]+$/,
		maybeMerchant_Id = h.parse(lineitems, 97, 110);

	if ( regex.test(maybeMerchant_Id) ) { 
		Merchant_Id = maybeMerchant_Id; 
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

var tagMerchantDescriptor = function(line) {
	var lineitems = line.split(''),
		regex = /PAY*/,
		maybeMerchantDescriptor = h.parse(lineitems, 104, 132).trim();

	if ( regex.test(maybeMerchantDescriptor) ) { 
		Merchant_Descriptor = maybeMerchantDescriptor; 
	}
};

/* Read each line and perform checks 	*/
rl.on('line', function(line) {
	tagMerchantId(line);
	tagMerchantDescriptor(line);

	if( isValidLine(line) ) { 
		parseLine(line);
	}
});

rl.on('close', function() {
	psql.connect();
	reduceArray(large_array, function(small_array){
		db(small_array);
	});
});

var reduceArray = function(arr, cb){
	var size = 1000,
	 small_array = []
	 ;

	for (var i=0; i<arr.length; i+=size){
		var chunk = arr.slice(i,i+size);
		small_array.push(chunk);
	}
	cb(small_array);
};

/* Insert into SQL */
var db = function(small_array){
	for(var i = 0; i<small_array.length;i++){
		var data = small_array[i];
		data.forEach(function(item,index){
			psql.query(sql, item, function(err,result){
				if(err) console.log(err);
				psql.end();
			});
		});
	}


	// async.times(small_array.length, function(n, next){
	// 	var data = small_array[n]; 
	// 		psql.query(sql, [data], function(err,result){
	// 			next(err, result);
	// 		});
	// }, function(err){
	// 	console.log(err);
	// });
};

/* Determine if each line is valid or not */
var isValidLine = function(line) {
	var lineitems = line.split(''), 
		Qualification_Code 	= h.parse(lineitems, 21, 66),
		Txn_Count = parseInt(h.parse(lineitems, 67, 78).replace(/,/,''))
	;

	if ( merchantFilter() || h.isSummaryTable(line) || h.notTabularData(line) || isNaN(Txn_Count) || h.isSubtotal(line)  ) {
		return false;
	} else {
		return true;
	}
};

var parseLine = function(line) {
	var lineitems 	= line.split(''),
		row = [],
		Qualification_Code = h.parse(lineitems, 21, 66),
		Network = h.Network(Qualification_Code),
		Txn_Count	= parseInt(h.parse(lineitems, 67, 78).replace(/,/g,'')),
		Txn_Amount = h.parse(lineitems, 80, 97).replace(/,/g,''), //parseFloat(parse(lineitems, 80, 97)) , //.replace(/,/,'')), //.toFixed(2),
		Interchange = parseFloat(h.parse(lineitems, 99, 111).replace(/,/g,'')).toFixed(2),
		Transaction_Type = h.TransactionType(lineitems[97]),
		Issuer_Type = h.IssuerType(Qualification_Code),
		Card_Type	= h.CardType(Qualification_Code)
	;

	Txn_Count = h.isNegative(lineitems[78]) 	?	Txn_Count 		*= -1 : Txn_Count;
	Txn_Amount = h.isNegative(lineitems[97]) 	?	'-'+Txn_Amount  		: Txn_Amount;
	Interchange = h.isNegative(lineitems[111])	? '-'+Interchange	 		: Interchange;

	row.push(Month, Merchant_Id, Merchant_Descriptor, 
		Network, Qualification_Code, Transaction_Type, Issuer_Type, Card_Type,  
		Txn_Count, Txn_Amount, Interchange
	);

	if (showConsole) {
		var string = "";
		row.forEach(function(element){
		    string += element+ '\t';
		});
		console.log(string);
	}

	return large_array.push(row);
};
