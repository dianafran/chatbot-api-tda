//https://choices-js.github.io/Choices/
//funcione especiales
function capitalize(word) {
    return word
      .toLowerCase()
      .replace(/\w/, firstLetter => firstLetter.toUpperCase());
  }

function errorSeleccion(){
    Swal.fire({
        title:"Error de selección",
        text:"Por favor seleccione una opción válida.",
        icon:"warning",
        confirmButtonColor:"#22528"
    });
  }
function insufficientData(){
    Swal.fire({
        title:"Elija al menos una opción",
        text:"Por favor ingrese al menos una opción de su preferencia.",
        icon:"warning",
        confirmButtonColor:"#22528"
    });
  }
function validate_dates_pro(fechaFrom,fechaTo,type="anuales"){
    //verificamos si no son nulas
    if(fechaFrom==undefined || fechaTo==undefined){
        return false;
    }
    //verificamos si las fechas fueron tipeadas correctamente
    fechaFrom=fechaFrom.trim()
    fechaTo=fechaTo.trim()
    if(fechaFrom.trim()=="" || fechaTo.trim()==""){
        return false;
    }
    //validamos en funcion de la unidad de tiempo (Year)
    try{
        if(type=="anuales"){
            if(Number(fechaFrom)<= Number(fechaTo)){ //validamos que la fecha inicial sea menor o igual a la fecha final
                return true;
            }else{
                return false;
            }
        }else if(type=="mensuales"){
            //los meses vienen en formato MM/YYYY
            year_from=Number(fechaFrom.split("/")[1]);
            year_to=Number(fechaTo.split("/")[1]);
            if(year_from<=year_to){
                month_from=Number(fechaFrom.split("/")[0]);
                month_to=Number(fechaTo.split("/")[0]);
                if(month_from<=month_to){
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }else if(type=="diarias"){
            //como los dias siguen un formato estandar de YYYY-MM-DD, podemos usar la funcion Date.parse
            date_from=new Date(fechaFrom);
            date_to=new Date(fechaTo);
            if(date_from<=date_to){
                return true;
            }else{
                return false;
            }
        }else if(type=="trimestrales"){
            //los trimestres estan en formato: YYYY-Q, ej. 2021-T1, 2022-T4
            trimestre_year_from=Number(fechaFrom.split("-")[0]);
            trimestre_year_to=Number(fechaTo.split("-")[0]);
            if(trimestre_year_from>trimestre_year_to){
                return false;
            }
            trimestre_from=Number(fechaFrom.split("-")[1].replace("T",""));
            trimestre_to=Number(fechaTo.split("-")[1].replace("T",""));
            if(trimestre_from>trimestre_to){
                return false;
            }
            return true; //si pasa todas las validaciones entonces esta bien.
        }
    }catch(e){
        console.log("Error en la validacion de fechas: ");
        console.log(e);
        return false;
    }

}
function VerificarFechas(fechaFrom,fechaTo){
    if(fechaFrom=="" || fechaTo==""){
        //si no se selecciona nada, entonces no hacemos nada.
        Swal.fire({
            title:"Error de fechas",
            text:"Ingrese un rango de fechas válido.",
            icon:"warning",
            confirmButtonColor:"#22528"
        });
        return false;  
    }else if(fechaFrom>fechaTo){
        Swal.fire({
            title:"Error de fechas",
            text:"La fecha final debe ser mayor o igual a la fecha inicial",
            icon:"warning",
            confirmButtonColor:"#22528"

        });
        return false;
    }
    return true;
  }

  function VerificarRango(rangeMin,rangeMax){
    if(Number.isNaN(rangeMin) || Number.isNaN(rangeMax)){
        //si no se selecciona nada, entonces no hacemos nada.
        Swal.fire({
            title:"Error de rango",
            text:"Ingrese un rango válido.",
            icon:"warning",
            confirmButtonColor:"#22528"
        });
        return false;  
    }else if(rangeMin>rangeMax){
        Swal.fire({
            title:"Error de rango",
            text:"El valor máximo debe ser mayor al valor mínimo",
            icon:"warning",
            confirmButtonColor:"#22528"

        });
        return false;
    }
    return true;
  }
  /*CurrentAnswers */
var currentAnswers = new Array();
//instrucciones de dialogflow
class TipoCambio {
    //constructor
    static NAME="cambio";
    constructor() {
        this.fechaFrom = undefined;
        this.fechaTo= undefined;
        this.entidad=undefined;
        this.tipoEntidad=undefined;
        this.repeatQuery=false;
        //flujo de ejecucion
        /*
        Poner el flujo de actividades en orden
        */
        this.nextActivity=this.chooseTipoEntidad;
    }
    //primera actividad
    chooseTipoEntidad(){
        addMessageChatbot("¡Muy buena elección!, por favor <b>escoge el tipo de entidad</b> de la cual deseas obtener información del tipo cambiario:");
        //frame de abajo
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
            {value:"none",label:"Escoja una opción",selected:true,disabled:true},
            {value:"Bancos",label:"Entidades bancarias",selected:false},
            {value:"Casa de cambio",label:"Casa de cambio",selected:false},
        ]
        currentAnswers=answers;
        opcionesSimples.setChoices(answers,'value','label',false);
        /*$("#opcionesSimples").empty();
        $("#opcionesSimples").append(new Option("Entidades bancarias", "Bancos"));
        $("#opcionesSimples").append(new Option("Casa de cambio", "Casa de cambio"));*/
        this.nextActivity=this.chooseEntidad;
    }
     async chooseEntidad(){
        //configuraciones previas
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //verificamos la entrada
        if(value=="none"){
            //si no se selecciona nada, entonces no hacemos nada.
            errorSeleccion();
            return false;
        }
        this.tipoEntidad=value;
        addMessageUsuario(texto);
        addTypingEffect();
        //obtenmos las entidades asociadas al tipo de entidad
        const response=await cascada_cambio("Tipo",this.tipoEntidad,"Entidad");
        let answers=[];
        response.data.forEach(element=>{
            answers.push({value:element,label:capitalize(element),selected:false});
        });
        currentAnswers=answers;
        addMessageChatbot("Mostrando la lista de entidades para el grupo "+this.tipoEntidad+". <br>Por favor, seleccione el elemento desde la lista desplegable para <b>escoger  la entidad</b> de su consulta:");
        //en base al tipo de entidad consultamos la lista de entidades(seleccion multiple)
        activateInputOpcionesMultiples();
        //const opcionesMultiples=new Choices(document.getElementById("choices-multiple-remove-button"));
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);
        
    
        this.nextActivity=this.chooseFecha;
        removeTypingEffect();
        /*cascada_cambio("Tipo",this.tipoEntidad,"Entidad").then((response)=>{
            
        });
        */
         
    }
     chooseFecha(){
        //resolvemos los asuntos de la actividad anterior
        if(this.repeatQuery==false){
            var listValues= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
            });
            console.log("Opciones multiples: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }
            let formatText=[]
            listValues.forEach(element=>{
                formatText.push(capitalize(element));
            });
            this.entidad=listValues.join(",");
            addMessageUsuario(formatText.join(", "));
            addTypingEffect();
        }
        addMessageChatbot("Por último, ingrese una <b>fecha o un rango de fechas</b> laborables(lunes a viernes) a consultar en formato <b>dd/mm/yyyy</b> :");
        //mostramos informacion de la fecha
        activateInputFechas();
        activateDailyPicker();
        //document.getElementById("microfono").style.display="none";
        removeTypingEffect();
        this.nextActivity=this.showTipoCambio;
    }
    async showTipoCambio(){
        //resolvemos los asuntos de la actividad anterior
         this.fechaFrom=$("#fechaFrom").val();
         this.fechaTo=$("#fechaTo").val();
        console.log("Fechas: ",this.fechaFrom,this.fechaTo);
        
        if(VerificarFechas(this.fechaFrom,this.fechaTo)==false){
            return false;
        }


        var mensaje="";
        if(this.fechaFrom==this.fechaTo){
             mensaje="Consultar solo la fecha del "+this.fechaFrom;
        }else{
             mensaje="Consultar el rango de fechas desde el "+this.fechaFrom+" hasta el "+this.fechaTo;
        }        
        addMessageUsuario(mensaje);
        addTypingEffect();
        //consultamos el tipo de cambio
        const response=await cambio(this.fechaFrom,this.fechaTo,this.entidad);
        //response resultados
        let results=undefined;
        if(response.status=="success"){
            results="Precio del dólar 💵 de "+this.entidad+".<br>"+response.data;
            //URL's de descarga
            let URL_DOWNLOAD_EXCEL=API_CHATBOT+"/cambio/file/xlsx?start="+this.fechaFrom+"&end="+this.fechaTo+"&entidad="+this.entidad;
            let URL_DOWNLOAD_CSV= API_CHATBOT+"/cambio/file/csv?start="+this.fechaFrom+"&end="+this.fechaTo+"&entidad="+this.entidad;
            
            results+="<br>Puede descargar el archivo en formatos:<br>"
            results+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"'>Descargar EXCEL</a><br><br>";
            results+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'role='button' href='"+URL_DOWNLOAD_CSV+"'>Descargar CSV</a><br><br>";
        }else{
            if(this.fechaFrom==this.fechaTo){
                results="<b>No hay información disponible</b> de "+this.entidad.replace(",",", ")+" para la fecha "+this.fechaFrom+"."
            }else{
                results="<b>No hay información disponible</b> de "+this.entidad.replace(",",", ")+" para las fechas del "+this.fechaFrom+" hasta el "+this.fechaTo+"."
            }
            results+="<br>Recuerde consultar fechas laborables (Lun-Vier)."
        }
        removeTypingEffect();
        addMessageChatbot(results);
        
        results="¡Gracias por utilizar el servicio!.<br>📅 ¿Desea consultar otro rango de fechas?📅:"
        //los resultados
        addMessageChatbot(results);
        //cambiar los dats
        activateInputOpcionesSimples();
        //cargamos las operaciones disponibles.
        opcionesSimples.clearStore();
        let answers=[
            {value:"none",label:"Escoja una opción",selected:true,disabled:true},
            {value:"SI",label:"Claro que si!",selected:false},
            {value:"NO",label:"No, gracias.",selected:false}
        ];
        currentAnswers=[
            {value:"SI",label:"Claro que si!|Si quiero intentar otra fecha|si por favor|si|si quiero continuar|si consultar"},
            {value:"NO",label:"No, gracias|No quiero continuar| Negacion|no|no consultar"}
            ];
        opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.deseaContinuar;
        /*Regresamos al apartado de LOGIN */

    }
    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //opciones verificar
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="SI"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.chooseFecha();
        }else{
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            if(ACTIVITY_LOGIN){
                ChatbotStatus.currentActivity=Login.NAME;
                ACTIVITY_LOGIN.showMenu();
            }
        }
    }
    //methods
    nextActivity=()=>{
    };
    hasFinished(){
        return this.nextActivity==undefined;
     }

}
/* 
=============================================
TASAS DE INTERES de la SBS
=============================================
*/
class TasasInteresSBS{
    static NAME="interes";
    constructor(){
        this.repeatQuery=false;
        this.nextActivity=this.showGruposEntidades;

        this.grupoEntidad=undefined;
        this.entidad=undefined;
        this.categoria=undefined;
        this.subcategoria=undefined;
        this.moneda=undefined;
        this.fechaFrom=undefined;
        this.fechaTo=undefined;
    }
    //mostrar la lista de GRUPOS de entidades
    async showGruposEntidades(){
        
        addMessageChatbot("¡Gracias por elegir consultar la información de las tasas de interés de la SBS!.","Por favor dispóngase a responder un par de preguntas para atender su consulta.<br>🤔 ¿Qué grupo de entidades desea consultar?:");
        const response=await cascada_interes("Grupo","","");
        //cambiar los dats
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[];
        currentAnswers=[];
        //cargamos las operaciones disponibles.
        //$("#opcionesSimples").empty();
        answers.push({value:"none",label:"Escoja una opción",selected:true,disabled:true});
        response.data.forEach((item)=>{
            answers.push({value:item,label:capitalize(item)});
            currentAnswers.push({value:item,label:capitalize(item)});
            //$("#opcionesSimples").append(new Option(capitalize(item), item));   
        });
        //let's add the option 'sistemas financieros'
        answers.push({value:SistemasFinancieros.NAME,label:"Sistemas financieros"});
        currentAnswers.push({value:SistemasFinancieros.NAME,label:"Sistemas financieros"});
        //agregamos las opciones
        opcionesSimples.setChoices(answers,'value','label',false);
        this.nextActivity=this.showEntidades;
    }
    async showEntidades(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //seleccion de entidades
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        //si detectamos que es un sistema financiero terminamos la operacion here!
        addMessageUsuario(texto);
        //detectamos si es un sistema financiero
        if(value==SistemasFinancieros.NAME){
            this.nextActivity=undefined;
            //let ACTIVITY_SISTEMAS_FINANCIEROS=new SistemasFinancieros();
            ChatbotStatus.currentActivity=SistemasFinancieros.NAME;
            //ACTIVITY_SISTEMAS_FINANCIEROS.Welcome();
            document.getElementById("enviar").click();
            return false;
        }
        addTypingEffect();
        this.grupoEntidad=value; //this variable are useful for us below
        const response=await cascada_interes("Grupo",this.grupoEntidad,"Entidad");
        addMessageChatbot("Ya tengo la lista de entidades del <b>grupo "+this.grupoEntidad+"</b>.<br>🏦¿Qué <b>entidades</b> desea consultar? :")
        let answers=[];
        
        response.data.forEach((item)=>{
            answers.push({value:item,label:capitalize(item),selected:false});
        });
        currentAnswers=answers;
        activateInputOpcionesMultiples();
        //const opcionesMultiples=new Choices(document.getElementById("choices-multiple-remove-button"));
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);
        
        removeTypingEffect();
        this.nextActivity=this.showCategorias;

    }
    async showCategorias(){
        //resolvemos los asuntos de la actividad anterior
        
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-entidades: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(capitalize(element));
        });
        this.entidad=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        addTypingEffect();
        //consultamos las categorias
        const response=await cascada_interes("Grupo",this.grupoEntidad,"Categoria");
        let answers=[];
        response.data.forEach((item)=>{
            answers.push({value:item,label:capitalize(item),selected:false});
        });
        currentAnswers=answers;
        activateInputOpcionesMultiples();
        //const opcionesMultiples=new Choices(document.getElementById("choices-multiple-remove-button"));
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);
        removeTypingEffect();//removemos el efecto de typing porque ya se muestra la respuesta.
        addMessageChatbot("Aquí tengo las <b>categorías disponibles</b> a base de las entidades que escogió.<br>🤗¿Qué categorías desea consultar?: ");
        this.nextActivity=this.showSubcategorias;
    }
    async showSubcategorias(){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-categorias: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(capitalize(element));
        });
        this.categoria=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        addTypingEffect();
        //consultamos las subcategorias
        const response=await cascada_interes("Categoria",this.categoria,"SubCategoria");
        let answers=[];
        response.data.forEach((item)=>{
            answers.push({value:item,label:capitalize(item),selected:false});
        });
        currentAnswers=answers;
        activateInputOpcionesMultiples();
        //const opcionesMultiples=new Choices(document.getElementById("choices-multiple-remove-button"));
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);

        removeTypingEffect();//removemos el efecto de typing porque ya se muestra la respuesta.

        addMessageChatbot("Por favor, elija las <b>Subcategorías disponibles</b> para las categorías que elegiste.","✨ Así que ... ¿Qué subcategorías desea consultar?:");
        this.nextActivity=this.showMonedas;
    }
    async showMonedas(){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-subcategorias: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(capitalize(element));
        });
        this.subcategoria=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        addTypingEffect();
        //consultamos las monedas
        let answers=[{value:"ME",label:"Moneda Extranjera",selected:false},{value:"MN",label:"Moneda Nacional",selected:false}];
        currentAnswers=answers;
        activateInputOpcionesMultiples();
        //const opcionesMultiples=new Choices(document.getElementById("choices-multiple-remove-button"));
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);

        removeTypingEffect();//removemos el efecto de typing porque ya se muestra la respuesta.

        addMessageChatbot("Por favor, escoja la <b>moneda</b> en la cual desea hacer su consulta:<br> 🪙 Monedas disponibles:");
        this.nextActivity=this.chooseFecha;
    }
    chooseFecha(){
        //resolvemos los asuntos de la actividad anterior
        if(this.repeatQuery==false){
            var listValues= new Array();
            var listText= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
                listText.push($(this).text());
            });
            console.log("Opciones multiples -monedas: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }

            this.moneda=listValues.join(",");
            addMessageUsuario(listText.join(", "));
        }
        
        //formato de fechas condicionales para bancos, financieras y cajas municipales
        if(["Bancos","Financieras","Cajas municipales"].includes(this.grupoEntidad)){
            addMessageChatbot("Por favor, ingrese la <b>Fecha Mensual</b> en la que desea consultar la información.<br>📅 <b>Formato:</b> mm/aaaa");
            //formato de fechas mensuales
            activateInputFechas();
            activateMonthYearPicker("01/2010",undefined);//activamos las fechas mensuales

        }else{
            //formato de fechas condicionales
            addMessageChatbot("Por último, ingrese una <b>fecha o un rango de fechas</b> laborables(lunes a viernes) a consultar en formato (<b>dd/mm/yyyy</b>) :");
             //mostramos informacion de la fecha.
            activateInputFechas();
            activateDailyPicker();
        }
       
        //document.getElementById("microfono").style.display="none";
        this.nextActivity=this.tasasInteres;
    }
    async tasasInteres(){
        //resolvemos los asuntos de la actividad anterior
        this.fechaFrom=$("#fechaFrom").val();
        this.fechaTo=$("#fechaTo").val();
        console.log("Fechas: ",this.fechaFrom,this.fechaTo);
        
        if(VerificarFechas(this.fechaFrom,this.fechaTo)==false){
            return false;
        }


       var mensaje="";
       if(this.fechaFrom==this.fechaTo){
            mensaje="Consultar solo la fecha del "+this.fechaFrom;
       }else{
            mensaje="Consultar el rango de fechas desde el "+this.fechaFrom+" hasta el "+this.fechaTo;
       }       
        addMessageUsuario(mensaje);
        addTypingEffect();
        //Filtramos solo las ultimas fechas del mes cuando nos referimos a categorias como bancos, financieras y cajas municipales
        var filter_only_months=false;
        //FORMATEAMOS LAS FECHAS MENSUALES A DIARIAS mm/yyyy a 01/mm/yyyy
        if(["Bancos","Financieras","Cajas municipales"].includes(this.grupoEntidad)){
            let date_from=this.fechaFrom.split("/")[1]+"-"+this.fechaFrom.split("/")[0]+"-01";
            
            let year_to=Number.parseInt(this.fechaTo.split("/")[1]); 
            let month_to=Number.parseInt(this.fechaTo.split("/")[0]);
            console.log("year_to: ",year_to," month_to: ",month_to);
            let date_to=new Date(year_to, month_to, 0);
            console.log("Date_to revious: ",date_to.toISOString().slice(0,10));
            date_to= date_to.getFullYear()+"-"+(date_to.getMonth()+1)+"-"+date_to.getDate();
            console.log("Date_to: ",date_to);
            console.log("Fechas mensuales: ",date_from,date_to);
            console.log("Fechas formateadas: ",this.fechaFrom,this.fechaTo);
            this.fechaFrom=date_from;
            this.fechaTo=date_to;
            filter_only_months=true; //filtramos solo las fechas del ultimo dia del MES
        }
       //consultamos el tipo de cambio
        const response=await interes(this.fechaFrom,this.fechaTo,this.entidad,this.categoria,this.subcategoria,this.moneda,this.grupoEntidad,filter_only_months);
       //response resultados
        let results=undefined;
        var URL_DOWNLOAD_EXCEL=undefined;
        var URL_DOWNLOAD_CSV=undefined;
        console.log("Tasas de interes consultadas")
        let questions="Consultando datos del grupo "+this.grupoEntidad.replace(",",", ")+" acerca de la entidad "+this.entidad.replace(",",", ")+" por medio de la Categoría  de "+this.categoria.replace(",",", ")+" y subcategoría de "+this.subcategoria.replace(",",", ")+", usando el tipo de moneda  "+this.moneda.replace(",",", ")+".";
        addMessageChatbot(questions);
        if(response.status=="success"){
            
            if(["Bancos","Financieras"].includes(this.grupoEntidad)){
                questions="Se encontró una gran cantidad de resultados, los cuales para evitar sobrecarga en el servidor restringiremos las descargas en grupos de 2 años. <br><br>";
                //this.fechaFrom="2010-09-01";
                let fechaFromDate=new Date(this.fechaFrom);
                //reasiganmos las fechas mas grandes para la fecha inicial
                if(fechaFromDate<=new Date("2010-09-01")){
                    fechaFromDate=new Date("2010-09-01");
                }
                let fechaToDate=new Date(this.fechaTo);
                var array_ranges=[];
                //step size: 2 años = 730 dias
                
                var step_size=730;
                for(let i=fechaFromDate;i<=fechaToDate;i.setDate(i.getDate()+step_size)){
                    array_ranges.push(new Date(i));
                }
                //considerar que el rango de fechas puede ser menor a 2 años
                if(array_ranges.length==1){
                    array_ranges.push(fechaToDate);
                }
                //fixing some bugs
                let last=array_ranges.pop();
                if(last<fechaToDate){
                    array_ranges.push(fechaToDate);
                }else{
                    array_ranges.push(last);
                }

                //convert dates to string
                array_ranges=array_ranges.map((v)=>v.toISOString().slice(0,10));
                //creamos rangos de fecha de 2 en 2 items a partir del array
                console.log("Rangos de fechas: ",array_ranges)
                var ranges=[];
                for(let i=0;i<array_ranges.length;i++){
                    if(i==0){
                        ranges.push([array_ranges[i],array_ranges[i+1]]);
                    }else if(i==array_ranges.length-1){
                        //ranges.push([array_ranges[i],fechaToDate]);
                    }else{
                        let temp=new Date(array_ranges[i]);
                        temp.setDate(temp.getDate()+1);
                        temp=temp.toISOString().slice(0,10);
                        ranges.push([temp,array_ranges[i+1]]);
                    }
                }
                console.log("Rangos de fechas(download): ",ranges)
                //generamos los botones de resultados
                console.log("Dividimos los resultados en distintos botones");
                for(let i=0;i<ranges.length;i++){
                    console.log("Rango: ",ranges[i])
                    let start_date=ranges[i][0];
                    let end_date=ranges[i][1];  
                    //button of downloads
                    URL_DOWNLOAD_EXCEL=API_CHATBOT+"/tasas/file/xlsx?start="+start_date+"&end="+end_date+"&entidad="+this.entidad+"&categoria="+this.categoria+"&subcategoria="+this.subcategoria+"&moneda="+this.moneda+"&tipo_entidad="+this.grupoEntidad+"&verify=false&filter_month="+filter_only_months;
                    URL_DOWNLOAD_CSV=API_CHATBOT+"/tasas/file/csv?start="+start_date+"&end="+end_date+"&entidad="+this.entidad+"&categoria="+this.categoria+"&subcategoria="+this.subcategoria+"&moneda="+this.moneda+"&tipo_entidad="+this.grupoEntidad+"&verify=false&filter_month="+filter_only_months;
                    console.log("URL EXCEL: ",URL_DOWNLOAD_EXCEL)
                    console.log("URL CSV: ",URL_DOWNLOAD_CSV)
                    //HTML of buttons
                    let min_start=start_date.split("-")[1]+"/"+start_date.split("-")[0];
                    let min_end=end_date.split("-")[1]+"/"+end_date.split("-")[0];
                    questions+="Fechas: "+min_start+" al "+min_end+"<br>";
                    console.log("Fechas: ",min_start," al ",min_end)
                    questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"' target='_blank'>Descargar EXCEL </a><br>";
                    questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283' role='button' href='"+URL_DOWNLOAD_CSV+"' target='_blank'>Descargar CSV</a><br>";
                    questions+="<br>";
                }   

            }else{
                questions="Se encontraron resultados desde las fechas "+this.fechaFrom+" al "+this.fechaTo+" para atender la consulta: <br>";
                URL_DOWNLOAD_EXCEL=API_CHATBOT+"/tasas/file/xlsx?start="+this.fechaFrom+"&end="+this.fechaTo+"&entidad="+this.entidad+"&categoria="+this.categoria+"&subcategoria="+this.subcategoria+"&moneda="+this.moneda+"&tipo_entidad="+this.grupoEntidad+"&verify=false&filter_month="+filter_only_months;
                URL_DOWNLOAD_CSV=API_CHATBOT+"/tasas/file/csv?start="+this.fechaFrom+"&end="+this.fechaTo+"&entidad="+this.entidad+"&categoria="+this.categoria+"&subcategoria="+this.subcategoria+"&moneda="+this.moneda+"&tipo_entidad="+this.grupoEntidad+"&verify=false&filter_month="+filter_only_months;
                
                questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"'>Descargar EXCEL</a><br><br>";
                questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283' role='button' href='"+URL_DOWNLOAD_CSV+"'>Descargar CSV</a><br>";
            }
            
       }else{
            questions="<b>No hay información disponible</b> para las fechas solicitadas.";
       }

       removeTypingEffect();//removemos el efecto de typing porque ya se muestra la respuesta.

       addMessageChatbot(questions);
       
       results="¡Gracias por utilizar el servicio!.<br> 📅 ¿Desea consultar otro rango de fechas?📅:"
       //los resultados
       addMessageChatbot(results);
       //cambiar los dats
       activateInputOpcionesSimples();
       opcionesSimples.clearStore();
       let answers=[
            {value:"none",label:"Escoja una opción",selected:true,disabled:true},
            {value:"SI",label:"Claro que si!. Quiero intentar otra fecha.",selected:false},
            {value:"NO",label:"No, gracias.",selected:false}
       ];
       currentAnswers=[
        {value:"SI",label:"Claro que si!|Si quiero intentar otra fecha|si por favor|si|si quiero continuar|si consultar"},
        {value:"NO",label:"No, gracias|No quiero continuar| Negacion|no|no consultar"}
        ];
        opcionesSimples.setChoices(answers,'value','label',false);
       
       this.nextActivity=this.deseaContinuar;
    }
    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="SI"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.chooseFecha();
        }else{
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            if(ACTIVITY_LOGIN){
                ChatbotStatus.currentActivity=Login.NAME;
                ACTIVITY_LOGIN.showMenu();
            }
        }
    }
    //methods
    nextActivity=()=>{
    };
    hasFinished(){
        return this.nextActivity==undefined;
     }
}
class SistemasFinancieros{
    static NAME="sistemasFinancieros";
    constructor(){
        this.categoria="";
        this.moneda="";
        this.fechaFrom="";
        this.fechaTo="";
        this.repeatQuery=false;
        this.nextActivity=this.Welcome;
    }
    Welcome(){
        addMessageChatbot("¡Gracias por elegir consultar la información de los <b>Sistemas Financieros!</b>.","Por favor dispóngase a responder un par de preguntas para atender su consulta.<br>🤔 ¿Qué grupo de Categorias desea consultar?:");
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        let answers=[
            {value:"Consumo",label:"Sistemas Financieros de Consumo",selected:false},
            {value:"Microempresa",label:"Sistemas Financieros de Microempresas",selected:false},
        ];
        currentAnswers=[
            {value:"Consumo",label:"Sistemas Financieros de Consumo|consumo|consumir"},
            {value:"Microempresa",label:"Sistemas Financieros de Microempresas|microempresas|financieras microempresas"}
        ];
        //mostramos las opciones en la lista de opciones simples
        opcionesMultiples.setChoices(answers,'value','label',false);
        //nos trasladamos a la siguiente actividad 'chooseCategoria'
        this.nextActivity=this.chooseCategoria;


    }
    chooseCategoria(){

        var listValues= new Array();
        var listText= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
            listText.push($(this).text());
        });
        console.log("Opciones multiples-subcategorias: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listText.forEach(element=>{
            formatText.push(capitalize(element));
        });
        //agregamos el mensaje del usuario de categorias
        this.categoria=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        //Solicitamos la moneda
        //addMessageChatbot("🪙¿Qué tipo de moneda desea consultar?🪙:");
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        let answers=[
            {value:"ME",label:"Moneda Nacional",selected:false},
            {value:"MN",label:"Moneda Extranjera",selected:false},
        ];
        currentAnswers=answers;
        //mostramos las opciones en la lista de opciones simples
        opcionesMultiples.setChoices(answers,'value','label',false);
        addMessageChatbot("Por favor, escoja la <b>moneda</b> en la cual desea hacer su consulta:<br> 🪙 Monedas disponibles🪙:");
        this.nextActivity=this.chooseMoneda;
    }
    chooseMoneda(){
        if(this.repeatQuery==false){

            var listValues= new Array();
            var listText=new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
                listText.push($(this).text());
            });
            console.log("Opciones multiples-moneda: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }
            let formatText=[]
            listText.forEach(element=>{
                formatText.push(capitalize(element));
            });
            //agregamos el mensaje del usuario de categorias
            this.moneda=listValues.join(",");
            addMessageUsuario(formatText.join(", "));
        }
        //Solicitamos la moneda
        addMessageChatbot("📅 ¿Qué rango de fechas desea consultar?📅:");
        activateInputFechas();
        activateDailyPicker();
        this.nextActivity=this.chooseFecha;
    }
    async chooseFecha(){
        let fechaFrom=$("#fechaFrom").val();
        let fechaTo=$("#fechaTo").val();
        if(fechaFrom=="" || fechaTo==""){
            insufficientData();
            return false;
        }
        this.fechaFrom=fechaFrom;
        this.fechaTo=fechaTo;
        let mensaje="";
        if(this.fechaFrom==this.fechaTo){
            mensaje="Consultar solo la fecha del "+this.fechaFrom;
        }else{
            mensaje="Consultar el rango de fechas desde el "+this.fechaFrom+" hasta el "+this.fechaTo;
        }  
        addMessageUsuario(mensaje);
        addMessageChatbot("🔎 Consultando información de los <b>Sistemas Financieros</b> de Categoria "+this.categoria.replace(",",", ")+" en la moneda "+this.moneda.replace(",",", ")+" para el rango de fechas "+this.fechaFrom+" hasta "+this.fechaTo);
        
        const response = await query_sistema_financiero(this.categoria,this.moneda,this.fechaFrom,this.fechaTo);
        console.log("response: ",response);
        let URL_DOWNLOAD_EXCEL=API_CHATBOT+"/sistemafinanciero/file/xlsx?fecha_inicio="+this.fechaFrom+"&fecha_fin="+this.fechaTo+"&categoria="+this.categoria+"&moneda="+this.moneda+"&verify=false";
        let URL_DOWNLOAD_CSV=API_CHATBOT+"/sistemafinanciero/file/csv?fecha_inicio="+this.fechaFrom+"&fecha_fin="+this.fechaTo+"&categoria="+this.categoria+"&moneda="+this.moneda+"&verify=false";
        console.log("Sistemas financieros consultados")
        //let questions="Consultando datos del grupo "+this.grupoEntidad.replace(",",", ")+" acerca de la entidad "+this.entidad.replace(",",", ")+" por medio de la Categoría  de "+this.categoria.replace(",",", ")+" y subcategoría de "+this.subcategoria.replace(",",", ")+", usando el tipo de moneda  "+this.moneda.replace(",",", ")+", desde las fechas "+this.fechaFrom+" hasta "+this.fechaTo+".";
        let questions="";
        //addMessageChatbot(questions);
        if(response.status=="success"){
            questions="Se encontraron resultados. <br>";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"'>Descargar EXCEL</a><br><br>";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283' role='button' href='"+URL_DOWNLOAD_CSV+"'>Descargar CSV</a><br>";
        }else{
            questions="<b>No hay información disponible</b> para las fechas solicitadas.";
        }

        addMessageChatbot(questions);

        let results="¡Gracias por utilizar el servicio!.<br> 📅 ¿Desea consultar otro rango de fechas?📅:"
        //los resultados
        addMessageChatbot(results);
        //cambiar los dats
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
                {value:"none",label:"Escoja una opción",selected:true,disabled:true},
                {value:"SI",label:"Claro que si!. Quiero intentar otra fecha.",selected:false},
                {value:"NO",label:"No, gracias.",selected:false}
        ];
        currentAnswers=[
            {value:"SI",label:"Claro que si!|Si quiero intentar otra fecha|si por favor|si|si quiero continuar|si consultar"},
            {value:"NO",label:"No, gracias|No quiero continuar| Negacion|no|no consultar"}
            ];
        opcionesSimples.setChoices(answers,'value','label',false);
       
       this.nextActivity=this.deseaContinuar;
       // this.nextActivity=this.showResult;

    }

    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="SI"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.chooseMoneda();
        }else{
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            if(ACTIVITY_LOGIN){
                ChatbotStatus.currentActivity=Login.NAME;
                ACTIVITY_LOGIN.showMenu();
            }
        }
    }
    //methods
    nextActivity=()=>{
    };
    hasFinished(){
        return this.nextActivity==undefined;
     }
}
class BCRPData{
    static NAME="bcrpdata";
    constructor(){
        this.nextActivity=this.Welcome;
        this.categoria="none";
        this.subcategoria="none";
        this.temporalidad="none";
        this.codigos="none";
        this.fechaIncio="none";
        this.fechaFin="none";
        this.repeatQuery=false; //las querys se repiten de forma automatica. POrlo que se haran hasta que el usuario diga que no.
    }
    async Welcome(){
        addMessageChatbot("Servicio de <b>consulta de BCRP Data. 📈 🛠 </b> ",'<img src="img/bcrp_data.png" alt="bcrp image" width="100%" height="50%" style="margin-right=0%;" class="rounded">');
        addTypingEffect();
        const response=await cascada_bcrpdata("categoria","","");
        //activamos las opciones simples para que escoja una sola categoria.
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        //almacenamos las categorias
        let answers=[]; //para display en el chatbot
        currentAnswers=[]; //para enviarlos a la api de similaridad de texto.

        //answers.push({value:"none",label:"Escoja una Categoria",selected:true,disabled:true});
        response.data.forEach(element => {
            answers.push({value:element,label:element});
            currentAnswers.push({value:element,label:element});
        });
        opcionesMultiples.setChoices(answers,'value','label',false);
        removeTypingEffect();
        addMessageChatbot("😌 Gracias por escoger  el servicio, dispongase a escoger la <b>Categoría</b> que desea consultar:");
        this.nextActivity=this.showSubcategorias;

    }
    
    //mostrar la lista de GRUPOS de entidades
    
    async showSubcategorias(){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-subcategorias: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(element);
        });
        this.categoria=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        addTypingEffect();
        //manejamos las subcategorias con opciones multiples.
        const response=await cascada_bcrpdata("categoria",this.categoria,"subcategoria");
        //activamos las opciones simples para que escoja una sola categoria.
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        //almacenamos las categorias
        let answers=[]; //para display en el chatbot
        currentAnswers=[]; //para enviarlos a la api de similaridad de texto.
        response.data.forEach(element => {
            answers.push({value:element,label:element});
            currentAnswers.push({value:element,label:element});
        });
        opcionesMultiples.setChoices(answers,'value','label',false);
        removeTypingEffect();
        addMessageChatbot("🤔 Interesante 🤔, ahora seleccione las <b>Subcategorias</b> que desea consultar:");
        this.nextActivity=this.showTemporalidades;
    }

    async showTemporalidades(){
        //fragmento de temporalidades{}
        //if(this.repeatQuery==false){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-subcategorias: ",listValues);
        if(listValues.length<=0){
            insufficientData();
            //si no se selecciona nada, entonces no hacemos nada.
            return false;
        }
        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(element);
        });
        this.subcategoria=listValues.join(",");
        addMessageUsuario(formatText.join(", "));
        //fin del fagmento de temporalidades
        //}
        //simulamos el efecto de escritura mientras consultamos las temporalidades disponibles para  la categoria y subcategoria seleccionada.
        addTypingEffect();
        const response=await cascada_bcrpdata("subcategoria",this.subcategoria,"temporalidad");
        //activamos las opciones mutiples para que escoja una sola temporalidad.
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        //almacenamos las categorias
        let answers=[]; //para display en el chatbot
        currentAnswers=[]; //para enviarlos a la api de similaridad de texto.
        answers.push({value:"none",label:"Escoja una temporalidad",selected:true,disabled:true});
        response.data.forEach(element => {
            answers.push({value:element,label:capitalize(element)});
            currentAnswers.push({value:element,label:capitalize(element)});
        });
        opcionesSimples.setChoices(answers,'value','label',false);
        removeTypingEffect();
        addMessageChatbot("📆 Escoja las <b>Temporalidades</b> en las que desea consultar la serie:");
        this.nextActivity=this.showCodigos;
    }

    async showCodigos(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //seleccion de entidades
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        this.temporalidad=value;
        addMessageUsuario(texto);
        //simulamos el efecto de escritura mientras consultamos las temporalidades disponibles para  la categoria y subcategoria seleccionada.
        addTypingEffect();
        const response=await query_bcrpdata(this.categoria,this.subcategoria,this.temporalidad);
        //activamos las opciones mutiples para que escoja una o varios codigos.
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        //storing the categories
        let answers=[]; //para display en el chatbot
        currentAnswers=[]; //para enviarlos a la api de similaridad de texto.
        response.data.codigos.forEach(element => {
            answers.push({value:element["codigo"],label:element["codigo"]+" - "+element["serie"]});
            currentAnswers.push({value:element["codigo"],label:element["serie"]});
        });
        console.log(opcionesMultiples.config);
        opcionesMultiples.config.searchEnabled=true;
        //enableInputFromMultichoice();
        //agregar codigo para habilitar la busqueda cuando tenemos más de 5 items.
        if(answers.length<=5 && isMobileDevice()){
            opcionesMultiples.config.searchEnabled=false;
            console.log("Busqueda deshabilitada");
            $(".choices__input choices__input--cloned").blur();
        }else{
            $(".choices__input choices__input--cloned").focus();
        }
        console.log("opcionesMultiples.searchEnabled: ",opcionesMultiples.config.searchEnabled);
        //console.log("answers: ",answers);
        console.log("Length answers: ",answers.length);
        console.log("isMobileDevice: ",isMobileDevice());

        opcionesMultiples.setChoices(answers,'value','label',false);
        
        removeTypingEffect();
        addMessageChatbot("💻 Por último, seleccione los <b>Códigos</b> que desea consultar.");
        

        this.nextActivity=this.showDatesBeginingEnding;

    }
    showDatesBeginingEnding(){
        //fragmento de codigo muy importante
        //opcionesMultiples.clearStore();
        opcionesMultiples.config.searchEnabled=false;
        if(isMobileDevice()){
            $(".choices__input choices__input--cloned").blur();
        }else{
            $(".choices__input choices__input--cloned").focus();
        }
        console.log("Busqueda habilitada x defecto");
        //disableInputFromMultichoice();
        //fin del fragmento de codigo muy importante
        if(this.repeatQuery==false){
            var listValues= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
            });
            //get all labels
            var listLabels= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listLabels.push($(this).text());
            });
            console.log("Opciones multiples-codigos: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }
        
            let formatText=[]
            listLabels.forEach(element=>{
                formatText.push(element);
            });
            this.codigos= new Array();
            //asignamos los codigos.
            //guardamos los codigos seleccionados
            listValues.forEach(element=>{
                this.codigos.push(element);
            });
            //imprimimos los codigos seleccionados.
            addMessageUsuario(formatText.join("<br>"));
            opcionesMultiples.clearStore();
        }
        
        
        //we configure the datepicker according to the temporalidad selected.
        if(this.temporalidad=="mensuales"){
            activateInputFechas();
            activateMonthYearPicker();
        }else if(this.temporalidad=="anuales"){
            activateInputFechas();
            activateYearPicker();
        }
        else if(this.temporalidad=="trimestrales"){
            activateInputFechasTrimestre();
            activateTrimestrePicker();
        }else if(this.temporalidad=="diarias"){
            activateInputFechas();
            activateDailyPicker();
        }
        addMessageChatbot("📅 Por último, seleccione el <b>intervalo de fechas "+this.temporalidad.toUpperCase()+"</b> que desea consultar.");


        this.nextActivity=this.showData;
    }
     showData(){
        //verificamos si es una temporalidad TRIMESTRAL porque estan tendran
        //un trato especial.
        if(this.temporalidad!="trimestrales"){ //obtenemos la fechas comunes
            this.fechaFrom=$("#fechaFrom").val();
            this.fechaTo=$("#fechaTo").val();
        }else{
            //obtenemos las fechas trimestrales
            this.fechaFrom=$("#fromTrimestreYear").val()+"-"+$("#fromTrimestreNumber").val();
            this.fechaTo=$("#toTrimestreYear").val()+"-"+$("#toTrimestreNumber").val();
        }
        
        console.log("Fechas: ",this.fechaFrom,this.fechaTo);
        //primer filtro de datos de fechas
        if(this.fechaFrom.trim()=="" || this.fechaTo.trim()==""){
            Swal.fire({
                title:"Error de fechas",
                text:"Por favor rellene los campos de fechas",
                icon:"warning",
                confirmButtonColor:"#22528"
            });
            return false;

        }
        //segundo y ultimo filtro de datos de fechas
        if(validate_dates_pro(this.fechaFrom,this.fechaTo,this.temporalidad)==false){
            
            Swal.fire({
                title:"Error de fechas",
                text:"Por favor seleccione un rango valido de fechas.",
                icon:"warning",
                confirmButtonColor:"#22528"
            });

            return false;
        }
        
        let start_date=undefined;
        let final_date=undefined;
        //mostramos el mensaje para las fechas seleccionaas en funcion de la temporalidad.
        if(this.temporalidad=="mensuales"){
            start_date=this.fechaFrom.split("/")[1]+"-"+this.fechaFrom.split("/")[0]
            final_date=this.fechaTo.split("/")[1]+"-"+this.fechaTo.split("/")[0]

            addMessageUsuario("Del mes de "+this.fechaFrom.split("/")[0]+" del año "+this.fechaFrom.split("/")[1]+" al mes de "+this.fechaTo.split("/")[0]+" del año "+this.fechaTo.split("/")[1]);
        }else if(this.temporalidad=="anuales"){
            start_date=this.fechaFrom;
            final_date=this.fechaTo;
            addMessageUsuario("Del año "+this.fechaFrom+" al año "+this.fechaTo);
        }else if(this.temporalidad=="trimestrales"){
            start_date=this.fechaFrom;
            final_date=this.fechaTo;
            addMessageUsuario("Del trimestre "+this.fechaFrom+" al trimestre "+this.fechaTo);
        }else if(this.temporalidad=="diarias"){
            start_date=this.fechaFrom;
            final_date=this.fechaTo;
            addMessageUsuario("Del día "+this.fechaFrom+" al día "+this.fechaTo);
        }
        //create the data to send to the api.
        var URL_API_BCRP="https://estadisticas.bcrp.gob.pe/estadisticas/series/api/"
         //creamos los botones para mostrar la descarga de datos de temporalidad anual.
         let questions="Los resultados para la consulta de las series del BCRP Data usando sus criterios son:<br><br>";
         //let questions="Los resultados para la consulta de las series del BCRP Data usando la categoria <b>"+capitalize(this.categoria)+"</b>, subcategoria <b>"+capitalize(this.subcategoria)+"</b> y temporalidad <b>"+capitalize(this.temporalidad)+"</b> son los siguientes:<br><br>";
        //consultamos cuantos grupos de 10 tenemos (10 es el numero de codigos que se pueden consultar en la api de bcrp)
        let num_groups=Math.ceil(this.codigos.length/10);
        if(num_groups==1){
            //como solo hay un grupo, entonces no hay necesidad de hacer un for.
            questions+="Temporalidad "+this.temporalidad+" <br><br>";
            let api_code_url=URL_API_BCRP+this.codigos.join("-")+"/xls/"+start_date+"/"+final_date+"/esp";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+api_code_url+"'>Descargar EXCEL</a><br><br>";
                    
        }else{
            //en caso existan mas de un grupo de 10 codigos, entonces mostramos los botones por cada grupo para descargar los datos.
            //mostramos los mensajes con las fechas.
            let wrap_codes= new Array();
            //numero de grupos de 10 codigos
            let n_group=1;
            console.log("Codigos: ",this.codigos);
            for(let i=1;i<=this.codigos.length;i++){
                //cada 10 codigos imprime un mensaje.
                wrap_codes.push(this.codigos[i-1]);
                if(i%10==0){
                    questions+="Temporalidad "+this.temporalidad+" | Grupo ("+n_group+")<br><br>";
                    let api_code_url=URL_API_BCRP+wrap_codes.join("-")+"/xls/"+start_date+"/"+final_date+"/esp";
                    questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+api_code_url+"'>Descargar EXCEL</a><br><br>";
                    wrap_codes=[];
                    n_group++;
                }
            }
            //si termina la ejecucion y el numero de elementos no es par, entonces mostramos el ultimo grupo.
            if(wrap_codes.length>0){
                questions+="Temporalidad "+this.temporalidad+" | Grupo ("+n_group+")<br><br>";
                let api_code_url=URL_API_BCRP+wrap_codes.join("-")+"/xls/"+start_date+"/"+final_date+"/esp";
                questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+api_code_url+"'>Descargar EXCEL</a><br><br>";
            }
        }
        //imprimimos el ultimo grupo de codigos.
        addMessageChatbot(questions);

        addMessageChatbot("🤔 ¿Desea consultar otro rango de fechas? 🤔");
       
        
       //cambiar los dats
       activateInputOpcionesSimples();
       opcionesSimples.clearStore();
       let answers=[
            {value:"none",label:"Escoja una opción",selected:true,disabled:true},
            {value:"SI",label:"Sí, consultar otro rango.",selected:false},
            {value:"NO",label:"No, gracias.",selected:false}
       ];
       currentAnswers=[
        {value:"SI",label:"Claro que si!|Si quiero intentar otra fecha|si por favor|si|si quiero continuar|si consultar|si otro rango"},
        {value:"NO",label:"No, gracias|No quiero continuar| Negacion|no|no consultar"}
        ];
        opcionesSimples.setChoices(answers,'value','label',false);
       
       this.nextActivity=this.deseaContinuar;
        

    }
    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="SI"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.showDatesBeginingEnding();
        }else{
            addMessageChatbot("✅Muchas gracias por realizar su consulta✅.","😀Si desea realizar otra consulta, por favor seleccionela del menú principal😀.");
            activateInputOpcionesSimples();//activamos el input de opciones simples.
            opcionesSimples.clearStore();//borramos temporalmente el store de opciones simples.
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            addTypingEffect();

            setTimeout(function(){
                console.log("removing typing effect");
                removeTypingEffect();
                this.nextActivity=undefined;
                //los values son los codigos.
                if(ACTIVITY_LOGIN){
                    ChatbotStatus.currentActivity=Login.NAME;
                    ACTIVITY_LOGIN.showMenu();
                }

            }, 3000);
            }
    }
    //methods
    nextActivity=()=>{
    };
    hasFinished(){
        return this.nextActivity==undefined;
     }
}
class TipoCambioContable{
    static NAME="cambiocontable"
    constructor(){
        this.temporalidad=undefined;
        this.pais=undefined;
        this.nextActivity=this.Welcome;
        this.repeatQuery=false;
    }
    async Welcome(){

        addMessageChatbot("Bienvenido al servicio de tipo de cambio contable.","Por favor, ingrese el <b>País</b> de la cual desea conocer el tipo de cambio contable.");
        const response=await cascada_cambiocontable();
        //cambiar los dats
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[];
        currentAnswers=[];
        //cargamos las operaciones disponibles.
        //$("#opcionesSimples").empty();
        answers.push({value:"none",label:"Escoja una opción",selected:true,disabled:true});
        response.data.forEach((item)=>{
            answers.push({value:item['Pais'],label:item['Pais']+" - "+item['Moneda']});
            currentAnswers.push({value:item['Pais'],label:item['Pais']+" - "+item['Moneda']});
            //$("#opcionesSimples").append(new Option(capitalize(item), item));   
        });//it maybe in thefuture we can add a mask using the label country-coin.
        //agregamos las opciones
        opcionesSimples.setChoices(answers,'value','label',false);
        this.nextActivity=this.showTipoFecha;
    }
    showTipoFecha(){
        //extract data from the input option simple
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();

        this.pais=value;
        addMessageUsuario(this.pais);

        addMessageChatbot("Seleccione el tipo de fechas que desea consultar")
        //cambiar los dats
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=["mensuales","diarias"];
        currentAnswers=[];
        //cargamos las operaciones disponibles.
        //$("#opcionesSimples").empty();
        //answers.push({value:"none",label:"Escoja una opción",selected:true,disabled:true});
        answers.forEach((item)=>{
            answers.push({value:item,label:capitalize(item),selected:true});
            currentAnswers.push({value:item,label:capitalize(item)});
            //$("#opcionesSimples").append(new Option(capitalize(item), item));   
        });//it maybe in thefuture we can add a mask using the label country-coin.
        //agregamos las opciones
        opcionesSimples.setChoices(answers,'value','label',false);
        this.nextActivity=this.chooseFecha;
    }
    chooseFecha(){
        if(this.repeatQuery==false){
            //extract data from the input option simple
            let value=$("#opcionesSimples").val();
            let texto=$("#opcionesSimples option:selected").text();

            this.temporalidad=value;
            addMessageUsuario(texto);
        }
        addMessageChatbot("Ingrese el rango de fechas <b>"+this.temporalidad+"</b> que desea consultar:");
        if(this.temporalidad=="mensuales"){
            activateInputFechas();
            activateMonthYearPicker();
        }else if(this.temporalidad=="diarias"){
            activateInputFechas();
            activateDailyPicker();
        }
        this.nextActivity=this.consultarcontable;
    }
    async consultarcontable(){
        //recopilar datos de las fechas
        this.fechaFrom=$("#fechaFrom").val();
        this.fechaTo=$("#fechaTo").val();
        //validar fechas
        console.log("Fechas: ",this.fechaFrom,this.fechaTo);
        //primer filtro de datos de fechas
        if(this.fechaFrom.trim()=="" || this.fechaTo.trim()==""){
            Swal.fire({
                title:"Error de fechas",
                text:"Por favor rellene los campos de fechas",
                icon:"warning",
                confirmButtonColor:"#22528"
            });
            return false;

        }
        //segundo y ultimo filtro de datos de fechas
        if(validate_dates_pro(this.fechaFrom,this.fechaTo,this.temporalidad)==false){
            
            Swal.fire({
                title:"Error de fechas",
                text:"Por favor seleccione un rango valido de fechas.",
                icon:"warning",
                confirmButtonColor:"#22528"
            });

            return false;
        }
        
        let start_date=undefined;
        let final_date=undefined;

        var filter_month=false;
        if(this.temporalidad=="mensuales"){
            start_date=this.fechaFrom.split("/")[1]+"-"+this.fechaFrom.split("/")[0]+"-01";
            final_date=new Date(Number.parseInt(this.fechaTo.split("/")[1]),Number.parseInt(this.fechaTo.split("/")[0]),0);
            final_date=final_date.getFullYear()+"-"+(final_date.getMonth()+1)+"-"+final_date.getDate();
            filter_month=true;
            addMessageUsuario("Del mes de "+this.fechaFrom.split("/")[0]+" del año "+this.fechaFrom.split("/")[1]+" al mes de "+this.fechaTo.split("/")[0]+" del año "+this.fechaTo.split("/")[1]);
        }else if(this.temporalidad=="diarias"){
            start_date=this.fechaFrom;
            final_date=this.fechaTo;
            filter_month=false;
            addMessageUsuario("Del día "+this.fechaFrom+" al día "+this.fechaTo);
        }
        //consultar el servicio
        addMessageChatbot("Consultando el tipo de cambio contable del país "+this.pais+" en el rango de fechas "+this.fechaFrom+" al "+this.fechaTo);

        //consultar el servicio
        const response=await cambiocontable(this.pais,start_date,final_date,6);
        if(response.status!="fail"){ //si los datos no estan vacios
            if (response.data.length<=5){//si la cantidad de datos es menor o igual a 5
                addMessageChatbot("Se encontraron "+response.data.length+" resultados para el rango de fechas seleccionado sobre el País "+this.pais);
                let response_formater=await cambiocontable_formatter(this.pais,start_date,final_date);
                addMessageChatbot(response_formater.data);
    
            }
            //si es mayor de todas formas se mostraran la opcion de descargar.
            let URL_DOWNLOAD_EXCEL=API_CHATBOT+"/cambiocontable/file/xlsx?pais="+this.pais+"&start="+start_date+"&end="+final_date+"&verify=false&filter_month="+filter_month;
            let URL_DOWNLOAD_CSV=API_CHATBOT+"/cambiocontable/file/csv?pais="+this.pais+"&start="+start_date+"&end="+final_date+"&verify=false&filter_month="+filter_month;
            let questions="Se encontraron resultados lo cuales puede descargarlos en formato CSV y EXCEL <br><br>";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"'>Descargar EXCEL</a><br><br>";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283' role='button' href='"+URL_DOWNLOAD_CSV+"'>Descargar CSV</a><br>";
            addMessageChatbot(questions);
            //return false;
        }else {//si los datos estan vacios
            addMessageChatbot("😰 No se encontraron datos del tipo de cambio contable para el país <b>"+this.pais+"</b> en el rango de fechas seleccionado 😰.");
            
        }
        ////////////////////////////////////

        addMessageChatbot("🤔 ¿Desea consultar otro rango de fechas? 🤔");
       
        
        //cambiar los dats
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
             {value:"none",label:"Escoja una opción",selected:true,disabled:true},
             {value:"SI",label:"Sí, consultar otro rango.",selected:false},
             {value:"NO",label:"No, gracias.",selected:false}
        ];
        currentAnswers=[
         {value:"SI",label:"Claro que si!|Si quiero intentar otra fecha|si por favor|si|si quiero continuar|si consultar|si otro rango"},
         {value:"NO",label:"No, gracias|No quiero continuar| Negacion|no|no consultar"}
         ];
         opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.deseaContinuar;
        
    }
    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="SI"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.chooseFecha();
        }else{
            addMessageChatbot("✅Muchas gracias por realizar su consulta✅.","😀Si desea realizar otra consulta, por favor seleccionela del menú principal😀.");
            activateInputOpcionesSimples();//activamos el input de opciones simples.
            opcionesSimples.clearStore();//borramos temporalmente el store de opciones simples.
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            addTypingEffect();

            setTimeout(function(){
                console.log("removing typing effect");
                removeTypingEffect();
                this.nextActivity=undefined;
                //los values son los codigos.
                if(ACTIVITY_LOGIN){
                    ChatbotStatus.currentActivity=Login.NAME;
                    ACTIVITY_LOGIN.showMenu();
                }

            }, 3000);
            }}
    hasFinished(){
        return this.nextActivity==undefined;
     }
}

class ComunicadosBCRP{
    static NAME="comunicados";
    constructor(){
        this.decisionPOM=undefined;
        this.indiceTono=undefined;
        this.min_rangeIndTono=undefined;
        this.max_rangeIndTono=undefined;
        this.tasaReal=undefined;
        this.min_rangeTasaReal=undefined;
        this.max_rangeTasaReal=undefined;
        this.pbi=undefined;
        this.mesAnterior=undefined;
        this.tasaReferencial=undefined;
        this.nextActivity=this.cleanInputs;
        this.repeatQuery=false;
    }
    cleanInputs(){
        $("#inputChat").val("");        
        this.showCriteria()
    }
    showCriteria(){
        addMessageChatbot("Buena elección !!! 👍. Por favor seleccione un criterio de búsqueda.");
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();       

        //almacenamos las categorias
        let answers=[
            {value:"none",label:"Escoja una opción",selected:true,disabled:true},
            {value:"1",label:"Por Decisión de Política Monetaria [redujo, eleva, mantuvo]",selected:false},
            {value:"2",label:"Por índice Tono [dovish, hawkish, neutral]",selected:false},
            {value:"3",label:"Por Tasa Real",selected:false},
            {value:"4",label:"Por PBI",selected:false},
            {value:"5",label:"Por Palabra Clave",selected:false},
            {value:"6",label:"Nivel Tasa de Referencia",selected:false}
            //{value:"6",label:"Agregar t-1",selected:false}
        ]; //para display en el chatbot

        opcionesSimples.setChoices(answers,'value','label',false);      
        this.nextActivity=this.chooseOptionsCriteria;
    }
    chooseOptionsCriteria(){

        var value=$("#opcionesSimples").val();
        var texto=$("#opcionesSimples option:selected").text();

        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);

        if(value=="1"){//Por Tasa Referencial
            this.showDecision();
        }else if(value=="2"){//Por índice Tono
            this.showOptionsIndiceTono();
        }else if(value=="3"){//Por Tasa Real
            this.showOptionsTasaReal();
        }else if(value=="4"){//Por PBI
            this.showOptionsPBI();
        }else if(value=="5"){//Por palabra clave
            addMessageChatbot("Por favor, ingrese las <b>Palabras claves</b>. En caso tenga más de una palabra clave, separelos utilizando comas. 🖋️");
            activateEntradaTexto();
            $('#inputChat').attr('type', 'text');
            this.nextActivity=this.chooseValuePalabraClave;
        }else if(value=="6"){//Por Tasa referencial
            this.showOptionsTasaRef();           
        }else{
            this.showOptionsMesAnterior(); 
        }

    }
    showDecision(){
        addMessageChatbot("Entendido !!! 👍. Por favor, seleccione las siguientes opciones que corresponden a la <b>decisión de la Tasa Referencial</b> de POM:");

        //activamos las opciones simples para que escoja una sola categoria.
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();     
        //almacenamos las categorias
        let answers=[
            {value:"Mantener",label:"Mantener",selected:false},
            {value:"Elevar",label:"Elevar",selected:false},
            {value:"Reducir",label:"Reducir",selected:false}
        ]; //para display en el chatbot

        opcionesMultiples.setChoices(answers,'value','label',false);      
        this.nextActivity=this.chooseDecision;
    }    
    chooseDecision(){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-decision: ",listValues);
        if(listValues.length<=0){
            this.decisionPOM=undefined;
            opcionesMultiples.clearStore();
            addMessageUsuario("Ninguno");
        }else{
            let formatText=[]
            listValues.forEach(element=>{
                formatText.push(element);
            });
            this.decisionPOM=listValues.join(",");

            addMessageUsuario(formatText.join(", "));
        }
        this.showOptionsContinuar();
    }
    showOptionsIndiceTono(){
        addMessageChatbot("😌 Gracias por su elección !!!. La búsqueda por <b>Índice de Tono</b>, "+
                        "puede ser de tipo <b>{Dovish,Hawkish y/o Neutro}</b> "+
                        "o por <b>rango de valor.</b>");

        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
             {value:"none",label:"Escoja una opción",selected:true,disabled:true},
             {value:"Tipo",label:"Por Tipo",selected:false},
             {value:"Rango",label:"Por Rango",selected:false},
             {value:"Ninguno",label:"Ninguno",selected:false}
        ];

        opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.chooseOptionsIndiceTono;
    }
    async chooseOptionsIndiceTono(){
        var value=$("#opcionesSimples").val();
        var texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);

        if(value=="Tipo"){
            addMessageChatbot("Muy bien !!! 👍. Por favor, seleccione una o varias opciones:");

            //activamos las opciones múltiples para que escoja una o varias categorias.
            activateInputOpcionesMultiples();
            opcionesMultiples.clearStore();
            //almacenamos las categorias
            let answers=[
                {value:"Dovish",label:"Dovish",selected:false},
                {value:"Hawkish",label:"Hawkish",selected:false},
                {value:"Neutro",label:"Neutro",selected:false}
            ]; //para display en el chatbot

            opcionesMultiples.setChoices(answers,'value','label',false);
            this.nextActivity=this.chooseValueIndiceTono;
        }else if(value=="Rango"){
            this.indiceTono=undefined;
            opcionesMultiples.clearStore();
            addMessageChatbot("Excelente !!! 👍. Por favor, ingrese el rango de búsqueda para la opción de <b>Índice de Tono</b>:");
            addTypingEffect()
            const response=await indicetono_comunicadobcrp();

            let min = response.data[0]["min"]
            let max = response.data[0]["max"]
            //activamos las opcion de rango
            activateInputSliderRange(min,max,0.1,1);
            removeTypingEffect()
            this.nextActivity=this.chooseValueIndiceTono;           
        }else{
            this.indiceTono=undefined;
            this.min_rangeIndTono=undefined;
            this.max_rangeIndTono=undefined; 
            opcionesMultiples.clearStore();
            this.showOptionsContinuar();
        }
    }
    chooseValueIndiceTono(){
        if($("#opcionesSimples").val()=="Tipo"){
            var listValues= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
            });
            console.log("Opciones multiples-decision: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }
            let formatText=[]
            listValues.forEach(element=>{
                formatText.push(element);
            });
            this.indiceTono=listValues.join(",");        
            addMessageUsuario(formatText.join(", "));

            this.min_rangeIndTono=undefined;
            this.max_rangeIndTono=undefined;   
        }else{   
            this.min_rangeIndTono=parseFloat($('#sliderRange').val().split(",")[0])
            this.max_rangeIndTono=parseFloat($('#sliderRange').val().split(",")[1])

            if(VerificarRango(this.min_rangeIndTono,this.max_rangeIndTono)==false){
                return false;    
            }
            addMessageUsuario("De "+this.min_rangeIndTono+" a "+this.max_rangeIndTono);
        }
        this.showOptionsContinuar();
    }
    showOptionsTasaReal(){
        addMessageChatbot("👍 Estupendo trabajo !!!. La búsqueda por la <b>Tasa Real</b>, "+
                            "puede ser de tipo <b>{Restrictiva,Expansiva,Neutra}</b> "+
                            "o por <b>rango de valor.</b>");

        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
             {value:"none",label:"Escoja una opción",selected:true,disabled:true},
             {value:"Tipo",label:"Por Tipo",selected:false},
             {value:"Rango",label:"Por Rango",selected:false},
             {value:"Ninguno",label:"Ninguno",selected:false}
        ];

        opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.chooseOptionsTasaReal;
    }
    async chooseOptionsTasaReal(){
        var value=$("#opcionesSimples").val();
        var texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);

        if(value=="Tipo"){
            addMessageChatbot("Buen trabajo !!! 👍. Por favor, seleccione una o varias opciones:");

            //activamos las opciones múltiples para que escoja una o varias categorias.
            activateInputOpcionesMultiples();
            opcionesMultiples.clearStore();
            //almacenamos las categorias
            let answers=[
                {value:"Restrictiva",label:"Restrictiva",selected:false},
                {value:"Expansiva",label:"Expansiva",selected:false},
                {value:"Neutra",label:"Neutra",selected:false}
            ]; //para display en el chatbot

            opcionesMultiples.setChoices(answers,'value','label',false);
            this.nextActivity=this.chooseValueTasaReal;

        }else if(value=="Rango"){
            addMessageChatbot("Muy bien !!! 😁. Por favor, ingrese el rango de búsqueda para la <b>Tasa Real</b>:");
            addTypingEffect();
            const response=await tasareal_comunicadobcrp();

            let min = response.data[0]["min"]
            let max = response.data[0]["max"]
            //activamos las opcion de rango
            activateInputSliderRange(min,max,0.1,1);
            removeTypingEffect();

            this.tasaReal=undefined;
            this.nextActivity=this.chooseValueTasaReal;
            
        }else{
            this.tasaReal=undefined;
            this.min_rangeTasaReal=undefined;
            this.max_rangeTasaReal=undefined; 
            opcionesMultiples.clearStore();
            this.showOptionsContinuar();
        }
    }
    chooseValueTasaReal(){
        if($("#opcionesSimples").val()=="Tipo"){
            var listValues= new Array();
            $("#choices-multiple-remove-button option:selected").each(function(){
                listValues.push($(this).val());
            });
            console.log("Opciones multiples-decision: ",listValues);
            if(listValues.length<=0){
                insufficientData();
                //si no se selecciona nada, entonces no hacemos nada.
                return false;
            }
            let formatText=[]
            listValues.forEach(element=>{
                formatText.push(element);
            });
            this.tasaReal=listValues.join(",");
            addMessageUsuario(formatText.join(", "));
            this.min_rangeTasaReal=undefined;
            this.max_rangeTasaReal=undefined;
        }else{
           
            this.min_rangeTasaReal=parseFloat($('#sliderRange').val().split(",")[0])
            this.max_rangeTasaReal=parseFloat($('#sliderRange').val().split(",")[1])

            if(VerificarRango(this.min_rangeTasaReal,this.max_rangeTasaReal)==false){
                return false;    
            }

            addMessageUsuario("De "+this.min_rangeTasaReal+" a "+this.max_rangeTasaReal);
        }
        this.showOptionsContinuar();
    }
    showOptionsPBI(){
        addMessageChatbot("Dispóngase a escoger la opción para filtar la búsqueda por <b>PBI</b>.");

        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
             {value:"none",label:"Escoja una opción",selected:true,disabled:true},
             {value:"Positivos",label:"Valores positivos",selected:false},
             {value:"Todos",label:"Todos",selected:false}
        ];

        opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.chooseValuePBI;
    }
    chooseValuePBI(){
        var value=$("#opcionesSimples").val();
        var texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        this.pbi=value;
        addMessageUsuario(texto);
        this.showOptionsContinuar();
    }
    chooseValuePalabraClave(){      
        var listValues=new Array();
        listValues=$("#inputChat").val().split(",");

        let formatText=[]
        listValues.forEach(element=>{
            formatText.push(element.trim());
        });
        this.palabraClave=listValues.join(",").trim().replace(/\s\s+/g,'');
        if (this.palabraClave==""){
            this.palabraClave=undefined
        }        
        addMessageUsuario(formatText.join(", ").trim()=="" ? "............." : formatText.join(", ").trim());
        this.showOptionsContinuar();
    }
    async showOptionsTasaRef(){
        addTypingEffect();
        //obtenmos los valores únicos de la tasa referencial
        const response=await tasareferencial_comunicadobcrp("Tipo",this.tipoEntidad,"Entidad");
        //const response = {data:[0.25,0.5,1,1.25,7.25,7.5,7.75]}
        let answers=[];
        response.data.forEach(element=>{
            answers.push({value:element,label:element,selected:false});
        });
        currentAnswers=answers;
        
        addMessageChatbot("Buenísismo !!! 👍. Por favor, seleccione uno o más valores del <b>Nivel de Tasa de referencia</b>:");
        //seleccion multiple
        activateInputOpcionesMultiples();
        opcionesMultiples.clearStore();
        opcionesMultiples.setChoices(answers,'value','label',false);       
    
        this.nextActivity=this.chooseTasaRef;
        removeTypingEffect();
    }
    chooseTasaRef(){
        var listValues= new Array();
        $("#choices-multiple-remove-button option:selected").each(function(){
            listValues.push($(this).val());
        });
        console.log("Opciones multiples-decision: ",listValues);
        if(listValues.length<=0){
            this.tasaReferencial=undefined;
            opcionesMultiples.clearStore();
            addMessageUsuario("Ninguno");
        }else{
            let formatText=[]
            listValues.forEach(element=>{
                formatText.push(element);
            });
            this.tasaReferencial=listValues.join(",");

            addMessageUsuario(formatText.join(", "));
        }
        this.showOptionsContinuar();
    }
    showOptionsMesAnterior(){
        addMessageChatbot("👍 Ánimo !!!. 🤔 ¿Desea agregar información del mes anterior? 🤔");

        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
             {value:"none",label:"Escoja una opción",selected:true,disabled:true},
             {value:"SI",label:"Si, por supuesto!",selected:false},
             {value:"NO",label:"No, gracias.",selected:false}
        ];

        opcionesSimples.setChoices(answers,'value','label',false);

        this.nextActivity=this.chooseOptionsMesAnterior;
    }
    chooseOptionsMesAnterior(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        this.mesAnterior=value;
        addMessageUsuario(texto);
        this.showOptionsContinuar();

    }
    chooseFecha(){
        addMessageChatbot("📅 ¿Qué rango de fechas desea consultar?📅:");
        activateInputFechas()
        activateMonthYearPicker("01/2001",undefined)

        this.nextActivity=this.consultarComunicadosBCRP;               
    }
    async consultarComunicadosBCRP(){
        let fechaFrom=$("#fechaFrom").val();
        let fechaTo=$("#fechaTo").val();
        if(fechaFrom=="" || fechaTo==""){
            insufficientData();
            return false;
        }
        this.fechaFrom=fechaFrom;
        this.fechaTo=fechaTo;
        let mensaje="";
        if(this.fechaFrom==this.fechaTo){
            mensaje="Consultar solo la fecha del "+this.fechaFrom;
        }else{
            mensaje="Consultar el rango de fechas desde el "+this.fechaFrom+" hasta el "+this.fechaTo;
        }  
        addMessageUsuario(mensaje);
        addMessageChatbot("🔎 Consultando información de los <b>Comunicados del BCRP</b>")
        addMessageChatbot("👉 Resumen de la consulta:<br>"+
                          "<b>Decisión POM: </b>"+(this.decisionPOM == undefined ? "-": this.decisionPOM)+"<br>"+
                          "<b>Palabra clave: </b>"+(this.palabraClave == undefined ? "-": this.palabraClave)+"<br>"+
                          "<b>índice de tono por tipo: </b>"+(this.indiceTono == undefined ? "-": this.indiceTono)+"<br>"+
                          "<b>Mínimo índice de tono: </b>"+(this.min_rangeIndTono == undefined ? "-": this.min_rangeIndTono)+"<br>"+
                          "<b>Máximo índice de tono: </b>"+(this.max_rangeIndTono == undefined ? "-": this.max_rangeIndTono)+"<br>"+
                          "<b>Tasa real por tipo: </b>"+(this.tasaReal == undefined ? "-": this.tasaReal)+"<br>"+
                          "<b>Mínimo Tasa real: </b>"+(this.min_rangeTasaReal == undefined ? "-": this.min_rangeTasaReal)+"<br>"+
                          "<b>Máximo Tasa real: </b>"+(this.max_rangeTasaReal == undefined ? "-": this.max_rangeTasaReal)+"<br>"+
                          //"<b>Agregar t-1: </b>"+(this.mesAnterior== undefined ? "-": this.mesAnterior)+"<br>"+ 
                          "<b>PBI: </b>"+(this.pbi == undefined ? "-": this.pbi)+"<br>"+
                          "<b>Nivel de Tasa de referencia: </b>"+(this.tasaReferencial == undefined ? "-": this.tasaReferencial))                      
        addTypingEffect()

        console.log('Decision: ',this.decisionPOM)
        console.log('Palabra clave: ',this.palabraClave)
        console.log('start: ',this.fechaFrom)
        console.log('end: ',this.fechaTo)
        console.log('Indice Tono: ',this.indiceTono)
        console.log('Min Indice Tono: ',this.min_rangeIndTono)
        console.log('Max Indice Tono: ',this.max_rangeIndTono)
        console.log('Tasa Real: ',this.tasaReal)
        console.log('Min Tasa Real: ',this.min_rangeTasaReal)
        console.log('Max Tasa Real: ',this.max_rangeTasaReal)
        console.log('PBI: ',this.pbi)
        console.log('Tasa Referencial: ',this.tasaReferencial)
        //console.log('Agregar t-1: ',this.mesAnterior)

        const response = await query_comunicados_bcrp(this.fechaFrom,this.fechaTo,this.decisionPOM,this.palabraClave,this.indiceTono,this.min_rangeIndTono,this.max_rangeIndTono,this.tasaReal,this.min_rangeTasaReal,this.max_rangeTasaReal,this.pbi,this.tasaReferencial,this.mesAnterior);
        console.log(response);
        if(response.status!="fail"){ //si los datos no estan vacios
            //si es mayor de todas formas se mostraran la opcion de descargar.
            let URL_DOWNLOAD_EXCEL=API_CHATBOT+"/comunicadobcrp/file/xlsx?fecha_inicio="+this.fechaFrom+"&fecha_fin="+this.fechaTo+"&decisionPOM="+this.decisionPOM+"&palabraClave="+this.palabraClave+"&indiceTono="+this.indiceTono+"&min_rangeIndTono="+this.min_rangeIndTono+"&max_rangeIndTono="+this.max_rangeIndTono+"&tasaReal="+this.tasaReal+"&min_rangeTasaReal="+this.min_rangeTasaReal+"&max_rangeTasaReal="+this.max_rangeTasaReal+"&PBI="+this.pbi+"&tasaReferencial="+this.tasaReferencial+"&mes_anterior="+this.mes_anterior+"&verify=false";
            //let URL_DOWNLOAD_CSV=API_CHATBOT+"/comunicadobcrp/file/csv?decisionPOM="+this.decisionPOM+"&palabraClave="+this.palabraClave+"&fecha_inicio="+this.fechaFrom+"&fecha_fin="+this.fechaTo+"&indiceTono="+this.indiceTono+"&min_rangeIndTono="+this.min_rangeIndTono+"&max_rangeIndTono="+this.max_rangeIndTono+"&tasaReal="+this.tasaReal+"&min_rangeTasaReal="+this.min_rangeTasaReal+"&max_rangeTasaReal="+this.max_rangeTasaReal+"&min_rangePBI="+this.min_rangePBI+"&max_rangePBI="+this.max_rangePBI+"&verify=false";
            let questions="Se encontraron resultados lo cuales puede descargarlos en formato EXCEL <br><br>";
            questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283'  role='button' href='"+URL_DOWNLOAD_EXCEL+"'>Descargar EXCEL</a><br><br>";
            //questions+="<a class='btn btn-primary btn-sm' style='background-color:#225283;border-color:#225283' role='button' href='"+URL_DOWNLOAD_CSV+"'>Descargar CSV</a><br>";
            addMessageChatbot(questions);
            //return false;
        }else {//si los datos estan vacios
            addMessageChatbot("😰 No se encontraron datos de la búsqueda en los comunicados del BCRP para las palabras claves <b>"+this.palabraClave+"</b> en el rango de fechas seleccionado 😰.");
            
        }
        removeTypingEffect();       
        this.showOptionsContinuar();        
    }
    showOptionsContinuar(){
        let results="¡Gracias por utilizar el servicio!.<br> 🔎 ¿Desea añadir otro criterio de búsqueda? 🔍:"
        addMessageChatbot(results);

        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        let answers=[
                {value:"none",label:"Escoja una opción",selected:true,disabled:true},
                {value:"1",label:"Claro que si!",selected:false},
                {value:"2",label:"No, gracias. Deseo descargar la información.",selected:false},
                {value:"3",label:"No, gracias. Deseo volver al menú principal.",selected:false}
        ];

        opcionesSimples.setChoices(answers,'value','label',false);
    
        this.nextActivity=this.deseaContinuar;
    }
    deseaContinuar(){
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        console.log()
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        addMessageUsuario(texto);
        if(value=="1"){
            this.repeatQuery=true;
            //this.nextActivity=this.chooseFecha;
            this.showCriteria();
        }else if(value=="2"){
            this.chooseFecha();        
        }else{
            this.repeatQuery=false;
            //this.nextActivity=Login.showMenu;
            this.nextActivity=undefined;

            if(ACTIVITY_LOGIN){
                ChatbotStatus.currentActivity=Login.NAME;
                ACTIVITY_LOGIN.showMenu();
            }
        }
    }
    //methods
    nextActivity=()=>{
    };
    hasFinished(){
        return this.nextActivity==undefined;
        
     }
}
///////

class Login{
    //constructor
    static NAME="login";
    constructor(){
        this.index=0;
        this.role=undefined;
        this.user=undefined;
        this.hasLogged=false;
        //this.dialogFlow=[this.verifyLogin,this.showMenu];
        
        this.nextActivity=this.Welcome;
    }
    
     Welcome(){
        
        addMessageChatbot("Buen día!. Bienvenido al chat de consultas del BCRP 👋","Soy un asistente del Departamento de Estadísticas Monetarias 😀!",'<img src="img/portada.jpg" alt="bcrp image" width="100%" height="50%" style="margin-right=0%;" class="rounded">');
        addMessageChatbot("🌐 Ingresa tu código de autenticación para usar el servicio:");
        this.nextActivity=this.verifyLogin;
    }
     async verifyLogin(){
        let input=document.getElementById("inputChat").value.trim();
        /*if the entry is empty then return false value */
        if(input.length<=0){
               return false; 
        }
        addMessageUsuario("********"); //mostramos asteriscos en lugar del codigo de usuario
        document.getElementById("inputChat").value="";
        document.getElementById("inputChat").disabled=true;
        addTypingEffect();
        var response=false;
        try{
            response=await login(input,"");   
        }catch(error){
            console.log(error);
            this.nextActivity=undefined;
            removeTypingEffect();
            Swal.fire({
                title: 'Error',
                text:'No se puede acceder a la API del BCRP.',
                showConfirmButton:true,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
            //location.reload();
            return false;
        }
        
        if(response.status=="success"){
            this.user=input;
            this.role=response.data.rol;
            this.hasLogged=true;
            //guardamos el estatus
            removeTypingEffect();
            addMessageChatbot("✅ Autenticación exitosa ✅");
            this.nextActivity=this.showMenu;
            //ChatbotStatus.currentActivity=MenuPrincipal.NAME;
            document.getElementById("enviar").click(); //simulamos click para avanzar al siguiente paso
        }else{
            removeTypingEffect();
            addMessageChatbot("❌ Código incorrecto ❌","🌐 Ingresa tu código de autenticación para usar el servicio:");   
            this.nextActivity=this.verifyLogin;
        }
        //document.getElementById("inputChat").value="";
        document.getElementById("inputChat").disabled=false;
    }
    //
    showMenu(){
        //ChatbotStatus.currentActivity=MenuPrincipal.NAME;
        addMessageChatbot("Bienvenido "+this.role+" <b>"+this.user+"</b> a nuestra plataforma de chatbot del Dpto. de Estadísticas Monetarias.");
        addMessageChatbot('<img src="img/welcome.png" alt="bcrp image" width="100%" height="50%" style="margin-right=0%;" class="rounded">');
        addMessageChatbot("Está bien!, ahora puedes hacer tu consulta haciendo clic en la opción que desees:");
        activateInputOpcionesSimples();
        opcionesSimples.clearStore();
        var answers=[]
        if(this.role=="administrador"){
            answers=[
                        {value:"none",label:"Escoja una opción",selected:true,disabled:true},
                        {value:TipoCambio.NAME,label:"💲 Precio de compra y venta del dólar 💲",selected:false},
                        {value:TasasInteresSBS.NAME,label:"🏢 Tasas de intereses de la SBS 🏢",selected:false},
                        {value:TipoCambioContable.NAME,label:"💳 Tipo de cambio contable💳",selected:false},
                        {value:BCRPData.NAME,label:"🪙 BCRP Data 🪙",selected:false},
                        {value:ComunicadosBCRP.NAME,label:"🧾 Comunicados BCRP 🧾",selected:false}
                    ];
            currentAnswers=[
                {value:TipoCambio.NAME,label:"Precio de compra y venta del dólar|Informe del tipo de cambio del dolar|Reporte del dolar|Consultar el dolar"},
                {value:TasasInteresSBS.NAME,label:"Tasas de intereses de la SBS|Tasas de interes de la Superintendencia de Banca y seguros"},
                {value:TipoCambioContable.NAME,label:"tipo de cambio contable|cambio contable|los tipos de cambio contable"},
                {value:BCRPData.NAME,label:"BCRP Data|Base de datos de las estadisticas del BCRP|estadisticas monetarias del BCRP"}
            ]
        }else{
            //si no eres administrador no te damos mas que solo el precio de compra y venta del dolar.
            answers=[
                {value:"none",label:"Escoja una opción",selected:true,disabled:true},
                {value:TipoCambio.NAME,label:"💲 Precio de compra y venta del dólar 💲",selected:false},
            ];
            currentAnswers=[
                {value:TipoCambio.NAME,label:"Precio de compra y venta del dólar|Informe del tipo de cambio del dolar|Reporte del dolar|Consultar el dolar"}
            ]
    }
        opcionesSimples.setChoices(answers,'value','label',false);
       
        //agregando nueva actividad al flujo de ejecucion
        
        this.nextActivity=this.chooseActivity;
        ChatbotStatus.currentActivity=Login.NAME;
        console.log("currentActivity en showmenu: "+ChatbotStatus.currentActivity);
        console.log("Dirigiendo a ChooseActivity");
    }
    //methods
    chooseActivity(){
        console.log("ChooseActivity iniciado");
        let value=$("#opcionesSimples").val();
        let texto=$("#opcionesSimples option:selected").text();
        //error de seleccion
        if(value=="none"){
            errorSeleccion();
            return false;
        }
        console.log("value: "+value);
        console.log("texto: "+texto);
        addMessageUsuario(texto);
        ChatbotStatus.currentActivity=value;
       // document.getElementById("enviar").click();
        console.log("MenuPrincipal.chooseActivity() terminado");
        this.nextActivity=undefined;
        console.log("ChatbotStatus.currentActivity: "+ChatbotStatus.currentActivity);
        document.getElementById("enviar").click();
    }
    
     nextActivity=()=>{
     };
     hasFinished(){
        return this.nextActivity==undefined;
     }
}


/*CLASE DE INICIALIZACION DE ACTIVIDADES*/
class ChatbotStatus{
    static currentActivity=TipoCambio.NAME;
}
/*
Patron de diseño: Factory Method
*/
