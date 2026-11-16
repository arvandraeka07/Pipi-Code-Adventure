import type { World } from '../../types'

const DOC = { label: 'Python Docs — Defining Functions', url: 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions' }
const W3 = { label: 'W3Schools — Python Functions', url: 'https://www.w3schools.com/python/python_functions.asp' }
const RP = { label: 'Real Python — Defining Your Own Python Function', url: 'https://realpython.com/defining-your-own-python-function/' }

export const world5: World = {
  id: 'world-5',
  order: 5,
  name: 'Function Mountain',
  tagline: 'Gunung tempat kekuatan kode dikemas ulang.',
  description:
    'Buat function sendiri, kirim parameter, dan kembalikan hasil dengan return agar kode rapi dan bisa dipakai ulang.',
  icon: 'function',
  palette: { from: '#8FB8FF', to: '#4E6FE0', accent: '#FFC93C', soft: '#E3EEFF' },
  reward: { xp: 180, coins: 90, badge: 'function-expert' },
  levels: [
    {
      id: 'w5l1',
      title: 'Pengenalan Function',
      summary: 'Mengemas perintah menjadi blok yang bisa dipanggil.',
      minutes: 9,
      icon: 'function',
      intro:
        'Function itu seperti resep yang diberi nama. Sekali ditulis, kamu bisa memakainya berkali-kali hanya dengan menyebut namanya.',
      sections: [
        {
          heading: 'Mendefinisikan function',
          body: [
            'Gunakan def diikuti nama function, tanda kurung, dan titik dua. Blok isi function diberi indentasi.',
            'Mendefinisikan function tidak menjalankannya. Function baru berjalan saat dipanggil dengan nama().',
          ],
          code: {
            code: 'def sapa():\n    print("Halo, aku Pipi!")\n\nsapa()\nsapa()',
            lines: [
              { line: 'def sapa():', explain: 'Mendefinisikan function bernama sapa tanpa parameter.' },
              { line: '    print("Halo, aku Pipi!")', explain: 'Isi function. Dijalankan saat function dipanggil.' },
              { line: 'sapa()', explain: 'Memanggil function. Bisa dipanggil berkali-kali.' },
            ],
            output: 'Halo, aku Pipi!\nHalo, aku Pipi!',
          },
        },
        {
          heading: 'Kenapa memakai function?',
          body: [
            'Function menghindari pengulangan kode, membuat program lebih mudah dibaca, dan memudahkan perbaikan. Jika ada kesalahan, cukup perbaiki di satu tempat.',
            'Nama function sebaiknya berupa kata kerja: sapa, hitung_total, tampilkan_menu. Ikuti aturan nama variabel dan gunakan huruf kecil dengan garis bawah.',
          ],
          tip: 'Function harus didefinisikan sebelum dipanggil di dalam alur program.',
        },
        {
          heading: 'Function memanggil function lain',
          body: [
            'Di dalam function, kamu boleh memanggil function lain. Ini membantu memecah masalah besar menjadi bagian kecil.',
          ],
          code: {
            code: 'def garis():\n    print("==========")\n\ndef judul():\n    garis()\n    print("PETUALANGAN PIPI")\n    garis()\n\njudul()',
            lines: [
              { line: 'def garis():', explain: 'Function kecil untuk mencetak garis.' },
              { line: 'def judul():', explain: 'Function yang memakai garis() dua kali.' },
              { line: 'judul()', explain: 'Memanggil function judul.' },
            ],
            output: '==========\nPETUALANGAN PIPI\n==========',
          },
        },
      ],
      playground: {
        starter: 'def sapa():\n    print("Halo, aku Pipi!")\n\nsapa()\n',
      },
      challenge: {
        prompt:
          'Buat function bernama sapa tanpa parameter yang mencetak "Halo dari Pipi!", lalu panggil function tersebut satu kali.',
        starter: '# def sapa(): ...\n# panggil sapa()\n',
        hint: 'Tulis def sapa():, isi dengan print, lalu di luar function panggil sapa().',
        solution: 'def sapa():\n    print("Halo dari Pipi!")\n\nsapa()',
        check: 'output',
        expected: 'Halo dari Pipi!',
      },
      quiz: [
        {
          id: 'w5l1-q1',
          kind: 'mc',
          question: 'Kata kunci apa yang dipakai untuk membuat function?',
          options: ['def', 'function', 'func', 'make'],
          answer: 0,
          explanation: 'Function di Python didefinisikan dengan def.',
          hint: 'Singkatan dari "define".',
        },
        {
          id: 'w5l1-q2',
          kind: 'output',
          question: 'Berapa kali "Hai" tercetak?',
          code: 'def hai():\n    print("Hai")\n\nhai()\nhai()',
          options: ['0', '1', '2', '3'],
          answer: 2,
          explanation: 'Function dipanggil dua kali, jadi "Hai" tercetak dua kali.',
          hint: 'Hitung baris pemanggilan, bukan definisi.',
        },
        {
          id: 'w5l1-q3',
          kind: 'mc',
          question: 'Apa yang terjadi jika function hanya didefinisikan tetapi tidak dipanggil?',
          options: ['Isinya tidak dijalankan', 'Isinya dijalankan otomatis', 'Terjadi error', 'Function terhapus'],
          answer: 0,
          explanation: 'Definisi hanya menyiapkan function. Isinya baru berjalan saat dipanggil.',
          hint: 'Resep yang disimpan belum berarti memasak.',
        },
      ],
      rewards: { xp: 65, coins: 22 },
      sources: [DOC, W3],
    },
    {
      id: 'w5l2',
      title: 'Parameter & Argument',
      summary: 'Mengirim data ke dalam function.',
      minutes: 9,
      icon: 'sliders',
      intro:
        'Function akan jauh lebih kuat jika bisa menerima data. Parameter adalah pintu masuknya!',
      sections: [
        {
          heading: 'Parameter',
          body: [
            'Tulis nama parameter di dalam tanda kurung saat mendefinisikan function. Saat memanggil, nilai yang dikirim disebut argument.',
            'Parameter bisa lebih dari satu, dipisahkan koma.',
          ],
          code: {
            code: 'def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Pipi")\nsapa("Andra")',
            lines: [
              { line: 'def sapa(nama):', explain: 'nama adalah parameter, belum punya nilai sampai dipanggil.' },
              { line: 'sapa("Pipi")', explain: '"Pipi" adalah argument yang masuk ke parameter nama.' },
              { line: 'sapa("Andra")', explain: 'Function yang sama menerima nilai berbeda.' },
            ],
            output: 'Halo, Pipi!\nHalo, Andra!',
          },
        },
        {
          heading: 'Beberapa parameter',
          body: [
            'Urutan argument mengikuti urutan parameter. Kamu juga bisa memakai nama parameter saat memanggil (keyword argument) agar lebih jelas.',
          ],
          code: {
            code: 'def perkenalan(nama, umur):\n    print(f"{nama} berumur {umur} tahun")\n\nperkenalan("Pipi", 3)\nperkenalan(umur=5, nama="Andra")',
            lines: [
              { line: 'def perkenalan(nama, umur):', explain: 'Dua parameter: nama lalu umur.' },
              { line: 'perkenalan("Pipi", 3)', explain: 'Argument posisional: "Pipi" ke nama, 3 ke umur.' },
              { line: 'perkenalan(umur=5, nama="Andra")', explain: 'Keyword argument: urutan tidak masalah karena namanya ditulis.' },
            ],
            output: 'Pipi berumur 3 tahun\nAndra berumur 5 tahun',
          },
        },
        {
          heading: 'Nilai default',
          body: [
            'Parameter bisa memiliki nilai default. Nilai ini dipakai jika argument tidak diberikan.',
          ],
          code: {
            code: 'def sapa(nama="Petualang"):\n    print(f"Halo, {nama}!")\n\nsapa()\nsapa("Pipi")',
            lines: [
              { line: 'nama="Petualang"', explain: 'Default dipakai saat sapa() dipanggil tanpa argument.' },
            ],
            output: 'Halo, Petualang!\nHalo, Pipi!',
          },
          tip: 'Parameter dengan default harus ditulis setelah parameter tanpa default.',
        },
      ],
      playground: {
        starter: 'def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Pipi")\n',
      },
      challenge: {
        prompt:
          'Buat function sapa(nama) yang mencetak "Halo, [nama]!" lalu panggil dengan argument "Pipi".\nOutput: Halo, Pipi!',
        starter: '# def sapa(nama): ...\n',
        hint: 'Gunakan f-string di dalam print: f"Halo, {nama}!" Lalu panggil sapa("Pipi").',
        solution: 'def sapa(nama):\n    print(f"Halo, {nama}!")\n\nsapa("Pipi")',
        check: 'output',
        expected: 'Halo, Pipi!',
      },
      quiz: [
        {
          id: 'w5l2-q1',
          kind: 'mc',
          question: 'Pada def sapa(nama), apa yang disebut parameter?',
          options: ['sapa', 'nama', 'def', 'tanda kurung'],
          answer: 1,
          explanation: 'nama adalah parameter. sapa adalah nama function.',
          hint: 'Parameter adalah variabel di dalam tanda kurung definisi.',
        },
        {
          id: 'w5l2-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'def kali(a, b):\n    print(a * b)\n\nkali(3, 4)',
          options: ['7', '12', '34', 'Error'],
          answer: 1,
          explanation: 'a=3, b=4, sehingga a * b = 12.',
          hint: 'Argument masuk sesuai urutan parameter.',
        },
        {
          id: 'w5l2-q3',
          kind: 'mc',
          question: 'Apa yang dimaksud argument?',
          options: [
            'Nilai yang dikirim saat function dipanggil',
            'Nama function',
            'Baris komentar',
            'Pesan error',
          ],
          answer: 0,
          explanation: 'Argument adalah nilai nyata yang dikirim ke parameter.',
          hint: 'Parameter adalah wadah, argument adalah isinya.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [W3, RP],
    },
    {
      id: 'w5l3',
      title: 'Return',
      summary: 'Mengembalikan hasil dari function.',
      minutes: 10,
      icon: 'return',
      intro:
        'Print hanya menampilkan. Return memberikan hasil kepada pemanggil agar bisa diolah lebih lanjut. Ini perbedaan penting, Petualang!',
      sections: [
        {
          heading: 'return mengirim nilai balik',
          body: [
            'Saat return dijalankan, function langsung berhenti dan mengirim nilai ke tempat pemanggilan.',
            'Nilai itu bisa disimpan di variabel, dicetak, atau dipakai dalam perhitungan lain.',
          ],
          code: {
            code: 'def tambah(a, b):\n    return a + b\n\nhasil = tambah(3, 4)\nprint(hasil)\nprint(tambah(10, 5) * 2)',
            lines: [
              { line: 'return a + b', explain: 'Mengirim hasil penjumlahan ke pemanggil, bukan mencetaknya.' },
              { line: 'hasil = tambah(3, 4)', explain: 'Nilai balik disimpan di variabel hasil.' },
              { line: 'tambah(10, 5) * 2', explain: 'Nilai balik (15) langsung dipakai dalam perhitungan.' },
            ],
            output: '7\n30',
          },
        },
        {
          heading: 'return vs print',
          body: [
            'Function yang hanya print tidak bisa dihitung lagi hasilnya. Function yang return dapat dirangkai dengan operasi lain.',
            'Jika function tidak memiliki return, Python mengembalikan None secara implisit.',
          ],
          code: {
            code: 'def cetak_tambah(a, b):\n    print(a + b)\n\ndef nilai_tambah(a, b):\n    return a + b\n\ncetak_tambah(2, 3)\nprint(nilai_tambah(2, 3) + 10)',
            lines: [
              { line: 'cetak_tambah(2, 3)', explain: 'Mencetak 5, tetapi tidak mengembalikan nilai.' },
              { line: 'nilai_tambah(2, 3) + 10', explain: 'Nilai balik 5 dipakai dalam penjumlahan menjadi 15.' },
            ],
            output: '5\n15',
          },
          tip: 'return langsung menghentikan function. Kode setelah return tidak dijalankan.',
        },
        {
          heading: 'Mengembalikan lebih dari satu nilai',
          body: [
            'Python bisa mengembalikan beberapa nilai sekaligus sebagai tuple. Ini akan kita dalami di Data Dungeon.',
          ],
          code: {
            code: 'def min_max(a, b):\n    return min(a, b), max(a, b)\n\nkecil, besar = min_max(7, 3)\nprint(kecil)\nprint(besar)',
            lines: [
              { line: 'return min(a, b), max(a, b)', explain: 'Mengembalikan dua nilai sekaligus.' },
              { line: 'kecil, besar = ...', explain: 'Unpacking: hasil dibagi ke dua variabel.' },
            ],
            output: '3\n7',
          },
        },
      ],
      playground: {
        starter: 'def tambah(a, b):\n    return a + b\n\nprint(tambah(5, 7))\nprint(tambah(2, 3) * 10)\n',
      },
      challenge: {
        prompt:
          'Buat function kali(a, b) yang MENGEMBALIKAN hasil perkalian (bukan mencetak).\nFunction akan diuji otomatis dengan beberapa nilai.',
        starter: 'def kali(a, b):\n    # kembalikan a * b\n    pass\n',
        hint: 'Gunakan return a * b di dalam function. Hapus pass.',
        solution: 'def kali(a, b):\n    return a * b',
        check: 'tests',
        tests:
          'assert kali(3, 4) == 12, "kali(3,4) harus 12"\nassert kali(0, 5) == 0, "kali(0,5) harus 0"\nassert kali(-2, 6) == -12, "kali(-2,6) harus -12"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w5l3-q1',
          kind: 'mc',
          question: 'Apa fungsi return?',
          options: [
            'Mengembalikan nilai dari function ke pemanggil',
            'Mencetak nilai ke layar',
            'Menghentikan program sepenuhnya',
            'Membuat variabel baru',
          ],
          answer: 0,
          explanation: 'return mengirim nilai balik, berbeda dengan print yang hanya menampilkan.',
          hint: 'Nilai balik bisa disimpan atau dihitung lagi.',
        },
        {
          id: 'w5l3-q2',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'def f(x):\n    return x * 2\n\nprint(f(5) + 1)',
          options: ['11', '10', '51', 'None'],
          answer: 0,
          explanation: 'f(5) mengembalikan 10, lalu 10 + 1 = 11.',
          hint: 'Hitung nilai balik dulu, lalu tambahkan 1.',
        },
        {
          id: 'w5l3-q3',
          kind: 'mc',
          question: 'Jika function tidak memiliki return, nilai baliknya adalah...',
          options: ['None', '0', 'string kosong', 'Error'],
          answer: 0,
          explanation: 'Python mengembalikan None jika function tidak memiliki return.',
          hint: 'Nilai khusus yang berarti "tidak ada nilai".',
        },
      ],
      rewards: { xp: 75, coins: 26 },
      sources: [RP, DOC],
    },
    {
      id: 'w5l4',
      title: 'Function + Logika',
      summary: 'Menggabungkan function dengan if dan loop.',
      minutes: 10,
      icon: 'git-branch',
      intro:
        'Saatnya menggabungkan semua yang sudah dipelajari: function, parameter, return, if, dan loop. Ini resep kekuatan sejati!',
      sections: [
        {
          heading: 'Function dengan keputusan',
          body: [
            'Function boleh berisi if. Pastikan setiap jalur yang mungkin mengembalikan nilai yang kamu inginkan.',
          ],
          code: {
            code: 'def cek_lulus(nilai):\n    if nilai >= 75:\n        return True\n    return False\n\nprint(cek_lulus(80))\nprint(cek_lulus(60))',
            lines: [
              { line: 'if nilai >= 75: return True', explain: 'Jika lulus, return langsung menghentikan function.' },
              { line: 'return False', explain: 'Dijalankan jika kondisi di atas tidak terpenuhi.' },
            ],
            output: 'True\nFalse',
          },
        },
        {
          heading: 'Function dengan loop',
          body: [
            'Function bisa memakai loop di dalamnya. Perhatikan bahwa return di dalam loop akan langsung keluar dari function.',
          ],
          code: {
            code: 'def jumlah_sampai(n):\n    total = 0\n    for i in range(1, n + 1):\n        total += i\n    return total\n\nprint(jumlah_sampai(5))',
            lines: [
              { line: 'for i in range(1, n + 1):', explain: 'Loop dari 1 sampai n. n + 1 agar n ikut dihitung.' },
              { line: 'return total', explain: 'Setelah loop selesai, kembalikan hasilnya.' },
            ],
            output: '15',
          },
        },
        {
          heading: 'Membuat kode ringkas',
          body: [
            'Function kecil yang jelas lebih baik daripada satu blok panjang. Pisahkan tanggung jawab setiap function.',
          ],
          code: {
            code: 'def bintang(n):\n    return "*" * n\n\ndef baris_bintang(n):\n    print(bintang(n))\n\nfor i in range(1, 4):\n    baris_bintang(i)',
            lines: [
              { line: 'def bintang(n):', explain: 'Function mengembalikan string bintang sepanjang n.' },
              { line: 'baris_bintang(i)', explain: 'Memakai function bintang untuk mencetak baris.' },
            ],
            output: '*\n**\n***',
          },
        },
      ],
      playground: {
        starter: 'def cek_lulus(nilai):\n    if nilai >= 75:\n        return True\n    return False\n\nprint(cek_lulus(82))\nprint(cek_lulus(70))\n',
      },
      challenge: {
        prompt:
          'Buat function cek_lulus(nilai) yang mengembalikan True jika nilai minimal 75, dan False jika kurang. Function diuji otomatis.',
        starter: 'def cek_lulus(nilai):\n    # lengkapi\n    pass\n',
        hint: 'Gunakan if nilai >= 75: return True, lalu return False untuk kondisi lainnya.',
        solution: 'def cek_lulus(nilai):\n    if nilai >= 75:\n        return True\n    return False',
        check: 'tests',
        tests:
          'assert cek_lulus(80) is True, "80 harus lulus"\nassert cek_lulus(75) is True, "75 harus lulus"\nassert cek_lulus(74) is False, "74 harus remedial"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w5l4-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'def cek(n):\n    if n > 0:\n        return "positif"\n    return "bukan"\n\nprint(cek(-5))',
          options: ['positif', 'bukan', 'None', 'Error'],
          answer: 1,
          explanation: 'n > 0 False, sehingga baris return "bukan" dijalankan.',
          hint: 'Ikuti jalur yang tidak memenuhi if.',
        },
        {
          id: 'w5l4-q2',
          kind: 'fill',
          question: 'Lengkapi function agar mengembalikan total:',
          code: 'def jumlah(n):\n    total = 0\n    for i in range(n + 1):\n        total += i\n    ____ total',
          options: ['return', 'print', 'def', 'break'],
          answer: 0,
          explanation: 'return mengirim total ke pemanggil.',
          hint: 'Kita ingin nilainya bisa dipakai, bukan hanya ditampilkan.',
        },
        {
          id: 'w5l4-q3',
          kind: 'mc',
          question: 'Apa yang terjadi pada kode setelah return di dalam function?',
          options: ['Tidak dijalankan', 'Dijalankan dua kali', 'Selalu error', 'Dijalankan sebelum return'],
          answer: 0,
          explanation: 'return langsung menghentikan eksekusi function.',
          hint: 'return sudah membawa hasil keluar.',
        },
      ],
      rewards: { xp: 75, coins: 26 },
      sources: [DOC, RP],
    },
  ],
  boss: {
    id: 'function-guardian',
    name: 'Function Guardian',
    title: 'Penjaga Gunung',
    description:
      'Guardian hanya membuka jalan bagi petualang yang bisa membuat function dengan parameter dan return yang tepat.',
    hp: 140,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w5l1-q1', 'w5l1-q2', 'w5l2-q1', 'w5l2-q2', 'w5l3-q1', 'w5l3-q2', 'w5l4-q1', 'w5l4-q3'],
    finalChallenge: {
      prompt:
        'Serangan terakhir! Buat function rata_rata(a, b, c) yang mengembalikan rata-rata tiga angka. Diuji dengan (6, 9, 12) → 9.0.',
      starter: 'def rata_rata(a, b, c):\n    # kembalikan rata-rata\n    pass\n',
      hint: 'Jumlahkan ketiganya lalu bagi 3. Gunakan return (a + b + c) / 3.',
      solution: 'def rata_rata(a, b, c):\n    return (a + b + c) / 3',
      check: 'tests',
      tests:
        'assert rata_rata(6, 9, 12) == 9.0, "rata_rata(6,9,12) harus 9.0"\nassert rata_rata(0, 0, 0) == 0, "rata_rata(0,0,0) harus 0"\nprint("PIPI_PASS")',
    },
    reward: { xp: 160, coins: 65 },
  },
}
