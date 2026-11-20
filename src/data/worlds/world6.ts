import type { World } from '../../types'

const DOC = { label: 'Python Docs — Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html' }
const W3 = { label: 'W3Schools — Python Lists', url: 'https://www.w3schools.com/python/python_lists.asp' }
const PR = { label: 'Programiz — Python Dictionary', url: 'https://www.programiz.com/python-programming/dictionary' }

export const world6: World = {
  id: 'world-6',
  order: 6,
  name: 'Data Dungeon',
  tagline: 'Ruangan bawah tanah penuh kumpulan data.',
  description:
    'Kelola banyak data sekaligus dengan list, tuple, dictionary, dan set, lalu manipulasi seperti petualang data sungguhan.',
  icon: 'database',
  palette: { from: '#ED9A5C', to: '#B95A20', accent: '#2FAE8F', soft: '#FFEBDD' },
  reward: { xp: 190, coins: 95, badge: 'data-wrangler' },
  levels: [
    {
      id: 'w6l1',
      title: 'List',
      summary: 'Menyimpan banyak nilai dalam satu variabel.',
      minutes: 10,
      icon: 'list',
      intro:
        'Selama ini satu variabel menyimpan satu nilai. List memungkinkan kita menyimpan banyak nilai sekaligus, seperti tas petualangan!',
      sections: [
        {
          heading: 'Membuat dan mengakses list',
          body: [
            'List ditulis dengan tanda kurung siku. Item dipisahkan koma dan boleh berbeda tipe, walaupun biasanya sejenis.',
            'Indeks dimulai dari 0. Indeks negatif mengambil dari belakang: -1 adalah item terakhir.',
          ],
          code: {
            code: 'buah = ["apel", "mangga", "pisang"]\nprint(buah[0])\nprint(buah[-1])\nprint(len(buah))',
            lines: [
              { line: 'buah = [...]', explain: 'Membuat list berisi tiga string.' },
              { line: 'buah[0]', explain: 'Item pertama: apel.' },
              { line: 'buah[-1]', explain: 'Item terakhir: pisang.' },
              { line: 'len(buah)', explain: 'Jumlah item dalam list: 3.' },
            ],
            output: 'apel\npisang\n3',
          },
        },
        {
          heading: 'Mengubah list',
          body: [
            'List bersifat mutable: isinya bisa diubah setelah dibuat. Kamu bisa mengganti item, menambah dengan append(), dan menghapus dengan remove().',
          ],
          code: {
            code: 'belanja = ["roti", "susu"]\nbelanja.append("telur")\nbelanja[0] = "roti gandum"\nprint(belanja)',
            lines: [
              { line: 'belanja.append("telur")', explain: 'Menambahkan telur di akhir list.' },
              { line: 'belanja[0] = "roti gandum"', explain: 'Mengganti item pertama.' },
              { line: 'print(belanja)', explain: 'Menampilkan seluruh list.' },
            ],
            output: "['roti gandum', 'susu', 'telur']",
          },
          tip: 'append() menambah satu item, extend() menambah banyak item dari iterable.',
        },
        {
          heading: 'Slicing',
          body: [
            'Slicing mengambil sebagian list dengan list[start:stop]. Stop tidak termasuk. Kamu juga bisa memakai langkah.',
          ],
          code: {
            code: 'angka = [0, 1, 2, 3, 4, 5]\nprint(angka[1:4])\nprint(angka[:3])\nprint(angka[::2])',
            lines: [
              { line: 'angka[1:4]', explain: 'Dari indeks 1 sampai sebelum 4: [1, 2, 3].' },
              { line: 'angka[:3]', explain: 'Dari awal sampai sebelum indeks 3.' },
              { line: 'angka[::2]', explain: 'Semua item dengan langkah 2: [0, 2, 4].' },
            ],
            output: '[1, 2, 3]\n[0, 1, 2]\n[0, 2, 4]',
          },
        },
      ],
      playground: {
        starter: 'buah = ["apel", "mangga", "pisang"]\nbuah.append("jeruk")\nprint(buah)\nprint(buah[0], buah[-1])\n',
      },
      challenge: {
        prompt:
          'Buat list buah berisi "apel", "mangga", "pisang". Tambahkan "jeruk" di akhir dengan append(). Jangan cetak apa pun.',
        starter: '# buah = [...]\n# tambahkan jeruk\n',
        hint: 'Gunakan buah = ["apel", "mangga", "pisang"] lalu buah.append("jeruk").',
        solution: 'buah = ["apel", "mangga", "pisang"]\nbuah.append("jeruk")',
        check: 'tests',
        tests:
          'assert isinstance(buah, list), "buah harus list"\nassert buah == ["apel", "mangga", "pisang", "jeruk"], "isi atau urutan list belum tepat"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w6l1-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'warna = ["merah", "hijau", "biru"]\nprint(warna[1])',
          options: ['merah', 'hijau', 'biru', 'Error'],
          answer: 1,
          explanation: 'Indeks dimulai dari 0, jadi indeks 1 adalah item kedua: hijau.',
          hint: 'Mulai menghitung dari nol.',
        },
        {
          id: 'w6l1-q2',
          kind: 'mc',
          question: 'Method apa yang menambahkan item di akhir list?',
          options: ['add()', 'push()', 'append()', 'insert()'],
          answer: 2,
          explanation: 'append() menambahkan satu item di akhir list. insert() menambah di posisi tertentu.',
          hint: 'Namanya berarti "menambahkan".',
        },
        {
          id: 'w6l1-q3',
          kind: 'output',
          question: 'Apa hasil len(["a", "b", "c", "d"])?',
          options: ['3', '4', '5', 'Error'],
          answer: 1,
          explanation: 'Ada empat item, jadi len bernilai 4.',
          hint: 'Hitung jumlah item.',
        },
      ],
      rewards: { xp: 70, coins: 24 },
      sources: [DOC, W3],
    },
    {
      id: 'w6l2',
      title: 'Tuple & Set',
      summary: 'Koleksi tetap dan koleksi unik.',
      minutes: 10,
      icon: 'layers',
      intro:
        'Tuple seperti list yang tidak bisa diubah, sedangkan set otomatis membuang duplikat. Masing-masing punya keunikan!',
      sections: [
        {
          heading: 'Tuple: tidak bisa diubah',
          body: [
            'Tuple ditulis dengan tanda kurung biasa. Setelah dibuat, isinya tidak dapat diganti atau ditambah. Tuple cocok untuk data yang harus tetap, seperti koordinat.',
            'Tuple satu item membutuhkan koma: (5,) bukan (5) — tanpanya Python menganggapnya angka biasa.',
          ],
          code: {
            code: 'koordinat = (10, 20)\nprint(koordinat[0])\nprint(koordinat)\nprint(len(koordinat))',
            lines: [
              { line: 'koordinat = (10, 20)', explain: 'Membuat tuple dua nilai.' },
              { line: 'koordinat[0]', explain: 'Mengakses item seperti list.' },
            ],
            output: '10\n(10, 20)\n2',
          },
        },
        {
          heading: 'Unpacking tuple',
          body: [
            'Nilai tuple bisa dibongkar ke variabel terpisah dalam satu baris.',
          ],
          code: {
            code: 'x, y = (10, 20)\nprint(x)\nprint(y)',
            lines: [
              { line: 'x, y = (10, 20)', explain: 'x mendapat 10, y mendapat 20.' },
            ],
            output: '10\n20',
          },
          tip: 'Cobalah koordinat[0] = 99 pada tuple — Python akan menolak dengan TypeError. Itu bukti tuple immutable.',
        },
        {
          heading: 'Set: kumpulan unik',
          body: [
            'Set dibuat dengan set() atau kurung kurawal berisi item tanpa pasangan. Duplikat otomatis dihilangkan.',
            'Set tidak mendukung indeks karena tidak berurutan. Gunakan add() untuk menambah dan in untuk mengecek keanggotaan.',
          ],
          code: {
            code: 'angka = [1, 2, 2, 3, 3, 3]\nunik = set(angka)\nprint(unik)\nprint(len(unik))\nunik.add(4)\nprint(4 in unik)',
            lines: [
              { line: 'set(angka)', explain: 'Mengubah list menjadi set, duplikat dihapus.' },
              { line: 'unik.add(4)', explain: 'Menambahkan nilai 4.' },
              { line: '4 in unik', explain: 'Mengecek keanggotaan → True.' },
            ],
            output: '{1, 2, 3}\n3\nTrue',
          },
        },
      ],
      playground: {
        starter: 'angka = [1, 2, 2, 3, 3, 3]\nunik = set(angka)\nprint(unik)\nkoordinat = (10, 20)\nx, y = koordinat\nprint(x, y)\n',
      },
      challenge: {
        prompt:
          'Diberikan angka = [1, 2, 2, 3, 3, 3]: ubah menjadi set unik, lalu buat tuple koordinat berisi 10 dan 20. Jangan cetak apa pun.',
        starter: 'angka = [1, 2, 2, 3, 3, 3]\nunik = ?\nkoordinat = ?\n',
        hint: 'Gunakan set(angka) untuk menghapus duplikat. Tuple ditulis dengan tanda kurung: (10, 20).',
        solution: 'angka = [1, 2, 2, 3, 3, 3]\nunik = set(angka)\nkoordinat = (10, 20)',
        check: 'tests',
        tests:
          'assert isinstance(unik, set), "unik harus set"\nassert unik == {1, 2, 3}, "set harus berisi 1,2,3"\nassert koordinat == (10, 20), "koordinat salah"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w6l2-q1',
          kind: 'mc',
          question: 'Apa keistimewaan tuple dibanding list?',
          options: ['Isinya tidak dapat diubah', 'Hanya bisa berisi angka', 'Ukurannya selalu 2', 'Tidak bisa di-loop'],
          answer: 0,
          explanation: 'Tuple immutable, sehingga isinya tidak bisa diubah setelah dibuat.',
          hint: 'Immutable = tidak bisa diubah.',
        },
        {
          id: 'w6l2-q2',
          kind: 'output',
          question: 'Apa isi set([1, 1, 2, 2, 3])?',
          options: ['[1, 1, 2, 2, 3]', '{1, 2, 3}', '(1, 2, 3)', '{1, 1, 2, 2, 3}'],
          answer: 1,
          explanation: 'Set menghapus nilai duplikat, menyisakan 1, 2, dan 3.',
          hint: 'Set hanya menyimpan nilai unik.',
        },
        {
          id: 'w6l2-q3',
          kind: 'mc',
          question: 'Bagaimana cara membuat tuple berisi satu item?',
          options: ['(5)', '(5,)', '[5]', '{5}'],
          answer: 1,
          explanation: 'Koma wajib agar Python mengenalinya sebagai tuple, bukan sekadar angka dalam kurung.',
          hint: 'Tambahkan koma setelah angka.',
        },
      ],
      rewards: { xp: 75, coins: 26 },
      sources: [DOC, W3],
    },
    {
      id: 'w6l3',
      title: 'Dictionary',
      summary: 'Menyimpan data berpasangan kunci dan nilai.',
      minutes: 11,
      icon: 'table',
      intro:
        'Dictionary seperti buku kontak: setiap nama (kunci) terhubung ke nomor telepon (nilai). Sangat kuat untuk data terstruktur!',
      sections: [
        {
          heading: 'Membuat dan mengakses dictionary',
          body: [
            'Dictionary ditulis dengan kurung kurawal berisi pasangan "kunci": nilai. Kunci harus unik dan biasanya berupa string atau angka.',
            'Akses nilai dengan dict["kunci"]. Jika kunci tidak ada, muncul KeyError. Gunakan get() untuk menghindarinya.',
          ],
          code: {
            code: 'siswa = {"nama": "Pipi", "level": 3}\nprint(siswa["nama"])\nprint(siswa.get("kota"))\nprint(siswa.get("kota", "belum diisi"))',
            lines: [
              { line: '{"nama": "Pipi", "level": 3}', explain: 'Dua pasangan kunci-nilai.' },
              { line: 'siswa["nama"]', explain: 'Mengambil nilai berdasarkan kunci nama.' },
              { line: 'get("kota")', explain: 'Kunci tidak ada → None, bukan error.' },
              { line: 'get("kota", "belum diisi")', explain: 'Memberi nilai default jika kunci tidak ada.' },
            ],
            output: 'Pipi\nNone\nbelum diisi',
          },
        },
        {
          heading: 'Menambah dan mengubah data',
          body: [
            'Assignment ke kunci baru akan menambah pasangan. Assignment ke kunci yang sudah ada akan menimpa nilainya.',
            'Gunakan len() untuk jumlah pasangan, dan in untuk mengecek kunci.',
          ],
          code: {
            code: 'petualang = {"nama": "Andra", "xp": 100}\npetualang["level"] = 2\npetualang["xp"] = 150\nprint(petualang)\nprint("level" in petualang)',
            lines: [
              { line: 'petualang["level"] = 2', explain: 'Menambah kunci baru level.' },
              { line: 'petualang["xp"] = 150', explain: 'Mengubah nilai xp.' },
              { line: '"level" in petualang', explain: 'Mengecek apakah kunci level ada.' },
            ],
            output: "{'nama': 'Andra', 'xp': 150, 'level': 2}\nTrue",
          },
          tip: 'Jangan mengandalkan urutan tampilan dictionary. Gunakan kuncinya, bukan posisinya.',
        },
        {
          heading: 'Menjelajahi dictionary',
          body: [
            'keys() mengambil semua kunci, values() semua nilai, dan items() pasangan kunci-nilai. Loop dengan items() saat membutuhkan keduanya.',
          ],
          code: {
            code: 'skor = {"pipi": 100, "andra": 85}\nfor nama, nilai in skor.items():\n    print(f"{nama}: {nilai}")',
            lines: [
              { line: 'skor.items()', explain: 'Menghasilkan pasangan (kunci, nilai).' },
              { line: 'for nama, nilai in ...', explain: 'Setiap pasangan dibongkar ke dua variabel.' },
            ],
            output: 'pipi: 100\nandra: 85',
          },
        },
      ],
      playground: {
        starter: 'siswa = {"nama": "Pipi", "level": 3}\nsiswa["kota"] = "Python Village"\nprint(siswa["nama"], siswa["level"])\nprint(siswa.get("umur", "tidak diketahui"))\n',
      },
      challenge: {
        prompt:
          'Buat dictionary siswa berisi "nama": "Pipi" dan "level": 3. Tambahkan kunci "kota" dengan nilai "Python Village". Simpan nilai level ke variabel level. Jangan cetak apa pun.',
        starter: '# siswa = {...}\n# tambah kota\n# level = ...\n',
        hint: 'Akses nilai dengan siswa["level"], lalu tambahkan kunci dengan siswa["kota"] = "...".',
        solution: 'siswa = {"nama": "Pipi", "level": 3}\nsiswa["kota"] = "Python Village"\nlevel = siswa["level"]',
        check: 'tests',
        tests:
          'assert siswa["nama"] == "Pipi", "nama salah"\nassert siswa["level"] == 3, "level salah"\nassert siswa["kota"] == "Python Village", "kota salah"\nassert level == 3, "variabel level salah"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w6l3-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'data = {"a": 1, "b": 2}\nprint(data["b"])',
          options: ['a', '1', '2', 'Error'],
          answer: 2,
          explanation: 'data["b"] mengambil nilai dari kunci b, yaitu 2.',
          hint: 'Kunci b memiliki nilai 2.',
        },
        {
          id: 'w6l3-q2',
          kind: 'mc',
          question: 'Apa yang dikembalikan get("x") jika kunci x tidak ada?',
          options: ['0', 'None', 'Error KeyError', 'string kosong'],
          answer: 1,
          explanation: 'get() mengembalikan None jika kunci tidak ada, sehingga aman dari KeyError.',
          hint: 'Nilai khusus "tidak ada nilai".',
        },
        {
          id: 'w6l3-q3',
          kind: 'fill',
          question: 'Lengkapi untuk menambahkan kunci baru:',
          code: 'siswa = {"nama": "Pipi"}\nsiswa____"kota"____ = "Village"',
          options: ['[ ]', '( )', '{ }', '< >'],
          answer: 0,
          explanation: 'Akses dan tambah kunci memakai tanda kurung siku: siswa["kota"] = "...".',
          hint: 'Sama seperti mengakses list, tetapi dengan kunci.',
        },
      ],
      rewards: { xp: 80, coins: 28 },
      sources: [PR, DOC],
    },
    {
      id: 'w6l4',
      title: 'Manipulasi Data',
      summary: 'Mengolah list dengan loop, fungsi bawaan, dan comprehension.',
      minutes: 11,
      icon: 'sliders',
      intro:
        'Petualang data sejati tidak hanya menyimpan data, tetapi mengolahnya. Kita akan menjumlahkan, mencari nilai terbesar, dan menyaring data.',
      sections: [
        {
          heading: 'Fungsi bawaan untuk list',
          body: [
            'sum() menjumlahkan angka, max() dan min() mencari nilai ekstrem, sorted() mengurutkan tanpa mengubah aslinya, sedangkan .sort() mengubah list langsung.',
          ],
          code: {
            code: 'angka = [3, 8, 1, 10, 5]\nprint(sum(angka))\nprint(max(angka))\nprint(min(angka))\nprint(sorted(angka))',
            lines: [
              { line: 'sum(angka)', explain: 'Menjumlahkan semua angka: 27.' },
              { line: 'max(angka) / min(angka)', explain: 'Nilai terbesar 10, terkecil 1.' },
              { line: 'sorted(angka)', explain: 'Mengembalikan list baru yang terurut: [1, 3, 5, 8, 10].' },
            ],
            output: '27\n10\n1\n[1, 3, 5, 8, 10]',
          },
        },
        {
          heading: 'Mengolah dengan loop',
          body: [
            'Loop memudahkan perhitungan kustom, seperti menghitung rata-rata atau menyaring data.',
          ],
          code: {
            code: 'nilai = [70, 85, 90, 60]\ntotal = 0\nfor n in nilai:\n    total += n\nrata = total / len(nilai)\nprint(rata)',
            lines: [
              { line: 'for n in nilai:', explain: 'Mengambil setiap nilai satu per satu.' },
              { line: 'total += n', explain: 'Menambahkan ke total.' },
              { line: 'total / len(nilai)', explain: 'Rata-rata = total dibagi jumlah data.' },
            ],
            output: '76.25',
          },
        },
        {
          heading: 'List comprehension',
          body: [
            'List comprehension membuat list baru dalam satu baris. Bentuknya [ekspresi for item in iterable if kondisi].',
            'Gunakan secukupnya; jika terlalu rumit, loop biasa lebih mudah dibaca.',
          ],
          code: {
            code: 'angka = [1, 2, 3, 4, 5, 6]\ngenap = [n for n in angka if n % 2 == 0]\nkuadrat = [n ** 2 for n in angka]\nprint(genap)\nprint(kuadrat)',
            lines: [
              { line: '[n for n in angka if n % 2 == 0]', explain: 'Mengambil n yang genap saja.' },
              { line: '[n ** 2 for n in angka]', explain: 'Mengkuadratkan setiap angka.' },
            ],
            output: '[2, 4, 6]\n[1, 4, 9, 16, 25, 36]',
          },
          tip: 'Comprehension mengembalikan list baru; list asli tidak berubah.',
        },
      ],
      playground: {
        starter: 'angka = [3, 8, 1, 10, 5]\nprint("Total:", sum(angka))\nprint("Terbesar:", max(angka))\ngenap = [n for n in angka if n % 2 == 0]\nprint("Genap:", genap)\n',
      },
      challenge: {
        prompt:
          'Diberikan angka = [3, 8, 1, 10, 5]. Simpan jumlah semua angka ke variabel total, dan angka terbesar ke variabel terbesar. Jangan cetak.',
        starter: 'angka = [3, 8, 1, 10, 5]\ntotal = ?\nterbesar = ?\n',
        hint: 'Gunakan sum(angka) untuk menjumlahkan dan max(angka) untuk mencari yang terbesar.',
        solution: 'angka = [3, 8, 1, 10, 5]\ntotal = sum(angka)\nterbesar = max(angka)',
        check: 'tests',
        tests:
          'assert total == 27, "total harus 27"\nassert terbesar == 10, "terbesar harus 10"\nprint("PIPI_PASS")',
      },
      quiz: [
        {
          id: 'w6l4-q1',
          kind: 'output',
          question: 'Apa output kode ini?',
          code: 'nilai = [10, 20, 30]\nprint(sum(nilai))',
          options: ['10', '30', '60', '102030'],
          answer: 2,
          explanation: 'sum() menjumlahkan: 10 + 20 + 30 = 60.',
          hint: 'Jumlahkan semua elemen.',
        },
        {
          id: 'w6l4-q2',
          kind: 'output',
          question: 'Apa isi hasil?',
          code: 'angka = [1, 2, 3, 4]\nhasil = [n * 2 for n in angka]',
          options: ['[1, 2, 3, 4]', '[2, 4, 6, 8]', '[1, 3, 5, 7]', 'Error'],
          answer: 1,
          explanation: 'Setiap n dikali 2 sehingga hasilnya [2, 4, 6, 8].',
          hint: 'Kalikan setiap elemen dengan dua.',
        },
        {
          id: 'w6l4-q3',
          kind: 'mc',
          question: 'Apa perbedaan sorted(list) dan list.sort()?',
          options: [
            'sorted() mengembalikan list baru, sort() mengubah list asli',
            'Keduanya sama persis',
            'sort() hanya untuk angka',
            'sorted() tidak bisa dipakai pada list',
          ],
          answer: 0,
          explanation: 'sorted() menghasilkan salinan terurut, sedangkan .sort() mengurutkan list di tempat.',
          hint: 'Satu mengembalikan nilai, satu mengubah langsung.',
        },
      ],
      rewards: { xp: 80, coins: 28 },
      sources: [DOC, W3],
    },
  ],
  boss: {
    id: 'data-beast',
    name: 'Data Beast',
    title: 'Pemangsa Koleksi',
    description:
      'Beast ini menelan list, dict, dan set menjadi kacau. Susun kembali data dan kalahkan dengan manipulasi yang tepat!',
    hp: 150,
    damagePerHit: 20,
    playerHp: 100,
    questionIds: ['w6l1-q1', 'w6l1-q2', 'w6l2-q1', 'w6l2-q2', 'w6l3-q1', 'w6l3-q2', 'w6l4-q1', 'w6l4-q2'],
    finalChallenge: {
      prompt:
        'Serangan terakhir! Diberikan nilai = [70, 85, 90]. Hitung rata-rata ke variabel rata_rata dan nilai tertinggi ke variabel tertinggi. Jangan cetak.',
      starter: 'nilai = [70, 85, 90]\nrata_rata = ?\ntertinggi = ?\n',
      hint: 'Rata-rata = sum(nilai) / len(nilai). Nilai tertinggi memakai max(nilai).',
      solution: 'nilai = [70, 85, 90]\nrata_rata = sum(nilai) / len(nilai)\ntertinggi = max(nilai)',
      check: 'tests',
      tests:
        'assert abs(rata_rata - 81.6666666) < 0.001, "rata-rata harus sekitar 81.67"\nassert tertinggi == 90, "tertinggi harus 90"\nprint("PIPI_PASS")',
    },
    reward: { xp: 170, coins: 70 },
  },
}
