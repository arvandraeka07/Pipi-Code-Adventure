export interface GuessItem {
  id: string
  code: string
  options: string[]
  answer: number
  explanation: string
}

export interface BugItem {
  id: string
  title: string
  code: string
  buggyLine: number
  explanation: string
  hint: string
}

export interface PuzzleItem {
  id: string
  title: string
  description: string
  lines: string[]
  explanation: string
}

export interface BuilderBlank {
  options: string[]
  answer: number
}

export interface BuilderItem {
  id: string
  title: string
  prompt: string
  template: string
  blanks: BuilderBlank[]
  explanation: string
}

export const GUESS_ITEMS: GuessItem[] = [
  {
    id: 'g1',
    code: 'print(2 + 3 * 2)',
    options: ['10', '8', '12', 'Error'],
    answer: 1,
    explanation: 'Perkalian dihitung lebih dulu: 3 * 2 = 6, lalu 2 + 6 = 8.',
  },
  {
    id: 'g2',
    code: 'print(10 // 3)',
    options: ['3.33', '3', '4', '1'],
    answer: 1,
    explanation: '// adalah pembagian bulat, desimal dibuang sehingga hasilnya 3.',
  },
  {
    id: 'g3',
    code: 'print("ha" * 2)',
    options: ['haha', 'ha2', 'hah', 'Error'],
    answer: 0,
    explanation: 'String dikali angka akan diulang sebanyak angka tersebut.',
  },
  {
    id: 'g4',
    code: 'nama = "Pipi"\nprint(f"Hai {nama}!")',
    options: ['Hai {nama}!', 'Hai Pipi!', 'Hai nama!', 'Error'],
    answer: 1,
    explanation: 'f-string menyisipkan nilai variabel nama ke dalam teks.',
  },
  {
    id: 'g5',
    code: 'print(7 % 4)',
    options: ['1', '3', '4', '1.75'],
    answer: 1,
    explanation: '7 dibagi 4 menghasilkan 1 sisa 3. Modulo memberi sisa bagi.',
  },
  {
    id: 'g6',
    code: 'print(bool(0))',
    options: ['True', 'False', '0', 'Error'],
    answer: 1,
    explanation: 'Angka 0 dianggap False dalam konteks boolean.',
  },
  {
    id: 'g7',
    code: 'print(len("python"))',
    options: ['5', '6', '7', 'Error'],
    answer: 1,
    explanation: '"python" terdiri dari 6 karakter.',
  },
  {
    id: 'g8',
    code: 'x = 5\nx += 3\nprint(x)',
    options: ['5', '3', '8', '53'],
    answer: 2,
    explanation: 'x += 3 sama dengan x = x + 3, sehingga x menjadi 8.',
  },
  {
    id: 'g9',
    code: 'print("5" + "3")',
    options: ['8', '53', '5 3', 'Error'],
    answer: 1,
    explanation: 'Kedua nilai berupa string, sehingga tanda + menggabungkan teks.',
  },
  {
    id: 'g10',
    code: 'print(3 > 2 and 1 > 5)',
    options: ['True', 'False', '3', 'Error'],
    answer: 1,
    explanation: '3 > 2 True, tetapi 1 > 5 False. and membutuhkan keduanya True.',
  },
  {
    id: 'g11',
    code: 'for i in range(3):\n    print(i)',
    options: ['1 2 3', '0 1 2', '0 1 2 3', '3'],
    answer: 1,
    explanation: 'range(3) menghasilkan 0, 1, 2.',
  },
  {
    id: 'g12',
    code: 'print([1, 2, 3][1])',
    options: ['1', '2', '3', '[1, 2]'],
    answer: 1,
    explanation: 'Indeks 1 mengambil item kedua dari list, yaitu 2.',
  },
  {
    id: 'g13',
    code: 'print(int("12") / 3)',
    options: ['4', '4.0', '12/3', 'Error'],
    answer: 1,
    explanation: 'Pembagian dengan / selalu menghasilkan float: 4.0.',
  },
  {
    id: 'g14',
    code: 'def f(x):\n    return x * 2\n\nprint(f(4) + 1)',
    options: ['8', '9', '5', 'Error'],
    answer: 1,
    explanation: 'f(4) mengembalikan 8, lalu ditambah 1 menjadi 9.',
  },
]

export const BUG_ITEMS: BugItem[] = [
  {
    id: 'b1',
    title: 'Kurung yang Hilang',
    code: 'print("Halo"',
    buggyLine: 0,
    explanation: 'Tanda kurung tutup ) hilang sehingga muncul SyntaxError.',
    hint: 'Periksa pasangan tanda kurung dan kutip.',
  },
  {
    id: 'b2',
    title: 'Sama Dengan atau Simpan?',
    code: 'skor = 10\nif skor = 10:\n    print("Sepuluh")',
    buggyLine: 1,
    explanation: 'Kondisi if membutuhkan == untuk membandingkan, bukan = yang menyimpan nilai.',
    hint: 'Untuk membandingkan, pakai dua tanda sama dengan.',
  },
  {
    id: 'b3',
    title: 'Titik Dua yang Lupa',
    code: 'for i in range(3)\n    print(i)',
    buggyLine: 0,
    explanation: 'Baris for harus diakhiri titik dua (:).',
    hint: 'Semua blok if, for, while, dan def butuh titik dua.',
  },
  {
    id: 'b4',
    title: 'Indentasi Kabur',
    code: 'if True:\nprint("Halo")',
    buggyLine: 1,
    explanation: 'Baris di dalam blok if harus diberi indentasi 4 spasi.',
    hint: 'Isi blok harus lebih menjorok dari baris pembukanya.',
  },
  {
    id: 'b5',
    title: 'Teks Bertemu Angka',
    code: 'umur = 10\nprint("Umur: " + umur)',
    buggyLine: 1,
    explanation: 'String tidak bisa langsung dijumlahkan dengan integer. Gunakan str(umur) atau f-string.',
    hint: 'Perhatikan tipe data kedua sisi tanda +.',
  },
  {
    id: 'b6',
    title: 'Nama yang Salah Ketik',
    code: 'nama = "Pipi"\nprint(nma)',
    buggyLine: 1,
    explanation: 'Variabel nma tidak pernah dibuat. Nama yang benar adalah nama (NameError).',
    hint: 'Cocokkan ejaan nama variabel dengan definisinya.',
  },
  {
    id: 'b7',
    title: 'Indeks Terlalu Jauh',
    code: 'buah = ["apel", "mangga"]\nprint(buah[2])',
    buggyLine: 1,
    explanation: 'Indeks list dimulai dari 0, sehingga indeks yang tersedia hanya 0 dan 1 (IndexError).',
    hint: 'Hitung item dari nol, atau pakai -1 untuk item terakhir.',
  },
  {
    id: 'b8',
    title: 'Function Tanpa Titik Dua',
    code: 'def sapa()\n    print("Halo")',
    buggyLine: 0,
    explanation: 'Definisi function harus diakhiri titik dua setelah tanda kurung.',
    hint: 'Cek akhir baris def.',
  },
  {
    id: 'b9',
    title: 'Huruf Besar yang Nakal',
    code: 'Print("Halo")',
    buggyLine: 0,
    explanation: 'Function bawaan ditulis print (huruf kecil). Print menyebabkan NameError.',
    hint: 'Python peka huruf besar-kecil.',
  },
  {
    id: 'b10',
    title: 'Bukan Cara Memanggil',
    code: 'buah = ["apel"]\nbuah.append["mangga"]',
    buggyLine: 1,
    explanation: 'Method dipanggil dengan tanda kurung: buah.append("mangga"), bukan kurung siku.',
    hint: 'Kurung siku untuk indeks, kurung biasa untuk memanggil function.',
  },
]

export const PUZZLE_ITEMS: PuzzleItem[] = [
  {
    id: 'p1',
    title: 'Sapaan Pertama',
    description: 'Susun program yang membuat variabel nama lalu mencetak sapaan.',
    lines: ['nama = "Pipi"', 'pesan = "Halo, " + nama', 'print(pesan)'],
    explanation: 'Variabel dibuat dulu, dirangkai, lalu dicetak. Urutan eksekusi dari atas ke bawah.',
  },
  {
    id: 'p2',
    title: 'Gerbang Lulus',
    description: 'Susun percabangan nilai kelulusan dengan if/else.',
    lines: [
      'nilai = 80',
      'if nilai >= 75:',
      '    print("Lulus")',
      'else:',
      '    print("Remedial")',
    ],
    explanation: 'Nilai ditentukan, lalu if memeriksa kondisi. else menangani kondisi lainnya.',
  },
  {
    id: 'p3',
    title: 'Jumlah 1 sampai 5',
    description: 'Susun loop yang menjumlahkan angka 1 sampai 5.',
    lines: ['total = 0', 'for i in range(1, 6):', '    total += i', 'print(total)'],
    explanation: 'Akumulator dimulai dari 0, ditambah setiap putaran, lalu dicetak setelah loop.',
  },
  {
    id: 'p4',
    title: 'Function Penjumlah',
    description: 'Susun function tambah lalu panggil dan cetak hasilnya.',
    lines: ['def tambah(a, b):', '    return a + b', 'hasil = tambah(3, 4)', 'print(hasil)'],
    explanation: 'Function didefinisikan sebelum dipanggil. Nilai balik disimpan di hasil.',
  },
  {
    id: 'p5',
    title: 'Hitung Mundur',
    description: 'Susun while loop yang menghitung mundur dari 3.',
    lines: ['i = 3', 'while i > 0:', '    print(i)', '    i -= 1', 'print("Selesai")'],
    explanation: 'While memeriksa kondisi. i dikurangi setiap putaran agar loop berhenti.',
  },
  {
    id: 'p6',
    title: 'Kartu Petualang',
    description: 'Susun dictionary sederhana dan tampilkan isinya.',
    lines: [
      'petualang = {"nama": "Pipi", "level": 3}',
      'print(f"Nama: {petualang[\'nama\']}")',
      'print(f"Level: {petualang[\'level\']}")',
    ],
    explanation: 'Dictionary dibuat dengan pasangan kunci-nilai, lalu nilainya diakses lewat kunci.',
  },
]

export const BUILDER_ITEMS: BuilderItem[] = [
  {
    id: 'bd1',
    title: 'Sapaan Pertama',
    prompt: 'Lengkapi kode agar mencetak Halo, Pipi!',
    template: '{{0}}("Halo, Pipi!")',
    blanks: [{ options: ['print', 'input', 'def', 'return'], answer: 0 }],
    explanation: 'print() menampilkan teks ke layar.',
  },
  {
    id: 'bd2',
    title: 'Simpan Nama',
    prompt: 'Lengkapi assignment dan cetak isinya.',
    template: 'nama {{0}} "Pipi"\nprint({{1}})',
    blanks: [
      { options: ['=', '==', '+', ':'], answer: 0 },
      { options: ['nama', '"nama"', 'print', 'Pipi'], answer: 0 },
    ],
    explanation: 'Tanda = menyimpan nilai. print(nama) mencetak isi variabel tanpa tanda kutip.',
  },
  {
    id: 'bd3',
    title: 'Gerbang Nilai',
    prompt: 'Lengkapi percabangan agar mencetak Lulus untuk nilai 85.',
    template: 'nilai = 85\n{{0}} nilai >= 75:\n    print("Lulus")\n{{1}}:\n    print("Remedial")',
    blanks: [
      { options: ['if', 'for', 'while', 'def'], answer: 0 },
      { options: ['else', 'elif', 'then', 'end'], answer: 0 },
    ],
    explanation: 'if memeriksa kondisi, else menangani kondisi lainnya.',
  },
  {
    id: 'bd4',
    title: 'Loop Angka',
    prompt: 'Lengkapi loop agar mencetak 1 sampai 5.',
    template: 'for i in {{0}}(1, {{1}}):\n    print(i)',
    blanks: [
      { options: ['range', 'len', 'list', 'int'], answer: 0 },
      { options: ['5', '6', '4', '1'], answer: 1 },
    ],
    explanation: 'range(1, 6) menghasilkan 1, 2, 3, 4, 5 — batas akhir tidak termasuk.',
  },
  {
    id: 'bd5',
    title: 'Function Kembali',
    prompt: 'Lengkapi function yang mengembalikan hasil penjumlahan.',
    template: '{{0}} tambah(a, b):\n    {{1}} a + b\n\nprint(tambah(2, 3))',
    blanks: [
      { options: ['def', 'function', 'fun', 'make'], answer: 0 },
      { options: ['return', 'print', 'input', 'break'], answer: 0 },
    ],
    explanation: 'def membuat function, return mengirim hasil ke pemanggil.',
  },
  {
    id: 'bd6',
    title: 'While Counter',
    prompt: 'Lengkapi loop yang berhenti setelah 3 putaran.',
    template: 'i = 1\nwhile i {{0}} 3:\n    print(i)\n    i {{1}} 1',
    blanks: [
      { options: ['<=', '>=', '==', '!='], answer: 0 },
      { options: ['+=', '-=', '=', '=='], answer: 0 },
    ],
    explanation: 'Loop berjalan selama i <= 3. i += 1 menaikkan nilai agar berhenti.',
  },
  {
    id: 'bd7',
    title: 'Tambah ke List',
    prompt: 'Lengkapi agar mangga masuk ke akhir list.',
    template: 'buah = ["apel"]\nbuah.{{0}}("mangga")\nprint(buah)',
    blanks: [{ options: ['append', 'add', 'push', 'insert'], answer: 0 }],
    explanation: 'append() menambahkan item di akhir list.',
  },
  {
    id: 'bd8',
    title: 'Baca Input',
    prompt: 'Lengkapi program yang menyapa nama dari input.',
    template: 'nama = {{0}}()\nprint(f"Halo, {{nama}}!")',
    blanks: [{ options: ['input', 'print', 'int', 'open'], answer: 0 }],
    explanation: 'input() membaca teks dari pengguna dan mengembalikannya sebagai string.',
  },
]

export function reputationTitle(total: number): string {
  if (total >= 900) return 'Legenda Python'
  if (total >= 600) return 'Petualang Ahli'
  if (total >= 350) return 'Penjelajah Tangguh'
  if (total >= 150) return 'Petualang Muda'
  return 'Pemula Pemberani'
}
