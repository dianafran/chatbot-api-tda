
function capitalize(word) {
    return word
      .toLowerCase()
      .replace(/\w/, firstLetter => firstLetter.toUpperCase());
  }

function chooseSingleOption(){
    // activate the simple option input
    activateInputOpcionesSimples();
    //convert arguments to simple array
    let data=Array.prototype.slice.call(arguments);
    //cleaning previous data stored in opcionesSimples
    //iteramos las opciones
    let answers=[];
    answers.push({value:"none",label:"Seleccione una opción",selected:true,disabled:true});
    data.forEach(element=>{
        answers.push({value:element,label:capitalize(element),selected:false});
    });
    opcionesSimples.clearStore();
    opcionesSimples.setChoices(answers,'value','label',false);
}
function chooseMultipleOption(){
    // activate the multiple option input
    activateInputOpcionesMultiples();
    //convert arguments to simple array
    let data=Array.prototype.slice.call(arguments);
    let answers=[];
    data.forEach(element=>{
        answers.push({value:element,label:capitalize(element)});
    });
    opcionesMultiples.clearStore();
    opcionesMultiples.setChoices(answers,'value','label',false);
}
function getSingleOption(){
    let value=$("#opcionesSimples").val();
    let texto=$("#opcionesSimples option:selected").text();
    //verify the input of data
    if(value=="none"){
        errorSeleccion();
        return false;
    }
    return [value,texto];
}
function getMultipleOption(){
    //get list of values
    var listValues=new Array();
    $("#choices-multiple-remove-button option:selected").each(function(){
        listValues.push($(this).val());
    });
    //validate list of values
    if (listValues.length==0){
        insufficientData();
        return false;
    }
    //get list of texts
    let formatText=[];
    listValues.forEach(element =>{
        formatText.push(capitalize(element));
    });
    let values=listValues.join(",");
    let texto=formatText.join(", ");
    return [values,texto];
}
function getAllowInstances(){
    //this house aint a home
}
