-- Additive: Payload blocks tables for global Sitio (sections).
-- Safe to re-run (IF NOT EXISTS). Does not drop or rename existing tables.

CREATE TABLE IF NOT EXISTS site_blocks_oferta (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_oferta_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_oferta_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_oferta_order_idx ON site_blocks_oferta (_order);
CREATE INDEX IF NOT EXISTS site_blocks_oferta_parent_id_idx ON site_blocks_oferta (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_oferta_path_idx ON site_blocks_oferta (_path);

CREATE TABLE IF NOT EXISTS site_blocks_oferta_locales (
  title character varying,
  lead character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_oferta_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_oferta_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_oferta(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_valor (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_valor_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_valor_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_valor_order_idx ON site_blocks_valor (_order);
CREATE INDEX IF NOT EXISTS site_blocks_valor_parent_id_idx ON site_blocks_valor (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_valor_path_idx ON site_blocks_valor (_path);

CREATE TABLE IF NOT EXISTS site_blocks_valor_locales (
  title character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_valor_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_valor_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_valor(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_valor_benefits (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  CONSTRAINT site_blocks_valor_benefits_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_valor_benefits_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_valor(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_valor_benefits_order_idx ON site_blocks_valor_benefits (_order);
CREATE INDEX IF NOT EXISTS site_blocks_valor_benefits_parent_id_idx ON site_blocks_valor_benefits (_parent_id);

CREATE TABLE IF NOT EXISTS site_blocks_valor_benefits_locales (
  title character varying NOT NULL,
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_valor_benefits_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_valor_benefits_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_valor_benefits(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_confianza (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_confianza_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_confianza_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_order_idx ON site_blocks_confianza (_order);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_parent_id_idx ON site_blocks_confianza (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_path_idx ON site_blocks_confianza (_path);

CREATE TABLE IF NOT EXISTS site_blocks_confianza_locales (
  title character varying,
  cases_title character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_confianza_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_confianza_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_confianza(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_confianza_testimonials (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  name character varying NOT NULL,
  CONSTRAINT site_blocks_confianza_testimonials_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_confianza_testimonials_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_confianza(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_testimonials_order_idx ON site_blocks_confianza_testimonials (_order);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_testimonials_parent_id_idx ON site_blocks_confianza_testimonials (_parent_id);

CREATE TABLE IF NOT EXISTS site_blocks_confianza_testimonials_locales (
  quote character varying NOT NULL,
  role character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_confianza_testimonials_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_confianza_testimonials_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_confianza_testimonials(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_confianza_cases (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  CONSTRAINT site_blocks_confianza_cases_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_confianza_cases_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_confianza(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_confianza_cases_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_cases_order_idx ON site_blocks_confianza_cases (_order);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_cases_parent_id_idx ON site_blocks_confianza_cases (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_confianza_cases_image_idx ON site_blocks_confianza_cases (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_confianza_cases_locales (
  title character varying NOT NULL,
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_confianza_cases_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_confianza_cases_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_confianza_cases(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_nosotros (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_nosotros_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_nosotros_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_nosotros_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_nosotros_order_idx ON site_blocks_nosotros (_order);
CREATE INDEX IF NOT EXISTS site_blocks_nosotros_parent_id_idx ON site_blocks_nosotros (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_nosotros_path_idx ON site_blocks_nosotros (_path);
CREATE INDEX IF NOT EXISTS site_blocks_nosotros_image_idx ON site_blocks_nosotros (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_nosotros_locales (
  title character varying,
  text character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_nosotros_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_nosotros_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_nosotros(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_faq_cierre (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_faq_cierre_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_faq_cierre_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_faq_cierre_order_idx ON site_blocks_faq_cierre (_order);
CREATE INDEX IF NOT EXISTS site_blocks_faq_cierre_parent_id_idx ON site_blocks_faq_cierre (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_faq_cierre_path_idx ON site_blocks_faq_cierre (_path);

CREATE TABLE IF NOT EXISTS site_blocks_faq_cierre_locales (
  faq_title character varying,
  cta_title character varying,
  cta_text character varying,
  cta_button character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_cierre_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_faq_cierre_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq_cierre(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_faq_cierre_faqs (
  _order integer NOT NULL,
  _parent_id character varying NOT NULL,
  id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_cierre_faqs_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_faq_cierre_faqs_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq_cierre(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS site_blocks_faq_cierre_faqs_order_idx ON site_blocks_faq_cierre_faqs (_order);
CREATE INDEX IF NOT EXISTS site_blocks_faq_cierre_faqs_parent_id_idx ON site_blocks_faq_cierre_faqs (_parent_id);

CREATE TABLE IF NOT EXISTS site_blocks_faq_cierre_faqs_locales (
  question character varying NOT NULL,
  answer character varying NOT NULL,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_faq_cierre_faqs_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_faq_cierre_faqs_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_faq_cierre_faqs(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS site_blocks_extra (
  _order integer NOT NULL,
  _parent_id integer NOT NULL,
  _path text NOT NULL,
  id character varying NOT NULL,
  image_id integer,
  button_href character varying,
  visible boolean DEFAULT true,
  block_name character varying,
  CONSTRAINT site_blocks_extra_pkey PRIMARY KEY (id),
  CONSTRAINT site_blocks_extra_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site(id) ON DELETE CASCADE,
  CONSTRAINT site_blocks_extra_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES media(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS site_blocks_extra_order_idx ON site_blocks_extra (_order);
CREATE INDEX IF NOT EXISTS site_blocks_extra_parent_id_idx ON site_blocks_extra (_parent_id);
CREATE INDEX IF NOT EXISTS site_blocks_extra_path_idx ON site_blocks_extra (_path);
CREATE INDEX IF NOT EXISTS site_blocks_extra_image_idx ON site_blocks_extra (image_id);

CREATE TABLE IF NOT EXISTS site_blocks_extra_locales (
  title character varying,
  text character varying,
  button_label character varying,
  id serial PRIMARY KEY,
  _locale _locales NOT NULL,
  _parent_id character varying NOT NULL,
  CONSTRAINT site_blocks_extra_locales_locale_parent_id_unique UNIQUE (_locale, _parent_id),
  CONSTRAINT site_blocks_extra_locales_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES site_blocks_extra(id) ON DELETE CASCADE
);
