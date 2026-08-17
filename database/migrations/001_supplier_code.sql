-- Jalankan di Supabase SQL Editor. ID database lama tetap dipertahankan.
ALTER TABLE supplier ADD COLUMN IF NOT EXISTS kode_supplier TEXT;
ALTER TABLE produk ADD COLUMN IF NOT EXISTS kode_produk TEXT;

CREATE SEQUENCE IF NOT EXISTS supplier_kode_seq MINVALUE 1;
CREATE SEQUENCE IF NOT EXISTS produk_kode_seq MINVALUE 1;

WITH bernomor AS (
SELECT id,'S'||LPAD((ROW_NUMBER() OVER (ORDER BY id)+COALESCE((SELECT MAX((substring(kode_supplier FROM 2))::INTEGER) FROM supplier WHERE kode_supplier ~ '^S[0-9]+$'),0))::TEXT,3,'0') AS kode
FROM supplier WHERE kode_supplier IS NULL
)
UPDATE supplier s SET kode_supplier=b.kode FROM bernomor b WHERE s.id=b.id;

WITH bernomor AS (
SELECT id,'P'||LPAD((ROW_NUMBER() OVER (ORDER BY id)+COALESCE((SELECT MAX((substring(kode_produk FROM 2))::INTEGER) FROM produk WHERE kode_produk ~ '^P[0-9]+$'),0))::TEXT,3,'0') AS kode
FROM produk WHERE kode_produk IS NULL
)
UPDATE produk p SET kode_produk=b.kode FROM bernomor b WHERE p.id=b.id;

DO $$
DECLARE n INTEGER;
BEGIN
SELECT COALESCE(MAX((substring(kode_supplier FROM 2))::INTEGER),0) INTO n FROM supplier WHERE kode_supplier ~ '^S[0-9]+$';
PERFORM setval('supplier_kode_seq',GREATEST(n,1),n>0);
SELECT COALESCE(MAX((substring(kode_produk FROM 2))::INTEGER),0) INTO n FROM produk WHERE kode_produk ~ '^P[0-9]+$';
PERFORM setval('produk_kode_seq',GREATEST(n,1),n>0);
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS supplier_kode_supplier_unique ON supplier(kode_supplier);
CREATE UNIQUE INDEX IF NOT EXISTS produk_kode_produk_unique ON produk(kode_produk);

CREATE OR REPLACE FUNCTION set_supplier_kode() RETURNS TRIGGER AS $$
BEGIN
IF NEW.kode_supplier IS NULL OR BTRIM(NEW.kode_supplier)='' THEN NEW.kode_supplier:='S'||LPAD(nextval('supplier_kode_seq')::TEXT,3,'0'); END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_produk_kode() RETURNS TRIGGER AS $$
BEGIN
IF NEW.kode_produk IS NULL OR BTRIM(NEW.kode_produk)='' THEN NEW.kode_produk:='P'||LPAD(nextval('produk_kode_seq')::TEXT,3,'0'); END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS supplier_kode_otomatis ON supplier;
CREATE TRIGGER supplier_kode_otomatis BEFORE INSERT ON supplier FOR EACH ROW EXECUTE FUNCTION set_supplier_kode();
DROP TRIGGER IF EXISTS produk_kode_otomatis ON produk;
CREATE TRIGGER produk_kode_otomatis BEFORE INSERT ON produk FOR EACH ROW EXECUTE FUNCTION set_produk_kode();
