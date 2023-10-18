const arrayCamposFormulas = {Shannon: ['larguraDeBanda', 'sinalRuido']};
const regex = "['\"´`[{}\]~^:;.>,<|\-+.?=.*[@!#$%^&*()\/\\a-zA-Z\s+\/g]+";
const formulaAtual = '';

window.onload = (event) => {
    let botoes = document.getElementById('botoes');
    let arrayNomeFormulas = ["Shannon", "Nyquist", "MW_Para_dBm", "DBm_Para_Mw", "EIRP", "FSLP", "RSL", "Fresnel"];
    camposInput = document.getElementsByClassName('campo-formula');

    arrayNomeFormulas.forEach(element => {
        botoes.innerHTML += "<div class='botoes' onclick='MudaFormula(" + element + ")'>" + element + "</div>";
    });
};

function MudaFormula (formula) {
    CreateBox(formula(true).split(";"), formula);

    // var classname = document.getElementsByClassName("campo-formula");

    // classname.forEach(element => {  
    //     element.addEventListener('keyDown', validarRegex);
    //     console.log('asd');
    // });  

    var elements = document.getElementsByClassName("campo-formula")

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('keypress', (event) => {
            if(regex.match(event.key)) {
                return false
            } else {
                console.log(event);
            }
        }, false);
    }
}

function CreateBox (camposFormula, formula) {
    let content = document.getElementById('box');
    let campos = "";

    camposFormula.forEach(element => {
        campos += "<div class='input-valor'><label id='label_" + element +"'>" + element + ": </label><input id='" + element + "' class='campo-formula' required='required' pattern='[0-9]+$' type='text'></div>";
    });

    console.log(formula);
    document.getElementById('calcula').innerHTML = "<input type='button' Value='Calcular' onClick='Calcula(" + formula + ");'>";
    content.innerHTML = campos;
}

function Calcula (formula) {
    console.log('entrou');
    valoresFormula = [];
    formula(true).split(";").forEach(element => {
        valoresFormula.push(document.getElementById(element).value);
    });
    console.log(formula(false, valoresFormula));
    document.getElementById('Resultado').innerText = formula(false, valoresFormula).toFixed(2);
}

function Shannon (formula, valoresFormula) {
    if (formula) {
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (<b>Largura de banda</b> * log10(1 + <b>Sinal/Ruido</b>))";
        return "Largura De Banda;Sinal/Ruido";
    } else {
        let larguraDeBanda = valoresFormula[0];
        let sinalRuido = valoresFormula[1];
        
        return capacidadeMaximaCanal = (larguraDeBanda * Math.log10(1 + sinalRuido));
    }
}

function Nyquist (formula, valoresFormula) {
    if (formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (2 * <b>Largura de banda do Sinal</b> * <b>Ondulação</b>)";
        return "Largura de Banda do Sinal;Ondulação";
    } else {
        let larguraDeBandaSinal = valoresFormula[0];
        let ondulacao = valoresFormula[1];

        return taxaNyquist = (2 * larguraDeBandaSinal * ondulacao); 
    }
}

function MW_Para_dBm (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (10 * Log10(<b>Potencia em Mw</b>))";
        return "Potencia em Mw";
    } else {
        let potenciaMw = valoresFormula[0];

        return potenciaDBm = (10 * Math.log10(potenciaMw));
    }
}

function DBm_Para_Mw (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (10^<b>Potencia em dBm</b> / 10)";
        return "Potencia em dBm";
    } else {
        let potenciaDBm = valoresFormula[0];
        return potencia = (Math.pow(10, (potenciaDBm/10)));
    }
}

function EIRP (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (<b>Potencia de Transmissão</b> + <b>Ganho da Antena</b> - <b>Perda do Cabo</b>)";
        return "Potencia de Transmissão;Ganho da Antena;Perda do Cabo"
    } else {
        let potenciaTransmissao = valoresFormula[0];
        let ganhoAntena = valoresFormula[1];
        let perdaCabo = valoresFormula[2];

        return EIRP = (potenciaTransmissao + ganhoAntena - perdaCabo);
    }
}

function FSLP (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (32.4 + ((20 * Log10(<b>Distancia em KM</b>)) + (20 * log10(<b>Frequencia em MHz</b>))))";
        return "Distancia em KM;Frequencia em MHz"
    } else {
        let distanciaKm = valoresFormula[0];
        let frequenciaMHz = valoresFormula[1];

        return fslp = (32.4 + ((20 * Math.log10(converteKm(distanciaKm)) + (20 * Math.log10(frequenciaMHz)))));
    }
}

function RSL (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> (<b>Potencia de Transmissão</b> + (<b>Ganho da Antena X</b> - <b>Perda do Cabo X</b>) - <b>fslp</b> + (<b>Ganho da Antena Y</b> - <b>Perda do Cabo Y</b>))";
        return "Potencia de Transmissão;Ganho da Antena X;Perda do Cabo X;Ganho da Antena Y;Perda do Cabo Y;FSLP";
    } else {
        let potenciaTransmissao = valoresFormula[0];
        let ganhoAntenaX = valoresFormula[1];
        let perdaCaboX = valoresFormula[2];
        let ganhoAntenaY = valoresFormula[3];
        let perdaCaboY = valoresFormula[4];
        let fslp = valoresFormula[5];

        return rsl  = (potenciaTransmissao + (ganhoAntenaX - perdaCaboX) - fslp + (ganhoAntenaY - perdaCaboY));
    }
}

function Fresnel (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 550 * √(<b>DAO</b> * <b>DBO</b>) / (<b>Distancia em KM</b> * <b>Frequencia em MHz</b>)";
        return "DAO;DBO;Distancia em KM;Frequencia em MHz";
    } else {
        
        let DAO = valoresFormula[0];
        let DBO = valoresFormula[1];
        let distanciaKm = valoresFormula[2];
        let frequenciaMHz = valoresFormula[3];

        return fresnel = (550 * Math.sqrt(((DAO * DBO) / (converteKm(distanciaKm) * frequenciaMHz))));
    }
}

function converteKm (distanciaKm) {
    return (distanciaKm / 1000);
}