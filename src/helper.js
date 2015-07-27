var fs 				= require('fs')
	;

var isNegative = function(chr){
	return chr === '-' ? true : false;	
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
	var Intl_Regex = /INTL/gi;

	if ( Intl_Regex.test(Qualification_Code) ) {
		return 'International';
	} else {
		return 'Domestic';
	}

};

exports.isNegative 				= isNegative;
exports.CardType 					= CardType;
exports.TransactionType 	= TransactionType;
exports.IssuerType 				= IssuerType;
