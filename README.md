# BCRP Chatbot Pro
Chatbot del BCRP mejorado con propio famework.

### database-api.js
Este archivo contiene las funciones para establecer las consultas con la base de datos.

### dialog-flow.js
Este archivo contiene todas las clases de los flujos de datos del chatbot.js

Aqui una clase se puede definir como:

    class NuevoFlujo(){
        static NAME="nuevoFlujo";
        construct(){
            this.nextActivity=undefined;
        }
        nextActivity=()=>{
            //do something here
        };
        hasFinished(){
            return this.nextActivity==undefined;
        };
    }

### init-chatbot.js
Contiene la inicialización de los flujos de datos, por defecto el flujo inicial es el de LOGIN.
En el codigo podrás encontrar una sentencia como esta:

    ACTIVITY_NUEVO=new NuevoFlujo()

    switch(ChatbotStatus.currentActivity){
            case Login.NAME:
                if(ACTIVITY_LOGIN.hasFinished()){
                    ACTIVITY_LOGIN=new Login();
                }
                ACTIVITY_LOGIN.nextActivity();
                break;
            ...
            ...
            ...
            //si deseas agregar el nuevo flujo de la clase solo debes agregarla como parte del switch
            case NuevoFlujo.NAME:
                if(ACTIVITY_NUEVO.hasFinished()){
                    ACTIVITY_NUEVO=new Login();
                }
                ACTIVITY_NUEVO.nextActivity();
                break;

            default:
                break;


### speech_recognition.js
Contiene los archivos necesarios para le lectura de voz.

### setting_chatbot.js
Contiene el codigo necesario para crear los componentes en tiempo de ejecucion.

```addMessageChatbot()```: Funcion que acepta una lista de oraciones que el *chatbot* tiene que decir.
Ejemplo:

    addMessageChatbot("Hola como estas?","gradioso dia"); //puedes agregar más de una linea.

```addMessageUsuario()```: Funcion que acepta una lista de oraciones que el *usuario* tiene que decir.

    addMessageUsuario("Los resultados son:","Seleccionar BCP, BBVA"); //puedes agregar más de una linea.

```addTypingEffect()``` y ```removeTypingEffect()```: Para agregar efectos de tipeo del robot cuando haces uan consulta a la base de datos. Estas funciones deben usarse en conjunto, antes y despues de un bloque de codigo que crees que demorará por parte del chatbot.
Un ejemplo de uso es:

    addTypingEffect()
    const response=call_database(**params) //it may take a long time
    removeTypingEffect()

```isMobileDevice```: Función que detecta si el *chatbot* se ejecuta en un dispositivo movil o no.

```activateInputFechas()```: Habilita el chatbot para la entrada de fechas comunes pero **NO** especifica aún que tipo de fechas puede esperar. Esta opción requiere sera acompañada del tipo de entrada  de fechas como:
* ```activateMonthYearPicker```: Para la entrada de fechas en formato **mm/yyyy**
* ```activateDailyPicker```: Para la entrada de fechas en formato **dd/mm/yyyy**
* ```activateYearPicker```: Para la entrada de fechas en formato **yyyy**

Un ejemplo para habilitar la entrada de fechas seria:

    activateInputFechas(); //primero habilito la entrada de fechas
    activateYearPicker(); //luego activo el tipo de fechas que voy a recibir.

```activateInputFechasTrimestre```: Funcion para habilitar el entorno para mostrar las fechas trimestrales. Requiere estar seguida de la funcion ```activateTrimestrePicker``` para la entrada de fechas en formato **T1-T4** - **YYYY**.

Un ejemplo de su aplicación en el codigo es:

    activateInputFechasTrimestre(); //primero habilito la entrada de fechas
    activateTrimestrePicker(); //luego activo el tipo de fechas trimestrales.

```activateEntradaTexto()```: Para activar la entrada del texto por parte del usuario. Esta función se utiliza en el *Login* cuando el usuario tiene que digitar su contraseña.

```Escoger opciones```: Cuando deseas que el usuario pueda escoger entre una o varias opciones usamos las siguientes funciones:
* ```activateInputOpcionesSimples```: Para escoger **solo una opcion** de una lista desplegable. Requiere del objeto *opcionesSimples*.
* ```activateInputOpcionesMultiples```:  Para escoger **varias  opciones** de una lista desplegable.Requiere del objeto *opcionesMultiples*.

Un ejemplo del uso de estas funciones seria el siguiente:

    activateInputOpcionesSimples(); //habilitamos el espacio para opciones unicas.
    opciones=[
        {value:"01",label:"Bancos"},
        {value:"02",label:"Casas de cambio"}
    ]
    //objecto 'opciones simples'. 
    //Pero en caso tu tengas las opciones multiples llamas al objeto 'opcionesMultiples'.

    opcionesSimples.setChoices(opciones,"value","label",false);




CHATBOT del despartamento de estadisticas monetarias desarrollada por @jovamih.



