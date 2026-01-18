#!/bin/bash

# ==========================================
# Nalbur Deposu - Automated Backup Script
# ==========================================
# Bu script veritabanını yedekler, sıkıştırır ve Google Drive'a yükler.
# Gereksinimler:
# 1. Docker container isminin 'nalburdeposu_db' olması
# 2. Host makinede 'rclone' kurulu olması
# 3. Rclone'da 'gdrive' adında bir remote tanımlı olması

# Konfigürasyon
CONTAINER_NAME="nalburdeposu_db"
DB_USER="postgres"
DB_NAME="nalburdeposu"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="nalburdeposu_backup_$TIMESTAMP.sql"
BACKUP_PATH="$BACKUP_DIR/$FILENAME"
RCLONE_REMOTE="gdrive:nalburdeposu_backups"

# Dizin kontrolü
mkdir -p $BACKUP_DIR

echo "[$(date)] Yedekleme başlatılıyor..."

# 1. Postgres Dump Al
if docker exec $CONTAINER_NAME pg_dump -U $DB_USER $DB_NAME > $BACKUP_PATH; then
    echo "✅ Veritabanı dump alındı: $FILENAME"
else
    echo "❌ HATA: pg_dump başarısız oldu!"
    exit 1
fi

# 2. Sıkıştır (gzip)
gzip $BACKUP_PATH
COMPRESSED_FILE="$BACKUP_PATH.gz"
echo "✅ Dosya sıkıştırıldı: $FILENAME.gz"

# 3. Google Drive'a Yükle (Rclone)
if command -v rclone &> /dev/null; then
    echo "☁️  Google Drive'a yükleniyor ($RCLONE_REMOTE)..."
    if rclone copy "$COMPRESSED_FILE" "$RCLONE_REMOTE"; then
        echo "✅ Yükleme başarılı!"
        
        # 4. Yerel yedeği sil (Opsiyonel - Disk tasarrufu)
        # rm "$COMPRESSED_FILE"
        # echo "🗑️  Yerel kopya silindi."

        # 5. Uzak sunucuda 30 günden eski yedekleri temizle
        echo "🧹 Eski yedekler temizleniyor (30 gün+)..."
        rclone delete --min-age 30d "$RCLONE_REMOTE"
    else
        echo "❌ HATA: rclone yüklemesi başarısız!"
    fi
else
    echo "⚠️  UYARI: rclone kurulu değil, buluta yükleme atlandı."
fi

# 6. Yerel klasör temizliği (7 günden eski)
find $BACKUP_DIR -name "*.gz" -type f -mtime +7 -delete
echo "✅ Yerel temizlik tamamlandı."

echo "[$(date)] İşlem bitti."
