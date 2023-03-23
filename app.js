/******************************************************
 *  Objetivo: Criar uma API para disponibilizar dados de Estados e Cidades
 *  Data: 10/03/2023
 *  Autor: Dwovanna
 *  Versão: 1.0
******************************************************/

// Metodos Verbos
// - Get (Retormar dados)
// - Post (Inserir dados)
// - Delete (Apagar dados existentes)
// - PUT (Alterar dados existentes)

/**
 *  Express - dependencia para realizar requisições de API pelo protocolo HTTP
 *   Comando para instalar = npm install express --save
 * 
 *  Cors - dependencia para gerenciar permissões de requisão da API
 * Comando para instalar = npm install cors --save
 * 
 * Body Parser - dependencia que gerencia o corpo das requisições
 *  Comando para instalar = npm install body-parser --save
 */

//Import das dependencias do projeto

//Dependencia para criar as requisções da API
const express = require('express');
//Dependencia para gerenciar as permissões da API
const cors = require('cors');
//Dependencia para gerenciar o corpo das requisições da API
const bodyParse = require('body-parser');

const estadosCidades  = require('../Aula 07/modulo/estados.js');
const estados = require('../Aula 07/modulo/estados.js');


//Cria um objeto com as características do express
const app = express();

app.use((request, response, next) => {
  //API publica - fica disponivel para utilização de qualquer aplicação
  //API privada - somente o IP informado podera consumir dados da API
  //Define se a API sera publica ou privada
  response.header('Acess-Control-Allow-Origin', '*')

  //Permite definir quais metodos poderao ser utilizados nas requisições da API
  response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

  //Envia para o cors() as regras de permicões
  app.use(cors());

  //Quando processar para não encerrar a API e passar para o proximo callback
  next();
});

//EndPoints

//async - estabelece uma status de aguarde, assim que eu processar te devolvo os dados
//obs - se não usar o asyns a requisicão é perdida, pois o front acha a API
// esta fora do ar

//EndPoint para listar todos os estados
app.get('/senai/estados', cors(), async function (request, response, next) {

  //Chama a função que vai listar todos os estados
  let estados = estadosCidades.getListaDeEstados();

// Validar se ocorreu erro ou não
  if (estados){
    response.status(200);
    response.json(estados)
  }else {
    response.status(500)
  }
});

// EndPoint para listar Estado pela sigla
app.get('/senai/estados/sigla/:uf', cors(), async function (request, response, next) {

  let statusCode;
  let dadosEstados = {};

  //Recebe a sigla do estado 
  let siglaEstado = request.params.uf

  console.log(siglaEstado);

  // Validação de erro
  if(siglaEstado == '' || siglaEstado == undefined || !isNaN(siglaEstado || siglaEstado.length !=2))

  {
    statusCode = 400;
    dadosEstados.message = 'Não foi possivel processar pois os dados de entrada (uf) que foi enviado não corresponde ao exigido, confira o valor, pois não pode ser vazio, precisa ser caracteres e ter 2 digitos.'
  } else {

    let estado = estadosCidades.getDadosEstados(siglaEstado);

    if(estado) {
      statusCode = 200;
      dadosEstados = estado;
    } else {
      statusCode = 404;
    }
  
  }
  // Validar se ocorreu erro ou não
  response.status(statusCode)
  response.json(dadosEstados)
  
}); 

//EndPoit lista os dados das capitais dos estados
app.get('/senai/capitalestados/sigla/:uf', cors(), async function (request, response, next) {

  let statusCode;
  let dadosCapitais = {};

  // Recebe a sigla da Capital
  let siglaCapital = request.params.uf
  
  //Validação de Erro
  if(siglaCapital == '' || siglaCapital == undefined ||  !isNaN(siglaCapital) || siglaCapital.length != 2)
  {
    statusCode = 400;
    dadosCapitais.message = 'Não foi possivel processar pois os dados de entrada (sigla) que foi enviado não corresponde, confira o valor,  pois não pode ser vazio, precisa ser caracteres e ter 2 digitos.'

  } else {

    let capitais = estadosCidades.getCapitalEstado(siglaCapital);

    if(capitais) {
      statusCode = 200;
      dadosCapitais = capitais;
    } else {
      statusCode = 404;
    }
  }
  // Validar se ocorreu erro ou não
  response.status(200)
  response.json(dadosCapitais)


});
//EndPoint listar região por estado
app.get('/senai/regiaoestado/regiao/:regiao', cors(), async function (request, response, next) {
  
  let statusCode;
  let dadosRegiao = {};

  // Recebe a sigla da regiao
  let siglaRegiao = request.params.regiao

  //Validação de erro
  if(siglaRegiao == '' || siglaRegiao == undefined ||  !isNaN(siglaRegiao))
  {
    statusCode = 400;
    dadosRegiao.message = "Não foi possível carregar"
  } else {
    let regiao = estadosCidades.getEstadosRegiao(siglaRegiao)

    if(regiao) {
      statusCode = 200;
      dadosRegiao = regiao;
    } else{
      statusCode = 404;
    }
  }

// Validar se ocorreu erro ou não
response.status(statusCode);
response.json(dadosRegiao);

console.log(dadosRegiao);

});
app.get('/senai/capitaispais', cors(), async function (request, response, next) {

  //Chama a função que vai listar todos os estados
  let capitais = estadosCidades.getCapitaisPais()

  if(capitais) {
    response.status(200);
    response.json(capitais);
  } else {
    response.status(500)
  }

})
//EndPoint para listar cidades de um estado
app.get('/senai/cidades/:uf', cors(), async function (request, response, next) {

  let statusCode;
  let cidades = {};

  // recebe a sigla do estado
  let siglaEstado = request.params.uf

  //Validar erros
  if(siglaEstado == '' || siglaEstado == undefined || !isNaN(siglaEstado)){
    statusCode = 400;
    cidades.message = 'Não foi possivel processar, pois os dados de entrada (uf) que foi enviado não corrensponde. Confira o valor, pois não pode ser vazio, precisa ser caracteres e ter 2 dígitos.';
} else {
    //Chama a função para retornar os dados do estado
    let cidadesEstado = estadosCidades.getCidades(siglaEstado)

    if(cidadesEstado){
        statusCode = 200
        cidades = cidadesEstado
    } else {
        statusCode = 404
    }
}
//Retorna o codigo e o JSON
response.status(statusCode)
response.json(cidades)



})




//Roda o serviço da API para ficar aguardando requisições
app.listen(9090, function () {
  console.log('Servidor Aguardando requisições na porta 8080.')
});
