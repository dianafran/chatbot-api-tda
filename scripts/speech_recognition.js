/*Creamos div para la funciones del audio chatbot*/
var HTMLContent=document.createElement('div');
HTMLContent.classList.add('container');
let spinners=document.createElement('div');
spinners.classList.add('d-flex','flex-row','justify-content-center','align-items-center');
spinners.innerHTML='<div class="spinner-grow text-primary" role="status"></div><div class="spinner-grow text-secondary" role="status"></div><div class="spinner-grow text-success" role="status"></div><div class="spinner-grow text-danger" role="status"></div><div class="spinner-grow text-warning" role="status"></div><div class="spinner-grow text-info" role="status"></div>';
HTMLContent.appendChild(spinners);
HTMLContent.appendChild(document.createElement('br'));
let cajaTexto=document.createElement('p');
cajaTexto.classList.add('text-center','text-muted');
cajaTexto.setAttribute('id','textoSpeech');
cajaTexto.innerHTML='Habla con el chatbot...';
HTMLContent.appendChild(cajaTexto);
/*Funcion de swalAlert.js no permitido */
function MicrophoneIsNoAllowed(){
    Swal.fire({
        title: "No se puede acceder al microfono",
        text: "No se le permite el acceso al microfono para realizar esta operación. Por favor, explore otras opciones.",
        icon: "warning",
    });
}
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 


/* Clases de JS  de speechrecognition */
class SpeechRecognition{

    static TextRecognized="";
    static Status=false;
    constructor(){
        this.textRecognized="";
        this.isActive=false;
        this.recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        this.recognition.lang="es-ES";
        this.recognition.continuous = true;
        this.recognition.interimResults = true;

        this.recognition.onresult=this.onresult;
        this.recognition.onend=this.onend;

    }
   
    onresult(event){
        console.log("onresult");
        let result= "";
        for(let i=event.resultIndex;i<event.results.length;i++){
            result += event.results[i][0].transcript;
        }
        //condicional para el tratamiento de los datos
        if(result.trim().endsWith(".")){
            result=result.substring(0,result.length-1);
        }
       
        SpeechRecognition.TextRecognized=result;
        try{
            document.getElementById('textoSpeech').innerHTML=result;
        }catch(e){
            console.log("Error al obtener el elemento.Problemas espontaneos de asincronia.");
        }
        
    }
    onend(){
        console.log("Se termino de escuchar toda la frase: "+SpeechRecognition.TextRecognized);
    }
    start(){
        SpeechRecognition.TextRecognized="";
        this.recognition.start();
    }
    stop(){
        this.recognition.stop();
    }
}
/* clases */
class ToolSpeechRecognition{
    static texto="";
    static opciones=[];
    static return_multiple=false;
    static dictionary={};
}
/*Settings of Artificial Intelligence*/


/*Funcion para iniciar el reconocimiento de voz */
var recognition= new SpeechRecognition();

let buttonMicrofono = document.getElementById("microfono");
if(buttonMicrofono){
    buttonMicrofono.addEventListener("click", function(){
        console.log("Click en microfono");
        //exploramos algunas opciones
        if(IdFlujoEjecucion!="flujoOpcionesMultiples" && IdFlujoEjecucion!="flujoOpcionesSimples" && IdFlujoEjecucion!="flujoEntradaTexto"){
            MicrophoneIsNoAllowed();
            return false;
        }
        //en caso contrario realizar toda la operacion,
        
        
        Swal.fire({
            title:"Microfono",
            html:HTMLContent,
            showCancelButton:true,
            confirmButtonText:"Enviar",
            cancelButtonText:"Cancelar",
            confirmButtonColor:"dark",
            cancelButtonColor:"dark",
            /*override close modal*/
            
            allowOutsideClick:false,

            didOpen:()=>{
                try{
                    recognition.start();
                }catch(e){
                    recognition.abort();
                    recognition.start();
                }
                
               
            },

            willClose:()=>{
                console.log("Cerrando modal");
                SpeechRecognition.Status=false;
                recognition.stop();
            }
        }).then( async (result)=>{
            recognition.stop();

            document.getElementById('textoSpeech').innerHTML='Habla con el chatbot...';
            console.log("Texto reconocido: "+SpeechRecognition.TextRecognized);
            if(result.isConfirmed && SpeechRecognition.TextRecognized.trim()!=""){
                
                
                SpeechRecognition.Status=true;
                console.log("Mensaje sin procesar: "+SpeechRecognition.TextRecognized);
                //document.getElementById('inputChat').value=SpeechRecognition.TextRecognized;
                //document.getElementById('enviar').click();
                var listOptionsValue=new Array();
                var listOptionsText=new Array();
                var listOptionsNative=new Array();
                /*como solo se envia el texto a la api tenemos que crear ub diccionario texto-valor */
                
                
                if(IdFlujoEjecucion=="flujoOpcionesMultiples" || IdFlujoEjecucion=="flujoOpcionesSimples"){
                    //mostramos lacaptura de texto
                    //console.log("OPCIONES CAPTURADAS:");
                    //console.log(currentAnswers) ;
                    currentAnswers.forEach(function(element) {
                        listOptionsValue.push(element.value.trim());
                        //agregamos los textos dividos por un |
                        element.label.split("|").forEach(function(element){
                            listOptionsText.push(removeAccents(element.trim()).toLowerCase());
                        });
                        listOptionsNative.push(removeAccents(element.label.trim()).toLowerCase());
                        //listOptionsText.push(element.label);
                    });
                    //mostramos las opciones extraidas
                    console.log("Opciones(val) extraidas: ",listOptionsValue);
                    console.log("Opciones(text) extraidas: ",listOptionsText);
                    var original={};
                    for(let i=0;i<listOptionsValue.length;i++){
                        //exlcusiones
                        let key=listOptionsValue[i];
                        original[key]=[];
                        listOptionsNative[i].split("|").forEach(function(element){
                            original[key].push(element.trim());
                        });
                        //original[listOptionsValue[i]]=listOptionsNative[i].split("|");
                        //original[listOptionsText[i]]=listOptionsValue[i];
                    }
                    //let speech=new ToolSpeechRecognition();
                    console.log("Diccionario: ",original);
                    //let return_multiple=false;
                    //speech.addTextos(SpeechRecognition.TextRecognized);
                    ToolSpeechRecognition.texto=removeAccents(SpeechRecognition.TextRecognized).toLowerCase();
                    if(IdFlujoEjecucion=="flujoOpcionesMultiples"){  
                        ToolSpeechRecognition.return_multiple=true;
                    }else if(IdFlujoEjecucion=="flujoOpcionesSimples"){
                        ToolSpeechRecognition.return_multiple=false; 
                    }
                    //speech.addOpciones(...listOptionsText);
                    ToolSpeechRecognition.opciones=listOptionsText;
                    ToolSpeechRecognition.dictionary=original;
                    //la siguiente instruccion nos devolvera una lista de valores de texto que se seleccionaran automaticamente.
                    axios({
                        method: 'POST',
                        url: API_CHATBOT+"/services/speech",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data:{
                            "texto": ToolSpeechRecognition.texto,
                            "opciones": ToolSpeechRecognition.opciones,
                            "return_multiple":ToolSpeechRecognition.return_multiple
                        }
                    }).then(function(response){
                        console.log("result API: ",response.data)
                        let result=response.data;
                        result.data.forEach((element)=>{
                            console.log("Datos devueltos - async: ",element);
                            console.log("Datos devueltos-text - async: ",element.text);
                            console.log("Datos devueltos-prob - async: ",element.prob);
                           
                            var text_result=element.text;
                            //hallamos el valor texto mas cercano devuelto por el diccionario.
                            console.log("Diccionario guardado: ",ToolSpeechRecognition.dictionary);
                            let key_found="";
                            console.log("Claves del diccionario: ",Object.keys(ToolSpeechRecognition.dictionary));
                            for(let key of Object.keys(ToolSpeechRecognition.dictionary)){
                                console.log("Key: ",key);
                                console.log("Value: ",ToolSpeechRecognition.dictionary[key]);
                                if(ToolSpeechRecognition.dictionary[key].includes(text_result)){
                                    key_found=key;
                                    break;
                                }
                            };
                            if(key_found==""){
                                console.log("No se encontro valor. Error imposible.");
                            }
                            if(IdFlujoEjecucion=="flujoOpcionesMultiples"){
                                //exclusiones para las monedas
                              
                                opcionesMultiples.setChoiceByValue(key_found);
                            }else if(IdFlujoEjecucion=="flujoOpcionesSimples"){
                                
                                //document.getElementById('enviar').click();
                                if(element.prob<0.2){
                                    //document.getElementById('enviar').click();
                                    opcionesSimples.setChoiceByValue('none');
                                    Swal.fire({
                                        title:"No se pudo reconocer la opcion",
                                        text:"El reconocimiento no logra detectar la opcion, por favor seleccionela manualmente o siga intentando",
                                        icon:"warning",
                                    });
                                    console.log("No se pudo reconocer la opcion. No se selecciona nada automaticamente");
                                }else{
                                    opcionesSimples.setChoiceByValue(key_found);
                                }
                            }
                            console.log("Los valores fueron asignados");
                            
                        //return response.data;
                    });
                    });
                   
                } else if(IdFlujoEjecucion=="flujoEntradaTexto"){
                    document.getElementById('inputChat').value=SpeechRecognition.TextRecognized;
                    document.getElementById('enviar').click();
                }else{
                    MicrophoneIsNoAllowed();
                }
                
                
            }else{
                SpeechRecognition.Status=false;
                SpeechRecognition.TextRecognized="";
                console.log("Cancelando envio de mensaje");
                //No hacer nada con las opciones
            }
        })
    }
    );
    
}