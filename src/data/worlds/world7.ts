import type { World } from '../../types'

const DOC = { label: 'Python Docs — Errors and Exceptions', url: 'https://docs.python.org/3/tutorial/errors.html' }
const W3 = { label: 'W3Schools — Python String Methods', url: 'https://www.w3schools.com/python/python_strings.asp' }
const RP = { label: 'Real Python — Reading and Writing Files', url: 'https://realpython.com/read-write-files-python/' }
const PR = { label: 'Programiz — Python List Methods', url: 'https://www.programiz.com/python-programming/methods/list' }
const IO = { label: 'Python Docs — Input and Output', url: 'https://docs.python.org/3/tutorial/inputoutput.html' }

export const world7: World = {
  id: 'world-7',
  order: 7,
  name: 'Final Python Kingdom',
  tagline: 'Kerajaan terakhir tempat semua ilmu bersatu.',
  description:
    'Gabungkan nested loop, manipulasi string, exception handling, file handling, dan bangun mini project pertamamu.',
  icon: 'crown',
  palette: { from: '#F7C948', to: '#D98324', accent: '#8266E6', soft: '#FFF6D8' },
  reward: { xp: 220, coins: 120 },
  levels: [
    {
      id: 'w7l1',
      title: 'Nested Loop',
      summary: 'Loop di dalam loop untuk pola dan tabel.',
      minutes: 10,
      icon: 'grid',
      intro:
        'Selamat datang di kerajaan terakhir! Kita mulai dengan loop di dalam loop. Kekuatan ini bisa membuat pola, tabel, dan banyak lagi.',
      sections: [
        {
          heading: 'Loop di dalam loop',
          body: [
            'Setiap putaran loop luar menjalankan seluruh loop dalam. Jika loop luar 3 kali dan loop dalam 2 kali, total blok dalam berjalan 6 kali.',
            'Gunakan nama variabel yang berbeda untuk loop luar dan dalam agar tidak tertukar.',
          ],
          code: {
            code: 'for baris in range(1, 4):\n    for kolom in range(1, 4):\n        print(baris, kolom)\n    print("---")',
            lines: [
              { line: 'for baris in range(1, 4):', explain: 'Loop luar berjalan untuk baris 1, 2, 3.' },
              { line: '    for kolom in range(1, 4):', explain: 'Untuk setiap baris, loop dalam berjalan 3 kali.' },
              { line: '        print(baris, kolom)', explain: 'Mencetak pasangan baris dan kolom.' },
              { line: '    print("---")', explain: 'Setelah loop dalam selesai, cetak pemisah. Indentasi sejajar for dalam.' },
            ],
            output: '1 1\n1 2\n1 3\n---\n2 1\n2 2\n2 3\n---\n3 1\n3 2\n3 3\n---',
          },
        },
        {
          heading: 'Pola bintang',
          body: [
            'Dengan end="" pada print(), output tidak pindah baris. Kita bisa membangun satu baris bintang, lalu pindah baris setelah loop dalam.',
          ],
          code: {
            code: 'for baris in range(1, 4):\n    for bintang in range(baris):\n        print("*", end="")\n    print()',
            lines: [
              { line: 'range(baris)', explain: 'Baris 1 → 1 bintang, baris 2 → 2 bintang, dst.' },
              { line: 'print("*", end="")', explain: 'Mencetak bintang tanpa pindah baris.' },
              { line: 'print()', explain: 'Pindah ke baris baru setelah selesai satu baris.' },
            ],
            output: '*\n**\n***',
          },
          tip: 'Nested loop mudah membingungkan. Cetak variabel loop untuk melihat urutannya.',
        },
        {
          heading: 'Tabel perkalian mini',
          body: [
            'Nested loop juga cocok membuat tabel. Baris untuk angka pertama, kolom untuk angka kedua.',
          ],
          code: {
            code: 'for a in range(1, 4):\n    for b in range(1, 4):\n        print(a * b, end=" ")\n    print()',
            lines: [
              { line: 'print(a * b, end=" ")', explain: 'Perkalian dicetak dalam satu baris dengan spasi.' },
            ],
            output: '1 2 3 \n2 4 6 \n3 6 9 ',
          },
        },
      ],
      playground: {
        starter: 'for baris in range(1, 5):\n    for bintang in range(baris):\n        print("*", end="")\n    print()\n',
      },
      challenge: {
        prompt: 'Gunakan nested loop untuk mencetak segitiga bintang 4 baris:\n*\n**\n***\n****',
        starter: '# Loop luar untuk baris, loop dalam untuk bintang\n',
        hint: 'Loop baris dari 1 sampai 4. Di dalamnya, loop range(baris) dan print("*", end=""). Akhiri dengan print().',
        solution:
          'for baris in range(1, 5):\n    for bintang in range(baris):\n        print("*", end="")\n    print()',
        check: 'output',
        expected: '*\n**\n***\n****',
      },
      quiz: [
        {
          id: 'w7l1-q1',
          kind: 'output',
          question: 'Berapa kali "x" tercetak?',
          code: 'for i in range(2):\n    for j in range(3):\n        print("x")',
          options: ['2', '3', '5', '6'],
          answer: 3,
          explanation: 'Loop luar 2 kali, loop dalam 3 kali setiap putaran → 2 × 3 = 6.',
          hint: 'Kalikan jumlah putaran luar dan dalam.',
        },
        {
          id: 'w7l1-q2',
          kind: 'mc',
          question: 'Apa fungsi end="" pada print()?',
          options: [
            'Mencegah pindah baris setelah print',
            'Menghapus output',
            'Mengakhiri program',
            'Menyisipkan baris baru',
          ],
          answer: 0,
          explanation: 'Secara default print diakhiri newline. end="" menggantinya dengan string kosong.',
          hint: 'Tanpa end, setiap print pindah baris.',
        },
        {
          id: 'w7l1-q3',
          kind: 'output',
          question: 'Apa output potongan kode ini?',
          code: 'for i in range(1, 3):\n    print("*" * i)',
          options: ['*\n**', '**', '* *', '***'],
          answer: 0,
          explanation: 'i bernilai 1 lalu 2, sehingga tercetak satu bintang lalu dua bintang.',
          hint: 'String dikali angka akan diulang.',
        },
      ],
      rewards: { xp: 75, coins: 26 },
      sources: [IO, DOC],
    },
    {
      id: 'w7l2',
      title: 'String Manipulation',
      summary: 'Mengolah teks dengan method bawaan Python.',
      minutes: 11,
      icon: 'text',
      intro:
        'Teks adalah data yang paling sering kita temui. Python punya banyak method untuk membersihkan, memotong, dan mengubah string.',
      sections: [
        {
          heading: 'Mengubah huruf dan membersihkan spasi',
          body: [
            'upper() membuat huruf kapital, lower() huruf kecil, title() kapital di awal kata. strip() menghapus spasi atau karakter di ujung.',
            'Method string mengembalikan string baru; string asli tidak berubah karena string immutable.',
          ],
          code: {
            code: 'teks = "  belajar python  "\nbersih = teks.strip()\nprint(bersih.upper())\nprint(bersih.title())\nprint(bersih.replace("python", "PIPI"))',
            lines: [
              { line: 'teks.strip()', explain: 'Menghapus spasi di awal dan akhir.' },
              { line: '.upper()', explain: 'Semua huruf menjadi kapital.' },
              { line: '.title()', explain: 'Kapital di awal setiap kata.' },
              { line: '.replace("python", "PIPI")', explain: 'Mengganti semua kemunculan "python".' },
            ],
            output: 'BELAJAR PYTHON\nBelajar Python\nBelajar PIPI',
          },
        },
        {
          heading: 'Memotong dan menggabung',
          body: [
            'split() memecah string menjadi list. join() menggabungkan list string dengan pemisah tertentu.',
            'Slicing string bekerja seperti list: teks[start:stop].',
          ],
          code: {
            code: 'kalimat = "Python itu seru"\nkata = kalimat.split()\nprint(kata)\nprint(len(kata))\nprint("-".join(kata))\nprint(kalimat[0:6])',
            lines: [
              { line: 'kalimat.split()', explain: 'Memecah berdasarkan spasi menjadi list kata.' },
              { line: '" - ".join(kata)', explain: 'Menggabungkan kata dengan tanda minus.' },
              { line: 'kalimat[0:6]', explain: 'Mengambil karakter indeks 0 sampai sebelum 6: Python.' },
            ],
            output: "['Python', 'itu', 'seru']\n3\nPython-itu-seru\nPython",
          },
          tip: 'Gunakan in untuk mengecek substring: "py" in "python" bernilai True.',
        },
        {
          heading: 'Mengubah angka dan teks',
          body: [
            'String method sering dipakai saat membersihkan input pengguna, misalnya lower().strip() agar jawaban "  YA " tetap dikenali.',
          ],
          code: {
            code: 'jawaban = "  Ya  "\nif jawaban.strip().lower() == "ya":\n    print("Lanjut!")',
            lines: [
              { line: 'jawaban.strip().lower()', explain: 'Membersihkan spasi lalu mengecilkan huruf, sehingga menjadi "ya".' },
            ],
            output: 'Lanjut!',
          },
        },
      ],
      playground: {
        starter: 'teks = "  belajar python  "\nbersih = teks.strip()\nprint(bersih.title())\nprint(bersih.split())\n',
      },
      challenge: {
        prompt:
          'Diberikan teks = "  belajar python  " buat: bersih = teks tanpa spasi ujung, judul = versi title-case dari bersih, kata = hasil split bersih, gabung = kata digabung dengan "-", potong = "Python" dari "Belajar Python" (pakai slicing). Jangan cetak.',
        starter: 'teks = "  belajar python  "\nbersih = ?\njudul = ?\nkata = ?\ngabung = ?\npotong = "Belajar Python"[0:?]\n',
        hint: 'strip(), title(), split(), "-".join(kata). "Belajar Python" indeks 0 sampai 6 menghasilkan Python (indeks 6 adalah spasi).',
        solution:
          'teks = "  belajar python  "\nbersih = teks.strip()\njudul = bersih.title()\nkata = bersih.split()\ngabung = "-".join(kata)\npotong = "Belajar Python"[0:6]',
        check: 'tests',
        tests:
          'assert bersih == "belajar python", "bersih salah"\nassert judul == "Belajar Python", "judul salah"\nassert kata == ["belajar", "python"], "kata salah"\nassert gabung == "belajar-python", "gabung salah"\nassert potong == "Python", "potong harus Python"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w7l2-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'print("Pipi".upper())',
          options: ['pipi', 'Pipi', 'PIPI', 'Error'],
          answer: 2,
          explanation: 'upper() mengubah semua huruf menjadi kapital.',
          hint: 'upper berarti huruf besar.',
        },
        {
          id: 'w7l2-q2',
          kind: 'output',
          question: 'Apa hasil "a,b,c".split(",")?',
          options: ['["a,b,c"]', '["a", "b", "c"]', '"abc"', '("a","b","c")'],
          answer: 1,
          explanation: 'split(",") memecah string pada setiap koma menjadi list.',
          hint: 'Pemisahnya koma.',
        },
        {
          id: 'w7l2-q3',
          kind: 'mc',
          question: 'Apa yang dilakukan strip()?',
          options: [
            'Menghapus spasi/karakter tertentu di awal dan akhir string',
            'Menghapus semua spasi di tengah',
            'Mengubah string menjadi angka',
            'Membalik string',
          ],
          answer: 0,
          explanation: 'strip() membersihkan ujung string, bukan bagian tengah.',
          hint: 'Hanya bagian tepi.',
        },
      ],
      rewards: { xp: 80, coins: 28 },
      sources: [W3, IO],
    },
    {
      id: 'w7l3',
      title: 'Exception Handling',
      summary: 'Menangani error agar program tidak berhenti.',
      minutes: 11,
      icon: 'alert',
      intro:
        'Error tidak selalu bisa dicegah. Dengan try/except, program bisa menangani kesalahan dengan anggun, seperti Pipi yang tetap tersenyum saat tersandung.',
      sections: [
        {
          heading: 'try dan except',
          body: [
            'Kode yang mungkin gagal diletakkan di blok try. Jika terjadi error yang sesuai, blok except dijalankan, dan program tidak berhenti.',
            'Tangkap error spesifik (ZeroDivisionError, ValueError) agar tidak menyembunyikan bug lain.',
          ],
          code: {
            code: 'try:\n    hasil = 10 / 0\nexcept ZeroDivisionError:\n    print("Tidak bisa membagi dengan nol")\nprint("Program tetap berjalan")',
            lines: [
              { line: 'try:', explain: 'Bagian yang berpotensi error.' },
              { line: 'except ZeroDivisionError:', explain: 'Hanya menangani pembagian dengan nol.' },
              { line: 'print("Program tetap berjalan")', explain: 'Dijalankan setelah error ditangani.' },
            ],
            output: 'Tidak bisa membagi dengan nol\nProgram tetap berjalan',
          },
        },
        {
          heading: 'ValueError dari input',
          body: [
            'int("abc") menimbulkan ValueError. Ini sering terjadi saat pengguna memasukkan teks padahal diminta angka.',
          ],
          code: {
            code: 'try:\n    umur = int("dua belas")\nexcept ValueError:\n    print("Masukkan angka yang valid, ya!")\nelse:\n    print("Umur:", umur)',
            lines: [
              { line: 'except ValueError:', explain: 'Menangani konversi yang gagal.' },
              { line: 'else:', explain: 'Dijalankan hanya jika tidak ada error.' },
            ],
            output: 'Masukkan angka yang valid, ya!',
          },
        },
        {
          heading: 'else dan finally',
          body: [
            'else berjalan jika try sukses. finally selalu berjalan, baik ada error maupun tidak — cocok untuk membersihkan sumber daya.',
          ],
          code: {
            code: 'def bagi(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Tidak bisa dibagi nol"\n    finally:\n        print("Percobaan selesai")\n\nprint(bagi(10, 2))\nprint(bagi(5, 0))',
            lines: [
              { line: 'try: return a / b', explain: 'Mencoba pembagian.' },
              { line: 'except ZeroDivisionError:', explain: 'Mengembalikan pesan ramah jika b = 0.' },
              { line: 'finally:', explain: 'Selalu dijalankan sebelum function benar-benar selesai.' },
            ],
            output: 'Percobaan selesai\n5.0\nPercobaan selesai\nTidak bisa dibagi nol',
          },
          tip: 'Jangan gunakan except: tanpa tipe error kecuali benar-benar perlu. Error tersembunyi sulit dilacak.',
        },
      ],
      playground: {
        starter: 'try:\n    angka = int("halo")\nexcept ValueError:\n    print("Itu bukan angka!")\n',
      },
      challenge: {
        prompt:
          'Buat function bagi(a, b) yang mengembalikan hasil a / b. Jika b bernilai 0, tangkap ZeroDivisionError dan kembalikan teks "Tidak bisa dibagi nol". Diuji otomatis.',
        starter: 'def bagi(a, b):\n    # gunakan try/except\n    pass\n',
        hint: 'Letakkan return a / b di dalam try, lalu except ZeroDivisionError: return "Tidak bisa dibagi nol".',
        solution:
          'def bagi(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Tidak bisa dibagi nol"',
        check: 'tests',
        tests:
          'assert bagi(10, 2) == 5, "bagi(10,2) harus 5"\nassert bagi(5, 0) == "Tidak bisa dibagi nol", "pembagian nol harus ditangani"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w7l3-q1',
          kind: 'mc',
          question: 'Apa fungsi try/except?',
          options: [
            'Menangani error agar program tidak berhenti',
            'Mempercepat program',
            'Membuat variabel baru',
            'Mengulang kode otomatis',
          ],
          answer: 0,
          explanation: 'try/except menangkap error yang diperkirakan dan menjalankan penanganannya.',
          hint: 'Agar program tetap berjalan saat error.',
        },
        {
          id: 'w7l3-q2',
          kind: 'mc',
          question: 'Error apa yang muncul dari 10 / 0?',
          options: ['ValueError', 'ZeroDivisionError', 'TypeError', 'NameError'],
          answer: 1,
          explanation: 'Membagi dengan nol memunculkan ZeroDivisionError.',
          hint: 'Namanya sangat jelas: pembagian nol.',
        },
        {
          id: 'w7l3-q3',
          kind: 'mc',
          question: 'Kapan blok finally dijalankan?',
          options: ['Selalu, baik ada error maupun tidak', 'Hanya saat error', 'Hanya saat tidak ada error', 'Tidak pernah'],
          answer: 0,
          explanation: 'finally selalu dijalankan, biasanya untuk pembersihan.',
          hint: 'Kata "finally" berarti akhirnya, apa pun yang terjadi.',
        },
      ],
      rewards: { xp: 85, coins: 30 },
      sources: [DOC, W3],
    },
    {
      id: 'w7l4',
      title: 'File Handling',
      summary: 'Menyimpan dan membaca data dari file.',
      minutes: 11,
      icon: 'file',
      intro:
        'Agar data tidak hilang saat program ditutup, kita bisa menyimpannya ke file. Dengan open() dan with, petualanganmu bisa berlanjut esok hari.',
      sections: [
        {
          heading: 'Menulis file',
          body: [
            'open(nama_file, mode) membuka file. Mode "w" menulis (menimpa isi lama), "a" menambah di akhir, "r" membaca.',
            'Gunakan with agar file otomatis ditutup setelah blok selesai, walaupun terjadi error.',
          ],
          code: {
            code: 'with open("catatan.txt", "w") as file:\n    file.write("Halo dari Pipi!\\n")\n    file.write("Belajar Python itu seru.\\n")\nprint("File berhasil ditulis")',
            lines: [
              { line: 'open("catatan.txt", "w")', explain: 'Membuka atau membuat file untuk ditulis.' },
              { line: 'as file', explain: 'Memberi nama variabel file untuk digunakan di blok.' },
              { line: 'file.write(...)', explain: 'Menulis teks. Tambahkan \\n untuk baris baru.' },
            ],
            output: 'File berhasil ditulis',
          },
        },
        {
          heading: 'Membaca file',
          body: [
            'Mode "r" membaca seluruh isi dengan read(), atau baris per baris dengan loop.',
          ],
          code: {
            code: 'with open("catatan.txt", "r") as file:\n    isi = file.read()\nprint(isi)',
            lines: [
              { line: 'open(..., "r")', explain: 'Membuka file untuk dibaca.' },
              { line: 'file.read()', explain: 'Mengambil seluruh isi file sebagai string.' },
            ],
            output: 'Halo dari Pipi!\nBelajar Python itu seru.',
          },
          tip: 'Membaca file yang tidak ada memunculkan FileNotFoundError. Tangani dengan try/except jika perlu.',
        },
        {
          heading: 'Menambah tanpa menghapus',
          body: [
            'Mode "a" menambahkan teks di akhir file tanpa menghapus isi sebelumnya.',
          ],
          code: {
            code: 'with open("catatan.txt", "a") as file:\n    file.write("Baris baru ditambahkan.\\n")\n\nwith open("catatan.txt") as file:\n    for baris in file:\n        print(baris.strip())',
            lines: [
              { line: 'mode "a"', explain: 'Append: menambah di akhir file.' },
              { line: 'for baris in file:', explain: 'Membaca file baris demi baris.' },
              { line: 'baris.strip()', explain: 'Menghapus newline sebelum dicetak.' },
            ],
            output: 'Halo dari Pipi!\nBelajar Python itu seru.\nBaris baru ditambahkan.',
          },
        },
      ],
      playground: {
        starter: 'with open("petualangan.txt", "w") as f:\n    f.write("Pipi sedang belajar file handling.\\n")\n\nwith open("petualangan.txt") as f:\n    print(f.read())\n',
      },
      challenge: {
        prompt:
          'Tulis teks "Belajar Python" ke file bernama catatan.txt (tanpa newline), lalu baca kembali isinya dan cetak. Output yang diharapkan: Belajar Python',
        starter: 'with open("catatan.txt", "w") as file:\n    # tulis teks\n\n# buka dan cetak isi file\n',
        hint: 'Gunakan file.write("Belajar Python"). Lalu with open("catatan.txt") as file: print(file.read()).',
        solution:
          'with open("catatan.txt", "w") as file:\n    file.write("Belajar Python")\n\nwith open("catatan.txt", "r") as file:\n    print(file.read())',
        check: 'output',
        expected: 'Belajar Python',
      },
      quiz: [
        {
          id: 'w7l4-q1',
          kind: 'mc',
          question: 'Mode apa untuk membaca file?',
          options: ['"r"', '"w"', '"a"', '"x"'],
          answer: 0,
          explanation: '"r" adalah mode read (membaca).',
          hint: 'R singkatan dari read.',
        },
        {
          id: 'w7l4-q2',
          kind: 'mc',
          question: 'Mengapa dianjurkan memakai with saat membuka file?',
          options: [
            'File otomatis ditutup setelah blok selesai',
            'File menjadi lebih kecil',
            'File tidak bisa dibaca tanpa with',
            'With membuat file baru',
          ],
          answer: 0,
          explanation: 'with memastikan file ditutup otomatis, bahkan jika terjadi error.',
          hint: 'Terkait penutupan file otomatis.',
        },
        {
          id: 'w7l4-q3',
          kind: 'mc',
          question: 'Apa perbedaan mode "w" dan "a"?',
          options: [
            '"w" menimpa isi lama, "a" menambah di akhir',
            '"w" membaca, "a" menulis',
            'Keduanya sama',
            '"a" menghapus file',
          ],
          answer: 0,
          explanation: 'Write menimpa, append menambahkan tanpa menghapus.',
          hint: 'Append berarti menambahkan.',
        },
      ],
      rewards: { xp: 85, coins: 30 },
      sources: [RP, DOC],
    },
    {
      id: 'w7l5',
      title: 'Mini Project: Todo List',
      summary: 'Menggabungkan semua ilmu menjadi aplikasi tugas.',
      minutes: 14,
      icon: 'rocket',
      intro:
        'Ini dia proyek pertamamu! Kita akan membuat aplikasi daftar tugas sederhana dengan list, function, loop, dan f-string. Semua ilmu menyatu di sini.',
      sections: [
        {
          heading: 'Rancang fiturnya',
          body: [
            'Aplikasi kita punya: daftar tugas (list), function untuk menambah tugas, function untuk menampilkan daftar bernomor, dan penanda tugas selesai.',
            'Mulailah dari versi kecil yang berfungsi, lalu tambah fitur. Jangan menulis semuanya sekaligus.',
          ],
          code: {
            code: 'def tambah_tugas(daftar, tugas):\n    daftar.append(tugas)\n    return daftar\n\ndef tampilkan(daftar):\n    if not daftar:\n        print("Belum ada tugas.")\n        return\n    for nomor, tugas in enumerate(daftar, start=1):\n        print(f"{nomor}. {tugas}")',
            lines: [
              { line: 'def tambah_tugas(daftar, tugas):', explain: 'Function menerima list dan tugas baru.' },
              { line: 'daftar.append(tugas)', explain: 'Menambahkan tugas ke list.' },
              { line: 'if not daftar:', explain: 'List kosong dianggap False, jadi pesan khusus ditampilkan.' },
              { line: 'enumerate(daftar, start=1)', explain: 'Memberi nomor mulai dari 1 sambil mengambil item.' },
            ],
          },
        },
        {
          heading: 'Menjalankan aplikasi',
          body: [
            'Sekarang buat list kosong, tambahkan beberapa tugas, lalu tampilkan. Inilah inti aplikasi yang bisa kamu kembangkan.',
          ],
          code: {
            code: 'tugas = []\ntambah_tugas(tugas, "Belajar Python")\ntambah_tugas(tugas, "Bermain dengan Pipi")\ntambah_tugas(tugas, "Buat proyek mini")\ntampilkan(tugas)',
            lines: [
              { line: 'tugas = []', explain: 'List kosong untuk menampung tugas.' },
              { line: 'tambah_tugas(...)', explain: 'Memanggil function untuk menambah tiga tugas.' },
              { line: 'tampilkan(tugas)', explain: 'Menampilkan daftar bernomor.' },
            ],
            output: '1. Belajar Python\n2. Bermain dengan Pipi\n3. Buat proyek mini',
          },
        },
        {
          heading: 'Mengembangkan proyek',
          body: [
            'Setelah inti berfungsi, kamu bisa menambah: tandai selesai, hapus tugas, simpan ke file, atau buat menu interaktif dengan while dan input().',
            'Itu tantangan lanjutanmu setelah menyelesaikan kerajaan ini!',
          ],
          code: {
            code: 'def tandai_selesai(daftar, nomor):\n    index = nomor - 1\n    if 0 <= index < len(daftar):\n        daftar[index] = daftar[index] + " [SELESAI]"\n        return True\n    return False',
            lines: [
              { line: 'index = nomor - 1', explain: 'Nomor tampilan 1-based diubah menjadi indeks list 0-based.' },
              { line: 'if 0 <= index < len(daftar):', explain: 'Memastikan nomor valid agar tidak IndexError.' },
              { line: 'daftar[index] + " [SELESAI]"', explain: 'Menambahkan tanda selesai pada tugas.' },
            ],
          },
          tip: 'Proyek kecil yang selesai lebih berharga daripada proyek besar yang tidak pernah jadi.',
        },
      ],
      playground: {
        starter:
          'def tambah_tugas(daftar, tugas):\n    daftar.append(tugas)\n    return daftar\n\ndef tampilkan(daftar):\n    for i, tugas in enumerate(daftar, start=1):\n        print(f"{i}. {tugas}")\n\ntugas = []\ntambah_tugas(tugas, "Belajar Python")\ntambah_tugas(tugas, "Bermain dengan Pipi")\ntampilkan(tugas)\n',
      },
      challenge: {
        prompt:
          'Lengkapi function tambah_tugas(daftar, tugas) agar menambahkan tugas ke daftar dan mengembalikan daftar. Function diuji otomatis dengan beberapa pemanggilan.',
        starter: 'def tambah_tugas(daftar, tugas):\n    # tambahkan tugas lalu kembalikan daftar\n    pass\n',
        hint: 'Gunakan daftar.append(tugas) lalu return daftar.',
        solution: 'def tambah_tugas(daftar, tugas):\n    daftar.append(tugas)\n    return daftar',
        check: 'tests',
        tests:
          'daftar_uji = []\nhasil = tambah_tugas(daftar_uji, "Belajar Python")\nassert hasil == ["Belajar Python"], "function harus mengembalikan daftar"\nassert daftar_uji == ["Belajar Python"], "daftar harus bertambah"\ntambah_tugas(daftar_uji, "Bermain dengan Pipi")\nassert len(daftar_uji) == 2, "harus ada dua tugas"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w7l5-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'tugas = ["Belajar"]\ntugas.append("Bermain")\nprint(len(tugas))',
          options: ['1', '2', '"Belajar"', 'Error'],
          answer: 1,
          explanation: 'Setelah append, list memiliki dua item.',
          hint: 'Hitung isi list setelah append.',
        },
        {
          id: 'w7l5-q2',
          kind: 'mc',
          question: 'Apa fungsi enumerate(daftar, start=1)?',
          options: [
            'Memberi nomor urut mulai 1 sambil mengambil item',
            'Mengurutkan daftar',
            'Menghapus duplikat',
            'Membalik daftar',
          ],
          answer: 0,
          explanation: 'enumerate menghasilkan pasangan nomor dan item, cocok untuk daftar bernomor.',
          hint: 'Enumerate membantu penomoran.',
        },
        {
          id: 'w7l5-q3',
          kind: 'fill',
          question: 'Lengkapi agar function mengembalikan daftar yang sudah ditambah:',
          code: 'def tambah(daftar, item):\n    daftar.append(item)\n    ____ daftar',
          options: ['return', 'print', 'break', 'input'],
          answer: 0,
          explanation: 'return mengirim daftar kembali ke pemanggil.',
          hint: 'Kita butuh nilai balik.',
        },
      ],
      rewards: { xp: 90, coins: 32 },
      sources: [DOC, PR],
    },
  ],
  boss: {
    id: 'python-final-boss',
    name: 'Python Final Boss',
    title: 'Penjaga Kerajaan Python',
    description:
      'Boss terakhir! Uji seluruh ilmumu: loop, logika, function, string, dan penanganan error. Kalahkan untuk menjadi Python Master!',
    hp: 180,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w7l1-q1', 'w7l1-q2', 'w7l2-q1', 'w7l2-q2', 'w7l3-q1', 'w7l3-q2', 'w7l4-q1', 'w7l4-q3'],
    finalChallenge: {
      prompt:
        'Serangan pamungkas! Buat function fizzbuzz(n): kembalikan "FizzBuzz" jika n habis dibagi 3 dan 5, "Fizz" jika habis dibagi 3, "Buzz" jika habis dibagi 5, selain itu kembalikan str(n).',
      starter: 'def fizzbuzz(n):\n    # tulis logikamu\n    pass\n',
      hint: 'Periksa pembagian 15 lebih dulu (3 dan 5), lalu 3, lalu 5, lalu else. Gunakan if/elif dengan n % 3 == 0.',
      solution:
        'def fizzbuzz(n):\n    if n % 15 == 0:\n        return "FizzBuzz"\n    elif n % 3 == 0:\n        return "Fizz"\n    elif n % 5 == 0:\n        return "Buzz"\n    else:\n        return str(n)',
      check: 'tests',
      tests:
        'assert fizzbuzz(15) == "FizzBuzz", "15 harus FizzBuzz"\nassert fizzbuzz(9) == "Fizz", "9 harus Fizz"\nassert fizzbuzz(10) == "Buzz", "10 harus Buzz"\nassert fizzbuzz(7) == "7", "7 harus string 7"\nprint("PIPI_PASS")',
    },
    reward: { xp: 250, coins: 100 },
  },
}
