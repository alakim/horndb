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

	function getByID(data, id){
		if(data[hornIDName]==id) return data;
		if(data instanceof Array){
			for(var el,i=0; el=data[i],i<data.length; i++){
				var itm = getByID(el, id);
				if(itm) return itm;
			}
		}
		else if(typeof(data)=='object'){
			for(var k in data){
				var itm = getByID(data[k], id);
				if(itm) return itm;
			}
		}
	}

	function appendAction(db, data, change){
		var trg = getItem(data, change.path);
		var itm = clone(change.item);
		if(trg instanceof Array)
			trg.push(itm);
		else 
			console.error(trg, ' is not array');
	}

	function changeAction(db, data, change){
		// console.log(data, change);
		var itm = getByID(data, change.itemID);
		if(!itm) console.error('item #'+change.itemID+' does not exist');
		for(var k in change.itemData){
			itm[k] = change.itemData[k];
		}
	}

	function applyChange(db, data, change){
		// console.log('db: %o', db);
		switch(change.type){
			case 'change':
				changeAction(db, data, change);
				break;
			case 'append':
				appendAction(db, data, change);
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
				item[hornIDName] = this.identity.newID();
				changes.push({
					type:'append',
					path: path,
					item: item
				});
			},
			applyChanges: function(){var self=this;
				console.log('applyChanges: %o', changes);
				var dd = clone(data);
				$D.each(changes, function(chg){
					applyChange(self, dd, chg);
				});
				console.log('Было: %o, стало: %o', data, dd);
				return dd;
			},
			getChanges: function(){return changes;}
		};
	}

	$D.extend(Horn, {
		getByID: getByID
	});

	return Horn;
})(JDB.version('3.0.1'));
