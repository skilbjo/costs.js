var fs 				= require('fs'),
	connection = require('mysql').createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  database : 'Costs'
	})
	;

var isNegative = function(chr){
	return chr === '-' ? true : false;	
};

var Network = function(Qualification_Code, Network) {
	var visaRegex = /^VS /,
		mcRegex = /^MC /,
		dsRegex = /^DS /
	;

	if ( visaRegex.test(Qualification_Code) || (Network === 'VISA') ) {
		return 'Visa';
	} else if ( mcRegex.test(Qualification_Code) || (Network === 'MasterCard') ) {
		return 'Mastercard';
	} else if ( dsRegex.test(Qualification_Code) || (Network === 'Discover') || (Network === 'Discover Diners') || (Network === 'JCB') ) {
		return 'Discover';
	}

};

var CardType = function(Qualification_Code) {
	var Debit = /debit/gi,
		Prepaid = /prepaid/gi
		;

	if (Debit.test(Qualification_Code) || Prepaid.test(Qualification_Code) ) {
		return 'Debit';
	} else { 
		return 'Credit';
	}

};

var TransactionType = function(chr) {
	return !isNegative(chr) ? 'Gross' : 'Refund';
};

var IssuerType = function(Qualification_Code) {
	var Intl_Regex = /INTL/gi,
		International_Regex = /International/gi,
		Interregional_Regex = /Interregtional/gi
	;

	if ( Intl_Regex.test(Qualification_Code) || International_Regex.test(Qualification_Code) || Interregional_Regex.test(Qualification_Code) ) {
		return 'International';
	} else {
		return 'Domestic';
	}

};

exports.isNegative 				= isNegative;
exports.CardType 					= CardType;
exports.TransactionType 	= TransactionType;
exports.IssuerType 				= IssuerType;
exports.connection 				= connection;
exports.Network 					= Network;
