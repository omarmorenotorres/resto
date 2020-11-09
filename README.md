# resto

# VERSIONES
# Node -> V10.8.0
# express -> 4.17.1

#CONDICIONES PREVIAS
#1. Asegurese de que tiene previamente instalado NodeJS
#2. Asegurese de que tiene previamente instalado express

#CLONAR PROYECTO
#1. En la consola de comandos dirijase a la carpeta en donde va a alojar el proyecto 
#2. Clone el proyecto del siguiente repositorio:

        git clone https://github.com/omarmorenotorres/resto.git

#4. Abra la carpeta con algún IDE, de preferencia Visual Studio.
#5. Abra una terminal dentro del proyecto.
#5. Instale las dependencias requeriadas para que el proyecto funcione correctamente, con el siguiente comando

        npm install

#CREAR LA BASE DE DATOS
#1. Abra XAMMP y asegurese que el puerto que se esta usando sea `3306`
#   Asegurese que la base de datos tengal la siguiente configuración:
        
        Host: localhost
        User: root
        Pass: ''

#2. Inicie los servicios de Apache y MySql
#3. Abra el panel de administración del servicio MySQL ( phpMyAdmin )
#4. Cree una base de datos llamada `delilah_resto` en el panel de phpMyAdmin
#5. En el listado del panel izquierdo de phMyAdmin haga clic en la base de datos que acaba de crear.
#6. En las configuraciones de la base de datos, haga clic a la pestaña importar.
#7. En el boton Examinar (dependiendo del idioma en el cual este instalado XAMMP), busque el archivo `delilah_resto.sql` ubicado en la raíz del proyecto clonado, y dele continuar. Esta acción creará las tablas de la base de datos y las poblará con datos de prueba.


#INICIAR SERVIDOR
#1. Desde su terminal node en la raiz del proyecto ejecute el sigueinte comando:

        killall -9 node   

#  Asegurandose de eliminar instancias previamente ejecutadas.
#2. Desde su terminal node en la raiz del proyecto ejecute el siguiente comando para inciar el servidor:

        nodemon index.js 

# A este punto estará listo el proyecto.

# Vaya a la URL https://editor.swagger.io/ seleccione File/Import File, busque el archivo llamado `swagger.yaml` ubicado en la raíz del proyecto. Ahí podrá ver la especificación de los endpoin del API y la conexión a la base de datos.

