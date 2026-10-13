# Compás 38

Landing estática: HTML, CSS y JavaScript, sin compilación ni dependencias de aplicación.

## Publicación en Netlify

Conectar este repositorio, rama `main`, directorio de publicación `.` y comando de compilación vacío. `netlify.toml` contiene la configuración.

## Contacto y ubicación

Editar `CONFIG` al principio de `js/main.js`:

- `phone`: número internacional real. La misma constante alimenta llamada y WhatsApp. Está vacío deliberadamente; los botones informan que el contacto estará disponible próximamente hasta configurarlo.
- `publicUrl`: dirección pública definitiva para compartir.
- `mapQuery`: dirección de búsqueda; por defecto Compás 38, Colonia Sevilla, Ciudad de México.
- `mapEmbedUrl`: opcional; sustituir por el embed del lugar exacto confirmado. Esta versión usa búsqueda por domicilio, sin inventar coordenadas. Confirmar visualmente el pin antes de publicar.

Al asignar el dominio, convertir `og:image` en `index.html` a URL absoluta del hero, y añadir `og:url` y canonical con ese dominio. No se inventó una URL pública.

## Fotografías

19 vistas de las fotografías limpiadas previamente aportadas al proyecto. Se conserva su contenido; únicamente se redimensiona y comprime a WebP. `assets/images/manifest.json` conserva los nombres fuente y dimensiones. Miniaturas de 480 px y vistas ampliadas de hasta 1440 px. La sala real sustituye el interior ilustrativo del mockup: no coinciden arquitectónicamente.

## Interacciones

Galería horizontal nativa; visor de fotografías con flechas, teclado y swipe. Mapa en diálogo con cierre, Escape, bloqueo de fondo y restauración del scroll. Compartir usa Web Share y portapapeles como respaldo. Contacto fijo con área segura de iPhone.

## Verificación

Se comprueban sintaxis JavaScript, integridad de imágenes y referencias locales. La comparación visual en navegador/iPhone queda pendiente: esta sesión no dispone del controlador de navegador requerido. No considerar aprobada la fidelidad visual hasta realizarla.

Revisar a 390, 414 y 430 px, además de tablet y escritorio. Comprobar apertura/cierre del mapa conservando el scroll, pin exacto, 19 imágenes, compartir en HTTPS y contacto después de completar el número.
