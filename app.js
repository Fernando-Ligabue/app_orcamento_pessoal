class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}  

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }
    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1

    }
    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id',id )
    }

    //contido na view consulta
    recuperarRegistros(){
        let despesas = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa){

        let despesasFiltro = Array()
        despesasFiltro = this.recuperarRegistros()        

    //filtro ano
        if(despesa.ano != ''){
        despesasFiltro = despesasFiltro.filter(d => d.ano == despesa.ano)
    }
    //filtro mes
        if(despesa.mes != ''){
        despesasFiltro = despesasFiltro.filter(d => d.mes == despesa.mes)
    }
    //filtro dia
        if(despesa.dia != ''){
        despesasFiltro = despesasFiltro.filter(d => d.dia == despesa.dia)
    }
    //filtro tipo
        if(despesa.tipo != ''){
        despesasFiltro = despesasFiltro.filter(d => d.tipo == despesa.tipo)
    }
    //filtro descricao
        if(despesa.descricao != ''){
        despesasFiltro = despesasFiltro.filter(d => d.descricao == despesa.descricao)
    }
    //filtro valor
        if(despesa.valor != ''){
        despesasFiltro = despesasFiltro.filter(d => d.valor == despesa.valor)
    }
    return despesasFiltro
    }

    remove(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()
    
function cadastrarDespesa (){

        let ano = document.getElementById('ano');
        let mes = document.getElementById('mes');
        let dia = document.getElementById('dia');
        let tipo = document.getElementById('tipo');
        let descricao = document.getElementById('descricao');
        let valor = document.getElementById('valor');

    console.log();

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
        )

    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso!!'
        document.getElementById('modal_title_div').className = 'modal-header text-success'
        document.getElementById('modal_content').innerHTML = 'Despesa cadastrada com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar!'
        document.getElementById('modal_btn').className = 'btn btn-success'
        //dialog success
        $('#registraDespesa').modal('show')
        //apaga as infos nos campos da view após salvar os valores no local storage
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    }else{

        document.getElementById('modal_title').innerHTML = 'Erro ao salvar dados!!'
        document.getElementById('modal_title_div').className = 'modal-header text-danger'
        document.getElementById('modal_content').innerHTML = 'Existem campos obrigatórios que não foram preenchidos!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir!'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        //dialog erro
        $('#registraDespesa').modal('show')
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarRegistros()
    }
    
    let listaDespesas = document.getElementById('lista_despesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){
        //cria a row (tr)
        let linha = lista_despesas.insertRow()
        //cria a column(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        //ajustar tipo para string
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break
            case '6': d.tipo = 'Casa'
            break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remove(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
        let mes = document.getElementById('mes').value
        let dia = document.getElementById('dia').value
        let tipo = document.getElementById('tipo').value
        let descricao = document.getElementById('descricao').value
        let valor = document.getElementById('valor').value

        let despesa = new Despesa(ano,mes,dia,tipo,descricao,valor)

        let despesas = bd.pesquisar(despesa)

        this.carregaListaDespesas(despesas, true)
}