var CatalogEditor = (function($, $H){
	$H.writeStylesheet({
		'body':{
			fontFamily: 'Verdana, Arial, Sans-serif'
		}
	});

	var db = {getData: function(){return {books:[]};}};

	function init(){
		db = Horn(catalogData);

		$('#pnlEditor').html((function(){with($H){
			return div(
				apply(db.getData().books, function(bk){
					return div(
						bk.author, ': ', bk.title
					);
				})
			);
		}})());
	}

	$(init);
})(jQuery, Html.version('4.1.0'));
