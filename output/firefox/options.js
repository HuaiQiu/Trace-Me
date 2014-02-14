
KangoAPI.onReady(function() 
{
	$('#options').ready(function() {
		init_form ()  
		});
    //event ADD
	$('#ADD').on("click", function() { 
    createElement ("");
 });
	
	$("#options").on('submit', function(event) {
		var Activities= [];
		$.each($(this).serializeArray(), function(_, kv) {
			if (kv.name == "Trace_Name") 
				{
				Activities.push(kv.value);
				kango.storage.setItem("trace_options_"+kv.name, JSON.stringify(Activities));
				}
			else 
       
		kango.storage.setItem("trace_options_"+kv.name, kv.value);
		});
   
     });
	// form configuration
     var eventObj= ["click","dblclick","Focus","keydown","keypress","mouseover","Load","keyup","change","mouseup"];	
	var index=0;
	var ADDB = "False";
// event load 
	$ ("#Load").on('click', function() {
		var iframe = document.getElementsByTagName("iframe");
		URL = document.getElementById("URL").value;
		kango.storage.setItem("DATA", "True");  
		window.open(URL,"nom_popup","menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=400");
	});
	
	$ ("#URL").on('keypress', function(e) {
	     if (e.keyCode==13){
		var iframe = document.getElementsByTagName("iframe");
		URL = document.getElementById("URL").value;
		kango.storage.setItem("DATA", "True");  
		window.open(URL,"nom_popup","menubar=no, status=no, scrollbars=no, menubar=no, width=400, height=400");
		e.preventDefault();
		}
	});
	
	kango.addMessageListener('Data', function(event) { 
	    
        $('iframe').contents().find('head').html(event.data.header);
		$('iframe').contents().find('body').html(event.data.body);
		kango.console.log ("data for iframe recived ");
	});
	/*$("iframe").on("load",function() {
	
	$("iframe").contents().find("a").click(function(e){
	e.preventDefault();
	});
	
	
	})*/
	
	$("iframe").contents().find("body").on ('click', function(e) {
	
	//document.getElementById("SelectorT").value= $(e.target).getPath() ; 
	document.getElementById("SelectorT").value= getPath($(e.target)) ;    
	e.preventDefault();
		
	});
// event ADD 
    $ ("#ADDEvent").on ('click', function()	{
        // Event div
            var eventdiv = document.createElement("div");
            eventdiv.setAttribute ("Id",index);
            var div = document.createElement("div");
            div.setAttribute ('class','input-group');
            var label = document.createElement("label");
            label.setAttribute('for','Event Type');
            label.setAttribute('class','control-label input-group-addon');
            label.appendChild(document.createTextNode("Event Type"));
            var select = document.createElement("select");
            select.setAttribute('class','form-control');
            select.setAttribute('Id','eventType');
            for (var j=0; j< eventObj.length; j++)
            {
            select.options[select.options.length] = new Option(eventObj[j],eventObj[j]);
            }
            div.appendChild(label);
            div.appendChild(select);
        // Selector div 
            var div1 = document.createElement("div");
            div1.setAttribute ('class','input-group');
            div1.setAttribute ('Id','Element');
            var label1 = document.createElement("label");
            label1.setAttribute('for','Selector');
            label1.setAttribute('class','control-label input-group-addon');
            label1.appendChild(document.createTextNode("Selector"));
            div1.appendChild(label1);
            var divC = document.createElement("input");
            divC.setAttribute ('id','selector');
			divC.setAttribute ('type','text');
			divC.setAttribute ('class','form-control');
            div1.appendChild(divC);
		// obsel type div
		    var div2 = document.createElement("div");
            div2.setAttribute ('class','input-group');
            div2.setAttribute ('Id','Type');
            var label2 = document.createElement("label");
            label2.setAttribute('for','TypeO');
            label2.setAttribute('class','control-label input-group-addon');
            label2.appendChild(document.createTextNode("Type Obsel"));
            div2.appendChild(label2);
            var divO = document.createElement("input");
            divO.setAttribute ('id','TypeO');
			divO.setAttribute ('type','text');
			divO.setAttribute ('class','form-control');
            div2.appendChild(divO);
            
			//
			eventdiv.appendChild(div);
            eventdiv.appendChild(div1);
			eventdiv.appendChild(div2);
			
            document.getElementById("EventList").appendChild(eventdiv);
            index++;
});
// event Save  Config
    $("#Save").on("click", function() {
        var  URL = document.getElementById("URL").value;
        var eventArray= [];
        // parcourir all event $
        for (var i=0 ; i< index ; i++ )
        {
            var eventType = document.getElementById(i).getElementsByTagName("select")[0].value;
            var SelectorArray=[];
            // selector
            var SelectorObj={"frame":"", "Selector":$("#"+i+" #Element #selector").val()};
            SelectorArray.push(SelectorObj);
            var eventObj ={type:eventType,typeObsel:$("#"+i+" #TypeO").val(),selectors:SelectorArray};
           eventArray.push (eventObj);
       }
       
// host or URL
if ($('#URLCK').prop('checked')) 
{
var Page = {URL: URL , HostName: "", event:eventArray };
}

if ($('#Hostname').prop('checked')) 
{
hostname = getHostname (URL)
var Page = {URL:"" , HostName: hostname, event:eventArray };
}

      
	  if (kango.storage.getItem("Config") != undefined  ) 
      {
       var PageArray = kango.storage.getItem("Config").Page;
      }
    else
     {      
   // kango.storage.setItem("Config",JSON.stringify ( {"Page":[{"URL":"www.youtube.com","event":[{"type":"click","element":[{"tag":"BUTTON","attribut":[]},{"tag":"A","attribut":[]}]}]},{"URL":"www.google.fr","event":[{"type":"click","element":[{"tag":"SPAN","attribut":[]},{"tag":"A","attribut":[]},{"tag":"IMG","attribut":[]}]},{"type":"change","element":[{"tag":"INPUT","attribut":[]}]}]}]}));
   //var PageArray = JSON.parse(kango.storage.getItem("Config")).Page;
	PageArray=[];
     }
    PageArray.push(Page);
	
    Config = {Page:PageArray};
    kango.storage.setItem("Config",Config);
	window.location.reload();
})
// all function called 
 function init_form (){
    $("#options *[name='first_name']").val(kango.storage.getItem("trace_options_first_name"));
    $("#options *[name='last_name']").val(kango.storage.getItem("trace_options_last_name"));
    $("#options *[name='email']").val(kango.storage.getItem("trace_options_email"));
    $("#options *[name='Base_URI']").val(kango.storage.getItem("trace_options_Base_URI"));
   $("#options *[name='Model_URI']").val(kango.storage.getItem("trace_options_Model_URI"));
   if  (kango.storage.getItem("trace_options_Trace_Name") != undefined)
	{
		var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
		for (i=0;i<Activities.length;i++)
		{ 
			if (i==0) {$("#options *[name='Trace_Name']").val(Activities[i]);}
		else {createElement (Activities[i]); }
    
		}
	}
}

function createElement (val) { 
    var obt = document.getElementById('Activities'); 
    var label = document.createElement("label");
    label.setAttribute('for','Trace_Name');
    label.setAttribute('class','control-label input-group-addon');
    var input = document.createElement("input");
    input.setAttribute('name','Trace_Name');
    input.setAttribute('type','text');
    input.setAttribute('class','form-control');
    input.setAttribute ('value',val);
	var obt = document.getElementById('Activities');
    obt.appendChild(label);
    obt.appendChild(input);
		}
//jQuery.fn.extend({
	function getPath ( e,path ) {
		// The first time this function is called, path won't be defined.
		if ( typeof path == 'undefined' ) path = '';

		// If this element is <html> we've reached the end of the path.
		if ( e.is('html') )
			return 'html' + path;

		// Add the element name.
		var cur = e.get(0).nodeName.toLowerCase();

		// Determine the IDs and path.
		var id    = e.attr('id');
		 var   classe = e.attr('class');


		// Add the #id if there is one.
		if ( typeof id != 'undefined' )
			cur += '#' + id;

		// Add any classes.
		if ( typeof classe != 'undefined' )
			cur += '.' + classe.split(/[\s\n]+/).join('.');

		// Recurse up the DOM.
		kango.console.log (e);
		return getPath( e.parent(),' > ' + cur + path );
	}
//});

function  getHostname (href) 
{
    var l = document.createElement("a");
    l.href = href;
    hostname = l.hostname ;
    return hostname;
};


    
});








