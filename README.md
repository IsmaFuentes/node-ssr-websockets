# React SSR - Node | Carousel de publicidad con "Hot reload"

Aplicación web basada en servidor, configurada con Vite, utilizando la plantilla de React + Node.

- Permite visualizar imágenes de la carpeta "Images\Horizontal" o "Images\Vertical" a partir de queries en la url
- Utiliza un file system watcher en conjunto de web sockets para actualizar las imágenes del visor en tiempo real

queries:

- baseUrl/?orientation=vertical
- baseUrl/?orientation=horizontal

## Configuración e instalación

### IIS

Es necesaria la instalación de los siguientes componentes:

- Node.js
- Módulo IISNode
- Módulo Rewrite

### Build

Debido a las limitaciones de IISNode, el proyecto debe incluir un archivo que servirá como punto de entrada que servirá para importar y ejecutar el archivo "server.js" donde se encuentra el script que pone en marcha el servidor.

**entrypoint.cjs**

```js
import('./server.js');
```

A partir de aquí los pasos a seguir son los siguientes:

- Mover la carpeta del proyecto a "inetpub\wwwroot"
- Abrir la consola de comandos y ejecutar "npm install" + "npm run build" (o el script que se haya configurado para generar el build)
- Añadir y modificar el archivo web.config con los siguientes parámetros

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
	<appSettings>
		<add key="NODE_ENV" value="production" />
	</appSettings>
	<system.webServer>
		<handlers>
			<add name="iisnode" path="/entrypoint.cjs" verb="*" modules="iisnode"/>
		</handlers>
		<rewrite>
			<rules>
				<rule name="nodejs">
					<match url="(.*)"/>
					<conditions>
						<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true"/>
					</conditions>
					<action type="Rewrite" url="/entrypoint.cjs"/>
				</rule>
			</rules>
		</rewrite>
		<security>
			<requestFiltering>
				<hiddenSegments>
					<add segment="node_modules"/>
					<add segment="iisnode"/>
				</hiddenSegments>
			</requestFiltering>
			<authorization>
				<remove users="*" roles="" verbs=""/>
				<add accessType="Allow" users="*" verbs=""/>
			</authorization>
		</security>
	</system.webServer>
	<system.web>
		<customErrors mode="Off"/>
	</system.web>
</configuration>
```

- En caso de que sea necesario, cambiar el usuario predeterminado del sitio web a "LocalSystem"
