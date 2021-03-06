function DataLoader() {
	
	var that = this;

	/**
	 * Load text file
	 */
	 $("#speed_chart").text("Please wait... data are being loaded. This may take a while.");
	
	this.loadPosData = function(file) {

			var pts = [];
			var month = [];
			var year = [];
			var days = [];
			var hours = [];
			var date = [];
			var sev = [];
			var road_type = [];
			var speed_limit = [];
			
			
			var weekday = new Array(7);
			weekday[0]=  "Po";
			weekday[1] = "Út";
			weekday[2] = "St";
			weekday[3] = "Čt";
			weekday[4] = "Pá";
			weekday[5] = "So";
			weekday[6] = "Ne";
			//var weekarray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
			
			var monthname = new Array(12);
			monthname[0]= "Led";
			monthname[1]= "Úno";
			monthname[2]= "Bře";
			monthname[3]= "Dub";
			monthname[4]= "Kvě";
			monthname[5]= "Čvn";
			monthname[6]= "Čvc";
			monthname[7]= "Srp";
			monthname[8]= "Zář";
			monthname[9]= "Říj";
			monthname[10]= "Lis";
			monthname[11]= "Pro";
			
			var yearnum = new Array(3);
			yearnum[0]= "2011";
			yearnum[1]= "2012";
			yearnum[2]= "2013";
	
			var sevEnum = new Array(6);
			sevEnum[0] = "neuvedeno";
			sevEnum[1] = "do 250000";
			sevEnum[2] = "do 500000";
			sevEnum[3] = "do 750000";
			sevEnum[4] = "do 1000000";
			sevEnum[5] = "nad 1000000";

			var rtEnum = new Array();
			rtEnum[1] = "Roundabout";
			rtEnum[2] = "One way street";
			rtEnum[3] = "Dual carriageway";
			rtEnum[6] = "Single carriageway";
			rtEnum[7] = "Slip road";
			rtEnum[9] = "Unknown";
			rtEnum[12] = "One way street/Slip road";
			rtEnum[-1] = "Data missing or out of range";
			
			rtDom = new Array();
			var i = 0;
			for(var key in rtEnum) {
 			   rtDom[i] = rtEnum[key];
 			   i++;
			}
			rtDom[8] = "No data";
				
		var j = 0;				
		
		d3.csv(file, function(error, data) {
		
		var dateminmax ;

			data.forEach(function(val, i) {
							
				pts[j++] = parseFloat(val.x);
				pts[j++] = parseFloat(val.y);
								
				//var d =  (new Date(val.timestamp*1000));
				//
				//index[i] = rasterer.calc(i);	

				//days[i] =  weekday[d.getDay()]; //d.getDay();		
				days[i] = weekday[val.days]; 
				
				month[i] = monthname[val.months];
				// console.log(val.months)
				year[i] = yearnum[val.years];
				
				//hours[i] = d.getHours() + d.getMinutes()/60;		
				hours[i] = val.hours;
				//date[i] = Math.round(d.getTime()/(1000*60*60));						
				//dateminmax = getMinMax(date[i], dateminmax);
				
				sev[i] = sevEnum[val.sev];
				//road_type[i] = rtEnum[val.road_type];
				//speed_limit[i] = val.speed_limit;
							
				if (typeof(days[i]) == 'undefined' || typeof(hours[i]) == 'undefined')  {
					console.error('error id data');
				}
			
			});
			//console.log(montharray)
			
			visualize({pts: pts, 
				month: month,
				year: year,
				days: days, 
				hours: hours, 
				sev: sev, 
				road_type: road_type, 
				speed_limit: speed_limit,
				date: date, 
				dmm : dateminmax , 
				num : data.length,
				daysarray: weekday,
				montharray: monthname,
				yeararray: yearnum,
				sevEnum: sevEnum,
				yearnum: yearnum,
				rtDom: rtDom});
			});
	}
	
	
	function getMinMax(val, minmax){
		if (typeof(minmax)=='undefined'){
			minmax = [];
			minmax.min = Number.MAX_VALUE;
			minmax.max = Number.MIN_VALUE;
		}
		if (val < minmax.min) {minmax.min = val};
		if (val > minmax.max) {minmax.max = val};
		return minmax;
		
	}
	
}
