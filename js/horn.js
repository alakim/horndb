var Horn = (function($D){

	newID = (function (){
		var counter = 1;
		return function(){
			return counter++;
		}
	})();

	function getItem(data, path){
		// console.log(1, path);
		if(typeof(path)=='string') path = path.split('/');
		// console.log(2, path);
		if(!path.length) return data;
		if(!path[0].length) return getItem(data, path.splice(1));
		var step = path[0];
		if(data[step]) return getItem(data[step], path.splice(1));
	}

	function append(data, change){
		var itm = getItem(data, change.path);
		if(itm instanceof Array)
			itm.push(change.item);
		else 
			console.error(itm, ' is not array');
	}

	function applyChange(data, change){
		switch(change.type){
			case 'append':
				append(data, change);
				break;
			default:
				break;
		}
	}

	function clone(itm){
		if(itm instanceof Array){
			var newItm = [];
			for(var el,i=0; el=itm[i],i<itm.length; i++){
				newItm.push(clone(el));
			}
			return newItm;
		}
		if(typeof(itm)=='object'){
			var newObj = {};
			for(var k in itm){
				newObj[k] = clone(itm[k]);
			}
			return newObj;
		}
		if(typeof(itm)=='function') return null;
		return itm;
	}

	function Horn(data){
		var changes = [];
		return {
			getData: function(){
				return data;
			},
			append: function(path, item){
				changes.push({
					type:'append',
					path: path,
					item: item
				});
			},
			applyChanges: function(){
				var dd = clone(data);
				$D.each(changes, function(chg){
					applyChange(dd, chg);
				});
				console.log('Было: %o, стало: %o', data, dd);
				return Horn(dd);
			}
		};
	}

	$D.extend(Horn, {
	});

	return Horn;
})(JDB.version('3.0.1'));
