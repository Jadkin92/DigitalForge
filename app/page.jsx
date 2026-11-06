'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    const pages = ['home', 'services', 'portfolio', 'about', 'contract-ba'];
    const navLinks = document.getElementById('navLinks');
    const menuBtn = document.getElementById('menuBtn');

    function route() {
      let key = (window.location.hash || '#home').replace('#', '');
      if (key === 'contact') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (!pages.includes(key)) key = 'home';

      document.querySelectorAll('.page').forEach((p) => {
        p.classList.toggle('active', p.id === `page-${key}`);
      });

      document.querySelectorAll('[data-link]').forEach((a) => {
        a.classList.toggle('active', a.dataset.link === key);
      });

      navLinks?.classList.remove('open');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    window.addEventListener('hashchange', route);
    route();

    menuBtn?.addEventListener('click', () => navLinks?.classList.toggle('open'));
    document.getElementById('year').textContent = new Date().getFullYear();

    document.querySelectorAll('#filters .filter').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#filters .filter').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });

        const filter = btn.dataset.filter;
        document.querySelectorAll('#projectGrid .project').forEach((card) => {
          card.style.display = filter === 'all' || card.dataset.cat === filter ? '' : 'none';
        });
      });
    });

    const fields = {
      topic: {
        wrap: 'f-topic',
        el: document.getElementById('topic'),
        test: (v) => v !== '',
      },
      name: {
        wrap: 'f-name',
        el: document.getElementById('name'),
        test: (v) => v.trim().length >= 2,
      },
      email: {
        wrap: 'f-email',
        el: document.getElementById('email'),
        test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
      },
      phone: {
        wrap: 'f-phone',
        el: document.getElementById('phone'),
        test: (v) => /^[+()\d\s-]{7,20}$/.test(v.trim()) && (v.replace(/\D/g, '').length >= 7),
      },
      message: {
        wrap: 'f-message',
        el: document.getElementById('message'),
        test: (v) => v.trim().length >= 10,
      },
    };

    function validateField(key) {
      const field = fields[key];
      const ok = field.test(field.el.value);
      document.getElementById(field.wrap)?.classList.toggle('invalid', !ok);
      return ok;
    }

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      const eventName = field.el.tagName === 'SELECT' ? 'change' : 'input';
      field.el.addEventListener(eventName, () => {
        if (document.getElementById(field.wrap)?.classList.contains('invalid')) {
          validateField(key);
        }
      });
      field.el.addEventListener('blur', () => {
        if (field.el.value) {
          validateField(key);
        }
      });
    });

    const form = document.getElementById('contactForm');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      let firstInvalid = null;

      Object.keys(fields).forEach((key) => {
        const ok = validateField(key);
        if (!ok && !firstInvalid) {
          firstInvalid = fields[key].el;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const payload = {
        topic: fields.topic.el.value,
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        phone: fields.phone.el.value.trim(),
        message: fields.message.el.value.trim(),
        submittedAt: new Date().toISOString(),
      };

      const FORM_ENDPOINT = '';

      try {
        if (FORM_ENDPOINT) {
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Request failed');
        } else {
          await new Promise((resolve) => setTimeout(resolve, 900));
          console.log('Contact request (demo mode):', payload);
        }

        document.getElementById('formBody')?.classList.add('hide');
        document.getElementById('successMsg')?.classList.add('show');
        form.reset();
      } catch (error) {
        showToast('Something went wrong. Please try again or email us directly.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Request';
      }
    });

    document.getElementById('resetBtn')?.addEventListener('click', () => {
      document.getElementById('successMsg')?.classList.remove('show');
      document.getElementById('formBody')?.classList.remove('hide');
    });

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);
    }

    return () => {
      window.removeEventListener('hashchange', route);
    };
  }, []);

  return (
    <>
      <header>
        <div className="container nav">
          <a href="#home" className="brand" aria-label="The Digital Forge home">
            <img src="/Images/Logo.png" alt="The Digital Forge logo" className="brand-logo" />
            <span>THE DIGITAL FORGE</span>
          </a>
          <nav>
            <button className="menu-btn" id="menuBtn" aria-label="Toggle menu">
              &#9776;
            </button>
            <div className="nav-links" id="navLinks">
              <a href="#home" data-link="home">Home</a>
              <a href="#services" data-link="services">Services</a>
              <a href="#portfolio" data-link="portfolio">Portfolio</a>
              <a href="#about" data-link="about">Digital Forge</a>
              <a href="#contract-ba" data-link="contract-ba">Contract BA Work</a>
              <a href="#contact" className="nav-cta">Get in Touch</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <div className="page active" id="page-home">
          <section className="hero">
            <div className="container">
              <span className="eyebrow">Digital Services &middot; Operational Efficiency &middot; Software Delivery</span>
              <h1>
                Build smarter. Run leaner.<br />
                <span>Forged for growth.</span>
              </h1>
              <p className="lead" style={{ marginTop: '22px' }}>
                The Digital Forge helps small and medium businesses look credible online, run more efficiently and manage customers with purpose-built tools. We also supply experienced Business Analysts to FinTech organisations that need delivery certainty.
              </p>
              <div className="btn-row">
                <a href="#services" className="btn">Explore Services</a>
                <a href="#contact" className="btn btn-ghost">Start a Conversation</a>
              </div>
              <div className="stats">
                <div className="stat">
                  <strong>8+ yrs</strong>
                  <span>Software delivery &amp; analysis</span>
                </div>
                <div className="stat">
                  <strong>Financial Services</strong>
                  <span>Tech &amp; operations depth</span>
                </div>
                <div className="stat">
                  <strong>End-to-end</strong>
                  <span>From discovery to live</span>
                </div>
              </div>
            </div>
          </section>

          <section className="band">
            <div className="container">
              <div className="section-head center">
                <span className="eyebrow">Two Disciplines, One Forge</span>
                <h2>Where digital services meet rigorous analysis</h2>
                <p className="lead">
                  Whether you are a local business ready to modernise or a FinTech delivery team needing a seasoned analyst, we bring the same discipline: understand the problem properly, then build the right thing.
                </p>
              </div>
              <div className="grid grid-2">
                <div className="card">
                  <div className="icon">
                    <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></svg>
                  </div>
                  <h3>For Small &amp; Medium Businesses</h3>
                  <p>Professional websites, operational improvements, tech implementation and a subscription SaaS platform for customer management, bookings, simple invoicing and communication.</p>
                  <div className="btn-row"><a href="#services" className="btn btn-ghost">View Business Services</a></div>
                </div>
                <div className="card">
                  <div className="icon cyan">
                    <svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>
                  </div>
                  <h3>For FinTech Organisations</h3>
                  <p>Contract Business Analysis for payments, lending, wealth, banking and regulated financial services. Requirements, process design, data analysis and delivery support.</p>
                  <div className="btn-row"><a href="#contract-ba" className="btn btn-ghost">Contract BA Work</a></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">How We Work</span>
                <h2>A clear path from idea to impact</h2>
              </div>
              <div className="grid grid-4">
                <div className="step"><div className="num">01</div><h3>Discover</h3><p>We map your current processes, customers and pain points before proposing anything.</p></div>
                <div className="step"><div className="num">02</div><h3>Design</h3><p>Requirements, user journeys and a practical scope agreed with you in plain language.</p></div>
                <div className="step"><div className="num">03</div><h3>Build</h3><p>Iterative delivery with regular demos, so you see progress and can steer early.</p></div>
                <div className="step"><div className="num">04</div><h3>Improve</h3><p>Launch, measure and refine. Ongoing support and optimisation as you grow.</p></div>
              </div>
            </div>
          </section>

          <section className="band">
            <div className="container cta">
              <h2>Ready to sharpen your digital edge?</h2>
              <p>Tell us a little about your business or your project and we will respond within one working day.</p>
              <div className="btn-row" style={{ justifyContent: 'center' }}><a href="#contact" className="btn">Get in Touch</a></div>
            </div>
          </section>
        </div>

        <div className="page" id="page-services">
          <section className="hero" style={{ padding: '30px 0 70px' }}>
            <div className="container">
              <span className="eyebrow">Services</span>
              <h1>Digital capability for <span>every stage of growth</span></h1>
              <p className="lead" style={{ marginTop: '20px' }}>From a first professional website to a fully managed customer and booking platform, we design and deliver solutions that remove manual work and make your business easier to run.</p>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Web &amp; Digital</span>
                <h2>Websites that work as hard as you do</h2>
              </div>
              <div className="grid grid-3">
                <div className="card">
                  <div className="icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg></div>
                  <h3>Website Design &amp; Build</h3>
                  <p>Responsive, fast and search-friendly websites designed around your customers.</p>
                  <ul><li>Custom responsive design</li><li>SEO foundations &amp; analytics</li><li>Contact &amp; enquiry forms</li><li>Hosting and handover support</li></ul>
                </div>
                <div className="card">
                  <div className="icon"><svg viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z" /><path d="M12 22V12M21 7l-9 5-9-5" /></svg></div>
                  <h3>Operational Improvement</h3>
                  <p>A Business Analyst's view of how work flows through your business, and where it leaks time and money.</p>
                  <ul><li>Process mapping &amp; review</li><li>Workflow automation</li><li>Data quality &amp; reporting</li><li>Practical roadmaps</li></ul>
                </div>
                <div className="card">
                  <div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M4 4h16v12H4zM8 20h8M12 16v4" /></svg></div>
                  <h3>Tech Implementation</h3>
                  <p>Selecting, configuring and integrating the right tools so they actually get used.</p>
                  <ul><li>Tool selection &amp; configuration</li><li>System integration</li><li>Staff onboarding</li><li>Ongoing support</li></ul>
                </div>
              </div>
            </div>
          </section>

          <section className="band">
            <div className="container">
              <div className="split">
                <div>
                  <span className="eyebrow">SaaS Subscription</span>
                  <h2>Forge Client Hub</h2>
                  <p className="lead">A subscription application designed for small service businesses to manage their customers, take bookings and keep invoicing and communication in one simple place.</p>
                  <div style={{ marginTop: '22px' }}>
                    <span className="tag">Customer management</span><span className="tag">Online booking</span><span className="tag">Simple invoicing</span><span className="tag">Client communication</span>
                  </div>
                  <div className="btn-row"><a href="#contact" className="btn">Request a Demo</a></div>
                </div>
                <div className="card">
                  <h3>Included in the platform</h3>
                  <ul>
                    <li>Customer profiles and contact history</li>
                    <li>Appointment and booking calendar</li>
                    <li>Automated reminders and confirmations</li>
                    <li>Simple invoice creation and tracking</li>
                    <li>Centralised client messaging</li>
                    <li>Monthly subscription, no long-term lock-in</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Plans &amp; Pricing</span>
                <h2>Start small, scale when you are ready</h2>
                <p className="lead">Final pricing is confirmed after a short discovery call. These tiers show how engagements typically scope.</p>
              </div>
              <div className="grid grid-3">
                <div className="card">
                  <h3>Starter Website</h3>
                  <p>A professional, mobile-friendly site for a new or growing business.</p>
                  <ul><li>Up to 5 pages</li><li>Contact form</li><li>Basic SEO setup</li></ul>
                </div>
                <div className="card" style={{ borderColor: 'rgba(255,122,26,.55)' }}>
                  <h3>Growth Package</h3>
                  <p>Website plus an operational review and one tool implementation.</p>
                  <ul><li>Everything in Starter</li><li>Process review &amp; roadmap</li><li>One system integration</li></ul>
                </div>
                <div className="card">
                  <h3>Forge Client Hub</h3>
                  <p>Monthly subscription for customer management, bookings and invoicing.</p>
                  <ul><li>Subscription SaaS</li><li>Onboarding included</li><li>Priority support</li></ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="page" id="page-portfolio">
          <section className="hero" style={{ padding: '30px 0 70px' }}>
            <div className="container">
              <span className="eyebrow">Portfolio</span>
              <h1>Selected <span>work &amp; outcomes</span></h1>
              <p className="lead" style={{ marginTop: '20px' }}>A snapshot of websites, operational programmes and delivery engagements. Replace these examples with your own case studies, screenshots and client results.</p>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="filters" id="filters">
                <button className="filter active" data-filter="all">All</button>
                <button className="filter" data-filter="web">Web Design</button>
                <button className="filter" data-filter="ops">Operations</button>
                <button className="filter" data-filter="saas">SaaS</button>
                <button className="filter" data-filter="fintech">FinTech BA</button>
              </div>

              <div className="grid grid-3" id="projectGrid">
                <article className="card project" data-cat="web">
                  <div className="project-visual v1"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">Web Design</span>
                    <h3 style={{ marginTop: '10px' }}>Local Trades Business Website</h3>
                    <p>A mobile-first site with service pages, quote request form and local SEO setup, leading to a noticeably higher enquiry volume.</p>
                  </div>
                </article>
                <article className="card project" data-cat="ops">
                  <div className="project-visual v2"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">Operations</span>
                    <h3 style={{ marginTop: '10px' }}>Booking Process Redesign</h3>
                    <p>Mapped the end-to-end booking journey, removed duplicate data entry and cut average admin time per booking.</p>
                  </div>
                </article>
                <article className="card project" data-cat="saas">
                  <div className="project-visual v3"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">SaaS</span>
                    <h3 style={{ marginTop: '10px' }}>Client Management Platform</h3>
                    <p>Requirements, workflow design and product backlog for a subscription application covering customers, bookings and invoicing.</p>
                  </div>
                </article>
                <article className="card project" data-cat="fintech">
                  <div className="project-visual v4"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">FinTech BA</span>
                    <h3 style={{ marginTop: '10px' }}>Payments Platform Migration</h3>
                    <p>Served as Business Analyst across requirements, UAT and regulatory reporting data mapping for a phased platform migration.</p>
                  </div>
                </article>
                <article className="card project" data-cat="ops">
                  <div className="project-visual v5"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">Operations</span>
                    <h3 style={{ marginTop: '10px' }}>Reporting &amp; Data Quality Programme</h3>
                    <p>Standardised management reporting across teams, introducing data definitions and dashboards that replaced manual spreadsheets.</p>
                  </div>
                </article>
                <article className="card project" data-cat="fintech">
                  <div className="project-visual v6"><div className="bar" /></div>
                  <div className="project-body">
                    <span className="tag">FinTech BA</span>
                    <h3 style={{ marginTop: '10px' }}>Lending Process Optimisation</h3>
                    <p>Analysed credit decisioning workflow, defined requirements for automation and supported delivery through to go-live.</p>
                  </div>
                </article>
              </div>

              <p className="notice">Note to owner: the projects above are illustrative placeholders. Replace them with your real engagements, client names (where permitted) and measured outcomes before publishing.</p>
            </div>
          </section>
        </div>

        <div className="page" id="page-about">
          <section className="hero" style={{ padding: '30px 0 70px' }}>
            <div className="container">
              <span className="eyebrow">Digital Forge</span>
              <h1>About <span>The Digital Forge</span></h1>
              <p className="lead" style={{ marginTop: '20px' }}>We are a digital services company built on a simple belief: good technology should make businesses calmer, not more complicated.</p>
            </div>
          </section>

          <section>
            <div className="container split">
              <div>
                <span className="eyebrow">Our Story</span>
                <h2>Analysis-led. Delivery-focused.</h2>
                <p className="lead">The Digital Forge was founded by a Business Analyst with eight years' experience across software delivery, operational improvement, data analysis and product management.</p>
                <p style={{ marginTop: '16px' }}>Much of that career has been spent in Financial Services, working at the intersection of technology and operations. That experience shapes how we work: we define the problem clearly, test our assumptions with data and deliver in controlled steps.</p>
                <p style={{ marginTop: '16px' }}>We bring that same rigour to smaller businesses, where it matters just as much, and to FinTech teams who need analysts who understand regulation, risk and real-world process.</p>
              </div>
              <div className="card">
                <p className="quote">"Every good system starts with a clear understanding of how work actually gets done."</p>
                <div className="info-item" style={{ marginTop: '28px' }}>
                  <div className="icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></div>
                  <div><strong>Founder &amp; Principal Analyst</strong><span>8+ years in delivery, operations, data and product</span></div>
                </div>
                <div className="info-item">
                  <div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v10h14V10" /></svg></div>
                  <div><strong>Financial Services Specialism</strong><span>Deep knowledge of FinTech operations and requirements</span></div>
                </div>
              </div>
            </div>
          </section>

          <section className="band">
            <div className="container">
              <div className="section-head center">
                <span className="eyebrow">Our Values</span>
                <h2>What guides the work</h2>
              </div>
              <div className="grid grid-3 values">
                <div className="card"><div className="icon"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2" /></svg></div><h3>Clarity First</h3><p>We would rather spend time understanding the problem than building the wrong solution quickly.</p></div>
                <div className="card"><div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M9 11l3 3 8-8M4 12a8 8 0 0 0 8 8" /></svg></div><h3>Honest Scoping</h3><p>Clear estimates, transparent trade-offs and no hidden extras.</p></div>
                <div className="card"><div className="icon"><svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" /></svg></div><h3>Built to Last</h3><p>Secure, well-documented and maintainable work that your team can own.</p></div>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Why Work With Us</span>
                <h2>Business sense and technical depth</h2>
              </div>
              <div className="grid grid-2">
                <div className="card"><h3>For business owners</h3><ul><li>Plain-English advice, no jargon</li><li>Solutions sized to your budget</li><li>Support after launch, not just before</li></ul></div>
                <div className="card"><h3>For FinTech organisations</h3><ul><li>Regulated-environment experience</li><li>Strong stakeholder and UAT management</li><li>Data mapping, reporting and controls focus</li></ul></div>
              </div>
            </div>
          </section>
        </div>

        <div className="page" id="page-contract-ba">
          <section className="hero" style={{ padding: '30px 0 70px' }}>
            <div className="container">
              <span className="eyebrow">Contract Business Analysis</span>
              <h1>Senior BA support for <span>FinTech delivery</span></h1>
              <p className="lead" style={{ marginTop: '20px' }}>Experienced, hands-on Business Analyst available on contract to banks, payment providers, lenders, wealth platforms and other financial technology organisations.</p>
              <div className="btn-row"><a href="#contact" className="btn">Discuss a Contract</a><a href="#portfolio" className="btn btn-ghost">See Experience</a></div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Areas of Expertise</span>
                <h2>Financial services depth, delivered in practice</h2>
              </div>
              <div className="grid grid-3">
                <div className="card"><div className="icon"><svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V10M10 21V10M14 21V10M19 21V10M2 10l10-7 10 7" /></svg></div><h3>Payments &amp; Banking</h3><p>Payment flows, account services, settlement and reconciliation requirements.</p></div>
                <div className="card"><div className="icon cyan"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></svg></div><h3>Lending &amp; Credit</h3><p>Origination, decisioning workflows, servicing and collections processes.</p></div>
                <div className="card"><div className="icon"><svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6" /></svg></div><h3>Wealth &amp; Investments</h3><p>Onboarding, portfolio operations, trade lifecycle and client reporting.</p></div>
                <div className="card"><div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" /></svg></div><h3>Regulation &amp; Risk</h3><p>Compliance requirements, controls design, regulatory reporting and audit support.</p></div>
                <div className="card"><div className="icon"><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 9h16M9 9v11" /></svg></div><h3>Data &amp; Reporting</h3><p>Data mapping, MI definitions, analysis and dashboard requirements.</p></div>
                <div className="card"><div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h10M4 18h7" /></svg></div><h3>Delivery Support</h3><p>Backlog management, user stories, UAT coordination and go-live readiness.</p></div>
              </div>
            </div>
          </section>

          <section className="band">
            <div className="container">
              <div className="split">
                <div>
                  <span className="eyebrow">How I Engage</span>
                  <h2>Flexible contract options</h2>
                  <p className="lead">Engagements can be embedded within your team for the duration of a programme or used for targeted, time-boxed pieces of work.</p>
                </div>
                <div className="grid" style={{ gap: '16px' }}>
                  <div className="card" style={{ padding: '24px' }}><h3>Embedded BA</h3><p>Long-term placement within a squad or programme team.</p></div>
                  <div className="card" style={{ padding: '24px' }}><h3>Discovery &amp; Assessment</h3><p>Short engagements to define scope, assess a current process or prepare a business case.</p></div>
                  <div className="card" style={{ padding: '24px' }}><h3>Interim Cover</h3><p>Rapid mobilisation to fill a gap or stabilise a delivery workstream.</p></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <div className="section-head">
                <span className="eyebrow">Experience</span>
                <h2>Background at a glance</h2>
              </div>
              <div className="grid grid-4">
                <div className="card"><strong style={{ fontSize: '1.8rem', color: 'var(--forge)' }}>8+</strong><p style={{ marginTop: '6px' }}>Years in software delivery &amp; analysis</p></div>
                <div className="card"><strong style={{ fontSize: '1.8rem', color: 'var(--cyan)' }}>FS</strong><p style={{ marginTop: '6px' }}>Entire career in Financial Services</p></div>
                <div className="card"><strong style={{ fontSize: '1.8rem', color: 'var(--forge)' }}>Tech + Ops</strong><p style={{ marginTop: '6px' }}>Bridging technology and operations</p></div>
                <div className="card"><strong style={{ fontSize: '1.8rem', color: 'var(--cyan)' }}>BA + PM</strong><p style={{ marginTop: '6px' }}>Analysis, data and product management</p></div>
              </div>
            </div>
          </section>
        </div>

        <section id="contact" className="band">
          <div className="container">
            <div className="contact-wrap">
              <div>
                <span className="eyebrow">Get in Touch</span>
                <h2>Let's talk about your next step</h2>
                <p className="lead">Choose the area you would like to discuss and send us a few details. We will reply within one working day.</p>
                <div className="info-item">
                  <div className="icon"><svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z" /><path d="M4 6l8 7 8-7" /></svg></div>
                  <div><strong>Email</strong><span>hello@thedigitalforge.co.uk</span></div>
                </div>
                <div className="info-item">
                  <div className="icon cyan"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg></div>
                  <div><strong>Phone</strong><span>+44 (0) 000 000 0000</span></div>
                </div>
                <div className="info-item">
                  <div className="icon"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg></div>
                  <div><strong>Based in</strong><span>United Kingdom &middot; Working remotely</span></div>
                </div>
              </div>

              <form className="contact" id="contactForm" noValidate>
                <div className="form-body" id="formBody">
                  <div className="form-row">
                    <div className="field full" id="f-topic">
                      <label htmlFor="topic">I would like to discuss <span className="req">*</span></label>
                      <select id="topic" name="topic">
                        <option value="">Select an option&hellip;</option>
                        <option value="Web Design">Web Design</option>
                        <option value="BA Contract Work">BA Contract Work</option>
                      </select>
                      <div className="err">Please select what you would like to discuss.</div>
                    </div>

                    <div className="field" id="f-name">
                      <label htmlFor="name">Full Name <span className="req">*</span></label>
                      <input id="name" name="name" type="text" placeholder="Jane Smith" autoComplete="name" />
                      <div className="err">Please enter your name.</div>
                    </div>

                    <div className="field" id="f-email">
                      <label htmlFor="email">Email Address <span className="req">*</span></label>
                      <input id="email" name="email" type="email" placeholder="jane@company.com" autoComplete="email" />
                      <div className="err">Please enter a valid email address.</div>
                    </div>

                    <div className="field full" id="f-phone">
                      <label htmlFor="phone">Contact Number <span className="req">*</span></label>
                      <input id="phone" name="phone" type="tel" placeholder="+44 7700 900000" autoComplete="tel" />
                      <div className="err">Please enter a valid contact number.</div>
                    </div>

                    <div className="field full" id="f-message">
                      <label htmlFor="message">Your Message <span className="req">*</span></label>
                      <textarea id="message" name="message" placeholder="Tell us about your business, project or contract requirement..." />
                      <div className="err">Please enter a message (at least 10 characters).</div>
                    </div>
                  </div>

                  <div className="form-foot">
                    <small>Fields marked <span style={{ color: 'var(--forge)' }}>*</span> are required.</small>
                    <button type="submit" className="btn" id="submitBtn">Send Request</button>
                  </div>
                </div>

                <div className="success" id="successMsg">
                  <div className="check">&#10003;</div>
                  <h3>Thank you, your request has been sent</h3>
                  <p style={{ marginTop: '8px' }}>We will be in touch within one working day.</p>
                  <div className="btn-row" style={{ justifyContent: 'center' }}><button type="button" className="btn btn-ghost" id="resetBtn">Send another request</button></div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="foot-grid">
            <div>
              <a href="#home" className="brand" style={{ marginBottom: '14px' }}>
                <img src="/Images/Logo.png" alt="The Digital Forge logo" className="brand-logo" />
                <span>THE DIGITAL FORGE</span>
              </a>
              <p>Websites, operational improvement and subscription software for small and medium businesses. Contract Business Analysis for FinTech.</p>
            </div>
            <div>
              <h4>Explore</h4>
              <a href="#home">Home</a>
              <a href="#services">Services</a>
              <a href="#portfolio">Portfolio</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#about">Digital Forge</a>
              <a href="#contract-ba">Contract BA Work</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h4>Get in touch</h4>
              <a href="#contact">Send a request</a>
              <a href="mailto:hello@thedigitalforge.co.uk">hello@thedigitalforge.co.uk</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>&copy; <span id="year" /> The Digital Forge. All rights reserved.</span>
            <span>Privacy &middot; Terms</span>
          </div>
        </div>
      </footer>

      <div className="toast" id="toast" />
    </>
  );
}
