var parse = function(line, start, finish) {
	var tempArray = []
		,	parsed = [];

	for (i = start; i < finish; i++) {
		tempArray.push(line[i]);
		parsed = tempArray.join('');
	}

	return parsed.trim();
};

var 
	lineDiv = '                                                                                        **DIVISION SUMMARY**                      ',
	lineitemsDiv 				= lineDiv.split(''),
	lineChain = '                                                                                        **CHAIN SUMMARY**                         ',
	lineitemsChain 				= lineChain.split(''),
	divRegex 					= /^\*\*DIVISION SUMMARY\*\*$/,
	chainRegex 				= /^\*\*CHAIN SUMMARY\*\*$/,
	divSummary 				= parse(lineitemsDiv, 88, 108),
	chainSummary 			= parse(lineitemsChain, 88, 105)
	;


console.log( 
	divSummary
	// ,
	// chainSummary,

	// divRegex.test(divSummary) ,
	// chainRegex.test(chainSummary)

);



// if ( divRegex.test(divSummary) || chainRegex.test(chainSummary) ) {