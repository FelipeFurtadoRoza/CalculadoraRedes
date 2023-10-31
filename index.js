const arrayCamposFormulas = {Shannon: ['larguraDeBanda', 'sinalRuido']};
const formulaAtual = '';
var valorMinimo = 0;

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

    valorMinimo = 0;
    var inputs = document.getElementsByClassName("campo-formula");
    const regexNumero = /[\d.]|[\b]/;
    
    for (const input of inputs) {
        input.addEventListener("keydown", (event) => {
            if(!regexNumero.test(event.key) && event.which != 9 && event.which != 8) {
                event.preventDefault();
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
    document.getElementById("Resultado").innerText = '';
}

function Calcula (formula) {
    console.log('entrou');
    valoresFormula = [];
    formula(true).split(";").forEach(element => {
        valoresFormula.push(document.getElementById(element).value);
    });

    let resultado = formula(false, valoresFormula).toFixed(2);

    if(valorMinimo != 0) 
        document.getElementById('Resultado').innerText = resultado + " Valor minimo: " + valorMinimo.toFixed(2);
    else
        document.getElementById('Resultado').innerText = resultado;
}

function Shannon (formula, valoresFormula) {
    if (formula) {
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> <b>Largura de banda</b> * log10(1 + <b>Sinal/Ruido</b>)";
        return "Largura De Banda;Sinal/Ruido";
    } else {
        let larguraDeBanda = Number(valoresFormula[0]);
        let sinalRuido = Number(valoresFormula[1]);
        
        return capacidadeMaximaCanal = larguraDeBanda * Math.log2(1 + Math.pow(10, sinalRuido / 10));
    }
}

function Nyquist (formula, valoresFormula) {
    if (formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 2 * <b>Largura de banda do Sinal</b> * <b>Ondulação</b>";
        return "Largura de Banda do Sinal;Ondulação";
    } else {
        let larguraDeBandaSinal = Number(valoresFormula[0]);
        let ondulacao = Number(valoresFormula[1]);

        return taxaNyquist = 2 * larguraDeBandaSinal * ondulacao; 
    }
}

function MW_Para_dBm (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 10 * Log10(<b>Potencia em Mw</b>)";
        return "Potencia em Mw";
    } else {
        let potenciaMw = Number(valoresFormula[0]);

        return potenciaDBm = 10 * Math.log10(potenciaMw);
    }
}

function DBm_Para_Mw (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 10^<b>Potencia em dBm</b> / 10";
        return "Potencia em dBm";
    } else {
        let potenciaDBm = Number(valoresFormula[0]);
        return potencia = Math.pow(10, (potenciaDBm/10));
    }
}

function EIRP (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> <b>Potencia de Transmissão</b> + <b>Ganho da Antena</b> - <b>Perda do Cabo</b>";
        return "Potencia de Transmissão;Ganho da Antena;Perda do Cabo"
    } else {
        let potenciaTransmissao = Number(valoresFormula[0]);
        let ganhoAntena = Number(valoresFormula[1]);
        let perdaCabo = Number(valoresFormula[2]);

        return EIRP = potenciaTransmissao + ganhoAntena - perdaCabo;
    }
}

function FSLP (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 32.4 + ((20 * Log10(<b>Distancia em KM</b>)) + (20 * log10(<b>Frequencia em MHz</b>)))";
        return "Distancia em KM;Frequencia em MHz"
    } else {
        let distanciaKm = Number(valoresFormula[0]);
        let frequenciaMHz = Number(valoresFormula[1]);

        return fslp = 32.4 + (20 * Math.log10(distanciaKm) + 20 * Math.log10(frequenciaMHz));
    }
}

function RSL (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> <b>Potencia de Transmissão</b> + (<b>Ganho da Antena X</b> - <b>Perda do Cabo X</b>) - <b>fslp</b> + (<b>Ganho da Antena Y</b> - <b>Perda do Cabo Y</b>)";
        return "Potencia de Transmissão;Ganho da Antena X;Perda do Cabo X;Ganho da Antena Y;Perda do Cabo Y;FSLP";
    } else {
        let potenciaTransmissao = Number(valoresFormula[0]);
        let ganhoAntenaX = Number(valoresFormula[1]);
        let perdaCaboX = Number(valoresFormula[2]);
        let ganhoAntenaY = Number(valoresFormula[3]);
        let perdaCaboY = Number(valoresFormula[4]);
        let fslp = Number(valoresFormula[5]);

        return rsl  = potenciaTransmissao + (ganhoAntenaX - perdaCaboX) - fslp + (ganhoAntenaY - perdaCaboY);
    }
}

function Fresnel (formula, valoresFormula) {
    if(formula){
        const form = document.getElementById("formulaAtual");
        form.innerHTML = "<h3>Formula:</h3> 550 * √(<b>DAO</b> * <b>DBO</b>) / (<b>Distancia em KM</b> * <b>Frequencia em MHz</b>)";
        return "DAO;DBO;Distancia em KM;Frequencia em MHz";
    } else {
        
        let DAO = Number(valoresFormula[0]);
        let DBO = Number(valoresFormula[1]);
        let distanciaKm = Number(valoresFormula[2]);
        let frequenciaMHz = Number(valoresFormula[3]);

        console.log(DAO + " " + DBO + " " + distanciaKm + " " + frequenciaMHz);

        fresnel = 550 * Math.sqrt((Number(DAO) * Number(DBO)) / (Number(distanciaKm) * Number(frequenciaMHz)));

        if(frequenciaMHz <= 3000) {
            valorMinimo = Number(fresnel * 0.6);
        }
        
        return fresnel;
    }
}