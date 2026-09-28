-- Pages collection + new home section blocks. Additive except extra (old extra schema replaced).

DO $$ BEGIN CREATE TYPE enum_pages_status AS ENUM ('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum__pages_v_version_status AS ENUM ('draft', 'published'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum__pages_v_published_locale AS ENUM ('es', 'en'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum_site_blocks_extra_layout AS ENUM ('media', 'cards'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum_site_blocks_extra_image_align AS ENUM ('left', 'right'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE enum_site_blocks_extra_cards_image_align AS ENUM ('left', 'center', 'right'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS pages (
  id serial PRIMARY KEY,
  slug character varying,
  updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
  created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
  _status enum_pages_status DEFAULT 'draft'
);
CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages (slug);
CREATE INDEX IF NOT EXISTS pages_updated_at_idx ON pages (updated_at);
CREATE INDEX IF NOT EXISTS pages_created_at_idx ON pages (created_at);
CREATE INDEX IF NOT EXISTS pages__status_idx ON pages (_status);

CREATE TABLE IF NOT EXISTS pages_locales (
  title character varying,
  body jsonb,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id integer NOT NULL,
  CONSTRAINT pages_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT pages_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES pages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS _pages_v (
  id serial PRIMARY KEY,
  parent_id integer REFERENCES pages(id) ON DELETE SET NULL,
  version_slug character varying,
  version_updated_at timestamp(3) with time zone,
  version_created_at timestamp(3) with time zone,
  version__status enum__pages_v_version_status DEFAULT 'draft',
  created_at timestamp(3) with time zone NOT NULL DEFAULT now(),
  updated_at timestamp(3) with time zone NOT NULL DEFAULT now(),
  snapshot boolean,
  published_locale enum__pages_v_published_locale,
  latest boolean
);
CREATE INDEX IF NOT EXISTS _pages_v_parent_idx ON _pages_v (parent_id);
CREATE INDEX IF NOT EXISTS _pages_v_version_version_slug_idx ON _pages_v (version_slug);
CREATE INDEX IF NOT EXISTS _pages_v_created_at_idx ON _pages_v (created_at);
CREATE INDEX IF NOT EXISTS _pages_v_updated_at_idx ON _pages_v (updated_at);
CREATE INDEX IF NOT EXISTS _pages_v_latest_idx ON _pages_v (latest);

CREATE TABLE IF NOT EXISTS _pages_v_locales (
  version_title character varying,
  version_body jsonb,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id integer NOT NULL,
  CONSTRAINT _pages_v_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT _pages_v_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES _pages_v(id) ON DELETE CASCADE
);

ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS pages_id integer;
CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_pages_id_idx ON payload_locked_documents_rels (pages_id);
DO $$ BEGIN
  ALTER TABLE payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pages_fk
    FOREIGN KEY (pages_id) REFERENCES pages(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS site_blocks_hero (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  show_title boolean DEFAULT true,
  show_lead boolean DEFAULT true,
  show_cta boolean DEFAULT true,
  show_search boolean DEFAULT true,
  show_image boolean DEFAULT true,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_hero_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_hero_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_hero_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_hero_order_idx ON site_blocks_hero (_order);
CREATE INDEX IF NOT EXISTS site_blocks_hero_parent_id_idx ON site_blocks_hero (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_hero_path_idx ON site_blocks_hero (_path);
CREATE INDEX IF NOT EXISTS site_blocks_hero_image_idx ON site_blocks_hero (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_hero_locales (
  title character varying NOT NULL,
  lead character varying,
  cta character varying NOT NULL,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_hero_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_hero_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_hero(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_carousel (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  show_title boolean DEFAULT true,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_carousel_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_carousel_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_carousel_order_idx ON site_blocks_carousel (_order);
CREATE INDEX IF NOT EXISTS site_blocks_carousel_parent_id_idx ON site_blocks_carousel (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_carousel_path_idx ON site_blocks_carousel (_path);

CREATE TABLE IF NOT EXISTS site_blocks_carousel_locales (
  title character varying,
  lead character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_carousel_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_carousel_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_carousel(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_about (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  show_title boolean DEFAULT true,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_about_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_about_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_about_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_about_order_idx ON site_blocks_about (_order);
CREATE INDEX IF NOT EXISTS site_blocks_about_parent_id_idx ON site_blocks_about (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_about_path_idx ON site_blocks_about (_path);
CREATE INDEX IF NOT EXISTS site_blocks_about_image_idx ON site_blocks_about (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_about_locales (
  title character varying,
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_about_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_about_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_about(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_faq (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  show_title boolean DEFAULT true,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_faq_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_faq_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_faq_order_idx ON site_blocks_faq (_order);
CREATE INDEX IF NOT EXISTS site_blocks_faq_parent_id_idx ON site_blocks_faq (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_faq_path_idx ON site_blocks_faq (_path);

CREATE TABLE IF NOT EXISTS site_blocks_faq_locales (
  title character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_faq_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_faq_faqs (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_faqs_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_faq_faqs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_faq_faqs_order_idx ON site_blocks_faq_faqs (_order);
CREATE INDEX IF NOT EXISTS site_blocks_faq_faqs_parent_id_idx ON site_blocks_faq_faqs (_parent_id);

CREATE TABLE IF NOT EXISTS site_blocks_faq_faqs_locales (
  question character varying NOT NULL,
  answer character varying NOT NULL,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_faqs_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_faq_faqs_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq_faqs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_talk_to_us (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  show_title boolean DEFAULT true,
  show_text boolean DEFAULT true,
  show_button boolean DEFAULT true,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_talk_to_us_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_talk_to_us_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_talk_to_us_order_idx ON site_blocks_talk_to_us (_order);
CREATE INDEX IF NOT EXISTS site_blocks_talk_to_us_parent_id_idx ON site_blocks_talk_to_us (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_talk_to_us_path_idx ON site_blocks_talk_to_us (_path);

CREATE TABLE IF NOT EXISTS site_blocks_talk_to_us_locales (
  title character varying,
  text character varying,
  button character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_talk_to_us_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_talk_to_us_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_talk_to_us(id) ON DELETE CASCADE
);

ALTER TABLE site_locales ALTER COLUMN hero_title DROP NOT NULL;
ALTER TABLE site_locales ALTER COLUMN hero_cta DROP NOT NULL;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS show_title boolean DEFAULT true;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS layout enum_site_blocks_extra_layout DEFAULT 'media';
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS show_image boolean DEFAULT true;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS image_align enum_site_blocks_extra_image_align DEFAULT 'left';
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS show_subtitle boolean DEFAULT true;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS show_text boolean DEFAULT true;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS show_button boolean DEFAULT true;
ALTER TABLE site_blocks_extra ADD COLUMN IF NOT EXISTS button_page_id integer;
CREATE INDEX IF NOT EXISTS site_blocks_extra_button_page_idx ON site_blocks_extra (button_page_id);
DO $$ BEGIN
  ALTER TABLE site_blocks_extra
    ADD CONSTRAINT site_blocks_extra_button_page_id_pages_id_fk
    FOREIGN KEY (button_page_id) REFERENCES pages(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE site_blocks_extra_locales ADD COLUMN IF NOT EXISTS subtitle character varying;

CREATE TABLE IF NOT EXISTS site_blocks_extra_cards (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  show_image boolean DEFAULT true,
  image_align enum_site_blocks_extra_cards_image_align DEFAULT 'left',
  show_subtitle boolean DEFAULT true,
  show_text boolean DEFAULT true,
  show_footer boolean DEFAULT true,
  show_button boolean DEFAULT true,
  button_page_id integer,
  CONSTRAINT site_blocks_extra_cards_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_extra_cards_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_extra(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_extra_cards_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL,
  CONSTRAINT site_blocks_extra_cards_button_page_id_pages_id_fk FOREIGN KEY (button_page_id) REFERENCES pages(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_extra_cards_order_idx ON site_blocks_extra_cards (_order);
CREATE INDEX IF NOT EXISTS site_blocks_extra_cards_parent_id_idx ON site_blocks_extra_cards (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_extra_cards_image_idx ON site_blocks_extra_cards (image_id);
CREATE INDEX IF NOT EXISTS site_blocks_extra_cards_button_page_idx ON site_blocks_extra_cards (button_page_id);

CREATE TABLE IF NOT EXISTS site_blocks_extra_cards_locales (
  subtitle character varying,
  text character varying,
  footer character varying,
  button_label character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_extra_cards_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_extra_cards_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_extra_cards(id) ON DELETE CASCADE
);
