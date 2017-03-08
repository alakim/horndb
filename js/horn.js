var Horn = (function($D){
	var hornIDName = '_id';

	function Identity(data){
		var index = {};

		function indexItem(itm){
			if(itm[hornIDName]) index[itm[hornIDName]] = itm;
			
			if(itm instanceof Array)
				for(var i; i<itm.length; i++){indexItem(itm[i]);}
			if(typeof(itm)=='object')
				for(var k in itm){indexItem(itm[k]);}
		}
		indexItem(data);

		var idCounter = 1;

		function newID(){
			while(index[idCounter]) idCounter++;
			return idCounter++;
		}

		function setID(itm){
			if(!itm[hornIDName]) itm[hornIDName] = newID();
			index[itm[hornIDName]] = itm;
			
			if(itm instanceof Array)
				for(var i; i<itm.length; i++){setID(itm[i]);}
			if(typeof(itm)=='object')
				for(var k in itm){setID(itm[k]);}
		}
		setID(data);

		return {
			newID: function(){
				while(index[idCounter]) idCounter++;
				return idCounter++;
			},
			getByID: function(id){
				return index[id];
			}
		};
	}


	function getItem(data, path){
		// console.log(1, path);
		if(typeof(path)=='string') path = path.split('/');
		// console.log(2, path);
		if(!path.length) return data;
		if(!path[0].length) return getItem(data, path.splice(1));
		var step = path[0];
		if(data[step]) return getItem(data[step], path.splice(1));
	}

	function appendAction(db, change){
		var itm = getItem(db.getData(), change.path);
		if(itm instanceof Array)
			itm.push(change.item);
		else 
			console.error(itm, ' is not array');
	}

	function changeAction(data, change){
		// console.log(data, change);
		var itm = data.identity.getByID(change.itemID);
		if(!itm) console.error('item #'+change.itemID+' does not exist');
		for(var k in change.itemData){
			itm[k] = change.itemData[k];
		}
	}

	function applyChange(data, change){
		switch(change.type){
			case 'change':
				changeAction(data, change);
				break;
			case 'append':
				appendAction(data, change);
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
		var identity = Identity(data);
		// console.log(data);
		var changes = [];
		return {
			identity: identity,
			getData: function(){
				return data;
			},
			change: function(itemID, itemData){
				changes.push({
					type:'change',
					itemID: itemID,
					itemData: itemData
				});
			},
			append: function(path, item){
				changes.push({
					type:'append',
					path: path,
					item: item
				});
			},
			applyChanges: function(){
				var dd = Horn(clone(data));
				$D.each(changes, function(chg){
					applyChange(dd, chg);
				});
				console.log('Было: %o, стало: %o', data, dd);
				return dd;
			}
		};
	}

	$D.extend(Horn, {
	});

	return Horn;
})(JDB.version('3.0.1'));
