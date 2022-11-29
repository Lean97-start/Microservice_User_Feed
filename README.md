
# ***Microservicio de User Feed***

  > #### Para ejecutar el proyecto debe ejecutar "NPM install" para instalar las dependencias. Luego ejecutar NPM run build, esto compilara el código TypeScript en código JavaScript. Por último, ejecutar NPM run start.

---

## *Casos de uso*
  
> #### *Es un servicio que permite a los usuarios comentar review sobre los artículos que compraron, permite modificar una review, eliminarlas, reportarlas y ocultar reviews reportadas.*
    
---
  

* ## CU: Consultar compra de artículo.  
    *Este caso de uso me permite consultarle al servicio de order por medio de mensajería asíncrona, si el usuario ha comprado el producto, devolviendo un resultado de la validación.*
      
    

	- ### Precondición:
		-   Que el usuario esté registrado.
		-   Que se haya validado el token del usuario. 
		-   Que se haya realizado petición de creación de review.  
      
    

	- ###  Camino normal:
    

		-   Nos llega por parámetro el _id_article, _id_user, _id_review.
		-   Enviar mensaje asíncrono a servicio de Order con las propiedades 			_id_article, _id_user, _id_review y el state = PAYMENT_DEFINED.
		-   Recibir mensaje asíncrono del servicio de order.
		-   Validamos que existan las propiedades article_bought_user y _id_review.
		 -   Validar que la propiedad article_bought_user del objeto enviado por el servicio de Order sea true.  
		-   Buscar por _id_review de review en la base de datos.
    
		-   Modificar la propiedad visibility = true.
    
		-   Mostrar mensaje “The review ${_id_review} was validated”  
      
    

	- ###  Caminos alternativos:
    

		-   Si el mensaje recibido del servidor es false, retornar error con mensaje “The review ${_id_review} was not validated”.  
		-   Si article_bought_user es igual a null, retornar error con mensaje “The article_bought_user not exist, it is required”.    
		-   Si el _id_review es igual a null, retornar error con mensaje “The _id_review not exist, it is required”.
		-   SI ocurre un error en la validación, retornar mensaje “Error server.”  

----
- ##  CU: Agregar reseña de artículo comprado.  
    *Este caso de uso me permite agregar una review de un artículo comprado por el usuario.* 
      
    

	- ###  Precondición:
		-   Que el usuario esté registrado.    
		-   Que se haya validado el token del usuario.
		-   Que se haya realizado petición de publicar review.  

	- ###  Camino normal:
    

		-   Al confirmar la review pasamos por body la review realizada y el _id_article.
		-   Tomar de Redis el _id_user del usuario.
		-   Validar que la review_descrip sea distinto de null.
		-   Validar que la puntuación sea distinta de null.
		-   Validar que el _id_article sea distinto de null. 
		-   Validar que la cantidad de palabras sea menor a 400 y mayor de 5.
		-   Validar que la puntuación sea mayor a 0 y menor que 6.  
		-   Crear review con el id del usuario, el id del artículo, la review_descrip, el score, visibility = false y la fecha de creación.
		-   Crear state_review con _id_review, stateReviewActive= true, reason = null y la fecha de creación.
		-   Mandar un mensaje asíncrono al servicio de order para pedir confirmación de compra realizado por el usuario respecto de un artículo. 
		-   Devolver un mensaje de retorno “Create Review successful”  

	-  ### Caminos alternativos:
		-   Si la review_descrip es igual a null, retornar error con mensaje “Null review_descript not allowed”.
		-   Si la puntuación es igual a null, retornar error con mensaje “Null score not allowed”.   
		-   Si el _id_article es igual a null, retornar error con mensaje "Null id_article not allowed". 
		-   Si el _id_article del artículo no está en la orden, retornar error con mensaje de “Article_not_bought”.
		-   Si la cantidad de palabras es mayor a 400, retornar error con mensaje “Maximun size is 400 words”. 
		-   Si la cantidad de palabras es menor a 5 palabras, retornar error con mensaje “Minimun size is 5 words”.  
		-   Si la cantidad de score es menor o igual a 0 ó mayor o igual a 6, retornar error con mensaje “Error score. The value is from 1 to 5”.
		-   Error de almacenamiento de review, retornar error con mensaje “Error create review, try again”.  
      
    

----------

  
  

-  ## CU: Modificar reseña realizada en artículo comprado.  
    *Este caso de uso me permite modificar una review realizada por el usuario.*  
      
	-  ### Precondición:
		-   Que el usuario haya realizado una review en un artículo.
		-   Que el usuario tenga token válido.
		-   Confirmar modificación de la review. 

	- ###  Camino normal:
    

		-   Pasar por body el _id_review, un objeto review con la nueva review_descrip y/o score modificado.
		-   Tomamos el _id_user desde Redis usando el token.
		-   Validar que el _id_review sea distinto de null.
		-   Validar que la review_descript sea mayor a 5 y menor que 400 palabras.
		-   Validar que el score sea mayor que 0 y menor que 6.
		-   Buscar por _id_review de review en la base de datos.
		-   Validar que el _id_user sea igual al _id_user traido de Redis.
		-   Buscar el estado de la review en stateReviewActive de state_review donde el _id_review de la review coincide con el _id_review registrado en el state_review.
		-   Validar que el stateReviewActive sea true.
		-   Modificar campo “review” y/o del documento.
		-   Guardar cambios de review.
		-   Retornar mensaje de éxito “Modified review successful”.  
      
    

	- ###  Caminos alternativos:

		-   Si el body es igual a null, retornar error con mensaje “Null_reviews_not_allowed”.
		-   Si el _id_review es igual a null, retornar error con mensaje "Id review is required".
		-   Si la review_descript es igual a null, se deja la review_descript actual.
		-   Si el score es igual a null se deja el score actual.
		-   Si no se encuentra la review, retornar error con mensaje “The review does not exist”.
		-   Si la cantidad de palabras es mayor a 400, retornar error con mensaje “Maximun size is 400 words”.
		-   Si la cantidad de palabras es menor a 5 palabras, retornar error con mensaje “Minimun size is 5 words”.
		-   Si la cantidad de score es menor o igual a 0 ó mayor o igual a 6, retornar error con mensaje “Error score ”.
		-   Si el _id_user de la review no es el mismo que token.user, retornar error con mensaje “Not authorization, you cannot modify the review”.
		-   Si el stateReviewActive = false, se descarta la petición y retornamos error con mensaje “Reported review”.
		-   Si falla el guardado de la review, retornar mensaje de error “Error modify review, try again”.
    

  

----------

  
  

- ##  CU. Eliminar Reseña en artículo comprado.  
    *Este caso de uso me permite eliminar una review realizada por el usuario.*  
      
    

	- ###  Precondición:
    
		-   Que el usuario haya realizado una review.  
		-   Que se haya validado el token del usuario.
		-   Se realiza una petición al servicio para eliminar una review de un artículo.
    

	-  ### Camino normal:
    

		-   Pasar por body el _id_review
		-   Tomar el _id_user de Redis usando el token del usuario.
		-   Validar que _id_review sea distinta de null.
		-   Buscar review que coincida con el número de _id_review.
		-   Validar que exista la review buscada.
		-   Leer _id_user de review.
		-   Validar que el user sea el mismo el _id_user de la review.
		-   Validar que la visibility de la review sea true.
		-   Buscar el estado de la review en stateReviewActive de state_review donde el _id_review de la review coincide con el _id_review registrado en el state_review.    
		-   Validar que el stateReviewActive sea true.
		-   Actualizar la propiedad visibility de la review con “false”.
		-   Retornamos un mensaje de éxito con el mensaje "Review deleted successfully".
    


	- ###  Caminos alternativos:
    

		-   Si la review no se encuentra, retornar error con mensaje "Invalid _id_review".
		-   Si el _id_review es null, retornar con mensaje “ID review is required”.
		-   Si la visibility de la review es igual a false, retornar mensaje con “Error review is already false”.
		-   Si el stateReviewActive = false, se descarta la petición y retornamos error con mensaje “Reported review”.
		-   Si no se puede actualizar el valor de la propiedad visibility, retornar mensaje “Review could not be unsubscribed”.
		-   Si hubo una falla en el borrado de la review, retornar error con mensaje "Error delete review, try again".  


----------

  
  

-  ## CU: Mostrar reseñas de artículos.  
    *Este caso de uso me permite cuando recibo una petición por mensajería asíncrona del servicio de Catalog sobre las reviews de un artículo, devolver un arreglo de reviews en el caso que tenga alguna, relacionadas con el artículo pedido.*  
      
    

	- ###  Precondición:
    
		-   Al presionar “Ver reviews del artículo”, el servicio de Catalog debe mandar un mensaje síncrono al servicio de User feed haciendo la petición de las reviews del artículo.
		-   Que se haya validado el token del usuario.  
      
    

	-  ### Camino normal:
    

		-   El servicio de User feed recibe un mensaje “direct” de petición de reviews de un artículo con el _id_article.
		-   Buscar reviews que coincida con el _id_article pasado por mensaje.
		-   Por cada review, valido que la visibility sea igual a true.
		-   Realizar un arreglo con todas las reviews coincidentes con el artículo.
		-   Enviar un mensaje con el objeto de reviews al servicio de Catalog.  
      
    

	- ###  Caminos alternativos:
    

		-   Si no se encuentran reviews que coincidan con el _id_article pasado por mensaje, enviar un mensaje al servicio de Catalog con el mensaje “The article has no reviews”.
    
		-   Si se produce un error en la búsqueda de las review, se retorna vuelve a llamar a la función pasándole el mismo _id_article.  
      
    

  

----------

  

- ##  CU: Reportar Reseña en artículo.  
    *Este caso de uso me permite reportar una review de un artículo realizada por un usuario seleccionando una razón.*  
      
    

	- ###  Precondición:

		-   Que un usuario haya hecho una review.
		-   Que se haya validado el token del usuario.
		-   Que se haya hecho una petición para reportar review.


	- ##  Camino normal:

		-   Recibir por body _id_review y reason.
		-   Tomar _id_user de Redis utilizando el token del usuario.
		-   Validar que _id_review sea distinto de null.
		-   Validar que reason sea distinta de null.
		-   Buscar review que coincida con el _id_review.
		-   validar que la visibility de la review sea true.
		-   Buscar el estado de la review en stateReviewActive de state_review donde el _id_review de la review coincide con el _id_review registrado en el state_review.
		-   Validar que el stateReviewActive sea true.
		-   Enviar mensaje asíncrono al servicio de reports.
		-   Retornar mensaje de éxito "Review reported".
  

	- ###  Caminos alternativos:
    
		-   Si el _id_review es igual a null retornar error con mensaje "ID review is required".
		-   Si la razon es igual a null, retornar error con mensaje "Reason of report is required".
		-   Si no se encuentra una review que coincida con el _id_review, retornar error con mensaje "The review does not exist".
		-   Si la visibility de la review es false, retornar mensaje con “The review is hidden”.
		-   Si el stateReviewActive = false, se descarta la petición y retornamos error con mensaje “Reported review”.
		-   Si no se puede mandar el mensaje al servicio de reportes, retornar mensaje “The report could not be made”.
		-   Si se produce un error en la ejecución de la funcionalidad, retornar mensaje “An error occurred, try again”.
    
----------

  

-  ## CU: Ocultar reseña reportada  
    *Este caso de uso me permite ocultar una review en el estado, cambiando el estado de la misma, luego de que el reporte fue revisado por el servicio de reports y fue aprobado.*
    

	- ###  Precondición:

		-   Que al menos un usuario haya reportado una review.
		-   Que se haya validado el token del usuario.  
		-   El servicio de “Reports” confirma el reporte de la review
    

	-  ### Camino normal:
    

		-   Al confirmar el reporte de la review, el servicio de “User Feed” recibe un mensaje asíncrono solicitando el ocultamiento de la review reportada.
		-   Se pasa por mensaje asíncrono el _id_review, stateReviewActive y reason_report.
		-   Validar que los parámetros pasados sean distinto de null.
		-   Buscar el estado de la review en stateReviewActive de state_review donde el _id_review de la review coincide con el _id_review registrado en el state_review.
		-   Validar que el stateReviewActive sea distinto de “false”.
		-   Cambiar el valor de stateReviewActive por el valor “false”.
		-   Asignar el valor de reason a “reason_state”.
		-   Cambiar la propiedad visibility de la review con el valor false.
		-   Actualizar fecha del campo “update” por la fecha actual.
    
	-  ### Caminos alternativos:

		-   Si el _id_review es null, retornar mensaje “Null _id_review, it is required”.
		-   Si el stateReviewActive es null, retornar mensaje “Null stateReviewActive, it is required”.
		-   Si la reason_report es null, retornar mensaje “Null reason_report, it is required”. 
		-   Si la reason_report no tiene contenido, retornar mensaje “Null reason_report, it is required”.
		-   Si no se encuentra una StateReview que coincida con _id_review, se descarta la acción y se retorna mensaje “The stateReview does not exist”.
		-   Si el stateReviewActive ya tiene un valor “false”, se deja el valor actual pero se le actualiza la fecha en el atributo “update”.
    

----------

# *Modelo de datos*  
  

![](https://lh6.googleusercontent.com/xcN4Tc8tC7ESk-PR9wUj2ApEDwxqp4ZCypBqfoRzpj0r7GAM2q-gOmzrqiM5rxCy3lHYCmqEK_za3P-5KKdEPueNoB7nrdGSrF0UFMirageQthrvIjz3DrZM0p-7xEWCDQnM5kdq-VuTxvuc3Sjfikr7s2GoJcHQ_FgJFz7c-gNu53H53cyYk2O0jS5yD8gR)

  ----

# *Interfaz REST*  
  

-  ## Publicar reseña  
  
	-  ### POST ( '/v1/reviews/createReview' )   
		-  ### *Header*
			-   Authorization: Bearer {token}
		- ###  *Body*
			``  
			{ 
				 _id_article: id ,  
				 review: {  
					    review_descrip: string,  
					    score: Int  
					    }  
			}
			`` 
		- ###  *Response*
    

			-  #### "200 OK":
				`` 
				    {message: “Create review successful”}
			`` 

			-  #### "400 BAD REQUEST":
				`` 
				{error_message: {error_message}}
	`` 
  

			- ####  "401 Unauthorized":
    
				`` 
				{error_message: {error_message}}
				`` 
  

			- ####  "404 NOT FOUND":
    
				`` 
				{error_message: {error_message}}
				`` 
  

			-  #### "500 Server Error":
    
				`` 
				{error_message: {error_message}}
				`` 
  ----

- ##  Modificar reseña  
      
    

	-  ### POST ( '/v1/reviews/modifyReview' )
    
		-  ### *Header*
			-   Authorization: Bearer {token}
		- ###  *Body*
			 `` {_id_review: id,review: {review_descrip: {review_descript}, score: {score}}}`` 

		-  ### *Response*
    

			-  #### "200 OK":
    

				`` {message: “Modified review successful”}`` 

  

			-  #### "400 BAD REQUEST":
    

				`` {error_message: {error_message}}`` 

  

			- ####  "401 Unauthorized":
    

				`` {error_message: {error_message}}`` 

  

			-  #### "404 NOT FOUND":
				`` {error_message: {error_message}}`` 


			- ####  "500 Server Error":
    

				`` {error_message: {error_message}}  `` 
  
---
- ##  Eliminar reseña  
      
    

	- ###  POST ( '/v1/reviews/deleteReview' )
	    
		-  ### *Header*
			-   Authorization: Bearer {token}
		- ###  *Body*
    

			``  { _id_review: id }`` 
    

  

	- ###  Response
    

		-  #### "200 OK":
    

			`` {message: “Review deleted successfully”}`` 

		- ####  "400 BAD REQUEST":
    

			`` {error_message: {error_message}}`` 

  

		- ####  "401 Unauthorized":
    

			`` {error_message: {error_message}}`` 


		-  #### "404 NOT FOUND":
    

			`` {error_message: {error_message}}`` 


		-  #### "500 Server Error":
    

			`` {error_message: {error_message}}`` 

  
---
- ##  Reportar reseña  
      
    

	- ###  POST ( '/v1/reviews/reportReview' )
    
		- ###  *Header*
			-   Authorization: Bearer {token}

		- ###  *Body*
    
			`` 
			   {_id_review: id,
			reason: reason_report}
			`` 
  

	- ###  Response
    

		- ####  "200 OK":
    
			`` 
			{message: “Review reported”}
			`` 
	  

		- ####  "400 BAD REQUEST":
    
			`` 
			{error_message: {error_message}}
			`` 
  

		-  #### "401 Unauthorized":
    
			`` 
			{error_message: {error_message}}
			`` 
  

		-  #### "404 NOT FOUND":
    
			`` 
			{error_message: {error_message}}
			`` 
  

		-  #### "500 Server Error":
    
			`` 
			{error_message: {error_message}}
			`` 
  
  
  
  

# *Interfaz ASÍNCRONA*

  

- ###  Recibe un mensaje asíncrono del servicio Auth de "logout" de tipo "fanout".
	``    
			{
				"type": "logout",
				"message": "{tokenId}"
			}  
	 ``

- ###  Enviar un objeto con la información necesaria para validar la compra del artículo por el usuario al servicio de Order de forma "direct" por validate_article_bought_user.
    

  
	`` 
		{"id_article": {_id_article},
			"Id_user": {_id_user},
			“_id_review”: {_id_review}
			"state_order": 'PAYMENT_DEFINED'}
	`` 
  

- ###  Recibe un objeto desde el servicio de Order con la propiedad article_bought_user´,  para validar que el usuario realizó la compra del artículo previamente, de forma "direct" por article_bought_user.
    

  
	`` 
		{"article_bought_user”: {result},“_id_review”: {_id_review}}
	`` 
  

-  ### Envía un objeto con la información necesaria al servicio de Reports de la review de forma "direct" por review_report_check.
    
	`` 
	{
	"id_review": {_id_review},
	"reason_report": {reason_state},
	"review_description": {review_descript},
	"user_reviewer": {_id_user}
	}
	`` 
  
  

- ###  Recibe resultado del checkeo de la review reportada del servicio de Reports de forma "direct" por result_check_review_report
    
	`` 
	{“Id_review”: {_id_review},
	“stateReviewActive”: {boolean},
	“reason_report”: {reason_descrip}}
	`` 
  

- ###  Recibe un objeto del servicio de catalog con la información de un artículo de forma "direct" por reviews_article

	`` 
	{"id_article": {_id_article}}
	`` 
  

- ###  Envía un objeto al servicio de catalog con la información de los reviews de un artículo específico de forma "direct" por article_reviews.

	`` 
	{"id_article": {_id_article},"reviews": [{reviews}]}
	`` 
