# Tests de Performance y Carga — [Nombre del Proyecto]

Base URL: https://automationexercise.com/api

## Caso 4
título: API 4- PUT To All Brands List
API URL: /brandsList
Request Method: PUT
Response Code: 405
Response message: "This request method is not supported."
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 5
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

## Caso 6
título: API 6- POST To Search Product without search_product parameter
API URL: /searchProduct
Request Method: POST
Response Code: 400
Request Parameter: null
Response Message: "Bad request, search_product parameter is missing in POST request."
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 8
título: API 8- POST To Verify Login without email parameter
API URL: /verifyLogin
Request Method: POST
Response Code: 400
Request Parameter: 
  - form-data: {key:"password", value:"1234"}
Response Message: Bad request, email or password parameter is missing in POST request.
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 9
título: API 9- DELETE To Verify Login
API URL: /verifyLogin
Request Method: DELETE
Response Code: 405
Response Message: This request method is not supported.
Timing duration: 500ms
Status: IMPLEMENTED

## Caso 10
título: API 10- POST To Verify Login with invalid details
API URL: /verifyLogin
Request Method: POST
Request Parameters: 
  - form-data: {
      key:"password", value:(invalid values);
      key:"email", value:(invalid values)
    }
Response Code: 404
Response Message: User not found!
Status: NOT_IMPLEMENTED