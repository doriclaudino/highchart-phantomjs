var finished = false;

$( document ).ready(function() {
  //lê os parâmetros na URL
  $.urlParam = function(name){
      var url = window.location.href;
	  //altera o formato=html para exibir normalmente a pagina
	  //altera o formato=email para exibir graficos em png
      //var url = "http://177.70.26.235/painel/zabbix/cloudbuilder_relat.php?report_timesince=20150705091059&report_timetill=20150804091059&groupid=45&hostid=10272&formato=html"
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
      if (results==null){
         return null;
      }
      else{
         return decodeURIComponent(results[1]) || 0;
      }
  }

  var options = {
      exporting: {
              enabled: false
          },
          chart: {
			  height: 300,
            events: {
                load: function () {
                  console.log("events.load.");
					var container = $(this).get(0).container;
					console.log($(container).parents(".container"));
					//console.log(container);
					//console.log($(container).html());
					//console.log();
					//teste se é envio de e-mail
					//console.log($("#id1.container>div").html());
					var formato = $.urlParam("formato");
					var svgText = $(container).html();
					var svgWidth = $(container).width();
					var svgHeight = $(container).height();
					//var current_id = $(container);					
					
					var canvas = document.createElement('canvas');
					canvas.width  = svgWidth;
					canvas.height = svgHeight;
					var ctxt = canvas.getContext("2d");
					
					function drawInlineSVG(ctx, rawSVG, callback) {
						var svg = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"}),
							domURL = self.URL || self.webkitURL || self,
							url = domURL.createObjectURL(svg),
							img = new Image;

						img.onload = function () {
							ctx.drawImage(this, 0, 0);
							domURL.revokeObjectURL(url);
							callback(this);
						};
						img.src = url;						
					}
					
					
					//trata a div filha do container caso seja formato e-mail
					if(formato != "html" || formato == "email")
						drawInlineSVG(ctxt, svgText, function() {
							$("#dori").attr("src",canvas.toDataURL());	
							//insere uma imagem depois do grafico
						    var imagem = "<img class='sgv-canvas-img' src="+ canvas.toDataURL() +" >";
							$(imagem).insertBefore($(container).parents(".container"));
							//usado remove para diminuir tamanho do html
							$(imagem).find(".container").remove();
							$(container).parents(".container").remove();
						});		
										
                }
              },
              zoomType: 'xy'
          },
          title: {
              text: 'Load Average XXXXXXXxx'
          },
          subtitle: {
              text: 'Host: XXXXXXXXXxx'
          },
          xAxis: [{
              categories: [],
              crosshair: true
          }],
          tooltip: {
              shared: true
          },
          legend: {
              layout: 'vertical',
              align: 'left',
              verticalAlign: 'top',
              y: 100,
              //floating: true,
              backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
          },
          series: []
      };

  Highcharts.setOptions(options);

  function getAjaxData(url, parametros,custom_json,callback) {
          $.getJSON(url, parametros, function(json) {
              //garante que retornou informacao		  
			  //console.log(json);
			  
              if(json.length>1){
                  var categorias = json[0]['data'];
				  if(categorias == undefined || categorias == null){
					  //console.log("id="+custom_json.chart.renderTo);
					  //console.log($('#'+custom_json.chart.renderTo).parents(".card"));
					  var card_pai = $('#'+custom_json.chart.renderTo).parents(".card");
					  //$(card_pai).find(".comentario").get(0).textContent = "dsadasdas";
					  //console.log(noeventscomment);
					  //console.log(eventscommet);					  
					  var element_comentario = $(card_pai).find(".comentario");
					  //console.log($(card_pai).find(".comentario").text());
					  //console.log($(card_pai).find(".comentario").get(0).firstChild.firstChild.data);
					  var card_espaco = card_pai.prev();
					  card_pai.remove();
					  card_espaco.remove();
					  /**
					  Precisa encontrar uma maneira de remover o botão final quando for HTML e deixar quando for EMAIl
					  **/
					  
					  //console.log($('.card').find('#'+custom_json.chart.renderTo));
					  //$('#container').find('h1')
						//$('#'+custom_json.chart.renderTo).hide();
						
				  }else{	
					  //apenas plota os graficos que voltaram alguma informacao		
					  var card_pai = $('#'+custom_json.chart.renderTo).parents(".card");
					  var element_comentario = $(card_pai).find(".comentario");					  
						  
					   custom_json.xAxis[0].categories = categorias;
					   //console.log(custom_json.xAxis[0].categories);
					  //console.log(categorias);
					  //aqui tenta jogar todos os array-X				  
					  for(var i=1; i< 3; i++){
						  custom_json.series[i-1] = json[i];
					  }
					  
					  //aqui pode disparar varios erros na hora de plotar.
					  chart = new Highcharts.Chart(custom_json);
					  
					  chart.xAxis[0].setCategories(categorias);
					  //console.log(chart.xAxis[0]);
					  callback(3,element_comentario);
				  }
			  }              
          });
      };


	  
	  
	  

  //cria cada gráfico
  $(".container").each(function() {
      //var url = "../../back/single_ajax.php";
	  var url = "http://c3283faaea.undercloud.net/doriclaudino/teste/single_ajax.php";
      var hostid = $(this).attr("hostid");
      //var hostid = $.urlParam("hostid");
	  var report_timesince = $.urlParam("report_timesince");
      var report_timetill = $.urlParam("report_timetill");
      var _key = $(this).attr("_key");
      var limit = $(this).attr("limit");
      var id = $(this).attr("id");
      var title = $(this).attr("title");
      var subtitle = $(this).attr("subtitle");
	  var noeventscomment = $(this).attr("noEventsComment");
	  var eventscomment = $(this).attr("EventsComment");
	  //console.log(noeventscomment);
	  //console.log(eventscommet);
	  
	  //hora passada em YYYYmmDDhhMMss
	  var varData = new Date();
	  
	  //primeiro dia, três meses para trás
	  var primeiroDia = new Date(varData.getFullYear(), varData.getMonth()-3, 1);
	  
	  //ultimo dia do mês anterior, levando em consideração que o script será gerado no proximo mês.
	  var ultimoDia = new Date(varData.getFullYear(), varData.getMonth(), 0,23,59,59);
	  
	  //passa as variaveis de dia para o SQL (para nao ser estatico na query)
	  report_timesince = convertZabbixHour(primeiroDia);
	  report_timetill = convertZabbixHour(ultimoDia);
	  

      var parametros = {hostid:hostid,
                        report_timesince:report_timesince,
                        report_timetill:report_timetill,
                        _key:_key,
                        limit:limit};

      var custom = {
          chart: {
              renderTo : id
          },
          title: {
              text: '' + title
          },
          xAxis: [{
              categories: [],
              crosshair: true,
			  labels: {
                step: 1,
				rotation: 45,
            }
          }],
          subtitle: {
              text: '' + subtitle
          },
          series: []
      };

      getAjaxData(url,parametros,custom, function(eventos,element){
		//trata quantidade de eventos no callback, alterando os comentários.
		//console.log(eventscomment.replace("count()", eventos));
		console.log(element);
		if(element){			
			if(eventos>0){			
				//console.log(">0");
				$(element).get(0).textContent = eventscomment.replace("count()", eventos);
				//$(element).get(0).html();
				//$(element).text(eventscomment.replace("Count()", eventos));
			}else{
				//console.log("else");
				$(element).get(0).textContent = noeventscomment;
				//$(element).text(noeventscomment);
			}
		}		
	  });
	  
	  finished=true;
	  
	  //remove os containers para diminuir o tamanho
	  $(".highcharts-container").remove();
	  $("svg").remove();
  }); 	  
});
