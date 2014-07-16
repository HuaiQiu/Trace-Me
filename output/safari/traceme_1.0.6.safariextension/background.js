


var trc;
var language = window.navigator.userLanguage || window.navigator.language;
kango.storage.setItem("LangChange",language.toUpperCase());
if ((kango.storage.getItem("Etat") == "Desactiver"))
{kango.ui.browserButton.setIcon('icons/traceMe1.png');}
kango.addMessageListener('Pret', function(event) 
{
  if (kango.storage.getItem("DATA")=="True") 
    {
	kango.browser.tabs.getCurrent(function(tab) 
	{
	kango.console.log ("get data back");
	tab.dispatchMessage('GetDataD');
	
	}); 
	kango.storage.setItem ("DATA","false");

    }  			
				
});
kango.addMessageListener('GetEtat', function(event) {

	kango.browser.tabs.getCurrent(function(tab) {
	if (kango.storage.getItem("Etat") == undefined) 
	{kango.storage.setItem("Etat","Activer");	  }
    tab.dispatchMessage('Etat', kango.storage.getItem("Etat") );
    kango.console.log ("send Etat");
});
});
kango.addMessageListener('OpenedAssist', function(event) {
 kango.console.log("here");
 kango.storage.setItem("OpenedAssist",false)
kango.browser.windows.getAll(function (win){
    for (var i=0;i<win.length; i++)
    {
        win[i].getCurrentTab(function (tab)
                        { 
                 
                  if(tab.getTitle() == "visualisation")
                    {kango.storage.setItem("OpenedAssist",true);}
                
                        })
    }
    kango.console.log (kango.storage.getItem("OpenedAssist"));
})

kango.browser.tabs.getCurrent(function(tab) {
var data = kango.storage.getItem("OpenedAssist") ; 
    tab.dispatchMessage('SendOpenedAssist', data );
    })
});
kango.addMessageListener('GetConfg', function(event) {
    kango.console.log ("get message config")
	kango.browser.tabs.getCurrent(function(tab) {
	if  (kango.storage.getItem("Config") == undefined)
				{
	kango.storage.setItem("Config",kango.i18n.getMessage('CalcoConfig'));
				}  
	var data = kango.storage.getItem("Config") ; 
    tab.dispatchMessage('confg', data );
    kango.console.log ("send Data",data);
});
});
 
kango.addMessageListener('notification', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var TraceActive = kango.storage.getItem("Trace_Active")
	//set notifications

if (kango.storage.getItem("LangChange") == "FR")
{ kango.storage.setItem("notification", "Pas Activité");
  kango.storage.setItem("TraceStart", "Début de tracage de votre activité.");}
else if (kango.storage.getItem("LangChange") == "EN")
{ 	kango.storage.setItem("notification", "No activity");
    kango.storage.setItem("TraceStart", "Tracing of your activities has started."); }
else if (kango.storage.getItem("LangChange") == "DE")
{ 	kango.storage.setItem("notification", "Keine Aktivität");
    kango.storage.setItem("TraceStart", "Die Aufspürung deiner Aktivitäten hat begonnen."); } 
	
	if ((TraceActive == " ")|| (TraceActive == undefined))
	{
	console.log (kango.storage.getItem("notification"));
	var notification = kango.ui.notifications.createNotification('Trace Me',kango.storage.getItem("notification"),urlImg);
    notification.show();
	
    }
    else 
    {
    var notification = kango.ui.notifications.createNotification('Trace Me',kango.storage.getItem("Trace_Active"),urlImg);
    notification.show();
    }
    
     
});
});
kango.addMessageListener('notificationD', function(event) {
    kango.browser.tabs.getCurrent(function(tab) {
	var urlImg = kango.io.getResourceUrl ("icons/traceMe.png");
	var notification = kango.ui.notifications.createNotification('Trace Me', kango.storage.getItem("TraceStart")+kango.storage.getItem("Trace_Active"),urlImg);
    notification.show();
     
});
});

kango.addMessageListener('obsel', function(event) {
if ( init_trc () )
{
 var OBSEL = event.data;
// send obsel to ktbs
    trc.put_obsels({
		 obsel: OBSEL,
		 success: function(){console.log("success is callbacked");},
		 error: function(jqXHR,textStatus, errorThrown){console.log("error is callbacked.");}
	                       });
	    if 	(event.data.hasType=="Deconnection")
	    {kango.storage.setItem("Trace_Active"," ");}
	   }
	  else 
	  {kango.console.log ("error");}
	
});

kango.addMessageListener('TraceInfo', function(event) {
var TraceInfo = event.data;
kango.storage.setItem("Trace_Active",TraceInfo.TraceName);
kango.storage.setItem("trace_options_Base_URI",TraceInfo.BaseURI);
kango.storage.setItem("trace_options_Model_URI",TraceInfo.ModelURI);

if (kango.storage.getItem("trace_options_Trace_Name") == undefined )
{var Activities = [];Activities.push (TraceInfo.TraceName);}
else
{var Activities = JSON.parse(kango.storage.getItem("trace_options_Trace_Name"));
            if (! existe( Activities,TraceInfo.TraceName) )
            {
                Activities.push (TraceInfo.TraceName);
               
            }
        }
    kango.storage.setItem("trace_options_Trace_Name",JSON.stringify(Activities));
    kango.console.log ("Ac"+JSON.stringify(Activities));
  var init = init_trc ();
			});


kango.addMessageListener('popup', function(event) 
{
var ini = init_trc ();
});				   
						   
function init_trc ()
{
    var Trace_Name = kango.storage.getItem("Trace_Active");
    var BASE_URI = kango.storage.getItem("trace_options_Base_URI") ;
    var Model = kango.storage.getItem("trace_options_Model_URI");
    if ((Trace_Name =="")||(BASE_URI == "")|| (BASE_URI == undefined ))
    { return false}
    else
   { var mgr = new tService.TraceManager({base_uri: BASE_URI , async: true}); 
    trc = mgr.init_trace({name: Trace_Name, modelURI:Model }); 
    return true;
    }
    
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
