function convertZabbixHour(data){
    var ano = data.getFullYear().toString();
    var mes = (data.getMonth()+1).toString();
    mes = (mes.length == 1 ) ? "0"+mes : mes;
    var dia = data.getDate().toString();
    dia = (dia.length == 1) ? "0"+dia : dia;
    var hora = data.getHours().toString();
    hora = (hora.length == 1) ? "0"+hora : hora;
    var minuto = data.getMinutes().toString();
    minuto = (minuto.length == 1) ? "0"+minuto : minuto;
    var segundo = data.getSeconds().toString();
    segundo = (segundo.length == 1) ? "0"+segundo : segundo;
    return (ano+mes+dia+hora+minuto+segundo);
}