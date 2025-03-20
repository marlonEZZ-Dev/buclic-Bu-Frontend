# Buclic

Se creó el proyecto para dar solución a la problemática en el área de bienestar universitario donde se acumulaban muchos las filas, por un beneficio que se brinda sobre el almuerzo para los estudiantes, además se buscó ayudar a otras áreas dentro de esta como odontología, enfermería y psicología, este proyecto se llevó a cabo por 8 personas entre las cuales asumimos 2 o más roles.

## Practicamente un fork

Se crea este repositorio como un fork público por motivo de que ya no es posible contactar con la persona encargada para cambiar estado de visualización del repositorio de github que actualmente es privado puede comprobarlo aquí[https://github.com/anamaria2211/bu-frontend]. Por ende este repositorio solo se le permitirá ser visible y lograr

### Para la visualización

1. Instale [NodeJS](https://nodejs.org/en/download) y NPM.
2. Ingrese a la carpeta del proyecto e instale las librerías del proyecto de frontend desde una terminal en linux ó Mac ó una cmd ó powershell en windows
```Bash
npm install
```
3. Dentro del proyecto con una cmd o powershell desde Windows o si se encuentra en linux ejecute el siguiente comando para iniciar el servidor de pruebas.
``` Bash
npm run dev
```
4. La aplicación necesita comunicarse con una API hecha en Spring Boot puede encontrar el archivo jar [aquí]() o puede instalar Jet Brains especial para Java y descargar el zip [aquí](https://drive.google.com/file/d/1hlYRHr3V4xaedyexPIOReu6CQXXOStUV/view?usp=drive_link). Cabe aclarar que la aplicación jar esta predefinida para comunicarse por el puerto http://localhost:8080/ . Es importante advertir que el código no es mio por tanto solo será compartido sí se me notifica por un correo de alguna empresa u oficina de trabajo que requiera el proyecto porque no pueden ejecutar correctamente el archivo jar.

5. Por defecto la aplicación cuenta con varios usuarios estos son admin, enfermero, estudiante, funcionario, cada uno tiene lo mismo como contraseña es decir el usuario admin tiene la contraseña admin, el usuario estudiante tiene la contraseña estudiante y así sucesivamente. Desde el usuario principal puede crear usuarios es decir el usuario admin. El aplicativo por seguridad define una clave provicional cuando se crea un usuario. y depende del tipo de usuario. Por ejemplo un estudiante Llamado Pepe Hinestroza tiene un código asociado dentro de la universidad ejemplo 202059432 por tanto su contraseña provicional sería P202059432H para otros tipos de usuarios que no tienen un código de estudiante se opta por el número de documento de identidad. Por seguridad se comparte esta información pero es preciso aclarar que los usuarios que tienen misma identificación y misma contraseña no existen y se les obligo a los usuarios en la organización cambiar la contraseña para el usuario admin.