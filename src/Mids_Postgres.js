var fs = require('fs'),
	path = require('path'),
	csv = require('csv'),
	h = require('./../lib/helper.js'),
	dirPath = './../Processor/Mids',
	fileName = 'mids_2015-11-30.csv',
	file = path.join(dirPath, fileName),
	psql = require('./../lib/config/database.js'),
	stream = fs.createReadStream(file),
	csv_data = [] , large_array = [], data = '',
	table	= 'Mids'
	;

var truncate = 'truncate table '+ table;

var sql = 'insert into ' + table +
	'(PlatformId, Vertical, ParentAccountId, ParentName, Processor, ProcessorMid) '+
	'values ($1,$2,$3,$4,$5,$6)';

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
			if(err) console.log(err, item);
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
			PlatformId = item[0],
			Vertical = item[1],
			ParentAccountId = item[2],
			ParentName = item[3],
			Processor = item[4],
			ProcessorMid = item[5]
		;

		row.push(PlatformId, Vertical, ParentAccountId, ParentName, Processor, ProcessorMid);

		return large_array.push(row);
	});

	cb(large_array);
};




