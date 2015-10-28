var fs 				= require('fs')
	;

/* Helper functions */
var boolean_search = function(search_term, test){
	try {
		return ~test.indexOf(search_term) ? true : false;
	} catch	(e) {
		return false;
	}
};

var regex_search = function(search_term, test){
	var re = new RegExp(search_term,'i');
	return re.test(test) ? true : false;
};

var parse = function(line, start, finish) {
	var tempArray = []
		,	parsed = [];

	for (i = start; i < finish; i++) {
		tempArray.push(line[i]);
		parsed = tempArray.join('');
	}
	return parsed.trim();
};

var convert_currency = function(Currency, Value){
	var EURUSD = 1.35, GBPUSD = 1.6, USDUSD = 1, CADUSD = 0.9;

	switch (Currency){
		case 'EUR':
			return Value / (EURUSD / EURUSD);
		case 'GBP':
			return Value / (GBPUSD / EURUSD);
		case 'USD':
			return Value / (USDUSD / EURUSD);
		case 'CAD':
			return Value / (CADUSD / EURUSD);
	}
};


/* Vantiv and Paymentech parser */
var notTabularData = function(line) {
	var lineitems					= line.split(''),
		Qualification_Code 	= parse(lineitems, 21, 66)
	;

	return Qualification_Code === '' ? true : false;
};

var isSubtotal = function(line) {
	var lineitems = line.split(''),
		subTotalRegex = /INTCH\/OTHER FEES/,
		Qualification_Code = parse(lineitems, 21, 66)
	;

	return subTotalRegex.test(Qualification_Code);
};

var isNegative = function(chr){
	return chr === '-' ? true : false;	
};

var Network = function(Qualification_Code, Network) {
	var visaRegex = /^VS /,
		mcRegex = /^MC /,
		dsRegex = /^DS /
	;

	if ( visaRegex.test(Qualification_Code) || (Network === 'VISA') || (Network === 'Clr VISA Int.') ) {
		return 'Visa';
	} else if ( mcRegex.test(Qualification_Code) || (Network === 'MasterCard') || (Network === 'Clr Mastercard Int') ) {
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
		Interregional_Regex = /Interregional/gi
	;

	if ( Intl_Regex.test(Qualification_Code) || International_Regex.test(Qualification_Code) || Interregional_Regex.test(Qualification_Code) ) {
		return 'International';
	} else {
		return 'Domestic';
	}
};

/* Global Payments functions */
var CardType_GlobalPayments = function(FPI_Code){
	var Debit_FPI_Codes = ['01B','J67','NM8','NN2','NN3','P72','01B','04D','72A','97G','P72'],
		result = 'Credit'
	;

	Debit_FPI_Codes.map(function(item){
		if (boolean_search(item, FPI_Code)) {
			result = 'Debit';
		}
	});

	return result;
};

var Region_GlobalPayments = function(Region){
	var Domestic = /^Intra-Country/,
		Intra = /^((Sub-Regional)|(Intra-Regional))/,
		Inter = /^(Inter-Regional)/ 
		;

	if ( Domestic.test(Region) ) {
		return 'Domestic';
	} else if ( Intra.test(Region) ) {
		return 'Intra';
	} else if ( Inter.test(Region) ) {
		return 'Inter';
	} else { // Sometimes there is a blank geographical location :(
		return 'Inter';
	}
};

var AssessmentRate_GlobalPayments = function(Network, Region, Card_Type){
	switch(Network){
		case 'Visa':
			switch(Card_Type){
				case 'Credit':
					switch( Region ) {
						case 'Domestic':
							return 0.0425;
						case 'Intra':
							return 0.0425;
						case 'Inter':
							return 0.4325;
					}
				break;
				case 'Debit':
					switch( Region ) {
						case 'Domestic':
							return 0.025;
						case 'Intra':
							return 0.025;
						case 'Inter':
							return 0.415;
					}
			}
		break;
		case 'Mastercard':
			switch(Card_Type){
				case 'Credit':
					switch( Region ) {
						case 'Domestic':
							return 0.08;
						case 'Intra':
							return 0.1255;
						case 'Inter':
							return 0.6451;
					}
				break;
				case 'Debit':
					switch( Region ) {
						case 'Domestic':
							return 0.08;
						case 'Intra':
							return 0.0263;
						case 'Inter':
							return 0.6451;
					}
			}
	}
};

var ServiceCharge_GlobalPayments = function(Currency){
	var Service_Charge = 0.45;

	return convert_currency(Currency, Service_Charge);
};

var AssessmentFixed_GlobalPayments = function(Network, Region, Card_Type, Currency){
	switch(Network){
		case 'Visa':
			switch(Card_Type){
				case 'Credit':
					switch( Region ) {
						case 'Domestic':
							return convert_currency(Currency, 0.015);
						case 'Intra':
							return convert_currency(Currency, 0.015);
						case 'Inter':
							return convert_currency(Currency, 0.075);
					}
				break;
				case 'Debit':
					switch( Region ) {
						case 'Domestic':
							return convert_currency(Currency, 0.015);
						case 'Intra':
							return convert_currency(Currency, 0.015);
						case 'Inter':
							return convert_currency(Currency, 0.075);
					}
			}
		break;
		case 'Mastercard':
			switch(Card_Type){
				case 'Credit':
					switch( Region ) {
						case 'Domestic':
							return convert_currency(Currency, 0.0263);
						case 'Intra':
							return convert_currency(Currency, 0.0263);
						case 'Inter':
							return convert_currency(Currency, 0.084);
					}
				break;
				case 'Debit':
					switch( Region ) {
						case 'Domestic':
							return convert_currency(Currency, 0.0263);
						case 'Intra':
							return convert_currency(Currency, 0.0263);
						case 'Inter':
							return convert_currency(Currency, 0.084);
					}
			}
	}
};

var TransactionType_GlobalPayments = function(Txn_Amount) {
	return Txn_Amount < 0 ? 'Gross' : 'Refund';
};

/* Export functions */
exports.parse 						= parse;

exports.isNegative 				= isNegative;
exports.CardType 					= CardType;
exports.TransactionType 	= TransactionType;
exports.IssuerType 				= IssuerType;
exports.Network 					= Network;
exports.notTabularData 		= notTabularData;
exports.isSubtotal 				= isSubtotal;

exports.CardType_GlobalPayments = CardType_GlobalPayments;
exports.ServiceCharge_GlobalPayments = ServiceCharge_GlobalPayments;
exports.AssessmentRate_GlobalPayments = AssessmentRate_GlobalPayments;
exports.AssessmentFixed_GlobalPayments = AssessmentFixed_GlobalPayments;
exports.Region_GlobalPayments = Region_GlobalPayments;
exports.TransactionType_GlobalPayments = TransactionType_GlobalPayments;


