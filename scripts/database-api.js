//var API_CHATBOT="http://147.182.174.135/";
//var API_CHATBOT="https://bcrp-chatbot-api-tesnet.azurewebsites.net/";
//var API_CHATBOT="http://127.0.0.1:8000";
//var API_CHATBOT="https://bcrpchatbotapi-peru-6kzhp.ondigitalocean.app/"; //DIGITAL OCEAN -JOHAN
//var API_CHATBOT="https://bcrp-chatbot-app-bcngc.ondigitalocean.app/"; //DIGITAL OCEAN -FRANK NOVOA
var API_CHATBOT="https://bcrp-chatbot-app-bcngc-ygbv3.ondigitalocean.app/"//DIGITAL OCEAN - DIANA BARDON
//fixing errors
if(API_CHATBOT.endsWith("/")){
    API_CHATBOT=API_CHATBOT.substring(0,API_CHATBOT.length-1)
}

const cambio=  async (start,end,entidad) => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/cambio/range/formatter?start="+start+"&end="+end+"&entidad="+entidad,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        console.log("result API Cambio: ",response.data)
        return response.data
    })
    
}
const interes= (start,end,entidad,categoria,subcategoria,moneda,tipo_entidad,filter_only_months) => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/tasas/file/csv",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            start: start,
            end: end,
            entidad: entidad,
            categoria: categoria,
            subcategoria: subcategoria,
            moneda: moneda,
            tipo_entidad: tipo_entidad,
            verify: true,
            filter_month:filter_only_months
        }

    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });
}

const cambiocontable=(pais,start,end,limit)=>{
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/cambiocontable/range",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            pais: pais,
            start: start,
            end: end,
            limit: limit
        }
    }).then(function(response){
        console.log("Result API(Cambio contable): ",response.data)
        return response.data
    });
}
const cambiocontable_formatter=(pais,start,end)=>{
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/cambiocontable/range/formatter",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            pais: pais,
            start: start,
            end: end,
        }
    }).then(function(response){
        console.log("Result API(Cambio contable formatter): ",response.data)
        return response.data
    });
}
///////FUNCIONES EN CASCADA
const cascada_interes= (root,root_value,child) => {
  
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/tasas/cascade",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            root: root,
            root_value: root_value,
            child: child
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });

}


const cascada_cambio=  (root,root_value,child) => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/cambio/cascade",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            root: root,
            root_value: root_value,
            child: child
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });
}
const cascada_cambiocontable=  () => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/cambiocontable/cascade",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{}
    }).then(function(response){
        console.log("Result API (Cambio contable): ",response.data)
        return response.data
    });
}
const query_bcrpdata= (categoria,subcategoria,temporalidad) => {
  
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/bcrpdata/series",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            categoria: categoria,
            subcategoria: subcategoria,
            temporalidad: temporalidad
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });

};
const query_sistema_financiero=(categoria,moneda,fechaFrom,fechaTo) => {
    
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/sistemafinanciero/file/csv",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            categoria: categoria,
            moneda: moneda,
            fecha_inicio: fechaFrom,
            fecha_fin: fechaTo,
            verify: true
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });
}
const tasareal_comunicadobcrp=  () => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/comunicadobcrp/tasareal",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{}
    }).then(function(response){
        console.log("Result API (Cambio contable): ",response.data)
        return response.data
    });
}
const indicetono_comunicadobcrp=  () => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/comunicadobcrp/indicetono",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{}
    }).then(function(response){
        console.log("Result API (Cambio contable): ",response.data)
        return response.data
    });
}
const tasareferencial_comunicadobcrp=  () => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/comunicadobcrp/tasareferencial",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{}
    }).then(function(response){
        console.log("Result API (Cambio contable): ",response.data)
        return response.data
    });
}
const query_comunicados_bcrp=(fechaFrom,fechaTo,decisionPOM,palabraClave,indiceTono,min_rangeIndTono,max_rangeIndTono,tasaReal,min_rangeTasaReal,max_rangeTasaReal,PBI,tasaReferencial,mes_anterior) => {
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/comunicadobcrp/file/xlsx",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            fecha_inicio: fechaFrom,
            fecha_fin: fechaTo,
            decisionPOM: decisionPOM,
            palabraClave: palabraClave,            
            indiceTono: indiceTono,
            min_rangeIndTono: min_rangeIndTono,
            max_rangeIndTono: max_rangeIndTono,
            tasaReal: tasaReal,
            min_rangeTasaReal: min_rangeTasaReal,
            max_rangeTasaReal: max_rangeTasaReal,
            PBI: PBI,
            mes_anterior: mes_anterior,
            tasaReferencial:tasaReferencial,            
            verify: true
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });
}

const cascada_bcrpdata= (root,root_value,child) => {
  
    return axios({
        method: 'GET',
        url: API_CHATBOT+"/bcrpdata/cascade",
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            root: root,
            root_value: root_value,
            child: child
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        return response.data
    });

}

const findBestMatch=(multiple)=>{
    return axios({
        method: 'POST',
        url: API_CHATBOT+"/services/speech",
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            "texto": ToolSpeechRecognition.texto,
            "opciones": ToolSpeechRecognition.opciones,
            "return_multiple":multiple
        }
    }).then(function(response){
        console.log("result API: ",response.data)
        response.data.data.forEach(element => {
            console.log(element);
        });
        return response.data;
    });
};

const login=  async (username,password) => {
    const result=await axios({
        method: 'POST',
        url: API_CHATBOT+"/user/login",
        headers: {
            'Content-Type': 'application/json'
        },
        data:{
            correo:username
        }
        
    })
    console.log("result: ",result.data)
    return result.data
}
