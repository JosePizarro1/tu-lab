import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Crear tablas si no existen
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

    // 2. Sembrar datos iniciales si están vacías
    const usuariosCount = await sql`SELECT COUNT(*) FROM "Usuario"`;
    const uCount = parseInt((usuariosCount[0] as any).count, 10);
    if (uCount === 0) {
      await sql`
        INSERT INTO "Usuario" (id, username, password, nombre, rol) VALUES 
        ('U-ADMIN', 'admin', 'admin', 'Administrador Clínico', 'ADMIN'),
        ('U-DOCTOR', 'doctor', 'doctor', 'Dr. Juan Pérez', 'DOCTOR')
      `;
    }

    const reactivosCount = await sql`SELECT COUNT(*) FROM "Reactivo"`;
    const rCount = parseInt((reactivosCount[0] as any).count, 10);
    if (rCount === 0) {
      await sql`
        INSERT INTO "Reactivo" (id, name, stock, unit, "minStock", sede) VALUES 
        ('R1-B', 'Reactivo Glucosa COD', 15, 'Frascos 50ml', 10, 'Breña'),
        ('R2-B', 'Tiras Reactivas de Orina', 8, 'Cajas x100', 12, 'Breña'),
        ('R3-B', 'Tubos EDTA Tapa Morada', 120, 'Unidades', 50, 'Breña'),
        ('R4-B', 'Reactivo Colesterol HDL', 5, 'Frascos 20ml', 8, 'Breña'),
        ('R1-C', 'Reactivo Glucosa COD', 25, 'Frascos 50ml', 10, 'Comas'),
        ('R2-C', 'Tiras Reactivas de Orina', 18, 'Cajas x100', 12, 'Comas'),
        ('R3-C', 'Tubos EDTA Tapa Morada', 95, 'Unidades', 50, 'Comas'),
        ('R4-C', 'Reactivo Hemoglobina Glicosilada', 12, 'Frascos 10ml', 10, 'Comas')
      `;
    }

    const pacientesCount = await sql`SELECT COUNT(*) FROM "Paciente"`;
    const pCount = parseInt((pacientesCount[0] as any).count, 10);
    if (pCount === 0) {
      await sql`
        INSERT INTO "Paciente" (dni, nombre, apellido, telefono, correo, "sedeRegistro", "fechaRegistro") VALUES 
        ('12345678', 'JUAN', 'PÉREZ GARCÍA', '987654321', 'juan.perez@gmail.com', 'Breña', '2026-07-01'),
        ('87654321', 'MARÍA', 'RODRÍGUEZ LÓPEZ', '912345678', 'maria.rod@outlook.com', 'Comas', '2026-07-02')
      `;
    }

    const pruebasCount = await sql`SELECT COUNT(*) FROM "PruebaClinica"`;
    const prCount = parseInt((pruebasCount[0] as any).count, 10);
    if (prCount === 0) {
      await sql`
        INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede) VALUES 
        ('P1', '12345678', 'Hemoglobina', 'Completado', '2026-07-01', '14.5 g/dL', 'Breña'),
        ('P2', '12345678', 'Glucosa en Ayunas', 'Completado', '2026-07-01', '85 mg/dL', 'Breña'),
        ('P3', '87654321', 'Colesterol Total', 'En Proceso', '2026-07-02', NULL, 'Comas')
      `;
    }

    return NextResponse.json({ status: 'success', message: 'Base de datos sembrada con éxito.' });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message || 'Error en semilla' }, { status: 500 });
  }
}
