var mysql      = require('mysql'),
	connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'costs'
	}),
	testquery = 'select 1 + 1 as solution'
	;

connection.connect();

var sql = 'insert into GlobalPayments' +
	'(Month, Txn_Count, Currency, Txn_Amount, Network, ' +
	'Region, Geographical_Location, Card_Type, Interchange, ' +
	'Assessments, Service_Charge values ?';

// var values = [
//     ['demian', 'demian@gmail.com', 1],
//     ['john', 'john@gmail.com', 2],
//     ['mark', 'mark@gmail.com', 3],
//     ['pete', 'pete@gmail.com', 4]
// ];

connection.query(sql, function(err, rows, fields) {
  if (err) throw err;
  console.log('Data has been inserted !');
});

connection.end();

// var PresetData = [taskInfo.presetList.length];
// for( var i = 0; i < taskInfo.presetList.length; i++){
//    PresetData[i] = [ taskInfo.presetList[i].Name, "" + taskInfo.presetList[i].Category, "" + taskInfo.presetList[i].GUID ];
// }

// console.log("PresetData: " + JSON.stringify(PresetData));
// this.connection.query( "INSERT INTO Preset (PresetName, PresetCategory, PresetGUID) VALUES ?", [PresetData], function(err, result) {
// });