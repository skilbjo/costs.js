var fs 					= require('fs'),
	path 					= require('path'),
	h 						= require('./3. Helper/helper.js'),
	dirPath 			= './../data/Paymentech/excel',
	MonthNumber 	= '06',
	Month 				= '2015'+MonthNumber+'30',
	fileName 			= 'junesalem.xlsx',
	file 					= path.join(dirPath, fileName),
	workbook 			= require('xlsx').readFile(file).Sheets.SlmStmt,
	parse = true, imprt = false, insert = [],
	table = 'PS_Test'
;

var sql = 'insert into ' + table +
	'(idPaymentech, Month, Network, Qualification_Code, ' +
		'Transaction_Type, Issuer_Type, Card_Type, ' +
		'Txn_Count, Txn_Amount, Interchange) values ?';

var SQLinsert = function(record) {
	h.connection.query(sql, [record], function(err, rows, fields) {
	  if (err) { console.log(rows); throw err; }
	  console.log('Data has been inserted !');
	  h.connection.end();
	});
};

var parseXLSX = function(workbook) {
	var data = require('xlsx').utils.sheet_to_row_object_array(workbook);

	data.forEach(function(el) {
		var 			result = [],
			Network 							= h.Network(null,el.MOP),
			Qualification_Code 		= el['Interchange & Assessment Fees'],
			Transaction_Type 			= el['Action Type'],
			Issuer_Type 					= h.IssuerType(Qualification_Code),
			Card_Type							= h.CardType(Qualification_Code),
			Txn_Count 						= el['Unit Quantity'],
			Txn_Amount 						= el.Amount,
			Interchange 					= el['Total Charge'] * -1
		;

		if ( Qualification_Code !== 'Interchange') return;

		result.push(null, Month, Network, Qualification_Code, 
			Transaction_Type, Issuer_Type, Card_Type,
			Txn_Count, Txn_Amount, Interchange
		);

		return insert.push(result);
	});

	console.log(insert);

	if (imprt) SQLinsert(insert);
};

if (parse) parseXLSX(workbook);



