docker-compose con la base de datos a utilzar
instalar sequalize junto con la dependencia dependiendo que base de datos se utiliza
carpeta config
sequalize models
handlers de router
para interactuar con los modelos las funciones deben ser asincronas
tsconfig para poder guardar datos en la base de datos (target : ESNext, moduleResolution : NodeNext, module : NodeNext)
express-validator para validar los campos que se envían al backend
express-validator (check utilizar en funciones asincronas, body en las demas)
middleware se ejecuta entre una funcion y otra antes de llegar a las funciones del enrutamiento
