/*
INICIANDO EL CHATBOT
*/
ChatbotStatus.currentActivity=Login.NAME;
ACTIVITY_LOGIN=new Login();

ACTIVITY_CAMBIO=new TipoCambio();
ACTIVITY_TASAS=new TasasInteresSBS();
ACTIVITY_CREDITOS=new SistemasFinancieros();
ACTIVITY_BCRPDATA=new BCRPData();
ACTIVITY_CONTABLE=new TipoCambioContable();
ACTIVITY_COMUNICADOS=new ComunicadosBCRP();

ACTIVITY_LOGIN.nextActivity();
/*
activateEntradaTexto();
*/
activateEntradaTexto();

//agregando actividades al flujo de ejecucion
let buttonEnviar = document.getElementById("enviar");
if(buttonEnviar){
    buttonEnviar.addEventListener("click", function(){
        
        /*addTypingEffect();*/
        //showSpinner(5000);
        console.log("Current Activity: "+ChatbotStatus.currentActivity);
        
        switch(ChatbotStatus.currentActivity){
            case Login.NAME:
                if(ACTIVITY_LOGIN.hasFinished()){
                    ACTIVITY_LOGIN=new Login();
                }
                ACTIVITY_LOGIN.nextActivity();
                break;
  
            case TipoCambio.NAME:
                if(ACTIVITY_CAMBIO.hasFinished()){
                    ACTIVITY_CAMBIO=new TipoCambio();
                }
                ACTIVITY_CAMBIO.nextActivity();
                break;
            case TipoCambioContable.NAME:
                if(ACTIVITY_CONTABLE.hasFinished()){
                    ACTIVITY_CONTABLE=new TipoCambioContable();
                }
                ACTIVITY_CONTABLE.nextActivity();
                break;
            case TasasInteresSBS.NAME:
                if(ACTIVITY_TASAS.hasFinished()){
                    ACTIVITY_TASAS=new TasasInteresSBS();
                }
                ACTIVITY_TASAS.nextActivity();
                break;
            case BCRPData.NAME:
                if(ACTIVITY_BCRPDATA.hasFinished()){
                    ACTIVITY_BCRPDATA=new BCRPData();
                }
                ACTIVITY_BCRPDATA.nextActivity();
                break;
            case SistemasFinancieros.NAME:
                if(ACTIVITY_CREDITOS.hasFinished()){
                    ACTIVITY_CREDITOS=new SistemasFinancieros();
                }
                ACTIVITY_CREDITOS.nextActivity();
                break;
            case ComunicadosBCRP.NAME:
                if(ACTIVITY_COMUNICADOS.hasFinished()){                    
                    ACTIVITY_COMUNICADOS=new ComunicadosBCRP();                    
                }
                ACTIVITY_COMUNICADOS.nextActivity();                
                break;                
            default:
                console.log("No se encontro la actividad");
                break;
        }
        /*removeTypingEffect();*/
        return true;
    });
}