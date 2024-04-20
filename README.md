# Fastify PSP

PSP (Payment Service Provider) é uma tecnologia em forma serviço para viabilização de transações no ambiente online, de forma que todo o processo seja realizado de forma segura e performática. Nesse repositório apresentamos uma versão simplificada dessa tecnologia, de forma que seja possível registrar pagamentos de produtos e serviços prestados e obter uma contabilização dos lucros recebidos e à receber.

## Instalação e execução do projeto

Para instalação e execução do projeto em sua máquina local, siga o seguinte passo a passo:

* Faça um clone deste repositório na branch ````main```;
* Instale em sua máquina o banco de dados [MySQL](https://www.mysql.com/downloads/);
* Execute o comando ```npm i``` para instalar as dependencias do projeto;
* Adicione na pasta raiz do projeto o arquivo ```.env```, substituindo as informações entre ```<>``` pelas suas configurações do banco de dados, com a seguinte váriavel de ambiente:

    ```DATABASE_URL='mysql://<username>:<password>@localhost/<schemaname>'```

* Execute o comando ```npx prisma migrate dev --name <migrationname>``` para criar as tabelas no banco de dados configurado;
* E finalmente execute o projeto com o comando ```npm run dev```;

## Endpoints

Para realizar requisições nos endpoints, recomendamos fortemente o uso da ferramenta Postman, onde disponibilizamos nesse repositório o arquivo ```Fastify PSP.postman_collection``` para ser importado na ferramenta.

* ```Create Transaction```: rota para criar uma nova transação com seu pagamento associado;
* ```Update Transaction```: rota para atualizar uma transação e seu pagamento associado;
* ```Delete Transaction```: rota para deletar uma transação e seu pagamento associado. Realiza um hard delete;
* ```Get Transaction by Id```: retorna uma transação pelo seu id no banco de dados. O payable associado recebe o mesmo valor de Id. Ex: transctionId: 1 - payableId: 1;
* ```Get Transactions```: retorna todas as transações criadas, com paginação. O parametro ```skip``` define quantas transações você deseja ignorar e o parametro ```take``` define quantas transações serão retonadas a partir do intervalo de skip;
* ```Get Saldo```: retorna o saldo acumulado de payables com mesmo ```name``` ou ```cpf```. 
    * Se nenhuma informação seja passada, retorna 0 para os campos de resposta. 
    * Se os parametros ```name``` ou ```cpf``` estiverem errados, também retorna 0 para os campos. 
    * Se ambos os campos forem passados juntos, porém com informações de pessoas diferentes, realiza a soma de todos os payables relacionada as informações. 

### Restrições para o request Body de Create e Update  
    
* Valor da transação em centavos. Ex:2099 representa R$20,99 - Obs: pontos flutuantes e textos não são aceitos.
* Descrição da transação. Ex: 'Airpods'
* Método de pagamento (pix ou credit_card)
* Nome do Pagador
* CPF do Pagador Ex: 12345678900 - Obs: Apenas números são aceitos
* Número do cartão (Obrigatório somente se metódo for credit_card) - Obs: Apenas números são aceitos.
* Data de validade do cartão (MMAA) (Obrigatório somente se metódo for credit_card Obs: Apenas números são aceitos.)
* Código de verificação do cartão (CVV) (Obrigatório somente se metódo for credit_card) - Obs: Apenas números são aceitos.

* OBS: o endpoint de Update não atualiza a descrição de uma transação já criada. Ele atualiza valor, modo e informações de pagamento e recalcula e atualiza o payable associado à transação.

## Modelagem dos dados

Para modelagem simplificada dos dados consideramos apenas duas entidades:

* ```transactions```: informações da compra, dados do comprador, forma de pagamento, valor, etc.
* ```payables```: recebíveis que serão pagos ao cliente

Para ver o payable associado a uma transação basta fazer uma requisição ```GET``` relacionada aos endpoints de ```Get Transactions```  ou ```Get Transaction by Id```.

Os payables tem uma relação de 1 para 1com as transações, então sempre que uma transação é criada, seu respectivo payable também é registrado.

## Próximos passos

* Inclusão dos testes automatizados utilizando Jest;
* Executar a aplicação em container Docker;
* Inclusão de um Modelo de usuários permitindo criar parcelas de payables (de um usuario) em função de transactions realizadas;
* Implementação de Token JWT para realização de consulta dos dados com maior segurança;
