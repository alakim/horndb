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

	var db = {getData: function(){return {books:[]};}};

	function displayData(db){
		var itemID = null;
		$('#pnlEditor').html((function(){with($H){
			return div(
				apply(db.getData().books, function(bk){
					return div(
						bk.author, ': ', bk.title, ':', 
								span(button({'class':'btEdit', 'data-nodeID':bk._id}, 'Edit'))
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
		.find('.btEdit').click(function(){
			itemID = $(this).attr('data-nodeID');
			var item = db.identity.getByID(itemID);
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
		displayData(Horn(catalogData));
	}

	$(init);
})(jQuery, Html.version('4.1.0'));
