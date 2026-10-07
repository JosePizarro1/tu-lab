import { sql } from './db';
import { ROLES, UserRole } from '@/types/roles';

const INITIAL_ESPECIALIDADES = [
  { id: 'esp-medicina-general', nombre: 'Medicina General', descripcion: 'Atención primaria integral, diagnóstico y tratamiento de afecciones comunes.', duracionMinutos: 30, icono: 'IconStethoscope' },
  { id: 'esp-obstetricia', nombre: 'Obstetricia', descripcion: 'Salud materna, control prenatal, consejería reproductiva y salud de la mujer.', duracionMinutos: 30, icono: 'IconHeartbeat' },
  { id: 'esp-enfermeria', nombre: 'Enfermería', descripcion: 'Toma de muestras clínicas, inyectables, curaciones y control de signos vitales.', duracionMinutos: 20, icono: 'IconNurse' },
];

const SEDES = [
  { id: 'SEDE-LEGUIA', nombre: 'Sede Av. Leguía', direccion: 'Av. Leguía N° 778-C, Tacna', telefono: '952 920 616' },
  { id: 'SEDE-MELENDEZ', nombre: 'Sede Patricio Meléndez', direccion: 'Calle Patricio Meléndez N° 382 Of. 303, Tacna', telefono: '952 920 616' },
];

const INITIAL_REACTIVOS = [
  { id: 'R1-B', name: 'Reactivo Glucosa COD', stock: 15, unit: 'Frascos 50ml', minStock: 10, sedeId: 'SEDE-BRENA' },
  { id: 'R2-B', name: 'Tiras Reactivas de Orina', stock: 8, unit: 'Cajas x100', minStock: 12, sedeId: 'SEDE-BRENA' },
  { id: 'R3-B', name: 'Tubos EDTA Tapa Morada', stock: 120, unit: 'Unidades', minStock: 50, sedeId: 'SEDE-BRENA' },
  { id: 'R4-B', name: 'Reactivo Colesterol HDL', stock: 5, unit: 'Frascos 20ml', minStock: 8, sedeId: 'SEDE-BRENA' },

  { id: 'R1-C', name: 'Reactivo Glucosa COD', stock: 25, unit: 'Frascos 50ml', minStock: 10, sedeId: 'SEDE-COMAS' },
  { id: 'R2-C', name: 'Tiras Reactivas de Orina', stock: 18, unit: 'Cajas x100', minStock: 12, sedeId: 'SEDE-COMAS' },
  { id: 'R3-C', name: 'Tubos EDTA Tapa Morada', stock: 95, unit: 'Unidades', minStock: 50, sedeId: 'SEDE-COMAS' },
  { id: 'R4-C', name: 'Reactivo Hemoglobina Glicosilada', stock: 12, unit: 'Frascos 10ml', minStock: 10, sedeId: 'SEDE-COMAS' },
];

const INITIAL_PACIENTES = [
  { dni: '12345678', nombre: 'JUAN', apellido: 'PÉREZ GARCÍA', telefono: '987654321', correo: 'juan.perez@gmail.com', sedeId: 'SEDE-BRENA', fechaRegistro: '2026-07-01' },
  { dni: '87654321', nombre: 'MARÍA', apellido: 'RODRÍGUEZ LÓPEZ', telefono: '912345678', correo: 'maria.rod@outlook.com', sedeId: 'SEDE-COMAS', fechaRegistro: '2026-07-02' }
];

const INITIAL_PRUEBAS = [
  { id: 'P1', pacienteDni: '12345678', examen: 'Hemoglobina', status: 'Completado', fecha: '2026-07-01', resultado: '14.5 g/dL', sedeId: 'SEDE-BRENA' },
  { id: 'P2', pacienteDni: '12345678', examen: 'Glucosa en Ayunas', status: 'Completado', fecha: '2026-07-01', resultado: '85 mg/dL', sedeId: 'SEDE-BRENA' },
  { id: 'P3', pacienteDni: '87654321', examen: 'Colesterol Total', status: 'En Proceso', fecha: '2026-07-02', sedeId: 'SEDE-COMAS' }
];

const INITIAL_USUARIOS: { id: string; username: string; password: string; nombre: string; rol: UserRole }[] = [
  { id: 'U-ADMIN', username: 'admin', password: 'admin', nombre: 'Administrador Clínico', rol: ROLES.ADMIN },
  { id: 'U-DOCTOR', username: 'doctor', password: 'doctor', nombre: 'Dr. Juan Pérez', rol: ROLES.DOCTOR },
  { id: 'U-RECEPCION', username: 'recepcion', password: 'recepcion', nombre: 'Ana Gómez', rol: ROLES.RECEPCIONISTA },
];

let isSeeded = false;
let seedPromise: Promise<void> | null = null;

export async function ensureSeed() {
  if (isSeeded) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      // 1. Crear tabla Sede (nueva)
      await sql`
        CREATE TABLE IF NOT EXISTS "Sede" (
          id VARCHAR(36) PRIMARY KEY,
          nombre VARCHAR(255) UNIQUE NOT NULL,
          direccion TEXT,
          telefono VARCHAR(20),
          activo BOOLEAN DEFAULT true
        );
      `;


    // 2. Crear tablas existentes
    await sql`
      CREATE TABLE IF NOT EXISTS "Usuario" (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Reactivo" (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stock INT NOT NULL,
        unit VARCHAR(255) NOT NULL,
        "minStock" INT NOT NULL,
        sede VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Paciente" (
        dni VARCHAR(255) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        telefono VARCHAR(255),
        correo VARCHAR(255),
        "sedeRegistro" VARCHAR(255) NOT NULL,
        "fechaRegistro" VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "PruebaClinica" (
        id VARCHAR(255) PRIMARY KEY,
        "pacienteDni" VARCHAR(255) NOT NULL REFERENCES "Paciente"(dni) ON DELETE CASCADE,
        examen VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        fecha VARCHAR(255) NOT NULL,
        resultado VARCHAR(255),
        sede VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "MovimientoInventario" (
        id VARCHAR(255) PRIMARY KEY,
        "reactivoId" VARCHAR(255) NOT NULL REFERENCES "Reactivo"(id) ON DELETE CASCADE,
        cantidad INT NOT NULL,
        tipo VARCHAR(255) NOT NULL,
        fecha VARCHAR(255) NOT NULL,
        responsable VARCHAR(255) NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Especialidad" (
        id VARCHAR(64) PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        "duracionMinutos" INT DEFAULT 30,
        icono VARCHAR(64) DEFAULT 'IconStethoscope',
        activo BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Cita" (
        id VARCHAR(64) PRIMARY KEY,
        "especialidadId" VARCHAR(64) NOT NULL REFERENCES "Especialidad"(id) ON DELETE RESTRICT,
        fecha VARCHAR(10) NOT NULL,
        hora VARCHAR(10) NOT NULL,
        "duracionMinutos" INT DEFAULT 30,
        "pacienteDni" VARCHAR(20) NOT NULL,
        "pacienteNombre" VARCHAR(255) NOT NULL,
        "pacienteTelefono" VARCHAR(50),
        "pacienteEmail" VARCHAR(255),
        motivo TEXT,
        origen VARCHAR(20) DEFAULT 'web',
        estado VARCHAR(20) DEFAULT 'pendiente',
        "creadoEn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "HorarioBloqueado" (
        id VARCHAR(64) PRIMARY KEY,
        "sedeId" VARCHAR(64) NOT NULL,
        "especialidadId" VARCHAR(64),
        fecha VARCHAR(10) NOT NULL,
        "horaInicio" VARCHAR(10) NOT NULL,
        "horaFin" VARCHAR(10) NOT NULL,
        motivo TEXT,
        "creadoEn" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    for (const esp of INITIAL_ESPECIALIDADES) {
      await sql`
        INSERT INTO "Especialidad" (id, nombre, descripcion, "duracionMinutos", icono, activo)
        VALUES (${esp.id}, ${esp.nombre}, ${esp.descripcion}, ${esp.duracionMinutos}, ${esp.icono}, true)
        ON CONFLICT (id) DO UPDATE SET 
          nombre = ${esp.nombre},
          descripcion = ${esp.descripcion},
          "duracionMinutos" = ${esp.duracionMinutos},
          icono = ${esp.icono},
          activo = true
      `;
    }

    await sql`ALTER TABLE "Cita" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(64) DEFAULT 'SEDE-LEGUIA'`;
    await sql`ALTER TABLE "Cita" ADD COLUMN IF NOT EXISTS "recordatorioEnviado" BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE "Cita" ADD COLUMN IF NOT EXISTS "recordatorioEnviadoEn" TIMESTAMP`;

    // 3. Migraciones: agregar columnas nuevas si no existen
    await sql`ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "activo" BOOLEAN DEFAULT true`;


    await sql`ALTER TABLE "Reactivo" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;
    await sql`ALTER TABLE "Paciente" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;
    await sql`ALTER TABLE "PruebaClinica" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;

    // Asegurar y limpiar para que existan ÚNICAMENTE las 2 sedes oficiales de Tacna
    for (const s of SEDES) {
      await sql`
        INSERT INTO "Sede" (id, nombre, direccion, telefono, activo)
        VALUES (${s.id}, ${s.nombre}, ${s.direccion}, ${s.telefono}, true)
        ON CONFLICT (id) DO UPDATE SET
          nombre = ${s.nombre},
          direccion = ${s.direccion},
          telefono = ${s.telefono},
          activo = true
      `;
    }

    // Desactivar o reasignar sedes viejas/duplicadas que no sean las 2 oficiales
    await sql`
      UPDATE "Sede" SET activo = false 
      WHERE id NOT IN ('SEDE-LEGUIA', 'SEDE-MELENDEZ')
    `;

    // Normalizar roles existentes en la BD
    await sql`UPDATE "Usuario" SET rol = 'ADMINISTRADOR' WHERE rol IN ('ADMIN', 'Administrador', 'admin')`;
    await sql`UPDATE "Usuario" SET rol = 'DOCTOR' WHERE rol IN ('DOCTOR', 'Doctor', 'Tecnico', 'doctor', 'tecnico')`;
    await sql`UPDATE "Usuario" SET rol = 'RECEPCIONISTA' WHERE rol IN ('RECEPCIONISTA', 'Secretaria', 'Recepcionista', 'secretaria')`;

    // 4. Poblar sedes si están vacías
    const sedeCount = await sql`SELECT COUNT(*) FROM "Sede"`;
    const sCount = parseInt((sedeCount[0] as any).count, 10);
    if (sCount === 0) {
      for (const s of SEDES) {
        await sql`
          INSERT INTO "Sede" (id, nombre, direccion, telefono)
          VALUES (${s.id}, ${s.nombre}, ${s.direccion}, ${s.telefono})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    // 5. Migrar datos existentes: poblar sedeId desde el texto sede/sedeRegistro
    await sql`
      UPDATE "Reactivo" SET "sedeId" = (SELECT id FROM "Sede" WHERE nombre = "Reactivo".sede)
      WHERE "sedeId" IS NULL AND sede IS NOT NULL
    `;
    await sql`
      UPDATE "Paciente" SET "sedeId" = (SELECT id FROM "Sede" WHERE nombre = "Paciente"."sedeRegistro")
      WHERE "sedeId" IS NULL AND "sedeRegistro" IS NOT NULL
    `;
    await sql`
      UPDATE "PruebaClinica" SET "sedeId" = (SELECT id FROM "Sede" WHERE nombre = "PruebaClinica".sede)
      WHERE "sedeId" IS NULL AND sede IS NOT NULL
    `;

    // 6. Poblar datos iniciales
    for (const u of INITIAL_USUARIOS) {
      await sql`
        INSERT INTO "Usuario" (id, username, password, nombre, rol, activo)
        VALUES (${u.id}, ${u.username}, ${u.password}, ${u.nombre}, ${u.rol}, true)
        ON CONFLICT (id) DO UPDATE SET rol = ${u.rol}, activo = true
      `;
    }

    const countRes = await sql`SELECT COUNT(*) FROM "Reactivo"`;
    const rCount = parseInt((countRes[0] as any).count, 10);
    if (rCount === 0) {
      for (const r of INITIAL_REACTIVOS) {
        await sql`
          INSERT INTO "Reactivo" (id, name, stock, unit, "minStock", sede, "sedeId")
          VALUES (${r.id}, ${r.name}, ${r.stock}, ${r.unit}, ${r.minStock}, ${r.sedeId}, ${r.sedeId})
          ON CONFLICT (id) DO NOTHING
        `;
      }

      for (const p of INITIAL_PACIENTES) {
        await sql`
          INSERT INTO "Paciente" (dni, nombre, apellido, telefono, correo, "sedeRegistro", "fechaRegistro", "sedeId")
          VALUES (${p.dni}, ${p.nombre}, ${p.apellido}, ${p.telefono}, ${p.correo}, ${p.sedeId}, ${p.fechaRegistro}, ${p.sedeId})
          ON CONFLICT (dni) DO NOTHING
        `;
      }

      for (const pr of INITIAL_PRUEBAS) {
        const res = pr.resultado || null;
        await sql`
          INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede, "sedeId")
          VALUES (${pr.id}, ${pr.pacienteDni}, ${pr.examen}, ${pr.status}, ${pr.fecha}, ${res}, ${pr.sedeId}, ${pr.sedeId})
          ON CONFLICT (id) DO NOTHING
        `;
      }

      console.log('Base de datos sembrada automáticamente con Neon SQL.');
    }

    // 7. Crear índices estratégicos para optimización y escalabilidad de consultas
    await sql`CREATE INDEX IF NOT EXISTS "idx_cita_disponibilidad" ON "Cita" (fecha, "especialidadId", "sedeId", estado)`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_cita_paciente_dni" ON "Cita" ("pacienteDni")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_bloqueo_filtro" ON "HorarioBloqueado" (fecha, "sedeId", "especialidadId")`;
    await sql`CREATE INDEX IF NOT EXISTS "idx_sede_activo" ON "Sede" (activo)`;

    isSeeded = true;
  } catch (e) {
    console.error('Fallo en la siembra automática de base de datos:', e);
    seedPromise = null;
    throw e;
  }
  })();

  return seedPromise;
}

