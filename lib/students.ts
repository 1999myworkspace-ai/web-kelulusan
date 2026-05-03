import fs from "fs";
import path from "path";

export type StudentRecord = {
  nama: string;
  program: string;
  fixedResult?: "red" | "blue";
};

const csvPath = path.join(process.cwd(), "data", "students.csv");

function parseCsv(csv: string): Record<string, StudentRecord> {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const [header, ...rows] = lines;
  if (!header) {
    return {};
  }

  return rows.reduce((acc, row) => {
    const [nisn, nama, program, fixedResult] = row.split(",");
    if (!nisn || !nama || !program) return acc;
    const result = fixedResult?.trim();
    acc[nisn.trim()] = {
      nama: nama.trim(),
      program: program.trim(),
      fixedResult: result === "red" || result === "blue" ? result : undefined,
    };
    return acc;
  }, {} as Record<string, StudentRecord>);
}

function loadStudentDatabase(): Record<string, StudentRecord> {
  try {
    const csv = fs.readFileSync(csvPath, "utf8");
    const parsed = parseCsv(csv);
    if (Object.keys(parsed).length > 0) {
      return parsed;
    }
  } catch (error) {
    console.warn("Could not read students.csv, falling back to hardcoded data.", error);
  }

  return {
    "1234567890": {
      nama: "Budi Santoso",
      program: "DESAIN KOMUNIKASI VISUAL",
    },
    "0987654321": {
      nama: "Siti Aminah",
      program: "REKAYASA PERANGKAT LUNAK",
    },
    "1122334455": {
      nama: "Andi Pratama",
      program: "TEKNIK KOMPUTER DAN JARINGAN",
    },
  };
}

export function getStudentByNisn(nisn: string): StudentRecord | null {
  const db = loadStudentDatabase();
  return db[nisn] ?? null;
}
