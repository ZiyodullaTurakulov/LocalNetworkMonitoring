# LocalNetworkMonitoring
Software that stores devices and their ports on a local network.

# Tarmoq Monitoring Tizimi

Bu loyiha tarmoqdagi qurilmalarni monitoring qilish uchun mo'ljallangan web-dastur hisoblanadi. Tizim orqali tarmoqdagi qurilmalarning holati, tezligi va boshqa parametrlarini real vaqtda kuzatish mumkin.

## Asosiy imkoniyatlar

- Qurilmalarning online/offline holatini kuzatish
- Tarmoq qurilmalarining tezligini monitoring qilish
- Qurilmalar haqida batafsil ma'lumotlarni ko'rish
- Ogohlantirishlar tizimi
- Qurilmalarni qo'shish va tahrirlash
- Qurilmalarni qidirish

## O'rnatish

1. Loyihani clone qiling:

2. 
2. MySQL ma'lumotlar bazasini yarating va `network_monitoring.sql` faylini import qiling

3. `config/database.php` faylida ma'lumotlar bazasi sozlamalarini o'zgartiring:

4. 
4. Loyihani web-server (Apache/Nginx) papkasiga joylang

## Texnologiyalar

- PHP 7.4+
- MySQL 5.7+
- Bootstrap 5.3
- JavaScript
- HTML5/CSS3

## Tizim talablari

- PHP 7.4 yoki undan yuqori versiya
- MySQL 5.7 yoki undan yuqori versiya
- Web-server (Apache/Nginx)
- PDO PHP kengaytmasi
- mod_rewrite moduli (Apache uchun)

## Ishga tushirish

1. Web-serverni ishga tushiring
2. Brauzerda `http://localhost/tarmoq-monitoring` manziliga kiring


## Ekran tasvirlari

![Bosh sahifa](screenshots/dashboard.png)
![Qurilmalar ro'yxati](screenshots/devices-list.png)

## Litsenziya

MIT

## Muallif

Loyiha [ZiyoTurakulov(21yo20.uz)] tomonidan ishlab chiqilgan

## Yordam va qo'llab-quvvatlash

Savollar va takliflar uchun (https://t.me/ZiyoTurakulov) bo'limiga murojaat qiling.
