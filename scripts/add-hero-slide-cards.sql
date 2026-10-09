-- Hero slide cards: title, per-part visibility, transition and duration.

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slide_transition AS ENUM ('fade', 'slide', 'none');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_hero
  ADD COLUMN IF NOT EXISTS slide_transition enum_site_blocks_hero_slide_transition DEFAULT 'fade';

ALTER TABLE site_blocks_hero
  ADD COLUMN IF NOT EXISTS slide_duration numeric DEFAULT 6;

ALTER TABLE site_blocks_hero
  ADD COLUMN IF NOT EXISTS show_slide_nav boolean DEFAULT true;

ALTER TABLE site_blocks_hero
  ADD COLUMN IF NOT EXISTS show_in_menu boolean DEFAULT true;

ALTER TABLE site_blocks_hero_slides ADD COLUMN IF NOT EXISTS visible boolean DEFAULT true;
ALTER TABLE site_blocks_hero_slides ADD COLUMN IF NOT EXISTS show_image boolean DEFAULT true;
ALTER TABLE site_blocks_hero_slides ADD COLUMN IF NOT EXISTS show_title boolean DEFAULT true;
ALTER TABLE site_blocks_hero_slides ADD COLUMN IF NOT EXISTS show_text boolean DEFAULT true;

ALTER TABLE site_blocks_hero_slides_locales ADD COLUMN IF NOT EXISTS title character varying;

ALTER TYPE enum_site_blocks_hero_slide_transition ADD VALUE IF NOT EXISTS 'slide-left';
ALTER TYPE enum_site_blocks_hero_slide_transition ADD VALUE IF NOT EXISTS 'rise';
ALTER TYPE enum_site_blocks_hero_slide_transition ADD VALUE IF NOT EXISTS 'zoom';

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slides_title_align AS ENUM ('left', 'center', 'right');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slides_text_align AS ENUM ('left', 'center', 'right');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS title_align enum_site_blocks_hero_slides_title_align DEFAULT 'center';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS text_align enum_site_blocks_hero_slides_text_align DEFAULT 'center';

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slides_text_align_y AS ENUM ('top', 'center', 'bottom');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS text_align_y enum_site_blocks_hero_slides_text_align_y DEFAULT 'bottom';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS title_color character varying;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS text_color character varying;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS show_cta boolean DEFAULT true;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS title_align_y enum_site_blocks_hero_slides_text_align_y DEFAULT 'bottom';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS title_size character varying DEFAULT 'lg';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS text_size character varying DEFAULT 'md';

ALTER TABLE site_locales
  ADD COLUMN IF NOT EXISTS search_placeholder character varying;

ALTER TABLE site_blocks_hero_slides_locales
  ADD COLUMN IF NOT EXISTS cta character varying;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS cta_align enum_site_blocks_hero_slides_title_align DEFAULT 'center';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS cta_align_y enum_site_blocks_hero_slides_text_align_y DEFAULT 'bottom';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS cta_size character varying DEFAULT 'md';

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS cta_color character varying;

ALTER TABLE site_blocks_hero_slides
  ADD COLUMN IF NOT EXISTS cta_page_id integer;

DO $$ BEGIN
  ALTER TABLE site_blocks_hero_slides
    ADD CONSTRAINT site_blocks_hero_slides_cta_page_id_pages_id_fk
    FOREIGN KEY (cta_page_id) REFERENCES pages(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
