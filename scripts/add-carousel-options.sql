ALTER TABLE site_blocks_carousel ADD COLUMN IF NOT EXISTS show_lead boolean DEFAULT false;
ALTER TABLE site_blocks_carousel ADD COLUMN IF NOT EXISTS show_featured boolean DEFAULT true;
ALTER TABLE site_blocks_carousel ADD COLUMN IF NOT EXISTS show_promo boolean DEFAULT true;
ALTER TABLE site_blocks_carousel ADD COLUMN IF NOT EXISTS show_all boolean DEFAULT true;

UPDATE site_blocks_carousel SET show_title = false WHERE show_title IS DISTINCT FROM false;
