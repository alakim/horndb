var Horn = (function($D){

	newID = (function (){
		var counter = 1;
		return function(){
			return counter++;
		}
	})();


	function Horn(data){
		return {
			getData: function(){
				return data;
			}
		};
	}

	$D.extend(Horn, {
	});

	return Horn;
})(JDB.version('3.0.1'));
