import { NextResponse } from "next/server";
import { getStudentByNisn } from "../../../lib/students";
import { dbConfig } from "../../../lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nisn = searchParams.get("nisn");

  if (!nisn) {
    return NextResponse.json(
      { error: "NISN is required" },
      { status: 400 }
    );
  }

  const student = getStudentByNisn(nisn);
  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  const hasDbConfig = Boolean(
    dbConfig.url || (dbConfig.host && dbConfig.user && dbConfig.name)
  );

  return NextResponse.json({
    nisn,
    nama: student.nama,
    program: student.program,
    source: hasDbConfig ? "database" : "in-memory",
  });
}
