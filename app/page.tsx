"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function Home() {
  const [nama, setNama] = useState("");
  const [nisn, setNisn] = useState("");
  const [programKeahlian, setProgramKeahlian] = useState("");
  const [hasil, setHasil] = useState(false);
  const [warna, setWarna] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [loadingAutoFill, setLoadingAutoFill] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStudent = useCallback(async (nisnValue: string) => {
    if (nisnValue.length < 9) return;

    try {
      setLoadingAutoFill(true);
      const response = await fetch(`/api/students?nisn=${encodeURIComponent(nisnValue)}`);
      const data = await response.json();

      if (response.ok) {
        setNama(data.nama);
        setProgramKeahlian(data.program);
      } else {
        setNama("");
        setProgramKeahlian("");
      }
    } catch (error) {
      console.error("Error fetching student:", error);
      setNama("");
      setProgramKeahlian("");
    } finally {
      setLoadingAutoFill(false);
    }
  }, []);

  const debouncedFetchStudent = useCallback(
    (nisnValue: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => fetchStudent(nisnValue), 500);
    },
    [fetchStudent]
  );

  const handleNisnChange = (value: string) => {
    setNisn(value);
    if (value.length >= 9) {
      debouncedFetchStudent(value);
    } else {
      setNama("");
      setProgramKeahlian("");
    }
  };

  const cekKelulusan = async () => {
    if (!nisn) {
      alert("Isi NISN dulu");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/students?nisn=${encodeURIComponent(nisn)}`);
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "NISN tidak ditemukan di database");
        setNama("");
        setProgramKeahlian("");
        return;
      }

      setNama(data.nama);
      setProgramKeahlian(data.program);

      const random = Math.random() > 0.5 ? "blue" : "red";
      setWarna(random);
      setHasil(true);

      if (random === "red") {
        setTimeout(() => {
          alert("😆 TENANG... CUMA PRANK!");
          setWarna("blue");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">

        {/* Header */}
        <div className="bg-black text-white text-center py-4 px-4 border-b border-zinc-700">
          <img
            src="/logo.svg"
            alt="Logo SMK Yapan Indonesia"
            className="mx-auto mb-3 h-16 w-16"
          />
          <h1 className="font-bold text-lg">
            HASIL KELULUSAN SMK YAPAN INDONESIA
          </h1>
        </div>

        {/* Form */}
        {!hasil && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Cek Kelulusan</h2>

            <input
              type="text"
              placeholder="Masukkan NISN"
              value={nisn}
              onChange={(e) => handleNisnChange(e.target.value)}
              className="w-full p-3 rounded-lg mb-3 bg-white text-black"
            />

            <input
              type="text"
              placeholder={loadingAutoFill ? "Mencari nama..." : "Nama akan diambil dari database"}
              value={nama}
              readOnly
              className="w-full p-3 rounded-lg mb-4 bg-white text-black"
            />

            <button
              onClick={cekKelulusan}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "MEMERIKSA..." : "LIHAT HASIL"}
            </button>

            <p className="text-xs text-zinc-400 text-center mt-4">
              *Nama dan Program Keahlian akan diambil dari database berdasarkan NISN.
            </p>
          </div>
        )}

        {/* Hasil */}
        {hasil && (
          <div>
            <div
              className={`p-4 font-bold text-center ${
                warna === "blue" ? "bg-blue-600" : "bg-red-600"
              }`}
            >
              {warna === "blue" ? (
                "SELAMAT! ANDA DINYATAKAN LULUS"
              ) : (
                <>
                  MAAF! ANDA DINYATAKAN{' '}
                  <span className="line-through">TIDAK</span>{' '}
                  LULUS
                </>
              )}
            </div>

            <div className="p-6 bg-black">

              {/* QR */}
              <div className="flex justify-center mb-5">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://instagram.com/"
                  alt="QR"
                  className="bg-white p-2 rounded-lg"
                />
              </div>

              <div className="space-y-3 text-sm">
                <p><b>NISN:</b> {nisn}</p>
                <p><b>NAMA:</b> {nama}</p>
                <p><b>PROGRAM KEAHLIAN:</b> {programKeahlian || "-"}</p>
                <p><b>ASAL SEKOLAH:</b> SMK YAPAN INDONESIA</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}