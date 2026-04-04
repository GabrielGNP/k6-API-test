# Tests de Performance y Carga — [Nombre del Proyecto]

Base URL: https://automationexercise.com/api

## Caso 1
título: API 4- PUT To All Brands List
API URL: /brandsList
Request Method: PUT
Response Code: 405
Response message: "This request method is not supported."
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 2
título: API 5- POST To Search Product
API URL: /searchProduct
Request Method: POST
Response Code: 200
Request Parameter: 
  - form-data: {key:"search_product", value:"top"}
Response Json: 
  - verificar que exista parámetro "products" en el json
  - verificar que el parámetro "products" en el json tenga más de 0 elementos
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 3
título: API 6- POST To Search Product without search_product parameter
API URL: /searchProduct
Request Method: POST
Response Code: 400
Request Parameter: null
Response Message: "Bad request, search_product parameter is missing in POST request."
Timing duration: 500ms
Status: NOT_IMPLEMENTED