-- Jalankan di Supabase SQL Editor sebelum memakai ID supplier sebagai identitas tetap.
ALTER TABLE supplier ADD COLUMN IF NOT EXISTS kode_supplier TEXT;

-- Isi kode untuk supplier lama berdasarkan urutan ID yang ada.
WITH bernomor AS (
SELECT id, 'S' || LPAD(ROW_NUMBER() OVER (ORDER BY id)::TEXT, 3, '0') AS kode
FROM supplier
WHERE kode_supplier IS NULL
)
UPDATE supplier s SET kode_supplier=b.kode FROM bernomor b WHERE s.id=b.id;

-- Cegah dua supplier memiliki ID yang sama.
CREATE UNIQUE INDEX IF NOT EXISTS supplier_kode_supplier_unique ON supplier(kode_supplier);
