

var trc;

kango.addMessageListener('GetEtat', function(event) {

	kango.browser.tabs.getCurrent(function(tab) {
	if (kango.storage.getItem("Etat") == undefined) 
	{kango.storage.setItem("Etat","Activer");}
    tab.dispatchMessage('Etat', kango.storage.getItem("Etat") );
});
});

kango.addMessageListener('GetConfg', function(event) {
	kango.browser.tabs.getCurrent(function(tab) {
	if  (kango.storage.getItem("Config") == undefined)
				{
				kango.storage.setItem("Config",JSON.stringify ( {"Page":[{"URL":"www.youtube.com","event":[{"type":"click","element":[{"tag":"BUTTON","attribut":[]},{"tag":"A","attribut":[]}]}]},{"URL":"www.google.fr","event":[{"type":"click","element":[{"tag":"SPAN","attribut":[]},{"tag":"A","attribut":[]},{"tag":"IMG","attribut":[]}]},{"type":"change","element":[{"tag":"INPUT","attribut":[]}]}]}]}));
				}  
			var data = JSON.parse(kango.storage.getItem("Config")) ; 
    tab.dispatchMessage('confg', data );
});
});




kango.addMessageListener('obsel', function(event) {
init_trc ();
 var OBSEL = event.data;
// send obsel to ktbs
    trc.put_obsels({
		 obsel: OBSEL,
		 success: function(){console.log("success is callbacked");},
		 error: function(jqXHR,textStatus, errorThrown){console.log("error is callbacked.");}
	                       });	
	
});
kango.addMessageListener('TraceInfo', function(event) {
var TraceInfo = event.data;
kango.storage.setItem("Trace_Active",TraceInfo.TraceName);
kango.storage.setItem("trace_options_Base_URI",TraceInfo.BaseURI);
kango.storage.setItem("trace_options_Model_URI",TraceInfo.ModelURI);
var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
            if (! existe( Activities,TraceInfo.TraceName) )
            {
                Activities.push (TraceInfo.TraceName);
                kango.storage.setItem("trace_options_Trace_Name",JSON.stringify(Activities));
            }
            init_trc ();
			});


kango.addMessageListener('popup', function(event) {

init_trc ();
						   
		});				   
						   
function init_trc ()
{
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
    var Model = kango.storage.getItem("trace_options_Model_URI");
    var mgr = new tService.TraceManager({base_uri: BASE_URI , async: true}); 
    trc = mgr.init_trace({name: Trace_Name	}); 
}

function existe (array, element)
{
    var i = array.length;
    while (i--)
    {
        if (array[i]==element)
        {
          return true;
        }
    }

  return false ;

}



/*function onRequest(request, sender, sendResponse) 
{
// recive mess

    if (request.mess=="Etat")
	{
	if (localStorage["Etat"] == undefined) 
	{localStorage["Etat"] = "Activer";}
	sendResponse({status: localStorage["Etat"]});
	}
	else
		if (request.mess=="confg")
			{   
				if  (localStorage["Config"] == undefined)
				{
				localStorage["Config"] = JSON.stringify ( {"Page":[{"URL":"www.youtube.com","event":[{"type":"click","element":[{"tag":"BUTTON","attribut":[]},{"tag":"A","attribut":[]}]}]},{"URL":"www.google.fr","event":[{"type":"click","element":[{"tag":"SPAN","attribut":[]},{"tag":"A","attribut":[]},{"tag":"IMG","attribut":[]}]},{"type":"change","element":[{"tag":"INPUT","attribut":[]}]}]}]});
				}  
			var data = JSON.parse(localStorage["Config"]) ; 
			sendResponse({status: data});
            }
		else 

        if (request.mess=="TraceInfo")
         {
            localStorage["Trace_Active"] = request.TraceInfo.TraceName;
            localStorage["trace_options_Base_URI"] = request.TraceInfo.BaseURI;
            localStorage["trace_options_Model_URI"] = request.TraceInfo.ModelURI;
            var Activities = JSON.parse(localStorage["trace_options_Trace_Name"]);
            if (! existe( Activities,request.TraceInfo.TraceName) )
            {
                Activities.push (request.TraceInfo.TraceName);
                localStorage["trace_options_Trace_Name"]=JSON.stringify(Activities);
            }
            init_trc ();
        }
        else
            if (request.mess=="popup") 
            {      
            init_trc ();
           
            
            }
            else 
            if (request.mess=="Assis")
            {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            console.log(response.farewell);
                       });
                                      });
            }
            else
            {
            init_trc ();
            var OBSEL = request.OBSEL;
            // send obsel to ktbs
            trc.put_obsels({
		                    obsel: OBSEL,
		                    success: function(){console.log("success is callbacked");},
		                    error: function(jqXHR,textStatus, errorThrown){console.log("error is callbacked.");}
	                       });	
  
            }
  // Return nothing to let the connection be cleaned up.
  //sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
*/