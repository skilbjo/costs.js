var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	h = require('./../lib/helper.js'),
	file = 'vs_mc_sample.txt',
	MonthNumber 	= '09', Month = '2015'+MonthNumber+'30',
	Merchant_Id = 4445, Merchant_Descriptor = '', large_array = [],
	imprt = true
	;

var extract = function(file, cb){
	rl = require('readline').createInterface({ 
		input: fs.createReadStream(path.join('./../processor/Vantiv/new', file)) 
	});

	rl.on('line',function(line){
		cb(line)
	});	

	rl.on('close', function(large_array){
	console.log(large_array);
	});
};

var transform = function(line, cb){
	var lineitems = line.split('|'),
		Merchant_Id = lineitems[1].trim(),
		MCC 	= lineitems[3].trim(),
		Network = lineitems[4].trim(),
		Interchange_Qualification = lineitems[6].trim(),
		Txn_Amount = lineitems[7].trim(),
		Interchange = lineitems[8].trim(),
		Assessements = lineitems[9].trim()
		results = []
	;

	try{
		results.push(Merchant_Id, MCC, Network, Interchange_Qualification.trim(), Txn_Amount, Interchange, Assessements);
	} catch(e){
		console.log(e);
	}

	cb(results);
};

extract(file, function(line){
	transform(line, function(results){
		large_array.push(results);
	});
});

