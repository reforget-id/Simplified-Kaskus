# Simplified Kaskus

>_Script ini sudah deprecated, silahkan gunakan [Kaskus Essentials Script (Dekstop)](https://github.com/reforget-id/kaskus-essentials-desktop)_

Menyederhanakan tampilan Kaskus (Mobile Browser) dan Script Pendukung (PC dan Mobile)

### Simplified Kaskus (Filter)

*Cari cara buat mengembalikan fitur quote dan mengatasi nested comment ?*


*Lewati langkah ini dan langsung menuju ke [Kumpulan Script](#script)*


Cara ini dilakukan dalam upaya untuk mengurangi kompleksitas tampilan Kaskus mobile web. Yang dimaksud disini ialah element yang tidak terlalu penting dan iklan. Sehingga tampilan Kaskus bisa terlihat lebih sederhana.

**Tools :**
1.  **Kiwi Browser a̶t̶a̶u̶ ̶M̶o̶z̶i̶l̶l̶a̶ ̶F̶i̶r̶e̶f̶o̶x̶**
2.  **uBlock Origin / N̶a̶n̶o̶ ̶A̶d̶b̶l̶o̶c̶k̶e̶r̶**
3.  **ViolentMonkey**

**Instalasi :**
1.  Instal [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=en) dari playstore.
2.  Buka Kiwi Browser lalu buka link berikut untuk instal ektensi [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en) di dalam Kiwi Browser. Add To Chrome
.
3. Instal [ViolentMonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en). Add To Chrome.


**uBlock Origin:**
1.  Buka uBlock -> Dasbor -> Tab Daftar Filter.
2.  Centang Import filter. Kemudian copy link di bawah ini dan import filter. [Simplified Kaskus](https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/filter/simplified-kaskus.txt) (filter lengkap) atau  [Simplified Kaskus Without Home](https://raw.githubusercontent.com/reforget-id/Simplified-Kaskus/master/filter/simplified-without-home.txt) (tanpa filter Homepage)
3.  Pastikan filter tersebut dicentang. Aktifkan perbarui otomatis  

**ViolentMonkey :**
1.  Pilih script yang mau dipasang (lihat script di bawah).
2.  Klik tombol Raw
3.  Konfirmasi pemasangan

### Modification

1.  **Thread**
* Menyesuaikan ukuran font size yang terlalu besar pada thread dan post reply
* Menghilangkan forum bar di atas judul thread
* Menghilangkan gambar avatar pemberi reputasi
* Menghilangkan Thread Rekomendasi di bawah thread
* Menghilangkan thumbnail Obrolan Hangat di bawah thread
* Menghilangkan embed widget Kaskus TV

1.  **Forum Page**
* Menyesuaikan ukuran font size yang terlalu besar pada judul thread
* Menghilangkan thumbnail thread disamping judul thread
* Menghilangkan Thread Rekomendasi dan Obrolan Hangat di bawah Daftar Thread
* Mengatur padding beberapa elemen

1.  **Homepage/Channel**
* Menghilangkan iklan yang mengganggu di semua halaman
* Menghilangkan widget Kaskus Podcast diatas Header di semua halaman
* Membuat bagian Hot Thread menjadi 1 kolom diikuti dengan 2 baris 2 kolom
* Menyesuaikan ukuran font size pada judul Hot Thread. Judul thread maksimal 3 baris, jika lewat akan menampilkan ellipsis dan judulnya bisa di scroll. 
* Mengecilkan gambar Hot Topic
* Menghilangkan thumbnail pada Obrolan Hangat
* Mengatur padding dan margin beberapa elemen

**Screenshots**

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110103.png)

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110150.png)

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110202.png)

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110357.png)

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110448.png)

![](https://s.kaskus.id/images/2020/02/12/9880921_20200212110504.png)



### Script 

***How to install script ?***

***Cara singkat buat pengguna Android***

1. Install Kiwi browser dari playstore [Link](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser)
2. Buka appnya trus buka ini [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag), Add to Chrome. Kalo ga bisa login dulu. 
3. Buka link ini 
- [k-allpost](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-allpost.user.js)
- [k-quote](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-quote.user.js)
- [k-lastpost](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-lastpost.user.js)
- [k-plus](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-plus.user.js) (pengguna kaskus plus ga perlu ini)
4. Klik tombol raw
5. Confirm installation
6. Beres, buka kaskus


***Installation Screenshots***

![https://s.kaskus.id/images/2020/05/03/9880921_20200503122005.png](https://s.kaskus.id/images/2020/05/03/9880921_20200503122005.png)

![https://s.kaskus.id/images/2020/05/03/9880921_20200503122018.png](https://s.kaskus.id/images/2020/05/03/9880921_20200503122018.png)

![https://s.kaskus.id/images/2020/05/03/9880921_20200503122028.png](https://s.kaskus.id/images/2020/05/03/9880921_20200503122028.png)


**For Mobile Browser (Kiwi Browser) :**

1.  **[k-quote.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-quote.user.js)**
Menambahkan tombol single quote dan multi quote di postingan temasuk nested comment
2.  **[k-allpost.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-allpost.user.js)**
Redirect show all post thread saat berada di halaman single post
3.  **[k-lastpost.user.js ](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-lastpost.user.js)**
Menambahkan tombol Last Post Thread di sebelah view post pada halaman Forum. Terbuka di tab baru. 
4.  **[k-plus.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-plus.user.js)**
Menggunakan Smiley Kaskus Plus tanpa perlu Kaskus Plus
5.  **[k-newtab.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-newtab.user.js)**
Membuka Go to Last Post, Go to First New Post dan Judul Hot Thread pada tab baru. Bekerja di semua halaman. 
6.  **[k-postreply.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-postreply.user.js)**
Memindahkan kotak post reply ke bawah thread
7.  **[k-scrollbottom.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/mobile/k-scrollbottom.user.js)**
Menambahkan tombol instant go to bottom


**For PC Browser :**

1.  **[k-quotepc.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/pc/k-quotepc.user.js)**
Menambahkan tombol single quote dan multi quote di postingan temasuk nested comment
2.  **[k-allpostpc.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/pc/k-allpostpc.user.js)**
Redirect show all post thread saat berada di halaman single post
3.  **[k-pluspc.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/pc/k-pluspc.user.js)**
Menggunakan Smiley Kaskus Plus tanpa perlu Kaskus Plus
4.  **[k-postreplypc.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/pc/k-postreplypc.user.js)**
Memindahkan kotak post reply ke bawah thread
5.  **[k-editor.user.js](https://github.com/reforget-id/Simplified-Kaskus/blob/master/script/pc/k-editor.user.js)**
Mengubah halaman post reply menjadi thread maker. Digunakan untuk membuat thread bagi yang lebih suka menggunakan Tag BBCode. 


### Screenshots

**k-lastpost dan k-scrollbottom**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503011217.png)

**k-quote**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503011241.png)

**k-postreply**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503011306.png)


**k-editor**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503014756.png)
![](https://s.kaskus.id/images/2020/05/03/9880921_20200503014805.png)

**k-quotepc**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503014830.png)

**k-postreplypc**

![](https://s.kaskus.id/images/2020/05/03/9880921_20200503014852.png)


*Error ? Bug ? Saran ? Request Fitur? Atau masih bingung?
Silahkan hubungi saya disini atau via kaskus [@ffsuperteam](https://m.kaskus.co.id/@ffsuperteam)*


*[Thread Kaskus](https://m.kaskus.co.id/thread/5e4424ed337f9310e6200752/simplified-kaskus--menyederhanakan-tampilan-kaskus-pada-browser-mobile/?ref=threadlist-14&med=thread_list)*
