DO $$ BEGIN
  CREATE TYPE enum_site_blocks_extra_cards_image_shape AS ENUM ('square', 'oval', 'circle', 'portrait', 'landscape');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_extra_cards
  ADD COLUMN IF NOT EXISTS image_shape enum_site_blocks_extra_cards_image_shape DEFAULT 'landscape';
