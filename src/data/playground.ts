export interface PlaygroundTemplate {
  id: string
  name: string
  description: string
  icon: string
  code: string
  stdin?: string
}

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: 'sapaan',
    name: 'Sapaan & variabel',
    description: 'Simpan data ke variabel lalu tampilkan dengan print dan f-string.',
    icon: 'message',
    code: `nama = "Pipi"
level = 1
tinggi = 12.5
senang = True

print("Halo, aku", nama)
print(f"Aku level {level} dan tinggiku {tinggi} cm.")
print("Apakah aku senang?", senang)
print(type(nama), type(level), type(tinggi), type(senang))
`,
  },
  {
    id: 'angka',
    name: 'Angka & operator',
    description: 'Latihan aritmatika, pembagian bulat, modulo, dan pangkat.',
    icon: 'calculator',
    code: `a = 17
b = 5

print("Tambah:", a + b)
print("Kurang:", a - b)
print("Kali:", a * b)
print("Bagi:", a / b)
print("Bagi bulat:", a // b)
print("Sisa bagi:", a % b)
print("Pangkat:", a ** 2)
`,
  },
  {
    id: 'if',
    name: 'If / elif / else',
    description: 'Ambil keputusan berdasarkan kondisi nilai.',
    icon: 'branch',
    code: `nilai = 82

if nilai >= 90:
    print("Grade A")
elif nilai >= 75:
    print("Grade B")
elif nilai >= 60:
    print("Grade C")
else:
    print("Belajar lagi, ya!")

print("Selesai memeriksa nilai.")
`,
  },
  {
    id: 'loop',
    name: 'For & while',
    description: 'Ulangi pekerjaan dengan for, dan hitung mundur dengan while.',
    icon: 'repeat',
    code: `print("For loop:")
for i in range(1, 6):
    print(f"Putaran ke-{i}")

print("\\nWhile loop:")
hitung = 3
while hitung > 0:
    print(hitung)
    hitung -= 1
print("Selesai!")
`,
  },
  {
    id: 'function',
    name: 'Function & return',
    description: 'Buat function dengan parameter dan kembalikan hasilnya.',
    icon: 'function',
    code: `def luas_persegi(sisi):
    return sisi * sisi


def sapa(nama, level):
    return f"Halo {nama}, kamu level {level}!"


print("Luas persegi 6:", luas_persegi(6))
print(sapa("Pipi", 3))
`,
  },
  {
    id: 'list',
    name: 'List & dictionary',
    description: 'Kelola banyak data dengan list dan dictionary.',
    icon: 'database',
    code: `buah = ["apel", "mangga"]
buah.append("jeruk")
print("Buah:", buah)
print("Jumlah:", len(buah))
print("Pertama:", buah[0])
print("Terakhir:", buah[-1])

petualang = {"nama": "Pipi", "level": 3, "kota": "Lembah Pertama"}
for kunci, nilai in petualang.items():
    print(f"{kunci}: {nilai}")
`,
  },
  {
    id: 'error',
    name: 'Try / except',
    description: 'Tangani error agar program tidak berhenti mendadak.',
    icon: 'shield',
    code: `angka = [10, 0, 5]

for n in angka:
    try:
        hasil = 100 / n
        print(f"100 / {n} = {hasil}")
    except ZeroDivisionError:
        print("Tidak bisa membagi dengan nol!")

print("Program tetap berjalan.")
`,
  },
  {
    id: 'input',
    name: 'Input & output',
    description: 'Baca input pengguna lewat stdin, lalu olah menjadi output.',
    icon: 'keyboard',
    code: `nama = input()
umur = int(input())

print(f"Halo, {nama}!")
print(f"Tahun depan umurmu {umur + 1} tahun.")
`,
    stdin: 'Pipi\n12\n',
  },
  {
    id: 'bintang',
    name: 'Pola bintang',
    description: 'Gabungkan loop dan string untuk membentuk pola.',
    icon: 'sparkles',
    code: `baris = 5

for i in range(1, baris + 1):
    print("*" * i)

print()

for i in range(baris, 0, -1):
    print(" " * (baris - i) + "*" * i)
`,
  },
]
