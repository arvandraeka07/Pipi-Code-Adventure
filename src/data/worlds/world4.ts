import type { World } from '../../types'

const DOC = { label: 'Python Docs — for Statements & range()', url: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements' }
const W3 = { label: 'W3Schools — Python For Loops', url: 'https://www.w3schools.com/python/python_for_loops.asp' }
const PR = { label: 'Programiz — Python while Loop', url: 'https://www.programiz.com/python-programming/while-loop' }

export const world4: World = {
  id: 'world-4',
  order: 4,
  name: 'Looping Jungle',
  tagline: 'Hutan liar tempat kode berulang tanpa lelah.',
  description:
    'Pelajari for loop, while loop, range(), break, dan continue untuk mengulang pekerjaan dengan cerdas.',
  icon: 'repeat',
  palette: { from: '#3ECF8E', to: '#167A4B', accent: '#FFC93C', soft: '#DDF8EC' },
  reward: { xp: 170, coins: 85, badge: 'loop-master' },
  levels: [
    {
      id: 'w4l1',
      title: 'For Loop',
      summary: 'Mengulang perintah untuk setiap item.',
      minutes: 9,
      icon: 'repeat',
      intro:
        'Bayangkan harus mencetak angka 1 sampai 100. Menulis 100 print() itu melelahkan! For loop menyelesaikannya dalam beberapa baris.',
      sections: [
        {
          heading: 'Bentuk dasar for',
          body: [
            'for mengambil satu nilai dari urutan, menjalankan blok kode, lalu mengambil nilai berikutnya. Proses berulang sampai urutan habis.',
            'Variabel setelah for (misalnya i) adalah variabel loop yang nilainya berganti setiap putaran.',
          ],
          code: {
            code: 'for i in range(5):\n    print("Putaran", i)\nprint("Selesai")',
            lines: [
              { line: 'for i in range(5):', explain: 'range(5) menghasilkan 0, 1, 2, 3, 4. Blok dijalankan 5 kali.' },
              { line: '    print("Putaran", i)', explain: 'Setiap putaran mencetak nilai i saat itu.' },
              { line: 'print("Selesai")', explain: 'Tanpa indentasi, jadi dijalankan sekali setelah loop selesai.' },
            ],
            output: 'Putaran 0\nPutaran 1\nPutaran 2\nPutaran 3\nPutaran 4\nSelesai',
          },
        },
        {
          heading: 'Menghitung mulai dari 1',
          body: [
            'range(5) dimulai dari 0. Gunakan range(1, 6) untuk angka 1 sampai 5. Angka kedua adalah batas dan tidak termasuk.',
          ],
          code: {
            code: 'for i in range(1, 6):\n    print(i)',
            lines: [
              { line: 'range(1, 6)', explain: 'Menghasilkan 1, 2, 3, 4, 5 — angka 6 tidak ikut.' },
            ],
            output: '1\n2\n3\n4\n5',
          },
          tip: 'Nama variabel loop bebas: for angka in range(3) juga valid, dan lebih jelas untuk pemula.',
        },
        {
          heading: 'Loop atas string',
          body: [
            'For bisa mengulang setiap karakter dalam sebuah string.',
          ],
          code: {
            code: 'for huruf in "Pipi":\n    print(huruf)',
            lines: [
              { line: 'for huruf in "Pipi":', explain: 'String "Pipi" memiliki empat karakter, jadi loop berjalan 4 kali.' },
            ],
            output: 'P\ni\np\ni',
          },
        },
      ],
      playground: {
        starter: 'for i in range(1, 6):\n    print("Petualang ke-", i)\n',
      },
      challenge: {
        prompt: 'Gunakan for dan range() untuk mencetak angka 1 sampai 5, masing-masing di baris baru.',
        starter: '# Cetak 1 sampai 5 dengan loop\n',
        hint: 'range(1, 6) menghasilkan 1 sampai 5. Jangan lupa titik dua dan indentasi.',
        solution: 'for i in range(1, 6):\n    print(i)',
        check: 'output',
        expected: '1\n2\n3\n4\n5',
      },
      quiz: [
        {
          id: 'w4l1-q1',
          kind: 'output',
          question: 'Nilai apa saja yang dihasilkan range(3)?',
          options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3'],
          answer: 1,
          explanation: 'range(n) dimulai dari 0 dan berhenti sebelum n.',
          hint: 'Python mulai menghitung dari 0.',
        },
        {
          id: 'w4l1-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'for i in range(2):\n    print("Pipi")',
          options: ['Pipi', 'Pipi\nPipi', 'Pipi\nPipi\nPipi', 'Error'],
          answer: 1,
          explanation: 'range(2) berisi 0 dan 1, jadi blok dijalankan dua kali.',
          hint: 'Ada dua putaran.',
        },
        {
          id: 'w4l1-q3',
          kind: 'fill',
          question: 'Lengkapi agar angka 1 sampai 4 tercetak:',
          code: 'for i in ____(1, 5):\n    print(i)',
          options: ['range', 'len', 'list', 'loop'],
          answer: 0,
          explanation: 'range(1, 5) menghasilkan 1, 2, 3, 4.',
          hint: 'Function pembuat urutan angka.',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w4l2',
      title: 'While Loop',
      summary: 'Mengulang selama kondisi masih benar.',
      minutes: 9,
      icon: 'rotate-cw',
      intro:
        'While cocok saat jumlah pengulangan belum pasti. Selama kondisinya True, kode akan terus berjalan. Hati-hati, jangan sampai terjebak selamanya!',
      sections: [
        {
          heading: 'Bentuk while',
          body: [
            'while memeriksa kondisi sebelum setiap putaran. Jika kondisi False, loop berhenti.',
            'Kamu harus mengubah nilai yang diperiksa di dalam loop, kalau tidak loop tidak akan pernah berhenti (infinite loop).',
          ],
          code: {
            code: 'hitung = 1\nwhile hitung <= 5:\n    print(hitung)\n    hitung += 1\nprint("Selesai")',
            lines: [
              { line: 'hitung = 1', explain: 'Nilai awal sebelum loop.' },
              { line: 'while hitung <= 5:', explain: 'Periksa kondisi setiap putaran.' },
              { line: '    print(hitung)', explain: 'Jalankan aksi.' },
              { line: '    hitung += 1', explain: 'Penting! Naikkan nilai agar kondisi akhirnya False.' },
            ],
            output: '1\n2\n3\n4\n5\nSelesai',
          },
        },
        {
          heading: 'Menjumlahkan dengan while',
          body: [
            'Pola akumulator: siapkan variabel total = 0, lalu tambahkan nilai setiap putaran.',
          ],
          code: {
            code: 'total = 0\nangka = 1\nwhile angka <= 4:\n    total += angka\n    angka += 1\nprint(total)',
            lines: [
              { line: 'total = 0', explain: 'Wadah penjumlahan, dimulai dari nol.' },
              { line: 'total += angka', explain: 'Sama dengan total = total + angka.' },
              { line: 'angka += 1', explain: 'Maju ke angka berikutnya agar loop berhenti.' },
            ],
            output: '10',
          },
          tip: 'total += 1 adalah singkatan dari total = total + 1.',
        },
        {
          heading: 'Kapan memakai while?',
          body: [
            'Gunakan for jika jumlah pengulangan sudah diketahui. Gunakan while jika berhentinya bergantung pada kondisi, misalnya menunggu jawaban benar atau input pengguna.',
          ],
          code: {
            code: 'energi = 3\nwhile energi > 0:\n    print(f"Energi: {energi}")\n    energi -= 1\nprint("Istirahat dulu, Pipi!")',
            lines: [
              { line: 'while energi > 0:', explain: 'Loop selama energi masih positif.' },
              { line: 'energi -= 1', explain: 'Mengurangi energi satu per satu.' },
            ],
            output: 'Energi: 3\nEnergi: 2\nEnergi: 1\nIstirahat dulu, Pipi!',
          },
        },
      ],
      playground: {
        starter: 'energi = 3\nwhile energi > 0:\n    print("Petualangan! Energi:", energi)\n    energi -= 1\nprint("Selesai")\n',
      },
      challenge: {
        prompt: 'Gunakan while untuk menjumlahkan angka 1 sampai 10, lalu cetak totalnya (55).',
        starter: 'total = 0\nangka = 1\n# Lengkapi while\n',
        hint: 'Di dalam while: total += angka, lalu angka += 1. Loop selama angka <= 10.',
        solution: 'total = 0\nangka = 1\nwhile angka <= 10:\n    total += angka\n    angka += 1\nprint(total)',
        check: 'output',
        expected: '55',
      },
      quiz: [
        {
          id: 'w4l2-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'i = 1\nwhile i <= 3:\n    print(i)\n    i += 1',
          options: ['1 2 3', '1\n2\n3', '0\n1\n2', 'Loop selamanya'],
          answer: 1,
          explanation: 'Setiap angka dicetak di baris baru sampai i menjadi 4.',
          hint: 'Setiap print menghasilkan baris baru.',
        },
        {
          id: 'w4l2-q2',
          kind: 'mc',
          question: 'Apa yang terjadi jika nilai kondisi while tidak pernah berubah menjadi False?',
          options: ['Program berhenti otomatis', 'Infinite loop', 'Python memperbaiki sendiri', 'Loop dilewati'],
          answer: 1,
          explanation: 'Loop akan berjalan terus sampai dihentikan. Pastikan ada perubahan nilai di dalam loop.',
          hint: 'Ingat istilah "infinite loop".',
        },
        {
          id: 'w4l2-q3',
          kind: 'fill',
          question: 'Lengkapi agar loop berhenti setelah 5 putaran:',
          code: 'i = 1\nwhile i <= 5:\n    print(i)\n    i ____ 1',
          options: ['+=', '-=', '==', '*='],
          answer: 0,
          explanation: 'i += 1 menambah satu setiap putaran sehingga akhirnya kondisi False.',
          hint: 'Tambahkan satu pada setiap putaran.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [PR, W3],
    },
    {
      id: 'w4l3',
      title: 'Range Lebih Dalam',
      summary: 'Mengatur awal, akhir, dan langkah perulangan.',
      minutes: 8,
      icon: 'list',
      intro:
        'Range punya tiga mode: satu angka, dua angka, dan tiga angka. Dengan langkah (step), kita bisa melompat dan bahkan berjalan mundur.',
      sections: [
        {
          heading: 'Start, stop, step',
          body: [
            'range(stop) mulai dari 0. range(start, stop) mulai dari start. range(start, stop, step) melompat sebesar step.',
            'Nilai stop tidak pernah disertakan.',
          ],
          code: {
            code: 'for i in range(2, 11, 2):\n    print(i)',
            lines: [
              { line: 'range(2, 11, 2)', explain: 'Mulai 2, berhenti sebelum 11, melompat 2: 2, 4, 6, 8, 10.' },
            ],
            output: '2\n4\n6\n8\n10',
          },
        },
        {
          heading: 'Berjalan mundur',
          body: [
            'Step negatif membuat range menurun. Pastikan start lebih besar dari stop.',
          ],
          code: {
            code: 'for i in range(5, 0, -1):\n    print(i)\nprint("Meluncur!")',
            lines: [
              { line: 'range(5, 0, -1)', explain: 'Menghasilkan 5, 4, 3, 2, 1.' },
            ],
            output: '5\n4\n3\n2\n1\nMeluncur!',
          },
          tip: 'Menghitung jumlah item: len(range(2, 11, 2)) menghasilkan 5.',
        },
        {
          heading: 'Range pada for dengan indeks',
          body: [
            'Range sering dipakai saat kita perlu indeks. Nanti di Dunia Data kita akan memakai fungsi enumerate yang lebih praktis.',
          ],
          code: {
            code: 'buah = ["apel", "mangga", "pisang"]\nfor i in range(len(buah)):\n    print(i, buah[i])',
            lines: [
              { line: 'range(len(buah))', explain: 'len(buah) bernilai 3, jadi range(3) → 0, 1, 2.' },
              { line: 'buah[i]', explain: 'Mengambil item berdasarkan indeks.' },
            ],
            output: '0 apel\n1 mangga\n2 pisang',
          },
        },
      ],
      playground: {
        starter: 'for i in range(10, 0, -2):\n    print(i)\n',
      },
      challenge: {
        prompt: 'Gunakan range() untuk mencetak bilangan genap 2, 4, 6, dan 8 — masing-masing di baris baru.',
        starter: '# Petunjuk: range(start, stop, step)\n',
        hint: 'Mulai dari 2, berhenti sebelum 10, langkah 2: range(2, 10, 2).',
        solution: 'for i in range(2, 10, 2):\n    print(i)',
        check: 'output',
        expected: '2\n4\n6\n8',
      },
      quiz: [
        {
          id: 'w4l3-q1',
          kind: 'output',
          question: 'Angka apa saja dari range(1, 5)?',
          options: ['1, 2, 3, 4, 5', '1, 2, 3, 4', '0, 1, 2, 3, 4', '2, 3, 4, 5'],
          answer: 1,
          explanation: 'Mulai dari 1 dan berhenti sebelum 5.',
          hint: 'Batas akhir tidak termasuk.',
        },
        {
          id: 'w4l3-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'for i in range(5, 0, -1):\n    print(i)',
          options: ['1 2 3 4 5', '5 4 3 2 1', '0 1 2 3 4 5', 'Tidak ada'],
          answer: 1,
          explanation: 'Step -1 membuat hitungan mundur dari 5 sampai 1.',
          hint: 'Langkah negatif berarti mundur.',
        },
        {
          id: 'w4l3-q3',
          kind: 'fill',
          question: 'Lengkapi agar keluar angka 3, 6, 9:',
          code: 'for i in range(3, 10, ____):\n    print(i)',
          options: ['3', '1', '2', '10'],
          answer: 0,
          explanation: 'Step 3 menghasilkan 3, 6, 9.',
          hint: 'Selisih antarangka adalah tiga.',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w4l4',
      title: 'Break & Continue',
      summary: 'Menghentikan atau melewati putaran tertentu.',
      minutes: 9,
      icon: 'stop',
      intro:
        'Tidak semua putaran harus diselesaikan. break menghentikan loop, continue melewati satu putaran. Ini senjata rahasia petualang!',
      sections: [
        {
          heading: 'break: berhenti sekarang',
          body: [
            'Saat break dijalankan, loop langsung berhenti dan kode setelah loop dilanjutkan.',
          ],
          code: {
            code: 'for i in range(1, 10):\n    if i == 4:\n        break\n    print(i)\nprint("Loop berhenti")',
            lines: [
              { line: 'if i == 4: break', explain: 'Saat i bernilai 4, loop dihentikan sebelum mencetak 4.' },
              { line: 'print(i)', explain: 'Mencetak 1, 2, 3.' },
            ],
            output: '1\n2\n3\nLoop berhenti',
          },
        },
        {
          heading: 'continue: lewati putaran ini',
          body: [
            'Continue melompati sisa kode di putaran saat ini, lalu lanjut ke nilai berikutnya. Loop tidak berhenti.',
          ],
          code: {
            code: 'for i in range(1, 6):\n    if i == 3:\n        continue\n    print(i)',
            lines: [
              { line: 'if i == 3: continue', explain: 'Saat i = 3, print dilewati. Putaran berikutnya tetap jalan.' },
            ],
            output: '1\n2\n4\n5',
          },
        },
        {
          heading: 'Menggabungkan keduanya',
          body: [
            'Kamu bisa memakai continue untuk melewati nilai yang tidak diinginkan dan break untuk berhenti lebih awal.',
          ],
          code: {
            code: 'for i in range(1, 11):\n    if i % 2 == 0:\n        continue\n    if i > 7:\n        break\n    print(i)',
            lines: [
              { line: 'i % 2 == 0 → continue', explain: 'Bilangan genap dilewati.' },
              { line: 'i > 7 → break', explain: 'Saat i = 9, loop berhenti.' },
              { line: 'print(i)', explain: 'Yang tercetak hanya bilangan ganjil ≤ 7: 1, 3, 5, 7.' },
            ],
            output: '1\n3\n5\n7',
          },
          tip: 'Hati-hati: break hanya menghentikan loop terdekat. Pada nested loop, loop luar tetap berjalan.',
        },
      ],
      playground: {
        starter: 'for i in range(1, 11):\n    if i == 5:\n        continue\n    if i == 9:\n        break\n    print(i)\n',
      },
      challenge: {
        prompt:
          'Cetak angka 1 sampai 10, tetapi lewati angka 5 dan berhenti sebelum mencetak 8.\nOutput yang diharapkan: 1 2 3 4 6 7 (masing-masing di baris baru).',
        starter: 'for i in range(1, 11):\n    # gunakan continue dan break\n',
        hint: 'Gunakan if i == 5: continue dan if i == 8: break. Letakkan kedua if sebelum print.',
        solution:
          'for i in range(1, 11):\n    if i == 5:\n        continue\n    if i == 8:\n        break\n    print(i)',
        check: 'output',
        expected: '1\n2\n3\n4\n6\n7',
      },
      quiz: [
        {
          id: 'w4l4-q1',
          kind: 'mc',
          question: 'Apa fungsi break?',
          options: ['Menghentikan loop saat itu juga', 'Melewati satu putaran', 'Mengulang loop dari awal', 'Menghapus variabel'],
          answer: 0,
          explanation: 'break keluar dari loop terdekat seketika.',
          hint: 'Artinya "berhenti".',
        },
        {
          id: 'w4l4-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'for i in range(1, 5):\n    if i == 2:\n        continue\n    print(i)',
          options: ['1 2 3 4', '1 3 4', '1 2', 'Tidak ada'],
          answer: 1,
          explanation: 'Angka 2 dilewati, sisanya dicetak.',
          hint: 'continue melewati putaran i = 2.',
        },
        {
          id: 'w4l4-q3',
          kind: 'mc',
          question: 'Perbedaan break dan continue yang tepat adalah...',
          options: [
            'break menghentikan seluruh loop, continue hanya melewati satu putaran',
            'break melewati satu putaran, continue menghentikan loop',
            'Keduanya sama saja',
            'break hanya untuk while, continue hanya untuk for',
          ],
          answer: 0,
          explanation: 'break keluar dari loop; continue lanjut ke putaran berikutnya.',
          hint: 'Satu berhenti total, satu hanya lompat.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [DOC, W3],
    },
  ],
  boss: {
    id: 'loop-monster',
    name: 'Loop Monster',
    title: 'Pemutar Waktu',
    description:
      'Monster ini memutar waktu terus-menerus. Hentikan dengan break, atur dengan range, dan kalahkan lewat logika loop!',
    hp: 130,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w4l1-q1', 'w4l1-q2', 'w4l2-q1', 'w4l2-q2', 'w4l3-q1', 'w4l3-q2', 'w4l4-q1', 'w4l4-q2'],
    finalChallenge: {
      prompt:
        'Serangan terakhir! Gunakan loop untuk menjumlahkan bilangan genap dari 2 sampai 10, lalu cetak totalnya (30).',
      starter: 'total = 0\n# loop angka genap 2..10\n',
      hint: 'Gunakan for i in range(2, 11, 2): lalu total += i. Setelah loop, print(total).',
      solution: 'total = 0\nfor i in range(2, 11, 2):\n    total += i\nprint(total)',
      check: 'output',
      expected: '30',
    },
    reward: { xp: 150, coins: 60 },
  },
}
