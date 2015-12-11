var fs = require('fs'),
	path = require('path'),
	csv = require('csv'),
	h = require('./../lib/helper.js'),
	psql = require('./../lib/config/database.js'),
	file = 'Presentment_Interchange_Summary_2015-10-31T014341.csv',
	Month = file.split('_')[3].replace(/.csv/,'').slice(0,10),
	stream 	= fs.createReadStream(path.join('./../processor/GlobalPayments/csv',file)),
	csv_data = [] , large_array = [], data = '', showConsole = false,
	table					= 'GlobalPayments'
	;

var sql = 'insert into ' + table + '('+
	' Month, Region, Currency, Network, Qualification_Code, Transaction_Type, Card_Type, '+
	' Txn_Count, Txn_Amount, Interchange, Assessments, Service_Charge, Total_Fees) '+
	' values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)';

stream.on('data', function(chunk){ data+=chunk; });

stream.on('end', function() {
	csv.parse(data, {auto_parse: true, trim: true}, function(err, data){
		csv_data.push(data);
		transform(csv_data,function(large_array){
			psql.connect();
			db(large_array);
		});
	});
});

var db = function(large_array){
	large_array.map(function(item, index){
		psql.query(sql, item, function(err,result){
			if(err) console.log(err);
		});
	});
	console.log('Data inserted');
};

var transform = function(data, cb) {
	var csv_data = 	data[0];
	csv_data.filter(function(item, index){ 
		return index === 0 ? false : /* skip headers */
			item[0] === '' ? false : true; /* skip subtotals */
	}).map(function(item, index){
		var row 							= [],
			Region = h.Region_GlobalPayments(item[15]),
			Currency = item[2],
			Qualification_Code = item[6],
			Network	= h.Network(null,item[5]),
			Card_Type = h.CardType_GlobalPayments(item[13]),
			Txn_Count = item[1],
			Txn_Amount = item[3],
			Interchange = item[12],
			Assessments = (h.AssessmentRate_GlobalPayments(Network,Region,Card_Type)*0.01 * Txn_Amount) + (h.AssessmentFixed_GlobalPayments(Network,Region,Card_Type,Currency)*Txn_Count),
			Service_Charge = h.ServiceCharge_GlobalPayments(Currency) * Txn_Count,
			Total_Fees = Interchange + Assessments + Service_Charge,
			Transaction_Type = h.TransactionType_GlobalPayments(Txn_Amount)
		;

		row.push(Month, Region, Currency, Network, Qualification_Code, Transaction_Type, Card_Type, 
			Txn_Count, Txn_Amount, Interchange, Assessments, Service_Charge, Total_Fees
		);

		if (showConsole) {
			var string = "";
			row.forEach(function(element){
		  	string += element+ '\t';
		});
			console.log(string);
		}

		return large_array.push(row);
	});

	cb(large_array);
};

