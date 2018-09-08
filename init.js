var heatmap;
	
var defaultPCValue = 40;
	
var datasets = {
	'1': {
		path: 'brno_dn',
		about: 'Tato mapa prezentuje 530 dopravních nehod z let 2011 až 2013. Jedná se o vybrané dopravní nehody s podezřením na spáchání trestného činu (alkohol, zranění, vyšší škoda).',
		name: 'DOPRAVNÍ NEHODY'
	},
	'2': {
		path: 'brno_kradeze_aut',
		about: 'Tato mapa prezentuje 905 krádeží dvoustopých vozidel z let 2011 až 2013.',
		name: 'KRÁDEŽE DVOUSTOPÝCH VOZIDEL'
	},
	'3': {
		path: 'brno_lp',
		about: 'Tato mapa prezentuje 832 loupežných přepadení z let 2011 až 2013 spáchaných ve veřejném prostoru Brna.',
		name: 'LOUPEŽNÁ PŘEPADENÍ'
	},
	'4': {
		path: 'brno_znasilneni',
		about: 'Tato mapa prezentuje 96 znásilnění z let 2011 až 2013 spáchaných ve veřejném prostoru Brna.',
		name: 'ZNÁSILNĚNÍ'
	}
}

function hidePanels() {
	$('#minch5').click();	
	$('#minch4').click();	
	$('#minch1').click();	
	$('#minch2').click();	
}

function init() { 
	loadDataset('1')
	$('#dataset-selector').change(function () {
		var newId = $('#dataset-selector input:checked').val();
		loadDataset(newId);
	})
	
}

function loadDataset(dsId) {

	var dataset = datasets[dsId];
	var pcup = $('#butPC').hasClass('fa-chevron-up');

	$('.vis-div').remove();
	$('.btn-minimize').next().remove();
	$('.btn-minimize').remove();
	$('.olMap').children().remove();
	$('#webglayer').remove();

	$('#slider_pc').val(defaultPCValue);
	$('#points_visible').prop('checked', true);
	$('#heatmap_visible').prop('checked', true);
	
  initMap();
	$('#dataset-about-content').text(dataset.about);
	$('#dataset-name').html(dataset.name);

	$('#map').append('<div id="wgl">Visualization made by <a href="http://webglayer.org/"> WebGLayer </a></div>')
	
	var data = new DataLoader();
	data.loadPosData('./data/' + dataset.path + '.csv');
		
	setTimeout(function() {
		hidePanels();
		
		var l = WGL.getDimension("pc_chart");
		if (l && pcup) {
			console.log('SETTING UP')
			l.setVisible(false);
			$('#butPC').removeClass("fa-chevron-down");  
			$('#butPC').addClass("fa-chevron-up");
		}
	}, 500);

	
}

var togglePC = function() {
	// $("#pc").slideToggle();
	var l = WGL.getDimension("pc_chart");
	
	var resize =  function(){	
			WGL.getManager().updateMapSize();
			WGL.mcontroller.resize();	
			WGL.mcontroller.zoommove(map.getZoom(), getTopLeftTC());
			WGL.render();
	}
	
	console.log(l);

	if (l.visible){
		console.log('hiding');
		l.setVisible(false);
		$('#map').animate({ 'margin-bottom': '1.5em'}, {done: resize})			
		$('#pc').animate({ 'height': '1.5em'}, {done: resize})	
										
		$('#butPC').removeClass("fa-chevron-down");  
		$('#butPC').addClass("fa-chevron-up");
		setTimeout( function() { map.updateSize();}, 10);
	} else {
		console.log('showing');
		l.setVisible(true);
		$('#map').animate({ 'margin-bottom': '18.5em'}, {done: resize})		
		$('#pc').animate({ 'height': '18.5em'}, {done: resize})	
		$('#butPC').removeClass("fa-chevron-up");  
		$('#butPC').addClass("fa-chevron-down");
		setTimeout( function() { map.updateSize();}, 200);
	}
}


function visualize(data){	

		//wgl = new WGL(data.num,'http://localhost:9999/js/webglayer/','map');	
		WGL.init(data.num,'../../','map');	
		window.onresize = function(){
			WGL.resize();
		}
		
		map.events.register("move", map, onMove);							

		var controlHM = new WGL.ChartDiv("right","chm","Nastavení heatmapy");
		heatmap = WGL.addHeatMapDimension(data.pts, 'heatmap');

		heatmap.radiusFunction = function(r, z){			
			var res = r/20000 * Math.pow(2,z);
			//console.log(res);
			var gpsize = map.getGeodesicPixelSize();
			var pixelsize = (gpsize.h+gpsize.w)/2;
			return  res ;
		};

		heatmap.setRadius(50);

		var mapdim = WGL.addMapDimension(data.pts, 'themap');
	
		WGL.addPolyBrushFilter('themap','polybrush');
		
		addHeatMapControl(heatmap,'chm');

		WGL.addExtentFilter();
	
		var charts = [];
		var year = {data: data.year,  domain: data.yeararray, min:0, max: 2, num_bins: 3, name: 'year', type:'ordinal', label: "rok"};
		var chd5 = new WGL.ChartDiv("right", "ch5", "Rok");
		chd5.setDim(WGL.addOrdinalHistDimension(year));
		WGL.addLinearFilter(year,3, 'yearF');		
		charts['year'] = new  WGL.ui.StackedBarChart(year, "ch5", "rok", 'yearF');
		
		/* MONTHS*/
		//var days = {data: data.dayes,  min:0, max: 7, num_bins: 7,  name: 'dayes'};	
		var month = {data: data.month,  domain: data.montharray, min:0, max: 11, num_bins: 12, name: 'month', type:'ordinal', label: "měsíc"};

		var chd4 = new WGL.ChartDiv("right", "ch4", "Měsíc v roce");
		//wgl.addLinearHistDimension(months);
		chd4.setDim(WGL.addOrdinalHistDimension(month));
		WGL.addLinearFilter(month,12, 'monthF');		
		charts['month'] = new  WGL.ui.StackedBarChart(month, "ch4", "měsíc v roce", 'monthF');

		/* DAYS*/
		//var days = {data: data.dayes,  min:0, max: 7, num_bins: 7,  name: 'dayes'};	
		var days = {data: data.days,  domain: data.daysarray, min:0, max: 6, num_bins: 7, name: 'days', type:'ordinal', label: "den"};
		var chd1 = new WGL.ChartDiv("right","ch1", "Den v týdnu");
		//wgl.addLinearHistDimension(dayes);
		chd1.setDim(WGL.addOrdinalHistDimension(days));
		WGL.addLinearFilter(days,7, 'daysF');		
		charts['days'] = new  WGL.ui.StackedBarChart(days, "ch1", "den v týdnu", 'daysF');
		
		/*HOURS*/
	/*	var hours = {data: data.hours, 					domain:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20', '21','22','23'], min:1, max:24, name: 'hours',type:'ordinal', label :"hour of the day"} ;
		var chd2 = new WGL.ChartDiv("right","ch2", "Hodina během dne");
		chd2.setDim(WGL.addOrdinalHistDimension(hours));		
		WGL.addLinearFilter(hours, 24*5, 'hoursF');		
		charts['hours'] = new  WGL.ui.StackedBarChart(hours, "ch2", "hour of the day", 'hoursF'); */
		
	var hours = {data: data.hours,  min:-0.01, max:23.99, num_bins: 24, name: 'hours',type:'linear', label :"hodina"} ; // pokud num_bins: 24*5, je to rozděleno pětiny
		var chd2 = new WGL.ChartDiv("right","ch2", "Hodina během dne");
		chd2.setDim(WGL.addLinearHistDimension(hours));		
		WGL.addLinearFilter(hours, 24*10, 'hoursF');		
		charts['hours'] = new  WGL.ui.StackedBarChart(hours, "ch2", "hodina během dne", 'hoursF');	
		
		var d =[];
		d[0] = year;
		d[1] = month;
		d[2] = days;
		d[3]= hours;
		//d[4] = sev;
		
		
		var pc = WGL.addParallelCoordinates('pc_chart', d);

		WGL.addMultiDim(d);
			
		/**
		 * Addin all charts
		 */		
		WGL.addCharts(charts);
		//wgl.addLegend(legend);
		
		WGL.initFilters();	

		$("#slider_pc").on("input", function(){			
			 //mapdim.render2(this.value);	
			pc.reRender(this.value);		
		});
		
		
		$("#points_visible").click(function(){
			var l = WGL.getDimension(this.name);
			l.setVisible(this.checked);					
			WGL.render();			
		});
		$("#heatmap_visible").click(function(){
			var l = WGL.getDimension(this.name);
			l.setVisible(this.checked);
			// heatmap.reRender();
			WGL.render();			
		});

		WGL.mcontroller.zoommove(map.getZoom(), getTopLeftTC());

		pc.reRender(defaultPCValue);
	}
			
	
function getTopLeftTC() {

	var tlwgs = (new OpenLayers.LonLat(-180, 90)).transform(
			new OpenLayers.Projection("EPSG:4326"),
		 	new OpenLayers.Projection("EPSG:900913"));
	
	var s = Math.pow(2, map.getZoom());
	tlpixel = map.getViewPortPxFromLonLat(tlwgs);
	res = {
			x : -tlpixel.x / s,
			y : -tlpixel.y / s
	}
	return res;
}
	
function onMove() {			
		WGL.mcontroller.zoommove(map.getZoom(), getTopLeftTC(), WGL.filterByExt);
}

function updateLabel(v){
	console.log(v);
}

function addHeatMapControl(hm,divid){
	
	$("#"+divid).append(
        "<div id="+divid+"left style='top:0em; left:0em; width:40%'></div>"+
        "<div id="+divid+"right style='top:0em; right:0em; width:60%; height:10em; position:absolute'></div>"
    );
		
	
	var thediv = $("#"+divid+"right");
	thediv.append(
	    "<div style='margin:0.5em'>"+
	        "<text>Poloměr: </text><text id='radius_label'></text>"+	 
	        "<input style='width: 50%; right:1em; position:absolute' type ='range' max='100' min='1'"+
        				"step='1' name='points' id='slider_radius' value='`50'></input>" +
        "</div>"
    );
   
    
	WGL.addColorFilter(hm.id,'colorbrush');
	var legend = new  WGL.ui.HeatMapLegend(divid + "left", 'colorbrush');
	hm.addLegend(legend);
	WGL.addLegend(legend);
	
	$("#slider_radius").on("input", function(){
        sliderValueChangeValue(this.value);
	});

	var sliderValueChangeValue = function(newValue) {
		hm.setRadius(newValue);	
		$('#radius_label').html(newValue+"m ");
		WGL.render();			
	}
	sliderValueChangeValue(50);
	
	$("#hm_max").on("input", function(){		
		hm.maxVal = this.value;		
		//heatmap.reRender();
		WGL.render();	
		legend.updateMaxAll(this.value);		
	});
	
	$("#max_checked").on("click", function(d,i){
		hm.lockScale = !this.checked;
		//$("#hm_min").val(100);			 
		document.getElementById("hm_max").disabled = this.checked; 
	}); 
}