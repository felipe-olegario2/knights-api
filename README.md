# API de Cavaleiros

Uma API RESTful para gerenciar cavaleiros e sua jornada para se tornarem heróis. Este projeto foi desenvolvido usando **NestJS** e **MongoDB**, com endpoints para criar, atualizar, recuperar e marcar cavaleiros como heróis.

## Funcionalidades
- Operações CRUD para cavaleiros.
- Cálculo dinâmico do poder de ataque e experiência.
- Marcar cavaleiros como heróis quando "morrem" em vez de excluí-los.
- Filtrar cavaleiros com base em seu status de herói.

## Tecnologias Utilizadas
- **Node.js** (NestJS)
- **MongoDB** (Mongoose para interação com o banco de dados)
- **Swagger** para documentação da API
- **Docker** para containerização

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/your-username/knights-api.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd knights-api
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```

## Configuração com Docker
1. Crie a imagem Docker:
   ```bash
   docker build -t knights-api .
   ```
2. Execute a aplicação usando Docker Compose:
   ```bash
   docker-compose up
   ```

## Documentação da API
A documentação da API está disponível via Swagger:
- **URL:** `http://localhost:3000/api`

## Endpoints
### [GET] `/knights`
Recupera uma lista de todos os cavaleiros.
- **Parâmetros de Consulta:**
  - `filter=heroes` (opcional) - Recupera apenas os cavaleiros que se tornaram heróis.

**Exemplo de Resposta:**
```json
[
  {
    "_id": "63f1c882e12345678",
    "name": "Arthur",
    "nickname": "O Bravo",
    "birthday": "1980-05-20",
    "weapons": [
      { "name": "espada", "mod": 3, "attr": "strength", "equipped": true }
    ],
    "attributes": {
      "strength": 18,
      "dexterity": 12,
      "constitution": 15,
      "intelligence": 10,
      "wisdom": 14,
      "charisma": 16
    },
    "keyAttribute": "strength",
    "isHero": false,
    "exp": 25987
  }
]
```

### [GET] `/knights/:id`
Recupera detalhes de um cavaleiro específico pelo ID.

**Exemplo de Resposta:**
```json
{
  "_id": "63f1c882e12345678",
  "name": "Arthur",
  "nickname": "O Bravo",
  "birthday": "1980-05-20",
  "weapons": [
    { "name": "espada", "mod": 3, "attr": "strength", "equipped": true }
  ],
  "attributes": {
    "strength": 18,
    "dexterity": 12,
    "constitution": 15,
    "intelligence": 10,
    "wisdom": 14,
    "charisma": 16
  },
  "keyAttribute": "strength",
  "isHero": false,
  "exp": 25987
}
```

### [POST] `/knights`
Cria um novo cavaleiro.

**Corpo da Requisição:**
```json
{
  "name": "Lancelot",
  "nickname": "O Valente",
  "birthday": "1985-07-10",
  "weapons": [
    { "name": "lança", "mod": 2, "attr": "dexterity", "equipped": true }
  ],
  "attributes": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 13,
    "intelligence": 12,
    "wisdom": 10,
    "charisma": 15
  },
  "keyAttribute": "dexterity"
}
```

**Exemplo de Resposta:**
```json
{
  "_id": "63f1c882e12345679",
  "name": "Lancelot",
  "nickname": "O Valente",
  "birthday": "1985-07-10",
  "weapons": [
    { "name": "lança", "mod": 2, "attr": "dexterity", "equipped": true }
  ],
  "attributes": {
    "strength": 16,
    "dexterity": 14,
    "constitution": 13,
    "intelligence": 12,
    "wisdom": 10,
    "charisma": 15
  },
  "keyAttribute": "dexterity",
  "attack": 12,
  "exp": 18850
}
```

### [PUT] `/knights/:id`
Atualiza o apelido de um cavaleiro.

**Corpo da Requisição:**
```json
{
  "nickname": "O Destemido"
}
```

**Exemplo de Resposta:**
```json
{
  "_id": "63f1c882e12345678",
  "name": "Arthur",
  "nickname": "O Destemido",
  "birthday": "1980-05-20",
  "isHero": false
}
```

### [PUT] `/knights/:id/death`
Marca um cavaleiro como herói (simbolizando sua morte).

**Exemplo de Resposta:**
```json
{
  "_id": "63f1c882e12345678",
  "name": "Arthur",
  "nickname": "O Bravo",
  "isHero": true
}
```

## Hall of Heroes
Cavaleiros marcados como heróis (`isHero: true`) são incluídos no "Hall of Heroes". Você pode filtrá-los usando:

**[GET] `/knights?filter=heroes`**

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

