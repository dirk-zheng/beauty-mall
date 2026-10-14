# Aurelia Pretty B2B SEO Strategy

## Positioning

Aurelia Pretty is a B2B beauty supply and product-development partner for retailers, distributors, e-commerce operators, gifting teams and private-label buyers. Public search pages should move qualified partners toward a product brief, sample or quotation request—not a consumer checkout.

## Primary Search Themes

- beauty products wholesale supplier
- skincare wholesale for retailers
- private label skincare partner
- color cosmetics wholesale
- private label makeup manufacturer
- fragrance wholesale supplier
- cosmetic product development partner
- low MOQ beauty private label
- custom beauty packaging
- beauty samples and wholesale quotation

Use these themes naturally. Avoid unsupported claims about certifications, clinical results, origin, sustainability, market approval, lowest pricing or guaranteed delivery.

## Route Intent

| Route | Search intent | Primary conversion |
| --- | --- | --- |
| `/` | Beauty B2B supplier discovery | Start a partnership inquiry |
| `/products` | Review the eight-product opening collection | Open a product / request samples |
| `/products/:id` | Evaluate a formula and format | Request quote and sample |
| `/contact` | Contact a beauty supplier | Submit partnership inquiry |
| `/about` | Brand and supplier qualification | Discuss a program |
| `/services/wholesale-private-label` | Wholesale and private-label sourcing | Share program requirements |
| `/services/skin-ritual` | Skincare assortment planning | Review skincare products |
| `/services/quality-and-care` | Formula, packaging and QC | Request technical details |
| `/news-blog/` | Beauty and buyer education | Read resource / contact team |
| `/faq` | Commercial qualification | Resolve questions / contact team |

Account, admin, RFQ and internal support routes remain `noindex`.

## Metadata and Structured Data

- Keep titles buyer-oriented and generally below 60 characters.
- Keep descriptions useful and generally between 140–160 characters.
- Use `Aurelia Pretty` as the site and Organization name.
- The canonical origin defaults to `https://www.aureliapretty.com` and can be overridden with `VITE_SITE_URL` / `SITE_URL`.
- Give every public product and article a unique canonical URL.
- Product schema uses `BusinessAudience` and additional properties for format, MOQ and lead time.
- Do not publish `Offer`, unit price, public availability or inventory until real commercial terms exist.
- Build FAQ schema only from published FAQs and Article schema from published editorial content.

## Content Program

Priority clusters:

1. Skincare assortment: barrier care, hydration, texture and routine architecture.
2. Modern color: shade planning, finish, assortment depth and inclusive testing.
3. Fragrance and body: scent direction, concentration, layering and gift formats.
4. Private label: formula brief, samples, packaging, labels, testing and approvals.
5. Production readiness: MOQ, lead-time factors, batch controls, documentation and shipping handoff.

Every article should answer a real partner question, link to a relevant product or capability, and finish with a B2B CTA.

## Preferred Conversion Language

- Request Quote & Sample
- Build a Partner Edit
- Discuss Your Beauty Program
- Request Product Details
- Talk to Partnership Support

Avoid consumer language such as Add to Cart, Shop Now, Free Shipping, Easy Returns or public sale pricing.

## Launch Checklist

- Set production `VITE_SITE_URL` and `SITE_URL` values.
- Replace or approve all concept product images before commercial launch.
- Confirm INCI, net contents, claims, warnings, label copy and market-specific compliance.
- Confirm MOQ, lead times, packaging options, testing scope and logistics with operations.
- Connect inquiry notifications to the real partnership inbox or CRM.
- Add analytics and Search Console ownership after the production domain is available.
- Submit `sitemap.xml` and verify robots, canonicals, Open Graph and JSON-LD.
