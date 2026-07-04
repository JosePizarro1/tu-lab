import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Crear tabla Sede
    await sql`
      CREATE TABLE IF NOT EXISTS "Sede" (
        id VARCHAR(36) PRIMARY KEY,
        nombre VARCHAR(255) UNIQUE NOT NULL,
        direccion TEXT,
        telefono VARCHAR(20),
        activo BOOLEAN DEFAULT true
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
      CREATE TABLE IF NOT EXISTS "Usuario" (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(255) NOT NULL
      );
    `;

    // 2. Migraciones
    await sql`ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "activo" BOOLEAN DEFAULT true`;
    await sql`ALTER TABLE "Reactivo" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;
    await sql`ALTER TABLE "Paciente" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;
    await sql`ALTER TABLE "PruebaClinica" ADD COLUMN IF NOT EXISTS "sedeId" VARCHAR(36) REFERENCES "Sede"(id)`;

    // 3. Sembrar sedes si están vacías
    const sedeCount = await sql`SELECT COUNT(*) FROM "Sede"`;
    const sCount = parseInt((sedeCount[0] as any).count, 10);
    if (sCount === 0) {
      await sql`
        INSERT INTO "Sede" (id, nombre, direccion, telefono) VALUES
        ('SEDE-BRENA', 'Breña', 'Av. Breña 123, Lima', '01-5550101'),
        ('SEDE-COMAS', 'Comas', 'Av. Comas 456, Lima', '01-5550202')
      `;
    }

    // 4. Migrar sedeId desde texto
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

    // 5. Sembrar datos iniciales si están vacías
    const usuariosCount = await sql`SELECT COUNT(*) FROM "Usuario"`;
    const uCount = parseInt((usuariosCount[0] as any).count, 10);
    if (uCount === 0) {
      await sql`
        INSERT INTO "Usuario" (id, username, password, nombre, rol, activo) VALUES 
        ('U-ADMIN', 'admin', 'admin', 'Administrador Clínico', 'ADMIN', true),
        ('U-DOCTOR', 'doctor', 'doctor', 'Dr. Juan Pérez', 'DOCTOR', true)
      `;
    }

    const reactivosCount = await sql`SELECT COUNT(*) FROM "Reactivo"`;
    const rCount = parseInt((reactivosCount[0] as any).count, 10);
    if (rCount === 0) {
      await sql`
        INSERT INTO "Reactivo" (id, name, stock, unit, "minStock", sede, "sedeId") VALUES 
        ('R1-B', 'Reactivo Glucosa COD', 15, 'Frascos 50ml', 10, 'SEDE-BRENA', 'SEDE-BRENA'),
        ('R2-B', 'Tiras Reactivas de Orina', 8, 'Cajas x100', 12, 'SEDE-BRENA', 'SEDE-BRENA'),
        ('R3-B', 'Tubos EDTA Tapa Morada', 120, 'Unidades', 50, 'SEDE-BRENA', 'SEDE-BRENA'),
        ('R4-B', 'Reactivo Colesterol HDL', 5, 'Frascos 20ml', 8, 'SEDE-BRENA', 'SEDE-BRENA'),
        ('R1-C', 'Reactivo Glucosa COD', 25, 'Frascos 50ml', 10, 'SEDE-COMAS', 'SEDE-COMAS'),
        ('R2-C', 'Tiras Reactivas de Orina', 18, 'Cajas x100', 12, 'SEDE-COMAS', 'SEDE-COMAS'),
        ('R3-C', 'Tubos EDTA Tapa Morada', 95, 'Unidades', 50, 'SEDE-COMAS', 'SEDE-COMAS'),
        ('R4-C', 'Reactivo Hemoglobina Glicosilada', 12, 'Frascos 10ml', 10, 'SEDE-COMAS', 'SEDE-COMAS')
      `;
    }

    const pacientesCount = await sql`SELECT COUNT(*) FROM "Paciente"`;
    const pCount = parseInt((pacientesCount[0] as any).count, 10);
    if (pCount === 0) {
      await sql`
        INSERT INTO "Paciente" (dni, nombre, apellido, telefono, correo, "sedeRegistro", "fechaRegistro", "sedeId") VALUES 
        ('12345678', 'JUAN', 'PÉREZ GARCÍA', '987654321', 'juan.perez@gmail.com', 'SEDE-BRENA', '2026-07-01', 'SEDE-BRENA'),
        ('87654321', 'MARÍA', 'RODRÍGUEZ LÓPEZ', '912345678', 'maria.rod@outlook.com', 'SEDE-COMAS', '2026-07-02', 'SEDE-COMAS')
      `;
    }

    const pruebasCount = await sql`SELECT COUNT(*) FROM "PruebaClinica"`;
    const prCount = parseInt((pruebasCount[0] as any).count, 10);
    if (prCount === 0) {
      await sql`
        INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede, "sedeId") VALUES 
        ('P1', '12345678', 'Hemoglobina', 'Completado', '2026-07-01', '14.5 g/dL', 'SEDE-BRENA', 'SEDE-BRENA'),
        ('P2', '12345678', 'Glucosa en Ayunas', 'Completado', '2026-07-01', '85 mg/dL', 'SEDE-BRENA', 'SEDE-BRENA'),
        ('P3', '87654321', 'Colesterol Total', 'En Proceso', '2026-07-02', NULL, 'SEDE-COMAS', 'SEDE-COMAS')
      `;
    }

    return NextResponse.json({ status: 'success', message: 'Base de datos sembrada con éxito.' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message || 'Error en semilla' }, { status: 500 });
  }
}
