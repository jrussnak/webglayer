<script id="map_interpolation_vShader" type="x-shader/x-vertex">
      attribute vec4 wPoint;
      attribute float attr;
      attribute vec2 index;
      
      uniform mat4 mapMatrix;
      uniform mat4 rasterMatrix;
      uniform float zoom;
 	  uniform float drawselect;   
       
      uniform sampler2D filter;

      varying vec4 col;
     
       
      void main() {
		
  	  	
  		float p_size = zoom*10. ;
  	    	   
  		vec4 p =  mapMatrix * wPoint;
  		float n_speed = ( attr+1.)/2.;
  		
  		vec4 rp = rasterMatrix * vec4(index[0],index[1],0.,1.);
  		vec4 fdata = texture2D(filter, vec2(rp[0],rp[1]));  		
  		
  		// if data are selected  
  		if (fdata[0]>0. && drawselect>0.5){
  			p_size = p_size +3.;
  			col = vec4(1.- n_speed, n_speed, 0.0, 0.8); 
  			gl_Position = p;    	
		gl_PointSize = p_size;
  			
  		} else if (drawselect<0.5) {  	
  		   // If not selected then use blue color	   
  		   //p_size = p_size-3.;
  		   col = vec4(1.- n_speed, n_speed, 0.0, 0.03);
  		   //col = vec4(0.482, 0.408, 0.533, 0.95); 	
  		   //p_size = 4.;
  		  // col = vec4(0.0,0.,0.,0.75);
  		 	gl_Position = p;    	
			gl_PointSize = 500.;
  		} else {
  			gl_Position = vec4(-2.,-2.,0.,0.);    	
			gl_PointSize = 0.;
  		}
  		gl_PointSize = 256.;

          col = vec4(n_speed/10., n_speed, 0.0, 0.);

 		
      }
    </script>
    
    <script id="map_interpolation_fShader" type="x-shader/x-fragment">
      precision mediump float;  
 	
    
	  varying vec4 col;
 

   		float length(vec2 a, vec2 b){
        	return sqrt(pow((a[0]-b[0]),2.)+pow((a[1]-b[1]),2.));
      	}
      
      void main() {

      float dist = length(gl_PointCoord.xy, vec2(0.5,0.5));

	  float alpha = (dist> .5 && col[1] >0.) ? 0. : 1. ;
	  float w = 1. / (dist*2.*dist*2.);
      gl_FragColor = vec4(col[0]*w, w ,0.,1.)*alpha; 
       
      }
      
   
    </script>