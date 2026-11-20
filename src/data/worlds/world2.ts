import type { World } from '../../types'

const DOC = { label: 'Python Docs — The Python Tutorial', url: 'https://docs.python.org/3/tutorial/' }
const W3 = { label: 'W3Schools — Python Variables', url: 'https://www.w3schools.com/python/python_variables.asp' }
const PR = { label: 'Programiz — Python Data Types', url: 'https://www.programiz.com/python-programming/variables-datatypes' }

export const world2: World = {
  id: 'world-2',
  order: 2,
  name: 'Variable Forest',
  tagline: 'Hutan tempat data disimpan dan berubah bentuk.',
  description:
    'Pelajari variabel, tipe data, string, angka, boolean, dan cara menerima input dari pengguna.',
  icon: 'variable',
  palette: { from: '#F4C15B', to: '#D98A18', accent: '#E85B48', soft: '#FFF1D6' },
  reward: { xp: 150, coins: 75, badge: 'python-adventurer' },
  levels: [
    {
      id: 'w2l1',
      title: 'Variabel & Assignment',
      summary: 'Menyimpan data ke dalam nama yang bisa dipakai ulang.',
      minutes: 8,
      icon: 'box',
      intro:
        'Variabel itu seperti kotak berlabel. Kita bisa menyimpan data ke dalamnya, lalu memakai atau mengganti isinya kapan saja.',
      sections: [
        {
          heading: 'Membuat variabel',
          body: [
            'Di Python, variabel dibuat saat kamu memberi nilai dengan tanda =. Nama di kiri, nilai di kanan.',
            'Tanda = bukan "sama dengan" dalam matematika, melainkan "masukkan nilai ini ke variabel". Perbandingan sama dengan memakai ==.',
          ],
          code: {
            code: 'nama = "Pipi"\numur = 10\nprint(nama)\nprint(umur)',
            lines: [
              { line: 'nama = "Pipi"', explain: 'Membuat variabel nama berisi teks "Pipi".' },
              { line: 'umur = 10', explain: 'Membuat variabel umur berisi angka 10.' },
              { line: 'print(nama)', explain: 'Menampilkan isi variabel nama.' },
              { line: 'print(umur)', explain: 'Menampilkan isi variabel umur.' },
            ],
            output: 'Pipi\n10',
          },
        },
        {
          heading: 'Aturan nama variabel',
          body: [
            'Nama variabel boleh berisi huruf, angka, dan garis bawah (_), tetapi tidak boleh diawali angka.',
            'Gunakan nama yang menjelaskan isinya: skor_total lebih jelas daripada x. Python juga peka huruf besar-kecil: nama dan Nama berbeda.',
          ],
          code: {
            code: 'skor_total = 100\nnama_petualang = "Andra"\nprint(skor_total, nama_petualang)',
            lines: [
              { line: 'skor_total = 100', explain: 'Nama dengan garis bawah, jelas maksudnya.' },
              { line: 'nama_petualang = "Andra"', explain: 'Menyimpan teks pada variabel.' },
              { line: 'print(skor_total, nama_petualang)', explain: 'Menampilkan dua nilai dipisah spasi.' },
            ],
            output: '100 Andra',
          },
          tip: 'Hindari spasi pada nama variabel. Gunakan garis bawah: skor_total.',
        },
        {
          heading: 'Mengganti isi variabel',
          body: [
            'Kamu bisa memberi nilai baru ke variabel yang sama. Nilai lama akan diganti.',
          ],
          code: {
            code: 'skor = 10\nprint(skor)\nskor = 25\nprint(skor)',
            lines: [
              { line: 'skor = 10', explain: 'Isi awal skor adalah 10.' },
              { line: 'print(skor)', explain: 'Mencetak 10.' },
              { line: 'skor = 25', explain: 'Isi skor diganti menjadi 25.' },
              { line: 'print(skor)', explain: 'Mencetak 25.' },
            ],
            output: '10\n25',
          },
        },
      ],
      playground: {
        starter: 'nama = "Pipi"\nlevel = 1\nprint("Nama:", nama)\nprint("Level:", level)\n',
      },
      challenge: {
        prompt:
          'Buat dua variabel: nama berisi "Pipi" dan umur berisi 10. Jangan mencetak apa pun — variabelnya akan diperiksa otomatis.',
        starter: '# Buat variabel nama dan umur\n',
        hint: 'Gunakan nama = ... lalu umur = ... . Perhatikan tanda kutip untuk teks dan tanpa kutip untuk angka.',
        solution: 'nama = "Pipi"\numur = 10',
        check: 'tests',
        tests: 'assert nama == "Pipi", "nama harus berisi Pipi"\nassert umur == 10, "umur harus 10"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w2l1-q1',
          kind: 'mc',
          question: 'Manakah nama variabel yang VALID di Python?',
          options: ['2nama', 'nama depan', 'nama_depan', 'nama-depan'],
          answer: 2,
          explanation: 'Garis bawah diperbolehkan, sedangkan spasi, tanda minus, dan angka di awal tidak.',
          hint: 'Gunakan garis bawah sebagai pengganti spasi.',
        },
        {
          id: 'w2l1-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'skor = 5\nskor = skor + 2\nprint(skor)',
          options: ['5', '2', '7', 'Error'],
          answer: 2,
          explanation: 'skor + 2 dihitung dulu (5+2=7), lalu disimpan kembali ke skor.',
          hint: 'Nilai baru dihitung dari nilai lama.',
        },
        {
          id: 'w2l1-q3',
          kind: 'mc',
          question: 'Apa fungsi tanda = dalam Python?',
          options: ['Membandingkan dua nilai', 'Menyimpan nilai ke variabel', 'Menampilkan nilai', 'Membuat komentar'],
          answer: 1,
          explanation: '= adalah assignment (menyimpan nilai). Untuk membandingkan, gunakan ==.',
          hint: 'Bayangkan memasukkan sesuatu ke dalam kotak.',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w2l2',
      title: 'Tipe Data & String',
      summary: 'Mengenal str, int, float, bool dan merangkai teks.',
      minutes: 9,
      icon: 'type',
      intro:
        'Setiap data punya tipe. Pipi punya tipe teks untuk nama, angka untuk umur, dan boolean untuk status suka atau tidak.',
      sections: [
        {
          heading: 'Empat tipe dasar',
          body: [
            'str (string) adalah teks, ditulis dengan tanda kutip. int adalah bilangan bulat. float adalah bilangan desimal. bool hanya berisi True atau False.',
            'Gunakan type() untuk memeriksa tipe sebuah nilai.',
          ],
          code: {
            code: 'nama = "Pipi"\numur = 10\ntinggi = 12.5\nsuka_python = True\nprint(type(nama))\nprint(type(umur))\nprint(type(tinggi))\nprint(type(suka_python))',
            lines: [
              { line: 'nama = "Pipi"', explain: 'String: teks diapit tanda kutip.' },
              { line: 'umur = 10', explain: 'Integer: bilangan bulat.' },
              { line: 'tinggi = 12.5', explain: 'Float: bilangan dengan titik desimal.' },
              { line: 'suka_python = True', explain: 'Boolean: True atau False (huruf T dan F kapital).' },
              { line: 'print(type(...))', explain: 'type() menunjukkan tipe data sebuah nilai.' },
            ],
            output: "<class 'str'>\n<class 'int'>\n<class 'float'>\n<class 'bool'>",
          },
        },
        {
          heading: 'Merangkai string dengan f-string',
          body: [
            'f-string adalah cara modern merangkai teks dan variabel. Awali string dengan huruf f, lalu tulis variabel di dalam kurung kurawal {}.',
            'f-string menghindari tanda kutip berlebih dan spasi aneh dari pemisah koma.',
          ],
          code: {
            code: 'nama = "Pipi"\nlevel = 3\nprint(f"Halo, aku {nama} level {level}!")',
            lines: [
              { line: 'f"Halo, aku {nama} level {level}!"', explain: 'Huruf f mengaktifkan penyisipan variabel di dalam {}.' },
            ],
            output: 'Halo, aku Pipi level 3!',
          },
          tip: 'String boleh memakai kutip tunggal atau ganda, asalkan pembuka dan penutupnya sama.',
        },
        {
          heading: 'Menggabung dan mengulang string',
          body: [
            'Tanda + menggabungkan dua string. Tanda * mengulang string beberapa kali.',
          ],
          code: {
            code: 'sapaan = "Halo" + " " + "Pipi"\nprint(sapaan)\nprint("ha" * 3)',
            lines: [
              { line: '"Halo" + " " + "Pipi"', explain: 'Menempelkan string secara berurutan.' },
              { line: '"ha" * 3', explain: 'Mengulang string tiga kali.' },
            ],
            output: 'Halo Pipi\nhahaha',
          },
        },
      ],
      playground: {
        starter: 'nama = "Petualang"\nlevel = 1\ntinggi = 150.5\nsiap = True\nprint(f"{nama} level {level}")\nprint(type(tinggi))\n',
      },
      challenge: {
        prompt:
          'Buat empat variabel: kota (string), populasi (integer), luas (float), dan indah (boolean). Isinya bebas, tetapi tipenya harus tepat.',
        starter: '# kota = ... (string)\n# populasi = ... (integer)\n# luas = ... (float)\n# indah = ... (boolean)\n',
        hint: 'Gunakan tanda kutip untuk kota, angka tanpa desimal untuk populasi, angka dengan titik untuk luas, dan True/False untuk indah.',
        solution: 'kota = "Bandung"\npopulasi = 2500000\nluas = 167.7\nindah = True',
        check: 'tests',
        tests:
          'assert isinstance(kota, str), "kota harus string"\nassert isinstance(populasi, int) and not isinstance(populasi, bool), "populasi harus int"\nassert isinstance(luas, float), "luas harus float"\nassert isinstance(indah, bool), "indah harus bool"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w2l2-q1',
          kind: 'mc',
          question: 'Tipe data dari 3.14 adalah...',
          options: ['int', 'str', 'float', 'bool'],
          answer: 2,
          explanation: 'Angka dengan titik desimal bertipe float.',
          hint: 'Angka desimal di Python disebut float.',
        },
        {
          id: 'w2l2-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'nama = "Pipi"\nprint(f"Hai {nama}!")',
          options: ['Hai {nama}!', 'Hai Pipi!', 'Hai nama!', 'Error'],
          answer: 1,
          explanation: 'f-string mengganti {nama} dengan isi variabel nama.',
          hint: 'Kurung kurawal pada f-string diisi nilai variabel.',
        },
        {
          id: 'w2l2-q3',
          kind: 'mc',
          question: 'Manakah nilai boolean yang valid?',
          options: ['"True"', 'true', 'True', '1'],
          answer: 2,
          explanation: 'Boolean Python ditulis True atau False dengan huruf kapital di awal.',
          hint: 'Huruf pertama kapital, dan tanpa tanda kutip.',
        },
      ],
      rewards: { xp: 70, coins: 22 },
      sources: [PR, W3, DOC],
    },
    {
      id: 'w2l3',
      title: 'Konversi Tipe Data',
      summary: 'Mengubah string menjadi angka dan sebaliknya.',
      minutes: 7,
      icon: 'refresh',
      intro:
        'Data dari input selalu berupa teks. Kalau ingin menghitung, kita harus mengubahnya menjadi angka. Inilah seni konversi tipe!',
      sections: [
        {
          heading: 'Mengubah tipe dengan int(), float(), str()',
          body: [
            'int("5") mengubah teks "5" menjadi angka 5. float("2.5") menjadi angka desimal. str(10) mengubah angka menjadi teks.',
            'Konversi gagal jika isinya tidak cocok, misalnya int("halo") menimbulkan ValueError.',
          ],
          code: {
            code: 'umur_teks = "12"\numur = int(umur_teks)\nprint(umur + 1)\nprint(str(99) + " poin")',
            lines: [
              { line: 'umur_teks = "12"', explain: 'Masih berupa string karena ada tanda kutip.' },
              { line: 'umur = int(umur_teks)', explain: 'Mengubah string "12" menjadi integer 12.' },
              { line: 'print(umur + 1)', explain: 'Sekarang bisa dijumlahkan: 12 + 1 = 13.' },
              { line: 'print(str(99) + " poin")', explain: 'Angka 99 diubah ke string agar bisa digabung dengan teks.' },
            ],
            output: '13\n99 poin',
          },
        },
        {
          heading: 'String + angka tidak bisa langsung digabung',
          body: [
            'Python tidak otomatis mengubah tipe. Menjumlahkan string dan integer dengan + menghasilkan TypeError.',
            'Solusinya: ubah tipenya secara eksplisit, atau gunakan f-string.',
          ],
          code: {
            code: 'print("Skor: " + str(50))\nprint(f"Skor: {50}")',
            lines: [
              { line: 'str(50)', explain: 'Mengubah angka menjadi teks sebelum digabung.' },
              { line: 'f"Skor: {50}"', explain: 'f-string menangani konversi tampilan secara otomatis.' },
            ],
            output: 'Skor: 50\nSkor: 50',
          },
          tip: 'Gunakan f-string saat menampilkan campuran teks dan angka agar lebih rapi.',
        },
        {
          heading: 'Membulatkan angka desimal',
          body: [
            'int(3.9) memotong bagian desimal menjadi 3 (bukan membulatkan). Untuk membulatkan, gunakan round().',
          ],
          code: {
            code: 'print(int(3.9))\nprint(round(3.9))\nprint(round(3.14159, 2))',
            lines: [
              { line: 'int(3.9)', explain: 'Membuang bagian desimal tanpa pembulatan.' },
              { line: 'round(3.9)', explain: 'Membulatkan ke bilangan bulat terdekat: 4.' },
              { line: 'round(3.14159, 2)', explain: 'Membulatkan sampai 2 angka di belakang koma.' },
            ],
            output: '3\n4\n3.14',
          },
        },
      ],
      playground: {
        starter: 'teks_angka = "25"\nangka = int(teks_angka)\nprint(angka * 2)\nprint(float("1.5") + 1)\n',
      },
      challenge: {
        prompt:
          'Program menerima satu baris input berisi angka. Ubah menjadi integer, tambahkan 1, lalu cetak hasilnya.\nContoh input: 12 → output: 13',
        starter: '# Baca input, konversi, tambah 1, cetak\n',
        hint: 'Gunakan int(input()) untuk membaca sekaligus mengonversi. Jangan menulis teks prompt di dalam input().',
        solution: 'umur = int(input())\nprint(umur + 1)',
        check: 'output',
        stdin: '12',
        expected: '13',
      },
      quiz: [
        {
          id: 'w2l3-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'print(int("5") + 2)',
          options: ['"5"2', '7', '52', 'Error'],
          answer: 1,
          explanation: 'int("5") menjadi angka 5, lalu 5 + 2 = 7.',
          hint: 'int() mengubah teks angka menjadi bilangan.',
        },
        {
          id: 'w2l3-q2',
          kind: 'mc',
          question: 'Mengapa "10" + 5 menghasilkan error?',
          options: [
            'Karena string dan integer tidak bisa dijumlahkan langsung',
            'Karena 5 terlalu kecil',
            'Karena harus memakai kurung kurawal',
            'Karena "10" bukan angka',
          ],
          answer: 0,
          explanation: 'Python tidak mengubah tipe secara otomatis. Gunakan int("10") + 5 atau f-string.',
          hint: 'Perhatikan tipe kedua nilai.',
        },
        {
          id: 'w2l3-q3',
          kind: 'mc',
          question: 'Hasil dari int(3.9) adalah...',
          options: ['4', '3', '3.9', 'Error'],
          answer: 1,
          explanation: 'int() memotong bagian desimal, bukan membulatkan.',
          hint: 'int() bukan round().',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w2l4',
      title: 'Input Pengguna',
      summary: 'Membuat program interaktif dengan input().',
      minutes: 8,
      icon: 'keyboard',
      intro:
        'Program yang seru bisa bicara dengan penggunanya. Dengan input(), Python menunggu kamu mengetik sesuatu.',
      sections: [
        {
          heading: 'Membaca input',
          body: [
            'input() menghentikan program sampai pengguna mengetik sesuatu dan menekan Enter. Hasilnya selalu berupa string.',
            'Kamu bisa menambahkan teks prompt: input("Nama: "). Teks ini tampil sebelum pengguna mengetik.',
          ],
          code: {
            code: 'nama = input("Nama kamu: ")\nprint(f"Halo, {nama}!")',
            lines: [
              { line: 'input("Nama kamu: ")', explain: 'Menampilkan prompt lalu menunggu ketikan pengguna.' },
              { line: 'nama = ...', explain: 'Hasil input berupa string disimpan di variabel nama.' },
              { line: 'print(f"Halo, {nama}!")', explain: 'Menyapa pengguna memakai isi input.' },
            ],
            output: 'Nama kamu: Andra\nHalo, Andra!',
          },
        },
        {
          heading: 'Input angka harus dikonversi',
          body: [
            'Karena input() menghasilkan string, gunakan int() atau float() jika ingin menghitung.',
          ],
          code: {
            code: 'umur = int(input("Umur: "))\nprint(f"Tahun depan kamu {umur + 1} tahun")',
            lines: [
              { line: 'int(input("Umur: "))', explain: 'input() membaca teks, int() mengubahnya menjadi angka.' },
              { line: '{umur + 1}', explain: 'Sekarang umur bisa ditambah 1.' },
            ],
            output: 'Umur: 15\nTahun depan kamu 16 tahun',
          },
          tip: 'Jika pengguna mengetik huruf saat diminta angka, int() akan error. Nanti kita tangani dengan exception handling.',
        },
        {
          heading: 'Menggabungkan input dan logika',
          body: [
            'Input sering dipakai bersama if dan perulangan untuk membuat program yang benar-benar interaktif.',
          ],
          code: {
            code: 'kota = input("Kota: ")\nprint(f"{kota} terdengar seru untuk petualangan!")',
            lines: [
              { line: 'kota = input("Kota: ")', explain: 'Menyimpan jawaban pengguna.' },
              { line: 'print(...)', explain: 'Menampilkan jawaban dalam kalimat.' },
            ],
          },
        },
      ],
      playground: {
        starter: 'nama = "Petualang"\nprint(f"Selamat datang, {nama}!")\n# Di playground ini, input interaktif memakai kolom Input di bawah.\n',
        stdin: 'Andra',
      },
      challenge: {
        prompt:
          'Baca satu baris input berisi nama, lalu cetak: Halo, [nama]! Selamat belajar Python.\nContoh input: Andra → output: Halo, Andra! Selamat belajar Python.\nGunakan input() tanpa teks prompt.',
        starter: 'nama = input()\n# Cetak kalimat sapaan\n',
        hint: 'Gunakan f-string: f"Halo, {nama}! Selamat belajar Python." Perhatikan tanda baca persisnya.',
        solution: 'nama = input()\nprint(f"Halo, {nama}! Selamat belajar Python.")',
        check: 'output',
        stdin: 'Andra',
        expected: 'Halo, Andra! Selamat belajar Python.',
      },
      quiz: [
        {
          id: 'w2l4-q1',
          kind: 'mc',
          question: 'Tipe data hasil dari input() adalah...',
          options: ['int', 'str', 'float', 'bool'],
          answer: 1,
          explanation: 'input() selalu mengembalikan string, walaupun pengguna mengetik angka.',
          hint: 'Itu sebabnya kita perlu int() saat memasukkan angka.',
        },
        {
          id: 'w2l4-q2',
          kind: 'output',
          question: 'Jika pengguna mengetik 7, apa output kode ini?',
          code: 'angka = input()\nprint(angka * 2)',
          options: ['14', '77', '7 7', 'Error'],
          answer: 1,
          explanation: 'angka masih string "7", jadi "7" * 2 menghasilkan "77".',
          hint: 'String dikali angka akan diulang, bukan dihitung.',
        },
        {
          id: 'w2l4-q3',
          kind: 'fill',
          question: 'Lengkapi kode agar input angka bisa dijumlahkan:',
          code: 'umur = ____(input())\nprint(umur + 1)',
          options: ['str', 'int', 'print', 'input'],
          answer: 1,
          explanation: 'Gunakan int() untuk mengubah teks input menjadi integer.',
          hint: 'Kita perlu tipe angka bulat untuk penjumlahan.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [DOC, PR],
    },
  ],
  boss: {
    id: 'variable-goblin',
    name: 'Variable Goblin',
    title: 'Pencuri Isi Kotak',
    description:
      'Goblin iseng ini menukar isi variabel dan mencampur tipe data. Kalahkan dengan pemahaman tipe dan assignment!',
    hp: 120,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w2l1-q1', 'w2l1-q2', 'w2l1-q3', 'w2l2-q1', 'w2l2-q2', 'w2l3-q3', 'w2l4-q1', 'w2l4-q3'],
    finalChallenge: {
      prompt:
        'Serangan terakhir! Buat variabel nama = "Petualang", skor = 75, dan lulus = True (boolean hasil skor >= 70).',
      starter: '# Buat tiga variabel\n',
      hint: 'lulus harus berupa hasil perbandingan: skor >= 70, bukan teks "True".',
      solution: 'nama = "Petualang"\nskor = 75\nlulus = skor >= 70',
      check: 'tests',
      tests:
        'assert nama == "Petualang", "nama salah"\nassert skor == 75, "skor salah"\nassert lulus is True, "lulus harus boolean True"\nprint("PIPI_PASS")',
    },
    reward: { xp: 140, coins: 55 },
  },
}
