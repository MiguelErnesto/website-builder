-- Hero: optional title/cta, CTA link, search placeholder, slides.
-- About: circle images + cards.

ALTER TABLE site_blocks_hero_locales ALTER COLUMN title DROP NOT NULL;
ALTER TABLE site_blocks_hero_locales ALTER COLUMN cta DROP NOT NULL;

ALTER TABLE site_blocks_hero ADD COLUMN IF NOT EXISTS cta_page_id integer;
ALTER TABLE site_blocks_hero ADD COLUMN IF NOT EXISTS cta_href character varying;

CREATE INDEX IF NOT EXISTS site_blocks_hero_cta_page_idx ON site_blocks_hero (cta_page_id);

DO $$ BEGIN
  ALTER TABLE site_blocks_hero
    ADD CONSTRAINT site_blocks_hero_cta_page_id_pages_id_fk
    FOREIGN KEY (cta_page_id) REFERENCES pages(id) ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_hero_locales ADD COLUMN IF NOT EXISTS search_placeholder character varying;

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slides_text_x AS ENUM ('left', 'center', 'right');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE enum_site_blocks_hero_slides_text_y AS ENUM ('top', 'center', 'bottom');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS site_blocks_hero_slides (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  text_x enum_site_blocks_hero_slides_text_x DEFAULT 'center',
  text_y enum_site_blocks_hero_slides_text_y DEFAULT 'center',
  CONSTRAINT site_blocks_hero_slides_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_hero_slides_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_hero(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_hero_slides_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_hero_slides_order_idx ON site_blocks_hero_slides (_order);
CREATE INDEX IF NOT EXISTS site_blocks_hero_slides_parent_id_idx ON site_blocks_hero_slides (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_hero_slides_image_idx ON site_blocks_hero_slides (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_hero_slides_locales (
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_hero_slides_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_hero_slides_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_hero_slides(id) ON DELETE CASCADE
);

ALTER TABLE site_blocks_about ADD COLUMN IF NOT EXISTS circle_images boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS site_blocks_about_cards (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  CONSTRAINT site_blocks_about_cards_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_about_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_about(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_about_cards_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_about_cards_order_idx ON site_blocks_about_cards (_order);
CREATE INDEX IF NOT EXISTS site_blocks_about_cards_parent_id_idx ON site_blocks_about_cards (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_about_cards_image_idx ON site_blocks_about_cards (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_about_cards_locales (
  title character varying,
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_about_cards_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_about_cards_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_about_cards(id) ON DELETE CASCADE
);
