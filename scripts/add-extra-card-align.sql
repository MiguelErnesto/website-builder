ALTER TABLE site_blocks_extra_cards
  ADD COLUMN IF NOT EXISTS subtitle_align enum_site_blocks_extra_cards_text_align DEFAULT 'left';

ALTER TABLE site_blocks_extra_cards
  ADD COLUMN IF NOT EXISTS footer_align enum_site_blocks_extra_cards_text_align DEFAULT 'left';
