
var list = [

240 ,
 1,010  ,
869 ,
74 ,
2 ,
5 ,
" 1,468"  ,
403 ,
326 ,
5 ,
97 ,
406 ,
243 ,

];



var parseIntP = function (number) {
	var regex = /^\([\d,\.]*\)$/;

	if (typeof number === "string") {
		//Check if it is in the proper format
		if (number.match(regex)) {

			return parseFloat('-' + number.replace(/[\(\)]/g,'').replace(/,/g,"") );
		}
		else{
			if (typeof number === "string") {
				return parseFloat(number.replace(/,/g,""));
			} else {
				return parseFloat(number);
			}
		}
	} else {
		return number;
	}   
};


console.log(
	parseFloat(" 1,245")
	);