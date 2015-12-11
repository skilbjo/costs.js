var 
	connection = require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	})
	;

exports.mysql = connection;