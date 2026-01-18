# Otomatik Yedekleme Kurulum Rehberi

Nalbur Deposu veritabanının otomatik olarak Google Drive'a yedeklenmesi için gerekli adımlar aşağıdadır. Bu sistem, veritabanı yedeğini alır, sıkıştırır, buluta yükler ve eski yedekleri (hem yerel hem bulut) otomatik temizler.

## Gereksinimler

- VDS üzerinde root/sudo erişimi
- Bir Google hesabı (Drive erişimi için)
- `server/infra/backup.sh` dosyasının sunucuda bulunması

---

## Kurulum Adımları

### 1. Rclone Kurulumu (VDS Üzerinde)

Rclone, dosyaları bulut depolama servislerine senkronize etmek için kullanılan bir araçtır.

```bash
sudo -v ; curl https://rclone.org/install.sh | sudo bash
```

### 2. Google Drive Bağlantısı

Rclone'u Google Drive hesabınızla eşleştirmeniz gerekir. VDS genellikle "headless" (arayüzsüz) olduğu için bu işlem iki aşamalıdır.

#### A. VDS Üzerinde Başlatma
```bash
rclone config
```
Sırasıyla şunları yapın:
1. `n` tuşuna basın (**New remote**).
2. İsim olarak `gdrive` yazın (Bu isim script için önemlidir).
3. Storage listesinde `drive` numarasını bulun ve yazın (genellikle 18 civarındadır).
4. **Client ID** ve **Client Secret** sorulduğunda `Enter`'a basarak boş geçin.
5. Scope sorulduğunda `1` (Full access) seçin.
6. `service_account_file` sorusuna boş geçin (`Enter`).
7. `Edit advanced config?` sorusuna `n` deyin.
8. `Use auto config?` sorusuna **`n`** deyin (Çok önemli, VDS'de tarayıcı yok).

Size `rclone authorize "drive"` ile başlayan bir komut verecek. Bu komutu kopyalayın.

#### B. Kendi Bilgisayarınızda Yetkilendirme
1. Kendi bilgisayarınızda (Windows/Mac) terminali açın (Rclone yüklü olmalı, yoksa indirin).
2. Kopyaladığınız komutu yapıştırın:
   ```bash
   rclone authorize "drive"
   ```
3. Tarayıcı açılacak, Google hesabınızla giriş yapın ve izin verin.
4. Terminalde size verilen **uzun kodu (token)** kopyalayın.

#### C. VDS'de Tamamlama
1. VDS terminaline geri dönün.
2. `config_token>` kısmına kopyaladığınız kodu yapıştırın.
3. `Configure this as a team drive?` sorusuna `n` deyin.
4. Bilgileri onaylayıp `y`, sonra `q` ile çıkın.

### 3. Klasör Kontrolü

Google Drive'ınızda `nalburdeposu_backups` klasörünün olup olmadığını kontrol edin. Yoksa rclone otomatik oluşturacaktır, ancak manuel oluşturmak isterseniz:

```bash
rclone mkdir gdrive:nalburdeposu_backups
```

Test etmek için:
```bash
rclone lsd gdrive:
```

### 4. Zamanlanmış Görev (Cron Job) Tanımlama

Yedeklemenin günde 2 kez (örneğin 03:00 ve 15:00) otomatik çalışması için:

1. Script'e çalıştırma izni verin:
   ```bash
   chmod +x /path/to/nalburdeposu/server/infra/backup.sh
   # Örnek: chmod +x /root/nalburdeposu/server/infra/backup.sh
   ```

2. Crontab editörünü açın:
   ```bash
   crontab -e
   ```

3. Dosyanın en altına şu satırı ekleyin (dosya yolunu sunucudaki gerçek yola göre güncelleyin):
   ```cron
   0 3,15 * * * /root/nalburdeposu/server/infra/backup.sh >> /var/log/pg_backup.log 2>&1
   ```

## Manuel Yedek Alma

İstediğiniz zaman manuel yedek almak için scripti doğrudan çalıştırabilirsiniz:

```bash
./server/infra/backup.sh
```

## Yedekten Geri Dönme (Restore)

Olası bir felaket durumunda yedeği geri yüklemek için:

1. **İlgili yedeği indirin:**
   ```bash
   rclone copy gdrive:nalburdeposu_backups/nalburdeposu_backup_20240101_150000.sql.gz ./
   ```

2. **Zip'ten çıkarın:**
   ```bash
   gunzip nalburdeposu_backup_20240101_150000.sql.gz
   ```

3. **Veritabanına yükleyin:**
   *(Dikkat: Mevcut verileri ezer!)*
   ```bash
   cat nalburdeposu_backup_20240101_150000.sql | docker exec -i nalburdeposu_db psql -U postgres -d nalburdeposu
   ```

---
**Not:** Script, yerel diskte son 7 günün, Google Drive'da ise son 30 günün yedeklerini saklar. Daha eski yedekler otomatik silinir.
