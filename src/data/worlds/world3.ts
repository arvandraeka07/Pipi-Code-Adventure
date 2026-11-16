import type { World } from '../../types'

const DOC = { label: 'Python Docs — Expressions & Control Flow', url: 'https://docs.python.org/3/tutorial/controlflow.html' }
const W3 = { label: 'W3Schools — Python Operators', url: 'https://www.w3schools.com/python/python_operators.asp' }
const PR = { label: 'Programiz — Python if else', url: 'https://www.programiz.com/python-programming/if-elif-else' }

export const world3: World = {
  id: 'world-3',
  order: 3,
  name: 'Logic Castle',
  tagline: 'Istana tempat keputusan dibuat oleh logika.',
  description:
    'Kuasai operator aritmatika, perbandingan, operator logika, serta if, elif, dan else.',
  icon: 'scale',
  palette: { from: '#9B8AFB', to: '#6B4EE6', accent: '#FFC93C', soft: '#EDE8FF' },
  reward: { xp: 160, coins: 80 },
  levels: [
    {
      id: 'w3l1',
      title: 'Operator Aritmatika',
      summary: 'Berhitung dengan Python: tambah, bagi, modulo, pangkat.',
      minutes: 8,
      icon: 'calculator',
      intro:
        'Python jago berhitung. Di istana ini kita belajar tujuh operator aritmatika yang wajib dikuasai petualang.',
      sections: [
        {
          heading: 'Tujuh operator dasar',
          body: [
            '+ tambah, - kurang, * kali, / bagi (hasil float), // bagi bulat, % sisa bagi (modulo), dan ** pangkat.',
            'Perhatikan bahwa / selalu menghasilkan float, sedangkan // membuang bagian desimal.',
          ],
          code: {
            code: 'print(7 + 3)\nprint(7 - 3)\nprint(7 * 3)\nprint(7 / 2)\nprint(7 // 2)\nprint(7 % 2)\nprint(2 ** 3)',
            lines: [
              { line: '7 + 3', explain: 'Penjumlahan: 10.' },
              { line: '7 - 3', explain: 'Pengurangan: 4.' },
              { line: '7 * 3', explain: 'Perkalian: 21.' },
              { line: '7 / 2', explain: 'Pembagian biasa menghasilkan float: 3.5.' },
              { line: '7 // 2', explain: 'Pembagian bulat: 3 (desimal dibuang).' },
              { line: '7 % 2', explain: 'Sisa bagi: 1.' },
              { line: '2 ** 3', explain: 'Pangkat: 2 × 2 × 2 = 8.' },
            ],
            output: '10\n4\n21\n3.5\n3\n1\n8',
          },
        },
        {
          heading: 'Urutan operasi',
          body: [
            'Python mengikuti urutan matematika: kurung, pangkat, kali/bagi, lalu tambah/kurang. Gunakan tanda kurung jika ingin mengatur urutan sendiri.',
          ],
          code: {
            code: 'print(2 + 3 * 4)\nprint((2 + 3) * 4)',
            lines: [
              { line: '2 + 3 * 4', explain: 'Kali dihitung dulu: 2 + 12 = 14.' },
              { line: '(2 + 3) * 4', explain: 'Kurung dihitung dulu: 5 * 4 = 20.' },
            ],
            output: '14\n20',
          },
          tip: 'Modulo (%) sering dipakai untuk mengecek bilangan genap/ganjil: angka % 2 == 0 berarti genap.',
        },
      ],
      playground: {
        starter: 'angka = 17\nprint(angka // 5)\nprint(angka % 5)\nprint(angka ** 2)\n',
      },
      challenge: {
        prompt:
          'Hitung dengan Python dan simpan ke variabel:\n• hasil_bagi_bulat = 17 // 5\n• hasil_pangkat = 2 ** 4\n• hasil_sisa = 17 % 5\nTidak perlu mencetak; nilainya diperiksa otomatis.',
        starter: '# Lengkapi tiga variabel\nhasil_bagi_bulat = ?\nhasil_pangkat = ?\nhasil_sisa = ?\n',
        hint: 'Ganti tanda ? dengan ekspresi Python. Ingat // untuk bagi bulat dan ** untuk pangkat.',
        solution: 'hasil_bagi_bulat = 17 // 5\nhasil_pangkat = 2 ** 4\nhasil_sisa = 17 % 5',
        check: 'tests',
        tests:
          'assert hasil_bagi_bulat == 3, "17 // 5 = 3"\nassert hasil_pangkat == 16, "2 ** 4 = 16"\nassert hasil_sisa == 2, "17 % 5 = 2"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w3l1-q1',
          kind: 'output',
          question: 'Apa hasil dari 7 // 2?',
          options: ['3.5', '3', '4', '1'],
          answer: 1,
          explanation: '// adalah pembagian bulat; bagian desimal dibuang sehingga hasilnya 3.',
          hint: 'Dua garis miring berarti pembagian bulat.',
        },
        {
          id: 'w3l1-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'print(10 % 3)',
          options: ['3', '1', '0', '3.33'],
          answer: 1,
          explanation: '10 dibagi 3 menyisakan 1. Modulo memberi sisa bagi.',
          hint: 'Sisa dari 10 dibagi 3.',
        },
        {
          id: 'w3l1-q3',
          kind: 'output',
          question: 'Berapa hasil 2 ** 3?',
          options: ['6', '8', '9', '23'],
          answer: 1,
          explanation: '** adalah pangkat: 2 × 2 × 2 = 8.',
          hint: 'Pangkat, bukan perkalian biasa.',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w3l2',
      title: 'Perbandingan & Logika',
      summary: 'Membandingkan nilai dan menggabungkan kondisi.',
      minutes: 9,
      icon: 'scale',
      intro:
        'Untuk membuat keputusan, program perlu bertanya: apakah nilai ini lebih besar? Apakah dua kondisi terpenuhi? Di sinilah operator perbandingan dan logika bekerja.',
      sections: [
        {
          heading: 'Operator perbandingan',
          body: [
            '== sama dengan, != tidak sama dengan, > lebih besar, < lebih kecil, >= lebih besar atau sama dengan, <= lebih kecil atau sama dengan.',
            'Hasil perbandingan selalu boolean: True atau False. Ingat: = untuk menyimpan, == untuk membandingkan.',
          ],
          code: {
            code: 'umur = 15\nprint(umur >= 17)\nprint(umur == 15)\nprint(umur != 15)',
            lines: [
              { line: 'umur >= 17', explain: '15 tidak lebih besar atau sama dengan 17 → False.' },
              { line: 'umur == 15', explain: '15 sama dengan 15 → True.' },
              { line: 'umur != 15', explain: '15 tidak sama dengan 15? Salah → False.' },
            ],
            output: 'False\nTrue\nFalse',
          },
        },
        {
          heading: 'and, or, not',
          body: [
            'and bernilai True hanya jika kedua kondisi benar. or bernilai True jika salah satu benar. not membalik nilai boolean.',
            'Gunakan kurung untuk memperjelas urutan logika.',
          ],
          code: {
            code: 'umur = 20\npunya_tiket = True\nprint(umur >= 17 and punya_tiket)\nprint(umur < 17 or punya_tiket)\nprint(not punya_tiket)',
            lines: [
              { line: 'umur >= 17 and punya_tiket', explain: 'Keduanya True → True.' },
              { line: 'umur < 17 or punya_tiket', explain: 'Salah satu True → True.' },
              { line: 'not punya_tiket', explain: 'Membalik True menjadi False.' },
            ],
            output: 'True\nTrue\nFalse',
          },
          tip: 'Kesalahan umum pemula: menulis if x = 5. Gunakan if x == 5 untuk membandingkan.',
        },
        {
          heading: 'Rangkaian perbandingan',
          body: [
            'Python membolehkan perbandingan berantai seperti 0 <= nilai <= 100, yang artinya nilai di antara 0 dan 100.',
          ],
          code: {
            code: 'nilai = 85\nprint(0 <= nilai <= 100)\nprint(80 < nilai < 90)',
            lines: [
              { line: '0 <= nilai <= 100', explain: 'Cek nilai berada di rentang 0 sampai 100.' },
              { line: '80 < nilai < 90', explain: 'Cek nilai lebih dari 80 dan kurang dari 90.' },
            ],
            output: 'True\nTrue',
          },
        },
      ],
      playground: {
        starter: 'umur = 20\npunya_tiket = True\nprint("Boleh masuk:", umur >= 17 and punya_tiket)\nprint("Remaja:", 13 <= umur <= 19)\n',
      },
      challenge: {
        prompt:
          'Diberikan umur = 20 dan punya_tiket = True, buat variabel boleh_masuk = umur >= 17 and punya_tiket dan variabel belum_dewasa = not (umur >= 17). Jangan cetak apa pun.',
        starter: 'umur = 20\npunya_tiket = True\nboleh_masuk = ?\nbelum_dewasa = ?\n',
        hint: 'Gunakan operator and dan not. Kurung membantu: not (umur >= 17).',
        solution: 'umur = 20\npunya_tiket = True\nboleh_masuk = umur >= 17 and punya_tiket\nbelum_dewasa = not (umur >= 17)',
        check: 'tests',
        tests:
          'assert boleh_masuk is True, "boleh_masuk harus True"\nassert belum_dewasa is False, "belum_dewasa harus False"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w3l2-q1',
          kind: 'mc',
          question: 'Operator mana yang digunakan untuk membandingkan dua nilai?',
          options: ['=', '==', '=>', '!='],
          answer: 1,
          explanation: '== membandingkan. = menyimpan nilai. != juga perbandingan, tetapi untuk "tidak sama dengan".',
          hint: 'Dua tanda sama dengan.',
        },
        {
          id: 'w3l2-q2',
          kind: 'output',
          question: 'Apa hasil dari True and False?',
          options: ['True', 'False', 'Error', 'None'],
          answer: 1,
          explanation: 'and hanya True jika kedua sisi True.',
          hint: 'and menuntut semua kondisi benar.',
        },
        {
          id: 'w3l2-q3',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'nilai = 75\nprint(nilai > 80 or nilai == 75)',
          options: ['True', 'False', '75', 'Error'],
          answer: 0,
          explanation: 'nilai > 80 salah, tetapi nilai == 75 benar. Dengan or, hasilnya True.',
          hint: 'or cukup salah satu kondisi benar.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [W3, DOC],
    },
    {
      id: 'w3l3',
      title: 'If, Elif, Else',
      summary: 'Membuat program yang mengambil keputusan.',
      minutes: 10,
      icon: 'branch',
      intro:
        'Sekarang programmu bisa berpikir! Dengan if, Python memilih langkah berdasarkan kondisi yang kamu tentukan.',
      sections: [
        {
          heading: 'if sederhana',
          body: [
            'Tulis if diikuti kondisi, lalu titik dua (:). Blok perintah di bawahnya harus diberi indentasi (4 spasi).',
            'Semua baris dengan indentasi yang sama adalah bagian dari blok if.',
          ],
          code: {
            code: 'nilai = 85\nif nilai >= 75:\n    print("Lulus")\nprint("Selesai")',
            lines: [
              { line: 'if nilai >= 75:', explain: 'Kondisi diperiksa. Titik dua wajib ada.' },
              { line: '    print("Lulus")', explain: 'Dijalankan hanya jika kondisi True. Perhatikan 4 spasi.' },
              { line: 'print("Selesai")', explain: 'Tidak berindentasi, jadi selalu dijalankan.' },
            ],
            output: 'Lulus\nSelesai',
          },
        },
        {
          heading: 'elif dan else',
          body: [
            'elif berarti "jika sebelumnya tidak terpenuhi, coba kondisi ini". else menangkap semua kemungkinan yang tersisa.',
            'Hanya satu cabang yang dijalankan: cabang pertama yang kondisinya True.',
          ],
          code: {
            code: 'nilai = 68\nif nilai >= 80:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelif nilai >= 60:\n    print("C")\nelse:\n    print("D")',
            lines: [
              { line: 'if nilai >= 80', explain: 'Salah karena 68 < 80.' },
              { line: 'elif nilai >= 70', explain: 'Salah karena 68 < 70.' },
              { line: 'elif nilai >= 60', explain: 'Benar, jadi mencetak C. Cabang lain dilewati.' },
              { line: 'else', explain: 'Tidak dijalankan karena sudah ada cabang yang cocok.' },
            ],
            output: 'C',
          },
          tip: 'Urutan elif penting. Jika kondisi lebar diletakkan lebih dulu, kondisi lain tidak akan pernah dicapai.',
        },
        {
          heading: 'Menggabungkan kondisi',
          body: [
            'Kondisi if bisa memakai and, or, dan not, serta perbandingan berantai.',
          ],
          code: {
            code: 'umur = 20\nif 17 <= umur < 60:\n    print("Dewasa")\nelse:\n    print("Bukan dewasa")',
            lines: [
              { line: '17 <= umur < 60', explain: 'Dua perbandingan sekaligus: 17 ≤ umur < 60.' },
            ],
            output: 'Dewasa',
          },
        },
      ],
      playground: {
        starter: 'nilai = 82\nif nilai >= 80:\n    print("Hebat!")\nelif nilai >= 70:\n    print("Bagus")\nelse:\n    print("Terus berlatih")\n',
      },
      challenge: {
        prompt:
          'Diberikan nilai = 85, cetak "Lulus" jika nilai minimal 75, selain itu cetak "Remedial".\nOutput yang diharapkan: Lulus',
        starter: 'nilai = 85\n# Tulis if/else di sini\n',
        hint: 'Gunakan if nilai >= 75: lalu print("Lulus"), dan else: print("Remedial"). Jangan lupa titik dua dan indentasi.',
        solution: 'nilai = 85\nif nilai >= 75:\n    print("Lulus")\nelse:\n    print("Remedial")',
        check: 'output',
        expected: 'Lulus',
      },
      quiz: [
        {
          id: 'w3l3-q1',
          kind: 'fill',
          question: 'Lengkapi kode agar valid:',
          code: 'angka = 10\n____ angka > 5:\n    print("Besar")',
          options: ['if', 'else', 'for', 'while'],
          answer: 0,
          explanation: 'Gunakan if untuk memeriksa kondisi.',
          hint: 'Kata kunci untuk percabangan pertama.',
        },
        {
          id: 'w3l3-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'skor = 70\nif skor > 70:\n    print("A")\nelif skor >= 70:\n    print("B")\nelse:\n    print("C")',
          options: ['A', 'B', 'C', 'A dan B'],
          answer: 1,
          explanation: 'skor > 70 False, lalu skor >= 70 True, sehingga B dicetak.',
          hint: 'Hanya satu cabang pertama yang True dijalankan.',
        },
        {
          id: 'w3l3-q3',
          kind: 'mc',
          question: 'Apa yang wajib ada setelah kondisi if pada Python?',
          options: ['Titik dua (:)', 'Titik koma (;)', 'Kurung kurawal {}', 'Tanda kurung siku []'],
          answer: 0,
          explanation: 'Blok if, elif, else, for, dan while diakhiri titik dua.',
          hint: 'Simbol ini juga dipakai pada def dan for.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [PR, DOC],
    },
    {
      id: 'w3l4',
      title: 'Logika Bertingkat',
      summary: 'If bersarang dan keputusan dunia nyata.',
      minutes: 9,
      icon: 'git-branch',
      intro:
        'Di gerbang istana, penjaga memeriksa umur dan tiket sekaligus. Kita akan membuat keputusan bertingkat seperti itu.',
      sections: [
        {
          heading: 'If di dalam if',
          body: [
            'Kamu bisa menaruh if di dalam blok if lain. Ini disebut nested if. Tambahkan indentasi lagi untuk setiap tingkat.',
          ],
          code: {
            code: 'umur = 20\npunya_tiket = True\nif umur >= 17:\n    if punya_tiket:\n        print("Boleh masuk")\n    else:\n        print("Beli tiket dulu")\nelse:\n    print("Belum cukup umur")',
            lines: [
              { line: 'if umur >= 17:', explain: 'Pemeriksaan pertama: cukup umur?' },
              { line: '    if punya_tiket:', explain: 'Jika cukup umur, periksa tiket. Indentasi bertambah.' },
              { line: '        print("Boleh masuk")', explain: 'Kedua kondisi terpenuhi.' },
              { line: '    else:', explain: 'Else milik if punya_tiket.' },
              { line: 'else:', explain: 'Else milik if umur. Dijalankan jika umur < 17.' },
            ],
            output: 'Boleh masuk',
          },
        },
        {
          heading: 'Lebih rapi dengan and',
          body: [
            'Sering kali nested if bisa disederhanakan dengan operator and. Pilih bentuk yang paling mudah dibaca.',
          ],
          code: {
            code: 'umur = 20\npunya_tiket = True\nif umur >= 17 and punya_tiket:\n    print("Boleh masuk")\nelse:\n    print("Tidak boleh masuk")',
            lines: [
              { line: 'umur >= 17 and punya_tiket', explain: 'Kedua syarat digabung dalam satu kondisi.' },
            ],
            output: 'Boleh masuk',
          },
          tip: 'Gunakan nested if saat kamu ingin memberi alasan berbeda untuk setiap kegagalan.',
        },
        {
          heading: 'Membaca beberapa input',
          body: [
            'Program bisa meminta lebih dari satu input. Setiap input() membaca satu baris, jadi urutannya penting.',
          ],
          code: {
            code: 'umur = int(input())\ntiket = input()\nprint(f"Umur {umur}, tiket: {tiket}")',
            lines: [
              { line: 'int(input())', explain: 'Membaca baris pertama sebagai angka.' },
              { line: 'input()', explain: 'Membaca baris kedua sebagai teks.' },
            ],
            output: 'Umur 20, tiket: y',
          },
        },
      ],
      playground: {
        starter: 'umur = 20\npunya_tiket = True\nif umur >= 17 and punya_tiket:\n    print("Boleh masuk")\nelse:\n    print("Tidak boleh masuk")\n',
      },
      challenge: {
        prompt:
          'Baca dua baris input: umur (angka) dan jawaban tiket (y untuk punya tiket).\nCetak "Boleh masuk" jika umur minimal 17 DAN tiket sama dengan "y". Selain itu cetak "Tidak boleh".\nGunakan input() tanpa prompt.',
        starter: 'umur = int(input())\ntiket = input()\n# Tulis logika di sini\n',
        hint: 'Gabungkan dua syarat dengan and: umur >= 17 and tiket == "y". Gunakan perbandingan == untuk teks.',
        solution:
          'umur = int(input())\ntiket = input()\nif umur >= 17 and tiket == "y":\n    print("Boleh masuk")\nelse:\n    print("Tidak boleh")',
        check: 'output',
        stdin: '20\ny',
        expected: 'Boleh masuk',
      },
      quiz: [
        {
          id: 'w3l4-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'umur = 16\ntiket = True\nif umur >= 17 and tiket:\n    print("Masuk")\nelse:\n    print("Tolak")',
          options: ['Masuk', 'Tolak', 'Error', 'Tidak ada output'],
          answer: 1,
          explanation: 'umur >= 17 False, sehingga seluruh kondisi and False dan else dijalankan.',
          hint: 'and butuh kedua kondisi True.',
        },
        {
          id: 'w3l4-q2',
          kind: 'mc',
          question: 'Mengapa indentasi penting pada if?',
          options: [
            'Menentukan baris mana yang termasuk blok if',
            'Agar kode berwarna',
            'Supaya program lebih cepat',
            'Hanya hiasan, tidak berpengaruh',
          ],
          answer: 0,
          explanation: 'Python memakai indentasi untuk menandai blok kode, bukan kurung kurawal.',
          hint: 'Python membaca struktur dari indentasi.',
        },
        {
          id: 'w3l4-q3',
          kind: 'fill',
          question: 'Lengkapi kondisi: boleh masuk jika umur ≥ 17 DAN punya tiket.',
          code: 'if umur >= 17 ____ punya_tiket:\n    print("Boleh masuk")',
          options: ['and', 'or', 'not', '=='],
          answer: 0,
          explanation: 'and memastikan kedua kondisi benar.',
          hint: 'Kedua syarat harus terpenuhi.',
        },
      ],
      rewards: { xp: 75, coins: 26 },
      sources: [DOC, PR],
    },
  ],
  boss: {
    id: 'logic-dragon',
    name: 'Logic Dragon',
    title: 'Naga Percabangan',
    description:
      'Naga ini menembakkan teka-teki True/False dan if/else. Kalahkan dengan logika yang tajam!',
    hp: 130,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w3l1-q1', 'w3l1-q2', 'w3l2-q1', 'w3l2-q2', 'w3l2-q3', 'w3l3-q2', 'w3l4-q1', 'w3l4-q3'],
    finalChallenge: {
      prompt:
        'Serangan terakhir! Diberikan nilai = 85. Cetak "A" jika nilai ≥ 80, "B" jika ≥ 70, selain itu "C".',
      starter: 'nilai = 85\n# if / elif / else\n',
      hint: 'Gunakan if nilai >= 80: print("A"), lalu elif nilai >= 70, lalu else.',
      solution:
        'nilai = 85\nif nilai >= 80:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelse:\n    print("C")',
      check: 'output',
      expected: 'A',
    },
    reward: { xp: 150, coins: 60 },
  },
}
