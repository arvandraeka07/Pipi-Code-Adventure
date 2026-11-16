import type { World } from '../../types'

const DOC = { label: 'Python Docs — The Python Tutorial', url: 'https://docs.python.org/3/tutorial/' }
const W3 = { label: 'W3Schools — Python Tutorial', url: 'https://www.w3schools.com/python/' }
const PR = { label: 'Programiz — Python Programming', url: 'https://www.programiz.com/python-programming' }

export const world1: World = {
  id: 'world-1',
  order: 1,
  name: 'Python Beginner Village',
  tagline: 'Desa tempat semua petualangan Python dimulai.',
  description:
    'Kenalan dengan Python, pahami apa itu coding, dan tulis program pertamamu bersama Pipi.',
  icon: 'sparkles',
  palette: { from: '#2FBF71', to: '#159A55', accent: '#FFC93C', soft: '#D8F7E4' },
  reward: { xp: 150, coins: 75, badge: 'python-adventurer' },
  levels: [
    {
      id: 'w1l1',
      title: 'Kenalan dengan Python',
      summary: 'Apa itu coding, kenapa Python, dan bagaimana kode dijalankan.',
      minutes: 6,
      icon: 'sparkles',
      intro:
        'Halo! Aku Pipi, ular Python yang akan menemanimu. Di desa ini kita mulai dari nol: mengenal Python dan cara ia bekerja. Santai saja, tidak perlu latar belakang IT!',
      sections: [
        {
          heading: 'Apa itu coding?',
          body: [
            'Coding adalah kegiatan menulis instruksi yang bisa dipahami komputer. Instruksi ini disusun dalam bahasa pemrograman, seperti resep masakan yang dijalankan langkah demi langkah.',
            'Bayangkan kamu memberi tahu teman cara membuat sandwich: ambil roti, oleskan selai, tutup rotinya. Komputer juga butuh instruksi yang urut dan jelas. Itulah yang kita tulis saat coding.',
          ],
          tip: 'Komputer tidak menebak maksud kita. Instruksi harus ditulis persis sesuai aturan bahasanya.',
        },
        {
          heading: 'Kenapa Python?',
          body: [
            'Python adalah bahasa pemrograman yang dirancang agar mudah dibaca. Sintaksnya mirip bahasa Inggris sehari-hari, sehingga cocok untuk pemula.',
            'Python dipakai untuk membuat web, menganalisis data, membuat game, hingga kecerdasan artifisial. File Python biasanya disimpan dengan akhiran .py.',
          ],
          code: {
            title: 'Contoh kode Python paling sederhana',
            code: 'print("Halo, aku Pipi!")',
            lines: [
              { line: 'print(...)', explain: 'print() adalah perintah untuk menampilkan sesuatu ke layar.' },
              { line: '"Halo, aku Pipi!"', explain: 'Teks di antara tanda kutip disebut string (teks).' },
            ],
            output: 'Halo, aku Pipi!',
          },
        },
        {
          heading: 'Bagaimana Python bekerja?',
          body: [
            'Python adalah bahasa interpreted. Kode dibaca dan dijalankan baris demi baris oleh program bernama interpreter Python.',
            'Di website ini, interpreter Python berjalan langsung di browser-mu menggunakan Pyodide (Python versi WebAssembly). Jadi kamu bisa mencoba kode tanpa memasang apa pun.',
          ],
          tip: 'Urutan baris itu penting. Python menjalankan kode dari atas ke bawah.',
        },
      ],
      playground: {
        starter: 'print("Halo, dunia!")\n# Tulis kode pertamamu di bawah ini\n',
      },
      challenge: {
        prompt: 'Tampilkan teks: Halo, Pipi!',
        starter: '# Tulis kode-mu di sini\n',
        hint: 'Gunakan print() lalu tulis teks di dalam tanda kutip. Contoh: print("...")',
        solution: 'print("Halo, Pipi!")',
        check: 'output',
        expected: 'Halo, Pipi!',
      },
      quiz: [
        {
          id: 'w1l1-q1',
          kind: 'mc',
          question: 'Apa itu coding?',
          options: [
            'Menulis instruksi yang bisa dijalankan komputer',
            'Menggambar karakter untuk game',
            'Membeli aplikasi di internet',
            'Menghapus file yang tidak dipakai',
          ],
          answer: 0,
          explanation: 'Coding adalah menulis instruksi berurutan yang dipahami komputer.',
          hint: 'Ingat resep sandwich yang dijalankan langkah demi langkah.',
        },
        {
          id: 'w1l1-q2',
          kind: 'mc',
          question: 'File Python biasanya memiliki akhiran apa?',
          options: ['.py', '.txt', '.python', '.html'],
          answer: 0,
          explanation: 'File Python disimpan dengan akhiran .py.',
          hint: 'Namanya sangat singkat, hanya dua huruf.',
        },
        {
          id: 'w1l1-q3',
          kind: 'mc',
          question: 'Python disebut bahasa "interpreted" karena...',
          options: [
            'Kode dijalankan baris demi baris oleh interpreter',
            'Kode harus diterjemahkan ke bahasa Jepang',
            'Kode hanya bisa dibaca manusia',
            'Kode berjalan tanpa ditulis',
          ],
          answer: 0,
          explanation: 'Interpreter Python membaca dan menjalankan kode baris demi baris.',
          hint: 'Pipi membaca petualangan ini baris demi baris, sama seperti Python.',
        },
      ],
      rewards: { xp: 60, coins: 20 },
      sources: [DOC, W3, PR],
    },
    {
      id: 'w1l2',
      title: 'Print Pertamamu',
      summary: 'Menampilkan teks dan angka dengan print().',
      minutes: 7,
      icon: 'terminal',
      intro:
        'Saatnya membuat programmu bersuara! Kita akan memakai print() untuk menampilkan pesan, angka, dan beberapa baris sekaligus.',
      sections: [
        {
          heading: 'Memanggil print()',
          body: [
            'print() adalah function bawaan Python untuk menampilkan nilai ke layar. Isi di dalam tanda kurung disebut argument.',
            'Teks harus diapit tanda kutip (boleh satu atau dua), sedangkan angka tidak perlu tanda kutip.',
          ],
          code: {
            title: 'Teks dan angka',
            code: 'print("Aku sedang belajar Python")\nprint(2026)',
            lines: [
              { line: 'print("Aku sedang belajar Python")', explain: 'Menampilkan string. Tanda kutip tidak ikut tampil.' },
              { line: 'print(2026)', explain: 'Menampilkan angka 2026 tanpa tanda kutip.' },
            ],
            output: 'Aku sedang belajar Python\n2026',
          },
        },
        {
          heading: 'Beberapa baris output',
          body: [
            'Setiap print() menghasilkan satu baris baru. Jika kamu menulis beberapa print(), hasilnya akan tampil berurutan ke bawah.',
          ],
          code: {
            title: 'Tiga print, tiga baris',
            code: 'print("Baris pertama")\nprint("Baris kedua")\nprint("Baris ketiga")',
            lines: [
              { line: 'print("Baris pertama")', explain: 'Mencetak baris pertama lalu pindah ke baris baru.' },
              { line: 'print("Baris kedua")', explain: 'Mencetak baris kedua.' },
              { line: 'print("Baris ketiga")', explain: 'Mencetak baris ketiga.' },
            ],
            output: 'Baris pertama\nBaris kedua\nBaris ketiga',
          },
        },
        {
          heading: 'print() dengan beberapa nilai',
          body: [
            'print() bisa menerima beberapa nilai dipisahkan koma. Secara default Python memberi spasi di antara nilai tersebut.',
          ],
          code: {
            code: 'nama = "Pipi"\nprint("Halo,", nama, "!")',
            lines: [
              { line: 'nama = "Pipi"', explain: 'Menyimpan teks "Pipi" ke variabel nama. Kita akan belajar variabel di dunia berikutnya.' },
              { line: 'print("Halo,", nama, "!")', explain: 'Menampilkan tiga nilai. Koma otomatis memberi spasi.' },
            ],
            output: 'Halo, Pipi !',
          },
          tip: 'Perhatikan hasil "Halo, Pipi !" — tanda koma menambahkan spasi. Nanti kita rapikan dengan f-string.',
        },
      ],
      playground: {
        starter: 'print("Halo dari playground!")\nprint("Aku siap belajar Python.")\n',
      },
      challenge: {
        prompt: 'Cetak dua baris berikut (persis, tanpa tanda kutip):\nAku belajar Python\nBersama Pipi',
        starter: '# Cetak dua baris\n',
        hint: 'Gunakan dua perintah print(). Baris pertama dan baris kedua dipisahkan enter.',
        solution: 'print("Aku belajar Python")\nprint("Bersama Pipi")',
        check: 'output',
        expected: 'Aku belajar Python\nBersama Pipi',
      },
      quiz: [
        {
          id: 'w1l2-q1',
          kind: 'output',
          question: 'Apa output dari kode ini?',
          code: 'print("Python")\nprint("Seru")',
          options: ['Python Seru', 'Python\nSeru', 'PythonSeru', 'Error'],
          answer: 1,
          explanation: 'Setiap print() mencetak satu baris, lalu pindah ke baris baru.',
          hint: 'Dua print() berarti dua baris terpisah.',
        },
        {
          id: 'w1l2-q2',
          kind: 'mc',
          question: 'Manakah penulisan yang benar untuk menampilkan teks?',
          options: ['print("Halo")', 'print(Halo)', 'echo "Halo"', 'print "Halo"'],
          answer: 0,
          explanation: 'Teks harus diapit tanda kutip dan print memakai tanda kurung.',
          hint: 'Python butuh tanda kurung dan tanda kutip untuk teks.',
        },
        {
          id: 'w1l2-q3',
          kind: 'output',
          question: 'Apa yang tampil dari kode ini?',
          code: 'print("Level", 1)',
          options: ['Level1', 'Level 1', '"Level" 1', 'Error'],
          answer: 1,
          explanation: 'Koma di dalam print() menambahkan satu spasi di antara nilai.',
          hint: 'Koma memberi pemisah berupa spasi.',
        },
      ],
      rewards: { xp: 65, coins: 20 },
      sources: [DOC, W3],
    },
    {
      id: 'w1l3',
      title: 'Komentar & Error Pertama',
      summary: 'Menulis catatan kode dan memahami pesan error.',
      minutes: 8,
      icon: 'message',
      intro:
        'Error bukan tanda kamu gagal! Error adalah petunjuk. Kita juga akan belajar komentar agar kode mudah dipahami.',
      sections: [
        {
          heading: 'Komentar: catatan untuk manusia',
          body: [
            'Komentar dimulai dengan tanda #. Python mengabaikan semua teks setelah # pada baris itu.',
            'Komentar berguna untuk menjelaskan maksud kode atau menonaktifkan sementara sebuah baris.',
          ],
          code: {
            code: '# Ini komentar, tidak dijalankan\nprint("Halo")  # komentar di akhir baris',
            lines: [
              { line: '# Ini komentar...', explain: 'Seluruh baris diabaikan Python.' },
              { line: 'print("Halo")  # komentar...', explain: 'Kode tetap jalan; bagian setelah # diabaikan.' },
            ],
            output: 'Halo',
          },
        },
        {
          heading: 'Membaca pesan error',
          body: [
            'Salah ketik adalah hal biasa. Python akan menampilkan pesan error beserta baris yang bermasalah.',
            'SyntaxError berarti aturan penulisan dilanggar, misalnya lupa tanda kurung. NameError berarti kamu memakai nama yang belum didefinisikan.',
          ],
          code: {
            title: 'Contoh SyntaxError (sengaja salah)',
            code: 'print("Halo"',
            lines: [
              { line: 'print("Halo"', explain: 'Tanda kurung tutup hilang, sehingga Python melaporkan SyntaxError.' },
            ],
            output: 'SyntaxError: \'(\' was never closed',
          },
          tip: 'Selalu periksa pasangan tanda kurung, kutip, dan titik dua saat menemui error.',
        },
        {
          heading: 'Python peka huruf besar-kecil',
          body: [
            'Print dan print adalah dua nama berbeda. Python membedakan huruf besar dan kecil (case-sensitive).',
          ],
          code: {
            code: 'print("benar")\n# Print("salah")  # NameError jika diaktifkan',
            lines: [
              { line: 'print("benar")', explain: 'Nama function harus huruf kecil semua.' },
              { line: '# Print(...)', explain: 'Contoh salah, sengaja dijadikan komentar.' },
            ],
            output: 'benar',
          },
        },
      ],
      playground: {
        starter: '# Tulis komentar pertamamu\n# Lalu cetak pesan\nprint("Aku siap bertualang!")\n',
      },
      challenge: {
        prompt:
          'Tulis satu komentar (diawali #), lalu cetak: Petualangan dimulai\nPastikan komentar tidak ikut tampil di output.',
        starter: '# Tulis komentarmu di sini\n',
        hint: 'Komentar diawali #. Setelah itu gunakan print("..."). Hanya teks print yang muncul.',
        solution: '# Awal petualangan Python\nprint("Petualangan dimulai")',
        check: 'output',
        expected: 'Petualangan dimulai',
      },
      quiz: [
        {
          id: 'w1l3-q1',
          kind: 'mc',
          question: 'Simbol apa yang memulai komentar di Python?',
          options: ['//', '#', '--', '<!--'],
          answer: 1,
          explanation: 'Komentar Python diawali tanda pagar #.',
          hint: 'Simbol ini ada di tombol angka 3 pada keyboard.',
        },
        {
          id: 'w1l3-q2',
          kind: 'output',
          question: 'Apa output dari kode berikut?',
          code: '# halo\nprint("Pipi")',
          options: ['# halo', 'halo Pipi', 'Pipi', 'Error'],
          answer: 2,
          explanation: 'Baris komentar diabaikan, jadi hanya "Pipi" yang tampil.',
          hint: 'Python tidak menjalankan komentar.',
        },
        {
          id: 'w1l3-q3',
          kind: 'mc',
          question: 'Error apa yang muncul jika kamu menulis Print("Halo")?',
          options: ['SyntaxError karena Print bukan print', 'NameError karena Print tidak dikenal (case-sensitive)', 'ValueError', 'Tidak ada error'],
          answer: 1,
          explanation: 'Python peka huruf besar-kecil, sehingga Print dianggap nama yang belum didefinisikan (NameError).',
          hint: 'Nama function bawaan ditulis huruf kecil.',
        },
      ],
      rewards: { xp: 70, coins: 25 },
      sources: [DOC, W3, PR],
    },
  ],
  boss: {
    id: 'syntax-slime',
    name: 'Syntax Slime',
    title: 'Raja Typo Rawa',
    description:
      'Slime berlendir ini mencuri tanda kurung dan titik dua. Kalahkan dengan mengenali sintaks Python yang benar!',
    hp: 100,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w1l1-q2', 'w1l1-q3', 'w1l2-q1', 'w1l2-q2', 'w1l3-q1', 'w1l3-q3'],
    finalChallenge: {
      prompt: 'Serangan terakhir! Cetak: Python Beginner LULUS',
      starter: '# Cetak pesan kemenangan\n',
      hint: 'Satu perintah print() dengan teks persis seperti permintaan.',
      solution: 'print("Python Beginner LULUS")',
      check: 'output',
      expected: 'Python Beginner LULUS',
    },
    reward: { xp: 120, coins: 50 },
  },
}
