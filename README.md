# proyecto-pazgo
<<<<<<< HEAD
este repo es para hacer pruebas para nosotros los Paez - Villamil

-------------------------------------------------------------------------------------------------------------------------------

TERRAFORM ES DECLARATIVO : El WorkfloW

Escribir Codigo , Planificar y Ejecutar cambios 

------------------------------------------------------------------------------------------------------------------------------
DynamoDB:

terraform-lock: Permite que si 2 usuarios lanzan cambios al tiempo que el primero que lo realizo tenga la prioridad o si los 2
por defecto quedan bloqueado toca forzar el cambio con un Apply Forces

El archivo .terraform.lock.hcl es un archivo de bloqueo de dependencias que utiliza Terraform para asegurar que se usen versiones específicas de los proveedores (providers) en un proyecto. Aquí te explico sus funciones clave:

Congela las versiones: Cuando ejecutas terraform init, Terraform descarga las versiones de los proveedores que tu configuración requiere y almacena esa información en el archivo. Esto garantiza que, en futuras ejecuciones o en otros entornos, se utilizarán las mismas versiones exactas, evitando sorpresas causadas por actualizaciones inesperadas en los proveedores.

Reproducibilidad: Al tener las versiones bloqueadas, aseguras que la infraestructura se despliegue de forma consistente, independientemente de dónde o cuándo se ejecute Terraform, lo que es crucial para entornos de producción y pruebas.

Seguridad: Evita conflictos y problemas de compatibilidad que podrían surgir si una nueva versión del proveedor introduce cambios inesperados.

Gestión de dependencias: Similar a un package-lock.json , este archivo ayuda a mantener un historial de las versiones que han sido validadas y probadas con tu configuración.

En resumen, el .terraform.lock.hcl actúa como una garantía de estabilidad y coherencia para la gestión de proveedores en tus despliegues con Terraform.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Cuando trabajas con el backend de S3 para almacenar el estado de Terraform, es muy común configurar una tabla de DynamoDB para bloquear el estado (state locking). Esto ayuda a evitar que dos procesos de Terraform modifiquen el estado simultáneamente, lo que podría causar inconsistencias o corrupciones.

¿Por qué DynamoDB?

Bloqueo Distribuido: DynamoDB ofrece un mecanismo de bloqueo distribuido que se integra nativamente con el backend S3 de Terraform. Esto permite a Terraform bloquear el archivo de estado mientras se realizan cambios, asegurando que sólo una operación lo modifique a la vez.

Alta Disponibilidad y Rendimiento: DynamoDB es un servicio administrado de AWS que garantiza baja latencia y alta disponibilidad, lo que lo hace ideal para gestionar bloqueos en entornos colaborativos o en infraestructura a gran escala.

Integración Nativa: La configuración estándar para el backend S3 de Terraform está preparada para usar una tabla de DynamoDB. La documentación de Terraform recomienda este enfoque debido a su facilidad de uso y confiabilidad.

¿Puedo usar otra base de datos en AWS?

La funcionalidad de bloqueo de estado en Terraform, cuando se usa S3 como backend, está específicamente diseñada para trabajar con DynamoDB. No está pensada para usar otra base de datos de AWS de forma nativa. Es posible deshabilitar el bloqueo, pero no es recomendable en entornos donde pueden realizarse cambios concurrentes, ya que se perdería la protección contra modificaciones simultáneas.

En resumen, si deseas asegurar un bloqueo confiable y mantener la integridad de tu estado remoto, lo ideal es usar DynamoDB, ya que es la opción integrada y soportada por Terraform para este propósito. Si deshabilitas el bloqueo o buscas una solución alternativa, te expondrías a riesgos en entornos colaborativos o en despliegues en producción.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Cuando trabajas con el backend de S3 para almacenar el estado de Terraform, es muy común configurar una tabla de DynamoDB para bloquear el estado (state locking). Esto ayuda a evitar que dos procesos de Terraform modifiquen el estado simultáneamente, lo que podría causar inconsistencias o corrupciones.

¿Por qué DynamoDB?

Bloqueo Distribuido: DynamoDB ofrece un mecanismo de bloqueo distribuido que se integra nativamente con el backend S3 de Terraform. Esto permite a Terraform bloquear el archivo de estado mientras se realizan cambios, asegurando que sólo una operación lo modifique a la vez.

Alta Disponibilidad y Rendimiento: DynamoDB es un servicio administrado de AWS que garantiza baja latencia y alta disponibilidad, lo que lo hace ideal para gestionar bloqueos en entornos colaborativos o en infraestructura a gran escala.

Integración Nativa: La configuración estándar para el backend S3 de Terraform está preparada para usar una tabla de DynamoDB. La documentación de Terraform recomienda este enfoque debido a su facilidad de uso y confiabilidad.

¿Puedo usar otra base de datos en AWS?

La funcionalidad de bloqueo de estado en Terraform, cuando se usa S3 como backend, está específicamente diseñada para trabajar con DynamoDB. No está pensada para usar otra base de datos de AWS de forma nativa. Es posible deshabilitar el bloqueo, pero no es recomendable en entornos donde pueden realizarse cambios concurrentes, ya que se perdería la protección contra modificaciones simultáneas.

En resumen, si deseas asegurar un bloqueo confiable y mantener la integridad de tu estado remoto, lo ideal es usar DynamoDB, ya que es la opción integrada y soportada por Terraform para este propósito. Si deshabilitas el bloqueo o buscas una solución alternativa, te expondrías a riesgos en entornos colaborativos o en despliegues en producción.

-------------------------------------------------------------------------------------------------------------------------------

COMANDOS IMPORTANTES:

terraform init – Inicializa el proyecto y descarga los providers.
terraform plan – Muestra qué cambios hará.
terraform apply – Aplica los cambios.
terraform destroy – Elimina todos los recursos gestionados.

terraform init -upgrade	Fuerza la descarga de las últimas versiones de los providers y módulos.
terraform init -backend-config="..."	Puedes sobreescribir parámetros del backend sin tocar el .tf.
terraform init -reconfigure	Reconfigura el backend desde cero, útil si cambió.

---------------------------------------------------------------------------------------------------------------------------------

ARQUITECTURA TERRAFORM

Definicion: 

Terraform tiene una arquitectura modular, declarativa y basada en estados, diseñada para crear, cambiar y destruir infraestructura de forma segura y eficiente.

 1. main.tf
📌 Propósito: Define los recursos principales de tu infraestructura.
🧱 Aquí es donde declaras cosas como: instancias EC2, buckets S3, redes VPC, etc.

2. provider.tf
📌 Propósito: Especifica el proveedor de nube que vas a usar (como AWS, Azure, GCP).
⚙️ También se puede configurar la región o perfiles de autenticación.

3. variables.tf
   📌 Propósito: Define todas las variables de entrada que puedes usar en otros archivos .tf.
   🛠️ Esto hace tu código más dinámico y reutilizable.

🗂️ 4. terraform.tfvars
   📌 Propósito: Asigna valores a las variables definidas en variables.tf.  las Variables en Terraform son "ENTRADAS"
   ✅ Es útil cuando quieres separar la configuración de los valores reales (como en diferentes entornos: dev, test, prod).

🗂️ 5. outputs.tf  - Son SALIDAS  - Recursos
   📌 Propósito: Define los valores que quieres mostrar al final del terraform apply, como IPs, URLs, nombres de recursos, etc.

🗂️ 6. backend.tf
   📌 Propósito: Configura el almacenamiento remoto del estado (terraform.tfstate).
   🌐 Útil cuando trabajas en equipo o quieres usar backends como S3, GCS, Azure Blob, etc.

 7. data.tf
    📌 Propósito: Define bloques data, que te permiten consultar recursos existentes en la nube sin crearlos.
    El bloque data en Terraform se usa para consultar información de recursos que ya existen fuera de Terraform o creados por otra configuración de Terraform, sin tener que crearlos tú directamente. Es decir, sirve para "leer" recursos y no para crearlos.

    ¿Para qué se usa?
    El bloque data es muy útil cuando:
    Quieres usar un recurso que ya existe en tu cuenta (por ejemplo, un VPC, un Security Group, una AMI).
    Necesitas información dinámica (ej. obtener la última versión de una AMI de Ubuntu).
    Quieres referenciar datos sin gestionar directamente esos recursos.

 8. locals.tf
    📌 Propósito: Define valores locales que puedes reutilizar dentro del proyecto (no se pasan como variables externas).

   🧠 ¿Para qué sirve esto?
   Reutilización: Puedes llamar a local.name_prefix en los recursos para nombrarlos consistentemente.
   Condiciones: instance_type cambia según el entorno.
   Orden: Centralizas cosas como etiquetas y nombres para que no estén repetidas en cada recurso.

