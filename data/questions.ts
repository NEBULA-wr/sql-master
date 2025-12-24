import { Question } from '../types';

export const questions: Question[] = [
  // ==========================================
  // CATEGORIA 1: BACKUPS Y RECUPERACIÓN (Teoría)
  // ==========================================
  {
    id: 1,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Qué es un backup lógico en MySQL?",
    options: [
      { id: 'a', text: "Una copia exacta de los archivos .ibd del disco." },
      { id: 'b', text: "Un archivo de texto con sentencias SQL (CREATE, INSERT) para reconstruir la BD." },
      { id: 'c', text: "Una copia de la carpeta de instalación de Windows." },
      { id: 'd', text: "Un archivo comprimido de logs de errores." }
    ],
    correctOptionId: 'b',
    explanation: "El backup lógico (ej. mysqldump) exporta las instrucciones SQL necesarias para volver a crear los datos, a diferencia del físico que copia bits."
  },
  {
    id: 2,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Cuál es el comando correcto para respaldar la base de datos 'tienda'?",
    options: [
      { id: 'a', text: "mysql -u root -p tienda < backup.sql" },
      { id: 'b', text: "mysqldump -u root -p tienda > backup.sql" },
      { id: 'c', text: "backup database tienda to disk" },
      { id: 'd', text: "save tienda > backup.sql" }
    ],
    correctOptionId: 'b',
    explanation: "Se utiliza 'mysqldump' para exportar y el operador '>' para redirigir la salida a un archivo."
  },
  {
    id: 3,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Para qué sirve el flag --single-transaction en mysqldump?",
    options: [
      { id: 'a', text: "Para bloquear todas las tablas y que nadie las use." },
      { id: 'b', text: "Realiza el backup dentro de una transacción, asegurando consistencia sin bloquear tablas InnoDB." },
      { id: 'c', text: "Para exportar solo una tabla." },
      { id: 'd', text: "Para hacerlo más rápido ignorando errores." }
    ],
    correctOptionId: 'b',
    explanation: "Es fundamental en entornos de producción para obtener un backup consistente sin detener el servicio."
  },
  {
    id: 4,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Qué comando restaura un backup llamado 'respaldo.sql' en la BD 'tienda'?",
    options: [
      { id: 'a', text: "mysqldump -u root -p tienda < respaldo.sql" },
      { id: 'b', text: "mysql -u root -p tienda < respaldo.sql" },
      { id: 'c', text: "mysql -u root -p tienda > respaldo.sql" },
      { id: 'd', text: "restore tienda from respaldo.sql" }
    ],
    correctOptionId: 'b',
    explanation: "Para restaurar se usa el cliente 'mysql' (no mysqldump) y el operador de entrada '<' para inyectar el SQL."
  },
  {
    id: 5,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Qué flag permite exportar procedimientos almacenados y eventos?",
    options: [
      { id: 'a', text: "--routines --events" },
      { id: 'b', text: "--include-all" },
      { id: 'c', text: "--full" },
      { id: 'd', text: "--procedures" }
    ],
    correctOptionId: 'a',
    explanation: "Por defecto, mysqldump a veces omite procedimientos y eventos. Debes especificarlos explícitamente."
  },
  {
    id: 6,
    category: 'backups',
    type: 'multiple-choice',
    question: "¿Qué opción se usa para respaldar TODAS las bases de datos del servidor?",
    options: [
      { id: 'a', text: "--all-tables" },
      { id: 'b', text: "--all-databases" },
      { id: 'c', text: "--everything" },
      { id: 'd', text: "--full-server" }
    ],
    correctOptionId: 'b',
    explanation: "La opción --all-databases genera un único archivo SQL que contiene todas las BDs del servidor."
  },

  // ==========================================
  // CATEGORIA 2: GESTIÓN DE USUARIOS (Teoría)
  // ==========================================
  {
    id: 16,
    category: 'usuarios',
    type: 'multiple-choice',
    question: "¿Qué sentencia crea un usuario 'admin' que puede conectarse desde cualquier IP?",
    options: [
      { id: 'a', text: "CREATE USER 'admin'@'localhost' ..." },
      { id: 'b', text: "CREATE USER 'admin'@'%' ..." },
      { id: 'c', text: "CREATE USER 'admin'@'all' ..." },
      { id: 'd', text: "CREATE USER 'admin'@'network' ..." }
    ],
    correctOptionId: 'b',
    explanation: "El carácter '%' actúa como comodín (wildcard) representando cualquier host."
  },
  {
    id: 17,
    category: 'usuarios',
    type: 'multiple-choice',
    question: "¿Cuál es la sintaxis correcta para otorgar TODOS los permisos sobre la BD 'tienda'?",
    options: [
      { id: 'a', text: "GRANT ALL PRIVILEGES ON tienda.* TO 'user'@'host';" },
      { id: 'b', text: "GRANT ALL ON *.* TO 'user'@'host';" },
      { id: 'c', text: "ALLOW ALL ON tienda TO 'user';" },
      { id: 'd', text: "GIVE PERMISSION ALL tienda 'user';" }
    ],
    correctOptionId: 'a',
    explanation: "Se debe especificar el alcance (tienda.*) para no dar permisos globales innecesarios."
  },
  {
    id: 18,
    category: 'usuarios',
    type: 'multiple-choice',
    question: "¿Qué hace el comando FLUSH PRIVILEGES?",
    options: [
      { id: 'a', text: "Borra los usuarios." },
      { id: 'b', text: "Recarga las tablas de permisos en memoria." },
      { id: 'c', text: "Cierra la sesión actual." },
      { id: 'd', text: "Cambia la contraseña a default." }
    ],
    correctOptionId: 'b',
    explanation: "Obliga al servidor a releer los permisos del disco. Útil si modificaste las tablas de sistema manualmente."
  },
  {
    id: 19,
    category: 'usuarios',
    type: 'multiple-choice',
    question: "¿Cómo se elimina un permiso específico (ej: INSERT) a un usuario?",
    options: [
      { id: 'a', text: "DELETE INSERT FROM user;" },
      { id: 'b', text: "REVOKE INSERT ON db.* FROM 'user'@'host';" },
      { id: 'c', text: "DENY INSERT TO 'user';" },
      { id: 'd', text: "REMOVE GRANT INSERT;" }
    ],
    correctOptionId: 'b',
    explanation: "REVOKE es el comando opuesto a GRANT y se usa para quitar privilegios."
  },
  {
    id: 20,
    category: 'usuarios',
    type: 'multiple-choice',
    question: "¿Qué comando muestra los permisos que tiene asignados un usuario?",
    options: [
      { id: 'a', text: "SHOW GRANTS FOR 'user'@'host';" },
      { id: 'b', text: "SELECT PERMISSIONS FROM user;" },
      { id: 'c', text: "DESCRIBE USER 'user';" },
      { id: 'd', text: "SHOW PRIVILEGES;" }
    ],
    correctOptionId: 'a',
    explanation: "SHOW GRANTS devuelve las sentencias GRANT necesarias para replicar los permisos del usuario."
  },

  // ==========================================
  // CATEGORIA 3: ADIVINA EL ERROR (Casos Prácticos)
  // ==========================================
  {
    id: 301,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nEjecutas:\n> mysqldump tienda > backup.sql\n\nResultado:\n'Access denied for user...'\n\n¿Por qué falló?",
    options: [
      { id: 'a', text: "La base de datos está llena." },
      { id: 'b', text: "Faltan las credenciales. Debes usar: mysqldump -u usuario -p ..." },
      { id: 'c', text: "El comando mysqldump no existe." },
      { id: 'd', text: "No se puede usar '>' en Windows." }
    ],
    correctOptionId: 'b',
    explanation: "mysqldump necesita autenticarse ante el servidor MySQL igual que cualquier cliente."
  },
  {
    id: 302,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nCódigo SQL:\nGRANT ALL PRIVILEGES ON *.* TO 'dev'@'localhost';\n\nError:\n'Access denied; you need (at least one of) the GRANT OPTION...'\n\n¿Qué pasa?",
    options: [
      { id: 'a', text: "El usuario 'dev' no existe." },
      { id: 'b', text: "Estás intentando dar permisos que tú mismo no tienes o no tienes 'WITH GRANT OPTION'." },
      { id: 'c', text: "La sintaxis 'ON *.*' es inválida." },
      { id: 'd', text: "Debes ser root obligatoriamente." }
    ],
    correctOptionId: 'b',
    explanation: "Solo puedes regalar permisos que tú posees y si tienes habilitada la opción de delegarlos (GRANT OPTION)."
  },
  {
    id: 303,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nConsulta:\nSELECT * FORM clientes;\n\nError:\n'You have an error in your SQL syntax...'\n\n¿Dónde está el error?",
    options: [
      { id: 'a', text: "Falta el punto y coma." },
      { id: 'b', text: "Error tipográfico: Escribiste 'FORM' en lugar de 'FROM'." },
      { id: 'c', text: "La tabla clientes no existe." },
      { id: 'd', text: "SELECT no lleva asterisco." }
    ],
    correctOptionId: 'b',
    explanation: "Es un error clásico de escritura. Las palabras reservadas deben escribirse correctamente."
  },
  {
    id: 304,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nComando:\nmysql -u root -p < backup.sql\n\nProblema:\nEl comando termina sin error, pero la BD 'tienda' sigue vacía.\n\n¿Causa más probable?",
    options: [
      { id: 'a', text: "El backup estaba encriptado." },
      { id: 'b', text: "El archivo .sql no tenía 'USE tienda;' y no especificaste la BD en el comando." },
      { id: 'c', text: "MySQL bloqueó la importación por seguridad." },
      { id: 'd', text: "El usuario root no tiene permisos." }
    ],
    correctOptionId: 'b',
    explanation: "Si el script SQL solo tiene CREATE TABLE sin especificar en qué BD, y tú no se la dices al comando, puede haber creado las tablas en otra BD o fallar silenciosamente si no había BD seleccionada."
  },
  {
    id: 305,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nIntento de conexión:\nmysql -u user -h 192.168.1.50 -p\n\nError:\n'Host 192.168.1.20 is not allowed to connect...'\n\n¿Solución?",
    options: [
      { id: 'a', text: "Apagar el firewall." },
      { id: 'b', text: "Crear un usuario que permita acceso desde esa IP específica o usar '%'." },
      { id: 'c', text: "Usar localhost en vez de IP." },
      { id: 'd', text: "Reiniciar el router." }
    ],
    correctOptionId: 'b',
    explanation: "MySQL restringe el acceso por host. Si te conectas desde la .20, debe existir un usuario 'user'@'192.168.1.20' o 'user'@'%'."
  },
  {
    id: 306,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nConsulta:\nUPDATE productos SET precio = 100\n\nResultado:\nSe actualizaron TODOS los productos.\n\n¿Qué error cometiste?",
    options: [
      { id: 'a', text: "MySQL tiene un bug." },
      { id: 'b', text: "Olvidaste la cláusula WHERE." },
      { id: 'c', text: "Usaste SET en lugar de LET." },
      { id: 'd', text: "El precio era muy bajo." }
    ],
    correctOptionId: 'b',
    explanation: "Un UPDATE sin WHERE aplica el cambio a todas las filas de la tabla. ¡Peligroso!"
  },
  {
    id: 307,
    category: 'errores',
    type: 'multiple-choice',
    question: "CASO:\nComando:\nDROP TABLE clientes;\n\nError:\n'Cannot drop table 'clientes' referenced by a foreign key constraint...'\n\n¿Qué significa?",
    options: [
      { id: 'a', text: "Que no eres administrador." },
      { id: 'b', text: "Hay otra tabla (ej. pedidos) que depende de clientes. Debes borrar esa primero o quitar la FK." },
      { id: 'c', text: "La tabla está abierta en Excel." },
      { id: 'd', text: "Falta el punto y coma." }
    ],
    correctOptionId: 'b',
    explanation: "La integridad referencial impide borrar padres si existen hijos huérfanos."
  },

  // ==========================================
  // CATEGORIA 4: PRÁCTICA DE CÓDIGO (Escribir comandos exactos)
  // ==========================================
  {
    id: 401,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando SQL para CREAR una base de datos llamada 'tienda'.",
    acceptedAnswers: ["CREATE DATABASE tienda;"],
    explanation: "Sintaxis: CREATE DATABASE nombre_bd;"
  },
  {
    id: 402,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando SQL para SELECCIONAR todos los registros de la tabla 'productos'.",
    acceptedAnswers: ["SELECT * FROM productos;"],
    explanation: "SELECT * FROM tabla; trae todas las columnas y filas."
  },
  {
    id: 403,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para crear el usuario 'vendedor' en 'localhost' con contraseña 'pass123'.",
    acceptedAnswers: [
      "CREATE USER 'vendedor'@'localhost' IDENTIFIED BY 'pass123';",
      "create user 'vendedor'@'localhost' identified by 'pass123';"
    ],
    explanation: "CREATE USER 'usuario'@'host' IDENTIFIED BY 'password';"
  },
  {
    id: 404,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para OTORGAR permisos de SELECT e INSERT en la BD 'tienda' (todas las tablas) al usuario 'vendedor'@'localhost'.",
    acceptedAnswers: [
      "GRANT SELECT, INSERT ON tienda.* TO 'vendedor'@'localhost';",
      "GRANT INSERT, SELECT ON tienda.* TO 'vendedor'@'localhost';"
    ],
    explanation: "GRANT privilegio1, privilegio2 ON bd.tablas TO usuario;"
  },
  {
    id: 405,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para VER los permisos del usuario 'vendedor'@'localhost'.",
    acceptedAnswers: ["SHOW GRANTS FOR 'vendedor'@'localhost';"],
    explanation: "SHOW GRANTS FOR usuario;"
  },
  {
    id: 406,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando de TERMINAL (no SQL) para hacer un backup de la BD 'tienda' al archivo 'tienda.sql' usando el usuario 'root'. (Asume que pedirá password).",
    acceptedAnswers: [
      "mysqldump -u root -p tienda > tienda.sql"
    ],
    explanation: "mysqldump -u usuario -p base_datos > archivo_salida.sql"
  },
  {
    id: 407,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para ELIMINAR al usuario 'vendedor'@'localhost'.",
    acceptedAnswers: ["DROP USER 'vendedor'@'localhost';"],
    explanation: "DROP USER elimina la cuenta definitivamente."
  },
  {
    id: 408,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para recargar los privilegios en memoria.",
    acceptedAnswers: ["FLUSH PRIVILEGES;"],
    explanation: "FLUSH PRIVILEGES; recarga las grant tables."
  },
  {
    id: 409,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando SQL para quitar el permiso INSERT al usuario 'vendedor'@'localhost' sobre la BD 'tienda'.",
    acceptedAnswers: ["REVOKE INSERT ON tienda.* FROM 'vendedor'@'localhost';"],
    explanation: "REVOKE permiso ON bd.* FROM usuario;"
  },
  {
    id: 410,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando para SELECCIONAR el campo 'nombre' de la tabla 'clientes' donde el 'id' sea 1.",
    acceptedAnswers: ["SELECT nombre FROM clientes WHERE id = 1;", "select nombre from clientes where id=1;"],
    explanation: "SELECT columna FROM tabla WHERE condicion;"
  },
  {
    id: 411,
    category: 'practica',
    type: 'text-input',
    question: "Escribe el comando de TERMINAL para restaurar 'tienda.sql' en la BD 'tienda' con usuario 'root'.",
    acceptedAnswers: ["mysql -u root -p tienda < tienda.sql"],
    explanation: "mysql -u user -p bd < archivo.sql"
  }
];