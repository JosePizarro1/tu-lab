# 🔌 Propuesta de Integración LIS: Analizador Lifotronic eCL8000

Este documento describe la arquitectura, protocolo y requisitos necesarios para conectar el analizador de inmunoensayo por electroquimioluminiscencia **Lifotronic eCL8000** con nuestro sistema **Demo Lab (LIS - Laboratory Information System)**.

---

## 📊 1. Ficha Técnica del Analizador

Basado en las especificaciones del equipo brindadas por la representación en Perú (*U Scientific*):

| Característica | Especificación |
| :--- | :--- |
| **Marca / Modelo** | Lifotronic **eCL8000** |
| **Metodología** | Inmunoensayo de Electroquimioluminiscencia (ECLIA) |
| **Rendimiento** | 86 pruebas / hora |
| **Tiempo al primer resultado** | 9 minutos |
| **Menú de Ensayos** | Marcadores Tumorales (CEA, AFP, CA 19-9, CA 15-3, CA 125, HE4, TPSA, FPSA, SCC, NSE, CYFRA 21-1, proGRP, CA 72-4, S100, CA 50, CA 242) |
| **Sistema Operativo del Equipo** | Windows 10 con Software de Pantalla Táctil |
| **Interfaz & Conectividad** | **Compatible con LIS (Bidireccional)** |

---

## 🛰️ 2. Opciones de Arquitectura para Conectar tu Web (Next.js) con el Equipo

Dado que tu sistema es una **Aplicación Web desplegada en la Nube (Vercel / Cloud)**, existen dos formas de conectar el equipo analizador con tu web:

---

### 🟢 Opción A: Directa vía Red LAN (Sin instalar nada en la PC) — *RECOMENDADA*

El equipo **Lifotronic eCL8000** cuenta con su propio puerto **Ethernet (TCP/IP)** y corre sobre **Windows 10**.

**¿Cómo funciona?**
1. Conectas el equipo al router/switch de la red local del laboratorio.
2. Si el servidor de tu web está en la nube o si utilizas una VPN/Tunnel (como Cloudflare Tunnel o Ngrok local en el router), el mismo equipo Lifotronic envía directamente las peticiones HTTP/TCP a tus endpoints `/api/lis/*`.
3. **Resultado:** No necesitas instalar ningún programa extra en las computadoras de las secretarias ni tecnólogos. La página web abierta en el navegador recibe los datos automáticamente en tiempo real.

---

### 🟡 Opción B: Mediante un "LIS Agent" (Solo si el equipo usa cable Serial RS-232)

Si el equipo **no** está conectado a la red LAN y únicamente se conecta por cable físico Serial (RS-232) a una computadora:
1. En esa PC se ejecuta un servicio diminuto e invisible (un script de 1MB en Node.js/Python).
2. El script lee el cable serie de la máquina y le reenvía los datos a tu Web por internet.

---

## 🛠️ 3. Arquitectura del Flujo de Trabajo (Bidireccional)

```text
┌────────────────────────┐              ┌────────────────────────────────┐              ┌────────────────────────┐
│  Analizador Lifotronic │              │    LIS Agent / Service Proxy   │              │   Demo Lab (Next.js)   │
│        eCL8000         │              │  (Node.js / Python local PC)   │              │     (Base de Datos)    │
└───────────┬────────────┘              └───────────────┬────────────────┘              └───────────┬────────────┘
            │                                           │                                           │
            │  1. Inserción de tubo de muestra          │                                           │
            │     con Código de Barras (DNI/Muestra)    │                                           │
            │                                           │                                           │
            │ ───────── Query ASTM (Q) ───────────────► │                                           │
            │   "¿Qué pruebas tiene la muestra X?"      │ ────── GET /api/pruebas/pending ────────► │
            │                                           │                                           │
            │ ◄──────── Response ASTM (O) ───────────── │ ◄───── JSON { paciente, exámenes } ────── │
            │   "Ejecutar examen CEA y CA 125"          │                                           │
            │                                           │                                           │
            │  [Procesamiento del Inmunoensayo (9 min)] │                                           │
            │                                           │                                           │
            │ ───────── Result ASTM (R) ──────────────► │                                           │
            │   "Resultado CEA: 3.4 ng/mL"              │ ────── POST /api/pruebas/resultado ─────► │
            │                                           │                                           │
```

### Explicación del Flujo:
1. **Query (Solicitud de Órdenes):** Al escanear el código de barras en el eCL8000, el equipo consulta al servidor qué pruebas requiere el paciente.
2. **Order (Orden de Análisis):** El sistema responde enviando las pruebas pendientes asignadas al paciente (ej. CEA, TPSA).
3. **Result (Envío de Resultados):** Una vez finalizado el inmunoensayo (9 minutos después), el equipo transmite automáticamente el resultado cuantitativo al LIS.

---

## 🛠️ 4. ¿Qué necesitamos implementar en Demo Lab?

Para lograr esta integración completa necesitaremos 3 componentes:

### A. Servicio Intermediario Local (LIS Driver / Agent)
Debido a que el equipo transmite datos en bruto vía socket TCP/IP o RS-232 local (tramas ASTM del tipo `<STX>1H|...\r<ETX>`), necesitaremos una pequeña aplicación o servicio de fondo (en Node.js o Python) instalado en la PC de la sede que:
- Escuche en el puerto TCP local (ej. Puerto 5000) o lea el puerto COM serial.
- Parsee los mensajes ASTM/HL7 a formato JSON estructurado.
- Consuma la API REST de Demo Lab para sincronizar datos.

### B. Nuevos Endpoints en Demo Lab (API REST)
1. **`GET /api/lis/order?sampleId=XXXX`**: Responde las pruebas clínicas pendientes para el código de muestra ingresado.
2. **`POST /api/lis/resultado`**: Recibe los resultados leídos directamente del equipo y actualiza el estado de la prueba a `'Completado'` guardando el valor obtenido.

### C. Módulo de Mapeo de Códigos de Examen
El equipo identifica las pruebas con códigos internos (ej. `CEA`, `CA199`, `FPSA`). En Demo Lab debemos tener una tabla de mapeo para asociar los códigos del equipo con los exámenes registrados en el laboratorio.

---

## 📋 7. ¿Cómo sabemos qué exámenes existen y en qué formato se envían?

Para saber con exactitud qué códigos usa el equipo y qué campos transmite, se utilizan los **manuales de protocolo de la marca (Lifotronic LIS Manual)** y una **Tabla de Mapeo (Diccionario de Exámenes)** en tu sistema:

---

### A. Diccionario de Códigos del Equipo (Menú de Ensayos)
Cada examen en el Lifotronic eCL8000 tiene un **código corto estándar** definido por el fabricante. Según la ficha técnica enviada, el catálogo de marcadores tumorales incluye:

| Nombre del Examen | Código Estándar | Unidad Típica |
| :--- | :--- | :--- |
| Antígeno Carcinoembrionario | `CEA` | ng/mL |
| Alfa-Fetoproteína | `AFP` | IU/mL |
| Antígeno de Cáncer 19-9 | `CA19-9` | U/mL |
| Antígeno de Cáncer 125 | `CA125` | U/mL |
| Antígeno Prostático Específico Total | `TPSA` | ng/mL |
| Antígeno Prostático Específico Libre | `FPSA` | ng/mL |
| Proteína del Epidídimo Humano 4 | `HE4` | pmol/L |

*En tu sistema web crearemos una tabla donde relacionas estos códigos con el nombre comercial o precio de tu laboratorio.*

---

### B. Formato Estándar de la Transmisión (Trama ASTM E1394-97)

El formato en el que viajan los datos entre tu web y el Lifotronic sigue el estándar internacional **ASTM E1394**. Es un texto delimitado por barras `|`:

#### 1. Cuando el Lifotronic consulta las órdenes a tu Web (Registro `Q` - Query):
```text
H|\^&|||Lifotronic^eCL8000|||||||P|1|20260805235900
Q|1|^M-2026-0089||ALL||||||||O
L|1|N
```
- `M-2026-0089`: Código de barra / DNI leído por el escáner del equipo.

#### 2. Cuando tu Web le responde qué exámenes hacer (Registro `O` - Order):
```text
H|\^&|||DemoLab^LIS|||||||P|1
P|1||12345678||Perez^Juan||||M
O|1|M-2026-0089||^^^CEA\^^^TPSA|R||20260805235905||||N||||||||||||||O
L|1|N
```
- **Campos enviados:** 
  - `P`: Datos del Paciente (DNI, Nombre, Apellido, Género).
  - `O`: Lista de códigos de examen solicitados (`CEA`, `TPSA`).

#### 3. Cuando el Lifotronic envía el resultado a tu Web (Registro `R` - Result):
```text
H|\^&|||Lifotronic^eCL8000|||||||P|1
P|1||12345678||Perez^Juan
O|1|M-2026-0089
R|1|^^^CEA|3.45|ng/mL|0.00-5.00|N||F|||20260806000500
L|1|N
```
- **Campos recibidos:**
  - Examen: `CEA`
  - Valor medido: `3.45`
  - Unidad de medida: `ng/mL`
  - Rango de referencia: `0.00 - 5.00`
  - Estado: `F` (Finalizado)


