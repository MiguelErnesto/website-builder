DO $$
DECLARE
  labels text[] := ARRAY[
    'inter',
    'poppins',
    'raleway',
    'work-sans',
    'dm-sans',
    'figtree',
    'outfit',
    'manrope',
    'merriweather',
    'lora',
    'libre-baskerville',
    'cormorant',
    'fraunces',
    'eb-garamond'
  ];
  label text;
  typ name;
BEGIN
  FOREACH typ IN ARRAY ARRAY['enum_site_font_primary', 'enum_site_font_secondary'] LOOP
    FOREACH label IN ARRAY labels LOOP
      IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON t.oid = e.enumtypid
        WHERE t.typname = typ AND e.enumlabel = label
      ) THEN
        EXECUTE format('ALTER TYPE %I ADD VALUE %L', typ, label);
      END IF;
    END LOOP;
  END LOOP;
END $$;
