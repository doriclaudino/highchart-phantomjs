var webPage = require('webpage');
var fs = require('fs');
var page = webPage.create();
var system = require('system');
var args = system.args;
var mail = webPage.create();


//passou parametros
if(args.length>1){
	var pagina = args[1];
	//var pagina = 'index.html';
	var arquivo = args[2];
	//var arquivo = 'teste.html';
	var destinatarios = args[3];
	//var arquivo = 'teste.html';
	
	//page.open(args[1], function(status) {
	//args[1] é a url com parametros, obs.: parametros nao funcionam chamada de arquivo local.
    //versao final precisa alterar o modo de pegar a variavel hostid no script1.js (pela tag ou pela url).
		page.open(pagina, function(status) {
		console.log('page.open' + status);
	});
	
	page.onLoadFinished = function() {	

	//funcao com 5 segudos de delay
		window.setTimeout(function () {
						
			var content = page.content;							
			console.log('content.length ' + content.length);	
			
			content = content.replace("<script src=\"jquery-1.8.3.min.js\"></script>", "");	
			content = content.replace("<script src=\"highcharts.js\"></script>", "");	
			content = content.replace("<script src=\"exporting.js\"></script>", "");	
			content = content.replace("<script src=\"funcoes.js\"></script>", "");	
			content = content.replace("<script src=\"single-script.js\"></script>", "");	
			
			fs.write(arquivo, content, 'w');
			
			mail.open("http://c3283faaea.undercloud.net/doriclaudino/highchart-phantomjs/envia_email.php?filename="+arquivo+"&destinatarios="+destinatarios, function(status) {
				console.log('Enviando email ' + status);
			});			
		}, 3000);
		
	};
	
	mail.onLoadFinished = function() {
		window.setTimeout(function () {
			phantom.exit();
		},3000)
	};
	
}else{
	console.log("Favor repassar os parâmetros corretamente.");
	phantom.exit();
}





