Mutils={};

Mutils.colourList=["AliceBlue",
  
"Aqua", 	
"Aquamarine",
"Blue", 
"BlueViolet",  
"Brown", 
"BurlyWood", 
"CadetBlue", 
"Chartreuse", 		 
"Chocolate", 	
"Coral", 	 
"CornflowerBlue", 
"Crimson" 
,"Cyan"
,"DarkBlue"
,"DarkCyan"
,"DarkGoldenRod"	
,"DarkGray"
,"DarkGreen"
,"DarkKhaki"
,"DarkMagenta"
,"DarkOliveGreen"
,"DarkOrange"
,"DarkOrchid"
,"DarkRed"
,"DarkSalmon"
,"DarkSeaGreen"
,"DarkSlateBlue"
,"DarkSlateGray"
,"DarkTurquoise"
,"DarkViolet"
,"DeepPink"
,"DeepSkyBlue"
,"DimGray"
,"DodgerBlue",
"FireBrick",
"Magenta",
,"Maroon"
,"MediumAquaMarine"
,"MediumBlue"
,"MediumOrchid"
,"MediumPurple"
,"MediumSeaGreen"
,"MediumSlateBlue"
,"MediumSpringGreen"
,"MediumTurquoise"
,"MediumVioletRed"
,"Olive"
,"OliveDrab"
,"Orange"
,"OrangeRed"
,"Orchid"
,"Purple"
,"Red"
,"RosyBrown"
,"RoyalBlue"
,"SaddleBrown"
,"Salmon"
,"SandyBrown"
,"SeaGreen"
,"Tomato"
,"Turquoise"
,"Violet"
,"Yellow"
,"YellowGreen"

];






Mutils.rondomColor=function (id) {
    let length= Mutils.colourList.length;
    return Mutils.colourList[id % length];
}

Mutils.rondomPosition=function (id) {


    return Mutils.colourList[id % length];
}
