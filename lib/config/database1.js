var 
	connection = require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	})
	;

exports.mysql = connection;
// module.exports = connection;
// exports.connection = connection;
// module.exports = mysql;

// exports.Vantiv = Vantiv;