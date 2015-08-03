var fs 					= require('fs'),
	path 					= require('path'),
	h 						= require('./3. Helper/helper.js'),
	dirPath 			= './../data/Mids',
	MonthNumber 	= '06',
	Month 				= '2015'+MonthNumber+'30',
	fileName 			= 'ProcessorMids.xlsx',
	file 					= path.join(dirPath, fileName),
	workbook 			= require('xlsx').readFile(file).Sheets.Sheet1,
	parse = true, imprt = true, insert = [],
	table = 'Mids'
;

var sql = 'insert into ' + table +
	'(idMids, PlatformId, Vertical, ' +
		'ParentAccountId, ParentName, ' +
		'Processor, ProcessorMid) values ?';

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
			PlatformId 				= el.PlatformId,
			Vertical 					= el.Vertical,
			ParentAccountId 	= el.ParentAccountId,
			ParentName 				= el.ParentName,
			Processor					= el.Processor,
			ProcessorMid 			= el.ProcessorMid
		;

		result.push(null, PlatformId, Vertical, 
			ParentAccountId, ParentName, 
			Processor, ProcessorMid
		);

		return insert.push(result);
	});

	console.log(insert);

	if (imprt) SQLinsert(insert);
};

if (parse) parseXLSX(workbook);



