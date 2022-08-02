/* Script JS a  completer... */
var memory = "undefined";
var edition = false;
var edition_button = document.getElementById("E");
const simple = document.querySelectorAll(".bouton_simple");
var collection = document.getElementsByClassName("bouton_classique bouton_simple");
var element = document.getElementById("zone_affichage");
var buttonLibre = document.getElementsByClassName("bouton_libre");


function rab(){
    element.value ="";     
}



function calcul(){
    
    try{
    
        var text = element.value;
        var result = text.replace("Math.", "");
        result = result.replace("PI", "pi()");
        /*
        console.log(text);
        let presence = text.search("Math.");
        var lettreM = text.search("M");
        console.log(presence);
        console.log(lettreM);
        if(precense == '0' && lettreM == '0')
        {
            
        }
        
        console.log(result);
        */
        
        var url = "calcul-serveur.php?data=" + encodeURIComponent(result);
        //console.log(url);
        ajax_get_request(maj_zone_affichage , url , true);
        
    }
    catch(err){
        alert("Synthaxe error");
    }
}

function maj_zone_affichage(res){

    element.value = res;
    

}

function affiche(elmt){
    element.value += elmt.value;
}

function init(){
    document.querySelectorAll(".bouton_simple").forEach(element => element.setAttribute('onclick', 'affiche(this)'));

    var cookies = document.querySelectorAll(".bouton_libre");
    
    //cookies.forEach(element => console.log(element));
    cookies.forEach(element => element.setAttribute("value", getCookie(element.id)));
    cookies.forEach(element => element.setAttribute("onclick", "affiche(this)"));
    var url = "recup-etat.php";
    ajax_post_request(maj_etat, url, true, null);
    
}


function maj_etat(res){

    var recup = JSON.parse(res);
    //console.log(recup);
    
    memory = recup.memoire;
    recup.fonctions.forEach(function(element) {

        console.log(element.id);
        console.log(element.val);
        document.getElementById(element.id).value = element.val;

    }  
    );
    


}
function save(){
    
    /*
    var id = elt.getAttribute("id");
    var valu = elt.getAttribute("value");
    valu.toString();
    if( valu != ""){
        setCookie(id, valu);
        //console.log(valu);
    }
    */
   
   var boutonLibre = toJSON();
   console.log(boutonLibre);
   var url = "sauvegarde-serveur.php"
   ajax_post_request(null, url, true, boutonLibre);
}



function plusmoins(){
    
    if(element.value[0] == '-'){
        //alert("- est present");
        
        element.value = element.value.replace('-', ''); 
    }
    else{
        //alert("- n'est pas present");
        var rajout = '-'
        element.value = rajout.concat(element.value);
    }      
}

function range_memory(){    
    var maRegEx = /^\-?\d+\.?\d*$/; 
    if(maRegEx.test(element.value))
    {
        memory = element.value;
        save();
    }
    else
    {
        alert("synthax error");
    }   
}

function affiche_memory(){   
    if(memory != "undefined")
    {
        element.value += memory;
    }   
}

function raz_memory(){
    memory = "undefined";
}

function mode_edition(){   
        edition= true;
        edition_button.classList.remove("default_text");
        edition_button.classList.add("red_text");
        edition_button.setAttribute("onclick", "mode_calcul();");
        
        for (var val of buttonLibre)
        {
            val.removeAttribute("onclick");
            val.setAttribute("ondblclick", "edit(this)");
        }    
}


function mode_calcul(){ 
    edition= false;
    edition_button.classList.remove("red_text");
    edition_button.classList.add("default_text");
    edition_button.setAttribute("onclick", "mode_edition();");
    
    for (var val of buttonLibre)
    {
        val.removeAttribute("ondblclick");
        val.setAttribute("onclick", 'affiche(this)');
        val.removeAttribute("type");
        val.setAttribute("type", "button");
    }
    
    save();
    
}

function edit(elt){
        elt.setAttribute("type", "text");
        elt.removeAttribute("ondblclick");
        elt.setAttribute("ondblclick", "fix(this);");
    
}

function fix(elt){
        if(elt.value === "")
        { 
            elt.setAttribute("value", ""); 
        }
       
        
        elt.removeAttribute("type");
        elt.setAttribute("type", "button");
        elt.removeAttribute("ondblclick");
        elt.setAttribute("ondblclick", "edit(this)");      

}


function ajax_get_request(callback, url, async = true) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest(); 

	// Définition de la fonction à exécuter à chaque changement d'état
	xhr.onreadystatechange = function(){
		if (callback && xhr.readyState == XMLHttpRequest.DONE 
				&& (xhr.status == 200 || xhr.status == 0))
		{
			// Si une fonction callback est définie + que le serveur a fini son travail
			// + que le code d'état indique que tout s'est bien passé
			// => On appelle la fonction callback en passant en paramètre
			//		les données récupérées sous forme de texte brut
			
            callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet puis envoi de la requête
	xhr.open("GET", url, async); 
	xhr.send();
}

function toJSON(){

    var donnees = { fonctions : [], "memoire" : memory};
    for (var val of buttonLibre)
    {
        
        donnees.fonctions.push({"id": val.getAttribute('id'), "val": val.getAttribute('value')});
        //donnees.fonctions.JSON.stringify()
    }
    //console.log(donnees);
    var chaineCarac = JSON.stringify(donnees);
    
    return chaineCarac;
}

function ajax_post_request(callback, url, async = true, data = null) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest();
    
	xhr.onreadystatechange = function() {
		if (callback && xhr.readyState == XMLHttpRequest.DONE
			&& (xhr.status == 200 || xhr.status == 0))
		{
			// => On appelle la fonction callback
			callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet
	// (avec la définition du format des données envoyées)
	xhr.open("POST", url, async); 
	xhr.setRequestHeader("Content-Type",
		"application/x-www-form-urlencoded");

	// Envoi de la requête (avec ou sans paramètre)
	if(data === null){
		xhr.send(null);
	} else {
		xhr.send("data=" + data);
	}
}