var CatalogEditor = (function($, $H){
	var px = $H.unit('px');
	$H.writeStylesheet({
		'body':{
			fontFamily: 'Verdana, Arial, Sans-serif',
			' .dialogPanel':{
				border: px(1)+' solid #ccc'
			}
		}
	});

	var db; //= {getData: function(){return {books:[]};}};

	function displayData(data){
		var itemID = null;
		$('#pnlEditor').html((function(){with($H){
			return div(
				apply(data.books, function(bk){
					return div(
						bk.author, ': ', bk.title, ':', 
								span(button({'class':'btEdit', 'data-nodeID':bk._id}, 'Edit')),
								span(button({'class':'btDel', 'data-nodeID':bk._id, style:'color:#f00'}, 'Delete'))
					);
				}),
				div(
					button({'class':'btAdd'}, 'Add')
				),
				div({'class':'dialogPanel dlgAdd', style:'display:none'},
					table(
						tr(
							td('Title'),
							td(input({type:'text', 'class':'tbTitle'}))
						),
						tr(
							td('Author'),
							td(input({type:'text', 'class':'tbAuthor'}))
						)
					),
					div(
						button({'class':'btOK'}, 'OK'),
						button({'class':'btCancel'}, 'Cancel')
					)
				),
				div({'class':'dialogPanel dlgEdit', style:'display:none'},
					'ssss'
				)
			);
		}})())
		.find('.btDel').click(function(){
			itemID = $(this).attr('data-nodeID');
			var item = Horn.getByID(data, itemID);
			if(!item) console.error('Item #'+itemID+' does not exist');
			db.delete(itemID);
			displayData(db.applyChanges());
		}).end()
		.find('.btEdit').click(function(){
			itemID = $(this).attr('data-nodeID');
			var item = Horn.getByID(data, itemID);
			if(!item) console.error('Item #'+itemID+' does not exist');
			$('.dlgAdd .tbTitle').val(item.title);
			$('.dlgAdd .tbAuthor').val(item.author);
			$('.dlgAdd').show();
		}).end()
		.find('.btAdd').click(function(){
			itemID = null;
			$('.dlgAdd .tbTitle').val('');
			$('.dlgAdd .tbAuthor').val('');
			$('.dlgAdd').show();
		}).end()
		.find('.dlgAdd .btCancel').click(function(){
			$('.dlgAdd').hide();
		}).end()
		.find('.dlgAdd .btOK').click(function(){
			var title = $('.dlgAdd .tbTitle').val(),
				author = $('.dlgAdd .tbAuthor').val();
			if(itemID!=null)
				db.change(itemID, {title:title, author:author});
			else
				db.append('/books/', {title:title, author:author});
			displayData(db.applyChanges());
			$('.dlgAdd').hide();
		}).end();
	}

	function init(){
		db = Horn(catalogData);
		displayData(db.getData());
	}

	$(init);

	return {
		showChanges: function(){
			console.log('changes: %o', db.getChanges());
		}
	};
})(jQuery, Html.version('4.1.0'));
