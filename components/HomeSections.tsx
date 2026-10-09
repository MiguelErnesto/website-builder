import type { CSSProperties } from 'react'

import { FaqList } from '@/components/FaqList'
import { FeaturedCarousel } from '@/components/FeaturedCarousel'
import { HeroSlides } from '@/components/HeroSlides'
import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'
import type { ExtraCard, HomeSection } from '@/lib/sections'
import type { OfferCardProps } from '@/components/OfferCard'

type CarouselItem = Pick<
  OfferCardProps,
  'slug' | 'title' | 'price' | 'image' | 'kind' | 'description' | 'featured' | 'promo'
> & { id: string }

type HomeSectionsProps = {
  locale: Locale
  sections: HomeSection[]
  carouselItems: CarouselItem[]
  ctaHref: string
  heroEm: string
}

function ExtraButton({
  show,
  href,
  label,
  className = 'flux-btn',
}: {
  show: boolean
  href: string | null
  label: string
  className?: string
}) {
  if (!show || !href || !label) return null
  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

function ExtraCardView({ card, beside }: { card: ExtraCard; beside?: boolean }) {
  const held = (show: boolean) => (show ? '' : ' is-held')
  const image = card.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={`extra-card-img--${card.imageShape}${held(card.showImage)}`} src={card.image} alt="" />
  ) : null
  const subtitle = card.subtitle ? (
    <h3 className={`extra-card-subtitle--${card.subtitleAlign}${held(card.showSubtitle)}`}>{card.subtitle}</h3>
  ) : null
  const text = card.text ? (
    <p className={`extra-card-text extra-card-text--${card.textAlign}${held(card.showText)}`}>{card.text}</p>
  ) : null
  const footer = card.footer ? (
    <p className={`extra-card-footer extra-card-footer--${card.footerAlign}${held(card.showFooter)}`}>{card.footer}</p>
  ) : null
  const button =
    card.buttonLabel && card.buttonHref ? (
      <div className={`extra-card-btn extra-card-btn--${card.buttonAlign}${held(card.showButton)}`}>
        <ExtraButton show href={card.buttonHref} label={card.buttonLabel} />
      </div>
    ) : null
  const copy = subtitle || text || footer || button ? (
    <div className="extra-card-copy">
      {subtitle}
      {text}
      {footer}
      {button}
    </div>
  ) : null
  const side = Boolean(beside && image && copy)
  return (
    <li className={`extra-card extra-card--${card.imageAlign} extra-card--y-${card.imageAlignY}${side ? ' extra-card--beside' : ''}`}>
      {side ? (
        <div className="extra-card-media">
          {image}
          {copy}
        </div>
      ) : (
        <>
          {image}
          {subtitle}
          {text}
          {footer}
          {button}
        </>
      )}
    </li>
  )
}

export function HomeSections({ locale, sections, carouselItems, ctaHref }: HomeSectionsProps) {
  const t = getMessages(locale)

  return (
    <>
      {sections.map((section) => {
        if (section.type === 'hero') {
          if (!section.slides.length) return null
          return (
            <section key={section.id} id={section.id} className="hero">
              <HeroSlides
                slides={section.slides}
                transition={section.slideTransition}
                duration={section.slideDuration}
                locale={locale}
                showNav={section.showSlideNav}
              />
            </section>
          )
        }

        if (section.type === 'carousel') {
          return (
            <div key={section.id}>
              {(section.showTitle && section.title) || (section.showLead && section.lead) ? (
                <div className="band-head featured-copy">
                  {section.showTitle && section.title ? (
                    <h2 id={`${section.id}-titulo`} className="band-title">
                      {section.title}
                    </h2>
                  ) : null}
                  {section.showLead && section.lead ? <p className="band-lead">{section.lead}</p> : null}
                </div>
              ) : null}
              <FeaturedCarousel
                locale={locale}
                items={carouselItems}
                featuredHref={`/${locale}/ofertas?destacados=1`}
                promoHref={`/${locale}/ofertas?promocion=1`}
                allHref={`/${locale}/ofertas`}
                sectionId={section.id}
                showFeatured={section.showFeatured}
                showPromo={section.showPromo}
                showAll={section.showAll}
              />
            </div>
          )
        }

        if (section.type === 'about') {
          return (
            <section key={section.id} id={section.id} className="about about--stack" aria-labelledby={`${section.id}-titulo`}>
              <div className="about-copy">
                {section.showTitle ? (
                  <h2 id={`${section.id}-titulo`} className="band-title">
                    {section.title}
                  </h2>
                ) : (
                  <h2 id={`${section.id}-titulo`} className="sr-only">
                    {section.title || t.about}
                  </h2>
                )}
                {section.text ? <p className="about-lead">{section.text}</p> : null}
              </div>
              {section.cards.length ? (
                <div className={`about-visual about-visual--cards${section.circleImages ? ' about-visual--circles' : ''}`}>
                  {section.cards.map((card, index) => (
                    <article key={`${section.id}-card-${index}`} className="about-card">
                      {card.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.image} alt="" />
                      ) : (
                        <div className="about-card-ph" aria-hidden="true" />
                      )}
                      {card.title ? <h3>{card.title}</h3> : null}
                      {card.text ? <p>{card.text}</p> : null}
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          )
        }

        if (section.type === 'faq') {
          if (!section.faqs.length) return null
          return (
            <section key={section.id} id={section.id} className="band" aria-labelledby={`${section.id}-titulo`}>
              <div className="band-head">
                {section.showTitle ? (
                  <h2 id={`${section.id}-titulo`} className="band-title">
                    {section.title}
                  </h2>
                ) : (
                  <h2 id={`${section.id}-titulo`} className="sr-only">
                    {section.title || t.faq}
                  </h2>
                )}
              </div>
              <FaqList items={section.faqs} />
            </section>
          )
        }

        if (section.type === 'talkToUs') {
          if (!section.showTitle && !section.showText && !section.showButton) return null
          return (
            <section key={section.id} id={section.id} className="cta-band" aria-labelledby={`${section.id}-titulo`}>
              {section.showTitle ? (
                <h2 id={`${section.id}-titulo`} className="cta-title">
                  {section.title}
                </h2>
              ) : (
                <h2 id={`${section.id}-titulo`} className="sr-only">
                  {section.title || t.contact}
                </h2>
              )}
              {section.showText && section.text ? <p className="cta-text">{section.text}</p> : null}
              {section.showButton && section.button ? (
                <a href={ctaHref} className="flux-btn flux-btn--xl">
                  {section.button}
                </a>
              ) : null}
            </section>
          )
        }

        if (section.layout === 'cards') {
          return (
            <section
              key={section.id}
              id={section.id}
              className="band extra-section"
              aria-labelledby={section.title ? `${section.id}-titulo` : undefined}
            >
              {section.showTitle && section.title ? (
                <div className="band-head">
                  <h2 id={`${section.id}-titulo`} className="band-title">
                    {section.title}
                  </h2>
                </div>
              ) : null}
              <ul className="extra-cards" style={{ '--cards-across': section.cardsPerRow } as CSSProperties}>
                {section.cards.map((card, index) => (
                  <ExtraCardView key={`${section.id}-${index}`} card={card} beside={section.cardsPerRow === 1} />
                ))}
              </ul>
            </section>
          )
        }

        return (
          <section
            key={section.id}
            id={section.id}
            className={`about extra-section extra-section--${section.imageAlign}`}
            aria-labelledby={section.title ? `${section.id}-titulo` : undefined}
          >
            {section.showImage && section.image ? (
              <div className="about-visual">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={section.image} alt="" />
              </div>
            ) : null}
            <div className="about-copy">
              {section.showTitle && section.title ? (
                <h2 id={`${section.id}-titulo`} className="band-title">
                  {section.title}
                </h2>
              ) : null}
              {section.showSubtitle && section.subtitle ? <h3>{section.subtitle}</h3> : null}
              {section.showText && section.text ? <p>{section.text}</p> : null}
              <ExtraButton show={section.showButton} href={section.buttonHref} label={section.buttonLabel} />
            </div>
          </section>
        )
      })}
    </>
  )
}
