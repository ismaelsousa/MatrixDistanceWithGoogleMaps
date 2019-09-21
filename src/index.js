require('dotenv').config();
const axios = require('axios');
const fs = require('fs')

async function main(){
  /**
   * Criando lista das cidades
   */

  var cidades = [
    'Quixeré',
    'Limoeiro+do+norte',
    'Russas'      
  ]
  /**
   * Criando matriz com as posições das cidades
   */
  var matrix = new Array(cidades.length); 
  for (var i = 0; i < matrix.length; i++) {
    matrix[i] = new Array(matrix.length);
  }

  /**
   * Buscando da API do Google Cada distância entre duas cidades
   */
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if(i===j){
        matrix[i][j] = 0
      } else if(i>j){
        /** Somente para não fazer requests desnecessários */
        matrix[i][j] = -1
      }else{
        /**
         * Lógica para fazer a requisição
         * Faz a requisição
         * Desestrutura e peda o data
         * Coloca a distância na matriz
         */

        const response = await axios
          .get(`https://maps.googleapis.com/maps/api/distancematrix/json`,{
            params: {
              units:'METRIC',
              origins:`${cidades[i]},CE`,
              destinations:`${cidades[j]},CE`,
              key:`${process.env.KEY}`
            }
        })
        const {data} = response   
        /** O resultado vem 18.2 km, então eu retiro o " km" */   
        const [kms, sigla] = data.rows[0].elements[0].distance.text.split(' ')
        
        matrix[i][j] = kms
      }
    }
  }
  
  /**
   * Transforma a matriz em uma STRING para escrever no arquivo
   * No modelo cidadeA para cidadeB = Distancia
   *  Russas-Quixeré=32,7
   */
  var stream = fs.createWriteStream('mapCitys.txt', {flags: 'a'});  
  for (let i = 0; i < matrix.length; i++) {   
    for (let j = 0; j < matrix[i].length; j++) {   
      if(i===j) continue
      if(i>j) continue      
      await  stream.write(`${cidades[i]}-${cidades[j]}=${matrix[i][j]}\n`)      
    }
  }   
  console.table(matrix);

}

main()


