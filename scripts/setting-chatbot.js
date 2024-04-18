function addMessageChatbot(){
    //addTypingEffect();
    const contenedor=document.createElement('div');
    contenedor.classList.add('d-flex','flex-row','justify-content-start','turno-bot');
    const imagen=document.createElement('img');
    //imagen.src='https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png';
    imagen.src="https://i.postimg.cc/pXMtPq62/robot-animado.png" //"../img/robot-animado.png"
    imagen.classList.add('rounded-circle','avatar-mensage');
    imagen.style.width='45px';
    imagen.style.height='100%';
    //let avatar="<img src='' alt='avatar chatbot' style='width: 45px; height: 100%;'>";
    const contenedorMensaje=document.createElement('div');
    //añadimos los valores al contenedor
    for(let i=0;i<arguments.length;i++){
        var message=document.createElement('div');
        message.classList.add('small','p-2','ms-3','mb-3','texto-mensaje-chatbot');
        message.innerHTML=arguments[i];
        //agregamos el texto al contenedor
        contenedorMensaje.appendChild(message);
    }
    //anidamos los componentes
    contenedor.appendChild(imagen);
    contenedor.appendChild(contenedorMensaje);
    //agregamos el mensaje al contenedor de mensajes.
    document.getElementById('chatbot-body').appendChild(contenedor);
    //configuramos el scroll
    var elem = document.getElementById('chatbot-body');
    elem.scrollTop = elem.scrollHeight;
}
function addMessageUsuario(){
    const contenedor=document.createElement('div');
    contenedor.classList.add('d-flex','flex-row','justify-content-end','mb-4','pt-1','turno-user');
    const imagen=document.createElement('img');
    /*
    imagen.src='https://e7.pngegg.com/pngimages/782/114/png-clipart-profile-icon-circled-user-icon-icons-logos-emojis-users-thumbnail.png';
    */
    imagen.src="https://i.postimg.cc/tCdGJWKF/usuario-avatar.jpg" //"../img/usuario-avatar.png"
    imagen.classList.add('rounded-circle','avatar-mensage');
    imagen.style.width='45px';
    imagen.style.height='100%';
    //let avatar="<img src='' alt='avatar chatbot' style='width: 45px; height: 100%;'>";
    const contenedorMensaje=document.createElement('div');
    //iteramos sobre los argumentos
    for(let i=0;i<arguments.length;i++){
        var message=document.createElement('div');
        message.classList.add('small','p-2','ms-3','mb-3','texto-mensaje-usuario');
        message.innerHTML=arguments[i];
        //agregamos el texto al contenedor
        contenedorMensaje.appendChild(message);
    }
    //anidamos los componentes
    contenedor.appendChild(contenedorMensaje);
    contenedor.appendChild(imagen);
    //agregamos el mensaje al contenedor de mensajes.
    document.getElementById('chatbot-body').appendChild(contenedor);

}


/*Para detectar el envio mediante la tecla ENTER*/
let inputChat = document.getElementById("inputChat");
if(inputChat){
    inputChat.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("enviar").click();
        }
    });
}
/*Para detectar el envio de fechasFrom y fechasTo */
let flujoFechasNormales = document.getElementById("flujoFechasNormales");
if(flujoFechasNormales
){
    flujoFechasNormales
.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById("enviar").click();
        }
    });
}



/*Configuraciones del speechrecognition */
var textRecognized="";
/*Variable para identificar microfono abierto */

/*ANIMACION DE CARGANDO */
function addTypingEffect(){
    const contenedor=document.createElement('div');
    contenedor.classList.add('d-flex','flex-row','justify-content-start','turno-bot');
    contenedor.setAttribute('name','typing');
    const imagen=document.createElement('img');
    //imagen.src='https://w7.pngwing.com/pngs/529/418/png-transparent-computer-icons-internet-bot-eyes-miscellaneous-people-sticker-thumbnail.png';
    imagen.src="https://i.postimg.cc/pXMtPq62/robot-animado.png" //"../img/robot-animado.png"
    imagen.classList.add('rounded-circle','avatar-mensage');
    imagen.style.width='45px';
    imagen.style.height='100%';
    contenedor.appendChild(imagen);
    //let avatar="<img src='' alt='avatar chatbot' style='width: 45px; height: 100%;'>";
    for(let i=0;i<3;i++){
        var spinner=document.createElement('div');
        spinner.classList.add('spinner-grow');
        spinner.setAttribute('role','status');
        contenedor.appendChild(spinner);
    }
    document.getElementById('chatbot-body').appendChild(contenedor);
    //configuramos el scroll
    var elem = document.getElementById('chatbot-body');
    elem.scrollTop = elem.scrollHeight;
}

/*Cerrar la aimacion de cargando */
function removeTypingEffect(){
    try{
        let typing=document.getElementsByName('typing');
        if(typing){
            typing[0].remove();
        }
    }catch(error){
        console.log(error);
    }
    
    //document.getEle
}
//funcion para aparecer y desparecer el spinner
function showSpinner(time){
    var mostrarSpinner = new Promise(function(resolve, reject) {
        setTimeout(function a(){ addTypingEffect(); resolve();}, time);
    });
    Promise.all([mostrarSpinner]).then(function() {
        removeTypingEffect();
    });
}
/*Setting la opcion completa */
var IdFlujoEjecucion="";
/* Detectamos si estamos usando un dispositivo mobil, esto para marcar los inputs como lectura */

function isMobileDevice(){
    return ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent));
}
var isMobile = isMobileDevice();
if(isMobile){
    document.getElementById('fechaFrom').readOnly=false;
    document.getElementById('fechaTo').readOnly=false;
}
//funciones para deshbilitar componentes en funcion del flujo.
function activateInputFechas(){
 document.getElementById('flujoEntradaTexto').style.display='none';
 document.getElementById('flujoOpcionesSimples').style.display='none';
 document.getElementById('flujoOpcionesMultiples').style.display='none';
 document.getElementById('flujoFechasNormales').style.display='flex';
 IdFlujoEjecucion="flujoFechasNormales";
 //por defecto se activa la seleccion de fechas en format yyyy-mm-dd
 resetOptionDates();
 //activateDailyPicker();
}

function resetOptionDates(){
    var fechaFrom=document.getElementById('fechaFrom');
    var fechaTo=document.getElementById('fechaTo');
    fechaFrom.value="";
    fechaTo.value="";

    fechaFrom.removeAttribute('placeholder');
    $('#fechaFrom').datepicker('destroy');

    fechaTo.removeAttribute('placeholder');
    $('#fechaTo').datepicker('destroy');


}

function activateMonthYearPicker(start=undefined,end=undefined){
    var fechaFrom=document.getElementById('fechaFrom');
    var fechaTo=document.getElementById('fechaTo');

    fechaFrom.setAttribute('class','form-control','form-control-sm','text-center');
    fechaTo.setAttribute('class','form-control','form-control-sm','text-center');
    //fechaTo.style.width='100%';
    var date = new Date();
    var currentMonth = date.getMonth();
    fechaFrom.setAttribute('type','text');
    fechaTo.setAttribute('type','text');
    fechaFrom.setAttribute('placeholder','mm/yyyy');
    fechaTo.setAttribute('placeholder','mm/yyyy');

    $("#fechaFrom").datepicker({
        format: "mm/yyyy",
        startView: "months",
        minViewMode: "months",
        autoclose: true,
        language: 'es',
        endDate: new Date(),
        startDate: new Date(1980, 0, 1)
    }).on('changeDate', function (selected) {
        var minDate = new Date(selected.date.valueOf());
        $('#fechaTo').datepicker('setStartDate', minDate);
    });

    $("#fechaTo").datepicker({
        format: "mm/yyyy",
        startView: "months",
        minViewMode: "months",
        autoclose: true,
        language: 'es',
        endDate: new Date(),
    }).on('changeDate', function (selected) {
        var maxDate = new Date(selected.date.valueOf());
        $('#fechaFrom').datepicker('setEndDate', maxDate);
    });

    fechaFrom.value=start?start:"01/1980";
    fechaTo.value= end?end:(new Date().getMonth()+1)+'/'+new Date().getFullYear();
}
function activateDailyPicker(){
    document.getElementById('fechaFrom').setAttribute('type','date'); //tipo de entrada DATE en formato yyyy-mm-dd
    document.getElementById('fechaTo').setAttribute('type','date');

    document.getElementById("fechaTo").value=new Date().toISOString().split('T')[0];
    document.getElementById("fechaFrom").value=new Date().toISOString().split('T')[0];
}

function activateYearPicker(){

    var fechaFrom=document.getElementById('fechaFrom');
    fechaFrom.setAttribute('type','number'); //tipo de entrada numerico para el año
    fechaFrom.setAttribute('min','1980');
    fechaFrom.setAttribute('max',new Date().getFullYear());
    fechaFrom.setAttribute('step','1');
    fechaFrom.setAttribute('value','1980');

    fechaFrom.value=1980;
    

    var fechaTo=document.getElementById('fechaTo');
    fechaTo.setAttribute('type','number');
    fechaTo.setAttribute('min','1980');
    fechaTo.setAttribute('max',new Date().getFullYear());
    fechaTo.setAttribute('step','1');
    fechaTo.setAttribute('value','2022');
    fechaTo.value=new Date().getFullYear();

    $("#fechaFrom").datepicker({
        format: "yyyy",
        viewMode: "years", 
        minViewMode: "years",
        autoClose: true,
        updateViewDate: true,
        maxDate: $('#fechaTo').val()

    });


    $("#fechaTo").datepicker("destroy"); //NO BORRAR ESTA LINEA: Solo en esta posicion funciona correctamente.
    $("#fechaTo").datepicker({
        format: "yyyy",
        viewMode: "years", 
        minViewMode: "years",
        autoClose: true,
        updateViewDate: true,
        maxDate: new Date().getFullYear(),
    });



}
function activateTrimestrePicker(){
    //activateMonthYearPicker();
    let arrayTrimestres=["T1","T2","T3","T4"];

    //obtenemos las instancias de los selectores
    var fromTrimestreNumber=$("#fromTrimestreNumber");
    var toTrimestreNumber=$("#toTrimestreNumber");
    //cleaning the options
    fromTrimestreNumber.empty();
    toTrimestreNumber.empty();

    //rellenamos los trimestres
    $.each(arrayTrimestres,function(item){
        fromTrimestreNumber.append($('<option>', {
            value: arrayTrimestres[item],
            text : arrayTrimestres[item]
        }));
        toTrimestreNumber.append($('<option>', {
            value: arrayTrimestres[item],
            text : arrayTrimestres[item]
        }));
    });
    $("#fromTrimestreNumber").val("T1");
    $("#toTrimestreNumber").val("T4");
    //rellenamos los años
    $("#fromTrimestreYear").empty();
    $("#toTrimestreYear").empty();

    for(let i=new Date().getFullYear();i>=1980;i--){
        //console.log(i);
        $("#fromTrimestreYear").append($('<option>', {
            value: i,
            text : i
        }));
        $("#toTrimestreYear").append($('<option>', {
            value: i,
            text : i
        }));
    }

    $("#fromTrimestreYear").val(1980);
    $("#toTrimestreYear").val(new Date().getFullYear());


}

function activateEntradaTexto(){
    document.getElementById('flujoEntradaTexto').style.display='flex';
    document.getElementById('microfono').style.display='flex';
    document.getElementById('flujoOpcionesSimples').style.display='none';
    document.getElementById('flujoOpcionesMultiples').style.display='none';
    document.getElementById('flujoFechasNormales').style.display='none';
    document.getElementById('flujoFechasTrimestrales').style.display='none';
    document.getElementById('flujoSliderRange').style.display='none';
    IdFlujoEjecucion="flujoEntradaTexto";
}
function activateInputOpcionesSimples(){
    document.getElementById('flujoEntradaTexto').style.display='none';
    document.getElementById('flujoOpcionesSimples').style.display='flex';
    document.getElementById('flujoOpcionesMultiples').style.display='none';
    document.getElementById('flujoFechasNormales').style.display='none';
    document.getElementById('flujoFechasTrimestrales').style.display='none';
    document.getElementById('flujoSliderRange').style.display='none';
    IdFlujoEjecucion="flujoOpcionesSimples";
}
function activateInputOpcionesMultiples(){
    document.getElementById('flujoEntradaTexto').style.display='none';
    document.getElementById('flujoOpcionesSimples').style.display='none';
    document.getElementById('flujoOpcionesMultiples').style.display='flex';
    document.getElementById('flujoFechasNormales').style.display='none';
    document.getElementById('flujoFechasTrimestrales').style.display='none';
    document.getElementById('flujoSliderRange').style.display='none';
    $("#inputMin").inputmask('decimal', {
        rightAlign: true
    });
    $("#inputMax").inputmask('decimal', {
        rightAlign: true
    });

    IdFlujoEjecucion="flujoOpcionesMultiples";
    if(isMobileDevice()){
        $(".choices__input choices__input--cloned").blur();
        console.log("Mobile detectado modo: blur");
    }else{
        $(".choices__input choices__input--cloned").focus();
        console.log("Desktop detectado modo: focus");
    }
}
function activateInputFechasTrimestre(){
    document.getElementById('flujoEntradaTexto').style.display='none';
    document.getElementById('flujoOpcionesSimples').style.display='none';
    document.getElementById('flujoOpcionesMultiples').style.display='none';
    document.getElementById('flujoFechasNormales').style.display='none';
    document.getElementById('flujoFechasTrimestrales').style.display='flex';
    document.getElementById('flujoSliderRange').style.display='none';
    IdFlujoEjecucion="flujoFechasTrimestrales";
}

//Instantiate a slider
var mySliderRange = new Slider("#sliderRange", {})

function activateInputSliderRange(min,max,step,numdec){
    
    document.getElementById('flujoEntradaTexto').style.display='none';
    document.getElementById('flujoOpcionesSimples').style.display='none';
    document.getElementById('flujoOpcionesMultiples').style.display='none';
    document.getElementById('flujoFechasNormales').style.display='none';
    document.getElementById('flujoFechasTrimestrales').style.display='none';
    document.getElementById('flujoSliderRange').style.display='flex';

    //Destroy instance of slider
    mySliderRange.destroy()
    //Instantiate a slider
    mySliderRange = new Slider("#sliderRange", {
         min:min,
         max:max,
         step:step,
         precision: numdec,
         value:[min, max],
         ticks:[min, max],
         ticks_labels:[min, max],
         range:true
     })
    IdFlujoEjecucion="flujoSliderRange";
}

//multiples opciones
/*
$(document).ready(function(){
   
    <input type="text" style="pointer-events:none" />
    
});*/
var opcionesMultiples = new Choices('#choices-multiple-remove-button', {
    removeItemButton: true, 
    searchEnabled: true,
    searchChoices: true,
    resetScrollPosition: false,
    searchResultLimit: 100,
    position: 'top',
  });
var opcionesSimples = new Choices('#opcionesSimples', {
    searchEnabled: false,
    position:'top',
    shouldSort:false,
});
  

function enableInputFromMultichoice(){
    //document.getElementBy(".choices__input").style.pointerEvents='none';
    //console.log(document.getElementsByClassName("choices__input choices__input--cloned"));
    document.getElementsByClassName("choices__input choices__input--cloned")[0].style['pointer-events'] = 'auto';


}
function disableInputFromMultichoice(){
    //document.getElementBy(".choices__input").style.pointerEvents='none';
    document.getElementsByClassName("choices__input choices__input--cloned")[0].style.pointerEvents='none !important';
}
/*
       maxItemCount:5,
       searchResultLimit:5,
       renderChoiceLimit:10
       */
//configuraciones iniciales del HTML

const fechaFrom=document.getElementById('fechaFrom');
const fechaTo=document.getElementById('fechaTo');
$("#inputChat").val("");
//$("#sliderRange").slider();

fechaFrom.setAttribute('autocomplete','off');
fechaTo.setAttribute('autocomplete','off');
