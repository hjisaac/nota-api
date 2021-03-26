========
Heading
========



About: datatype, datastructure
-------------------------------
db <=> graphql <=> ui_things

Au niveau de mongodb, favoritedBy et favorites sont des listes 
contenant des chaines de caracteres qui sont respectivements des
identifiants d'utilisateurs et de notes. 
Donc depuis le schema fournit à mongodb depuis mongoose, il faudra
donner une definition suplémentaire au niveau de graphql de 
de l'interpretation qu'il fera de favoritedBy et favorites.
C'est cela qui a été fait dans src/resolvers/{note.js, user.js}
C'est similaire aux principes d'attributs calculés.

About: data limitation in api
-----------------------------
Help to prevent user from sending enough request to the server

About: overly nested querie in graphql
--------------------------------------
If we don"t prevent overly nested query user can write a query over nested
that can required a lot of computation to be returned.
We can do this in graphql using the package validation-complexity and depht-limit

* Heroku Config
db-user=<username>
db-pass=<password>
con-string=mongodb+srv://<username>:<password>@cluster0.ry7wq.mongodb.net/<database_name>?retryWrites=true&w=majority
app-name=api-noteapp-with-node



curl \
-X POST \
-H "Content-Type: application/json" \
--data '{ "query": "{ notes { id } }" }' \
https://api-noteapp-with-node.herokuapp.com/api



*js trick

const dico = {
    entry1: "value1",
    entry2: "value2",
    ...
    entryN: "valueN"
}

This :
const { entry: name } = dico 
means, search entry in dico entries, if found assign its value to the declared variable name

const name = dico.entry


curl -s 'http://localhost:4000/api' -H 'Content-Type: application/json' -d '{"query": "{ users { username, email } }"}' | jq