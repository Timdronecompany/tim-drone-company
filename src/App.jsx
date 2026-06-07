import { useCallback, useEffect, useState } from "react";
import { companyFactPages, findServicePage, servicePages } from "./servicePages.js";

function DroneVisual({ variant }) {
  const droneImages = {
    alta: "/alta.png",
    inspire: "/inspire.png",
    fpv: "/fpv.png",
    bmpcc: "/bmpcc4k-cinewhoop.png",
    mavic: "/mavic4profinal.png",
    micro: "/mini5.png",
    microFpv: "/micro.png",
  };
  const fallbackImage = "/mavic4pro.png";

  return (
    <div className="relative bg-black">
      <div
        style={{
          width: '100%',
          maxHeight: '320px',
          aspectRatio: '1 / 1',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src={droneImages[variant]}
          alt={variant}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
          className="transition duration-700 group-hover:scale-105"
          onError={(event) => {
            const img = event.currentTarget;
            if (!img.dataset.fallback) {
              img.dataset.fallback = "true";
              img.src = fallbackImage;
            }
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
    </div>
  );
}

function FleetCard({ drone, isActive, onToggle }) {
  const specsId = `fleet-specs-${drone.id}`;

  return (
    <button
      type="button"
      className={`fleet-card group ${isActive ? "fleet-card-active" : ""}`}
      onClick={onToggle}
      aria-expanded={isActive}
      aria-controls={specsId}
    >
      <DroneVisual variant={drone.variant} />
      <div className="fleet-card-body">
        <p className="fleet-card-label">{drone.label}</p>
        <h3 className="fleet-card-title">{drone.title}</h3>
        <p className="fleet-card-copy">{drone.copy}</p>
        <span className="fleet-card-spec-prompt">{drone.prompt}</span>
      </div>
      <div id={specsId} className="fleet-card-specs" hidden={!isActive}>
        <p className="fleet-card-specs-label">{drone.specLabel}</p>
        <ul>
          {drone.specs.map((spec) => (
            <li key={spec}>{spec}</li>
          ))}
        </ul>
      </div>
    </button>
  );
}

function BookingMap({ copy, selectedLocation, onLocationChange }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [status, setStatus] = useState(copy.mapReady);

  const previewQuery = selectedLocation.lat && selectedLocation.lng
    ? `${selectedLocation.lat},${selectedLocation.lng}`
    : "Amsterdam, Netherlands";
  const previewSrc = `https://www.google.com/maps?q=${encodeURIComponent(previewQuery)}&z=${selectedLocation.lat ? "16" : "10"}&output=embed`;

  async function searchLocation(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setStatus(copy.mapSearching);
    setSearchResults([]);

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(trimmedQuery)}`);
      const results = response.ok ? await response.json() : [];
      setSearchResults(results);
      setStatus(results.length ? copy.mapChooseResult : copy.mapNoResults);
    } catch {
      setStatus(copy.mapSearchError);
    }
  }

  function focusResult(result) {
    const lat = Number.parseFloat(result.lat);
    const lng = Number.parseFloat(result.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    onLocationChange({
      label: result.display_name || `${lat}, ${lng}`,
      lat: Number(lat.toFixed(6)),
      lng: Number(lng.toFixed(6)),
      mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
    });
    setSearchResults([]);
    setStatus(copy.mapSelectedStatus);
  }

  return (
    <div className="booking-map">
      <div className="booking-map-panel">
        <div className="booking-map-search">
          <label className="booking-map-search-label">
            <span>{copy.mapSearchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchLocation(event);
              }}
              placeholder={copy.mapSearchPlaceholder}
              autoComplete="off"
            />
          </label>
          <button type="button" onClick={searchLocation}>{copy.mapSearchButton}</button>
        </div>
        {searchResults.length > 0 && (
          <div className="booking-map-results">
            {searchResults.map((result) => (
              <button key={result.place_id} type="button" onClick={() => focusResult(result)}>
                {result.display_name}
              </button>
            ))}
          </div>
        )}
        <p className="booking-map-status">{status}</p>
        <div className="booking-map-selected">
          <span>{copy.mapSelectedLabel}</span>
          <strong>{selectedLocation.label || copy.mapNoSelection}</strong>
        </div>
      </div>
      <div className="booking-map-frame">
        <iframe
          className="booking-map-canvas"
          src={previewSrc}
          title={copy.mapAriaLabel}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

function SiteHeader({ language, setLanguage }) {
  return (
    <>
      <header className="hero-header">
        <div className="hero-header-inner">
          <div className="hero-header-brand">
            <a href="/" className="hero-header-title">T.I.M. Drone Company</a>
          </div>
          <div className="hero-header-actions">
            <div className="language-toggle">
              <button onClick={() => setLanguage("en")} className={`hero-language-button ${language === "en" ? "hero-language-button-active" : ""}`}>EN</button>
              <button onClick={() => setLanguage("nl")} className={`hero-language-button ${language === "nl" ? "hero-language-button-active" : ""}`}>NL</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function ServicePage({ page, language, setLanguage }) {
  const isCompanyFactPage = companyFactPages.some((factPage) => factPage.slug === page.slug);
  const relatedPages = (isCompanyFactPage ? companyFactPages : servicePages).filter((relatedPage) => relatedPage.slug !== page.slug);

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader
        language={language}
        setLanguage={setLanguage}
      />
      <main className="service-page">
        <section className="service-hero">
          <p className="service-eyebrow">T.I.M. Drone Company · Amsterdam</p>
          <h1 className="service-title">{page.title}</h1>
          <p className="service-intro">{page.intro}</p>
          <div className="service-cta-row">
            <a href="/#booking" className="hero-cta-btn hero-cta-btn-primary">Book</a>
            <a href="/#contact" className="hero-cta-btn hero-cta-btn-secondary">Contact</a>
            <a href="/" className="hero-cta-btn hero-cta-btn-secondary">Home</a>
          </div>
        </section>

        <section className="service-detail-section">
          <div className="service-detail-container">
            <aside className="service-summary">
              <p className="service-summary-label">Service</p>
              <h2>{page.serviceType}</h2>
              <p>{page.focus}</p>
              <div className="service-term-list">
                {page.terms.map((term) => (
                  <span key={term}>{term}</span>
                ))}
              </div>
            </aside>

            <div className="service-copy-grid">
              {page.sections.map((section) => (
                <article key={section.title} className="service-copy-item">
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>

            <div className="service-insight-grid">
              {page.insights.map((insight) => (
                <article key={insight.label} className="service-insight-card">
                  <span>{insight.label}</span>
                  <p>{insight.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="service-related-section">
          <div className="service-related-container">
            <p className="service-eyebrow">{isCompanyFactPage ? "Related pages" : "Related services"}</p>
            <h2 className="service-related-title">{isCompanyFactPage ? "More company facts." : "More drone services in Amsterdam."}</h2>
            <div className="company-capability-links service-related-links" aria-label="Related service pages">
              {relatedPages.map((servicePage) => (
                <a key={servicePage.slug} href={servicePage.path}>
                  {servicePage.serviceType}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function TimDroneCompanyPortfolio({ path = "/" }) {
  const [language, setLanguage] = useState("en");
  const [activeFilter, setActiveFilter] = useState("All");
  const [portfolioExpanded, setPortfolioExpanded] = useState(false);
  const [initialPortfolioProjectCount, setInitialPortfolioProjectCount] = useState(15);
  const [activeProject, setActiveProject] = useState(null);
  const [activeFleetDrone, setActiveFleetDrone] = useState(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  const [showScrollControls, setShowScrollControls] = useState(false);
  const [isBookingLocationMissing, setIsBookingLocationMissing] = useState(false);
  const [bookingSubmitState, setBookingSubmitState] = useState("idle");
  const [bookingLocation, setBookingLocation] = useState({
    label: "",
    lat: "",
    lng: "",
    mapUrl: "",
  });

  const copy = {
    en: {
      aboutLabel: "About",
      aboutTitle: <>More than drone operators.<br />We create cinematic imagery with technical precision.</>,
      aboutLeft1: <>Powered by <span className="text-white">SkyMotion</span>, the T.I.M. team brings over 15 years of on-set experience across commercials, television and high-end film productions.</>,
      aboutLeft2: <>From flying an <span className="text-white">ARRI Alexa Mini LF</span> on our <span className="text-white">Freefly Alta X with Movi Pro</span>, to operating micro FPV drones through the tightest environments — we combine technical confidence with cinematic storytelling.</>,
      aboutLeft3: "Our approach is built around collaboration, precision and understanding the rhythm of professional productions. We integrate seamlessly with camera departments, AD’s and production teams to deliver efficient workflows both in the air and on set.",
      aboutLeft4: "Whether capturing large-scale cinematic sequences or intimate FPV movements through confined spaces, every shot is approached with the same focus on visual storytelling, timing and atmosphere.",
      aboutRight1: <>Your production can draw from a fleet that includes the <span className="text-white">Freefly Alta X</span>, <span className="text-white">Heavy Lift Dual Operator FPV</span>, <span className="text-white">DJI Inspire 3</span>, <span className="text-white">DJI Mavic 4</span>, <span className="text-white">DJI Mini</span>, FPV systems and 360 drones for complex and dynamic shoots.</>,
      aboutRight2: "On set, directors, D.O.P.’s and production teams get a drone partner who understands camera systems, visual storytelling and the pace of professional film work.",
      aboutRight3: "From pre-production to execution, every setup is shaped around the creative brief, the location and the most efficient way to achieve the shot.",
      aboutRight4: "Every production can be scaled to match its budget and demands, from agile lightweight one-man team setups to fully equipped high-end cinematic drone operations with a dedicated crew.",
      aboutRight5: "Production continuity is protected with backup systems and redundant equipment, so technical or operational issues do not have to stop the day.",
      aboutRight6: "Directors, D.O.P.’s and clients can follow every shot in real time through professional on-set monitoring, including multiple screens and video village transmission when required.",
      aboutRight7: "Specific production requirements can be supported with custom drone builds, from lightweight cinematic FPV platforms and prop drones to specialized heavy-lift configurations.",
      fleetLabel: "Fleet",
      fleetTitle: "Built for cinematic productions.",
      heavyLift: "Heavy Lift",
      cinemaDrone: "Cinema Drone",
      fpvPlatform: "FPV Platform",
      bmpccPlatform: "BMPCC 4K FPV",
      cinematicDrone: "Cinematic Drone",
      altaText: <>Configured for the <span className="text-white">ARRI Alexa Mini LF</span> with anamorphic lens setups and professional cinema workflows.</>,
      inspireText: "High-end aerial cinematography platform designed for demanding productions and cinematic camera movement.",
      fpvText: "Heavy lift dual operator FPV systems built to carry cinema payloads like the RED KOMODO 6K for dynamic cinematic movement, precision flying and immersive action sequences.",
      bmpccText: "Compact cinewhoop setup with a BMPCC 4K camera for cinematic FPV movement in tighter production spaces.",
      mavicText: "Compact professional aerial platform with advanced stabilization, ideal for fast-paced productions and versatile camera movements.",
      microDrone: "Micro Drone",
      microText: "Ultra-compact professional platform for agile productions, ideal for tight spaces and fast-response aerial coverage.",
      microFpvLabel: "Micro FPV",
      microFpvText: "Compact FPV platform for dynamic, immersive aerial movement and precision flying in confined spaces.",
      cameraSpecs: "Camera specs",
      viewCameraSpecs: "View camera specs",
      customDroneLabel: "Custom Drones",
      customDroneTitle: "Built around the shot, not the other way around.",
      customDroneIntro: "When an existing platform does not fit the production, we design and build custom drone solutions for specific camera payloads, safety demands, locations and movement requirements.",
      customDroneBuilds: "Custom FPV and heavy-lift builds",
      customDroneBuildsText: "Tailored airframes, power setups, camera mounts and protection for cinematic, commercial and technical production needs. We also build prop drones for scenes where the drone itself needs to appear on camera or perform a specific practical role.",
      customDronePayloads: "Payload-specific configuration",
      customDronePayloadsText: "From lightweight action cameras to cinema cameras and specialist equipment, we match the platform to the creative and technical brief.",
      customDroneWorkflow: "Production-ready workflow",
      customDroneWorkflowText: "Testing, backups, monitoring and set integration are considered from the start, so custom equipment behaves predictably on shoot days.",
      selectedWork: "Selected Work",
      featuredProject: "Featured Project",
      portfolioLabel: "Projects",
      portfolioTitle: "A selection of our work.",
      portfolioSubtitle: "Aerial video, FPV, commercials, events and feature films.",
      portfolioFilters: ["All", "Aerial video", "Awards", "BTS", "Commercials", "Event registration", "Events", "Feature films", "Fly-Through", "FPV", "Photography", "Prop drones", "Real estate", "Shorts", "Sports", "TV series"],
      portfolioShowMore: "Show more",
      portfolioShowLess: "Show less",
      bookingNav: "Book",
      bookingLabel: "Booking",
      bookingTitle: "Plan a drone shoot.",
      bookingIntro: "Share the date, time, preferred drone and shot requirements. Search the location and choose the right result to attach it to the request.",
      bookingName: "Name",
      bookingEmail: "Email",
      bookingPhone: "Phone",
      bookingDate: "Date",
      bookingStartTime: "Start time",
      bookingEndTime: "End time",
      bookingDroneType: "Drone type",
      bookingShotTypes: "Shot ideas",
      bookingShotSuggestions: "Suggestions: establishing shots, crane-style moves, fast FPV movement, slow cinematic movement, tracking shots, fly-through, top-down overview.",
      bookingDescription: "Short description",
      bookingDescriptionPlaceholder: "Describe the shots you need, timing, mood, movement, restrictions or any useful production details.",
      bookingSubmit: "Send booking request",
      bookingSending: "Sending...",
      bookingSuccess: "Booking request sent. We will get back to you soon.",
      bookingError: "Something went wrong while sending. Please try again or email timdronecompany@gmail.com.",
      mapSearchLabel: "Shoot location",
      mapSearchPlaceholder: "Search an address, venue or city",
      mapSearchButton: "Search",
      mapLoading: "Loading map...",
      mapReady: "Search a location and choose the right result.",
      mapSearching: "Searching location...",
      mapChooseResult: "Choose the correct result to attach it to the booking request.",
      mapAfterSearch: "Map preview updated.",
      mapResolving: "Saving selected location...",
      mapSelected: "Selected shoot location",
      mapSelectedStatus: "Location selected and attached to the booking request.",
      mapNoResults: "No result found. Try a more specific address or place.",
      mapSearchError: "Location search failed. Try again in a moment.",
      mapError: "Map could not load. Please refresh the page.",
      mapSelectedLabel: "Selected location",
      mapNoSelection: "No location selected yet",
      mapRequired: "Please select a shoot location on the map before sending.",
      mapAriaLabel: "Booking location map preview",
      contact: "Contact",
      contactLine: "Available for commercials, film, television and international productions.",
      heroLine: "AMSTERDAM · AVAILABLE WORLDWIDE",
      whatsappTitle: "Start a WhatsApp conversation",
      whatsappText: "Send a message directly from here. WhatsApp will open with a short pre-filled note.",
      whatsappMessage: "Hi T.I.M. Drone Company, I would like to discuss a drone shoot.",
      whatsappButton: "Open WhatsApp",
      callButton: "Call",
      close: "Close",
    },
    nl: {
      aboutLabel: "Over ons",
      aboutTitle: <>Meer dan drone-operators.<br />Wij creëren cinematografisch beeld met technische precisie.</>,
      aboutLeft1: <>Powered by <span className="text-white">SkyMotion</span>. Het T.I.M.-team brengt meer dan 15 jaar setervaring mee in commercials, televisie en high-end filmproducties.</>,
      aboutLeft2: <>Van het vliegen met een <span className="text-white">ARRI Alexa Mini LF</span> op onze <span className="text-white">Freefly Alta X met Movi Pro</span> tot micro-FPV drones door de krapste ruimtes: wij combineren technische controle met cinematografische storytelling.</>,
      aboutLeft3: "Onze aanpak draait om samenwerking, precisie en het begrijpen van het ritme op professionele sets. We sluiten naadloos aan bij camera departments, AD’s en productieteams voor efficiënte workflows in de lucht én op de set.",
      aboutLeft4: "Of het nu gaat om grote cinematografische shots of intieme FPV-bewegingen door kleine ruimtes: elk shot benaderen we met dezelfde focus op verhaal, timing en sfeer.",
      aboutRight1: <>Voor jouw productie is er een vloot beschikbaar met onder andere de <span className="text-white">Freefly Alta X</span>, <span className="text-white">Heavy Lift Dual Operator FPV</span>, <span className="text-white">DJI Inspire 3</span>, <span className="text-white">DJI Mavic 4</span>, <span className="text-white">DJI Mini</span>, FPV-systemen en 360-drones voor complexe en dynamische draaidagen.</>,
      aboutRight2: "Op set krijgen regisseurs, D.O.P.’s en productieteams een dronepartner die camerasystemen, visuele storytelling en het tempo van professionele filmproducties begrijpt.",
      aboutRight3: "Van pre-productie tot uitvoering wordt iedere setup afgestemd op de creatieve briefing, de locatie en de meest efficiënte manier om het shot te realiseren.",
      aboutRight4: "Iedere productie kan worden opgeschaald naar budget en behoefte, van lichte en wendbare one-man-team setups tot volledig uitgeruste high-end cinematic drone-operaties met een dedicated crew.",
      aboutRight5: "Productiecontinuïteit wordt beschermd met back-upsystemen en redundante apparatuur, zodat technische of operationele issues de draaidag niet hoeven te stoppen.",
      aboutRight6: "Regisseurs, D.O.P.’s en klanten kunnen ieder shot live volgen via professionele monitoring op set, inclusief meerdere schermen en video-village-transmissie wanneer nodig.",
      aboutRight7: "Specifieke productie-eisen kunnen worden ondersteund met custom drone-builds, van lichte cinematic FPV-platforms en prop-drones tot gespecialiseerde heavy-lift configuraties.",
      fleetLabel: "Fleet",
      fleetTitle: "Gebouwd voor cinematografische producties.",
      heavyLift: "Heavy Lift",
      cinemaDrone: "Cinema Drone",
      fpvPlatform: "FPV Platform",
      bmpccPlatform: "BMPCC 4K FPV",
      cinematicDrone: "Cinematic Drone",
      altaText: <>Geconfigureerd voor de <span className="text-white">ARRI Alexa Mini LF</span> met anamorphic lens setups en professionele cinema-workflows.</>,
      inspireText: "High-end aerial cinematography platform voor veeleisende producties en cinematografische camerabewegingen.",
      fpvText: "Heavy lift dual operator FPV-systemen gebouwd voor cinema-payloads zoals de RED KOMODO 6K, met dynamische camerabewegingen, precisievluchten en meeslepende action sequences.",
      bmpccText: "Compacte cinewhoop setup met BMPCC 4K-camera voor cinematic FPV-bewegingen in kleinere productieruimtes.",
      mavicText: "Compact professional aerial platform met geavanceerde stabilisatie, ideaal voor snelle producties en veelzijdige camerabewegingen.",
      microDrone: "Micro Drone",
      microText: "Ultracompact professioneel platform voor wendbare producties, ideaal voor krappe ruimtes en snelle camerabewegingen.",
      microFpvLabel: "Micro FPV",
      microFpvText: "Compact FPV platform voor dynamische, meeslepende camerabewegingen en precisievluchten in krappe ruimtes.",
      cameraSpecs: "Camera specs",
      viewCameraSpecs: "Bekijk camera specs",
      customDroneLabel: "Custom drones",
      customDroneTitle: "Gebouwd rondom het shot, niet andersom.",
      customDroneIntro: "Wanneer een bestaande drone niet past bij de productie, ontwerpen en bouwen we custom drone-oplossingen voor specifieke camera-payloads, veiligheidseisen, locaties en camerabewegingen.",
      customDroneBuilds: "Custom FPV- en heavy-lift-builds",
      customDroneBuildsText: "Airframes, power-setups, cameramounts en bescherming op maat voor cinematografische, commerciële en technische producties. We bouwen ook prop-drones voor scenes waarin de drone zelf in beeld moet komen of een specifieke praktische rol speelt.",
      customDronePayloads: "Payload-specifieke configuratie",
      customDronePayloadsText: "Van lichte actioncams tot cinemacamera’s en specialistische apparatuur: we stemmen het platform af op de creatieve en technische briefing.",
      customDroneWorkflow: "Klaar voor productie",
      customDroneWorkflowText: "Tests, back-ups, monitoring en integratie op set worden vanaf het begin meegenomen, zodat custom apparatuur voorspelbaar werkt op draaidagen.",
      selectedWork: "Geselecteerd werk",
      featuredProject: "Uitgelicht project",
      portfolioLabel: "Projecten",
      portfolioTitle: "Een selectie van ons werk.",
      portfolioSubtitle: "Luchtbeelden, FPV, commercials, events en bioscoopfilms.",
      portfolioFilters: ["Alles", "Luchtbeelden", "Awards", "BTS", "Commercials", "Event registratie", "Events", "Bioscoopfilms", "Fly-through", "FPV", "Fotografie", "Prop-drones", "Vastgoed", "Shorts", "Sport", "Tv-series"],
      portfolioShowMore: "Meer tonen",
      portfolioShowLess: "Minder tonen",
      bookingNav: "Boeken",
      bookingLabel: "Boeking",
      bookingTitle: "Plan een drone shoot.",
      bookingIntro: "Deel datum, tijd, gewenste drone en shotwensen. Zoek de locatie en kies het juiste resultaat om die aan de aanvraag te koppelen.",
      bookingName: "Naam",
      bookingEmail: "E-mail",
      bookingPhone: "Telefoon",
      bookingDate: "Datum",
      bookingStartTime: "Starttijd",
      bookingEndTime: "Eindtijd",
      bookingDroneType: "Drone type",
      bookingShotTypes: "Shot ideeën",
      bookingShotSuggestions: "Suggesties: establishing shots, crane shots, snelle FPV-beweging, langzame cinematic beweging, tracking shots, fly-through, top-down overzicht.",
      bookingDescription: "Korte omschrijving",
      bookingDescriptionPlaceholder: "Omschrijf de gewenste shots, timing, sfeer, beweging, restricties of andere nuttige productie-info.",
      bookingSubmit: "Boekingsaanvraag versturen",
      bookingSending: "Versturen...",
      bookingSuccess: "Boekingsaanvraag verstuurd. We komen snel bij je terug.",
      bookingError: "Er ging iets mis met versturen. Probeer opnieuw of mail naar timdronecompany@gmail.com.",
      mapSearchLabel: "Draailocatie",
      mapSearchPlaceholder: "Zoek een adres, venue of stad",
      mapSearchButton: "Zoeken",
      mapLoading: "Kaart laden...",
      mapReady: "Zoek een locatie en kies het juiste resultaat.",
      mapSearching: "Locatie zoeken...",
      mapChooseResult: "Kies het juiste resultaat om de locatie aan de aanvraag te koppelen.",
      mapAfterSearch: "Kaartvoorbeeld bijgewerkt.",
      mapResolving: "Geselecteerde locatie opslaan...",
      mapSelected: "Geselecteerde draailocatie",
      mapSelectedStatus: "Locatie geselecteerd en gekoppeld aan de boekingsaanvraag.",
      mapNoResults: "Geen resultaat gevonden. Probeer een specifieker adres of plaats.",
      mapSearchError: "Locatie zoeken is mislukt. Probeer het zo opnieuw.",
      mapError: "Kaart kon niet laden. Ververs de pagina.",
      mapSelectedLabel: "Geselecteerde locatie",
      mapNoSelection: "Nog geen locatie geselecteerd",
      mapRequired: "Selecteer eerst een draailocatie op de kaart voordat je verstuurt.",
      mapAriaLabel: "Kaartvoorbeeld voor boekingslocatie",
      contact: "Contact",
      contactLine: "Beschikbaar voor commercials, film, televisie en internationale producties.",
      heroLine: "AMSTERDAM · WERELDWIJD BESCHIKBAAR",
      whatsappTitle: "Start een WhatsApp-gesprek",
      whatsappText: "Stuur direct vanaf hier een bericht. WhatsApp opent met een kort vooraf ingevuld bericht.",
      whatsappMessage: "Hi T.I.M. Drone Company, ik wil graag een drone shoot bespreken.",
      whatsappButton: "Open WhatsApp",
      callButton: "Bel",
      close: "Sluiten",
    },
  };

  const t = copy[language];
  const servicePage = findServicePage(path);
  const whatsappUrl = `https://wa.me/31625083448?text=${encodeURIComponent(t.whatsappMessage)}`;
  const locationCheckWhatsAppUrl = `https://wa.me/31625083448?text=${encodeURIComponent("Hi T.I.M. Drone Company, I would like to check if a drone shoot is possible at this location: ")}`;
  const fleetItems = [
    {
      id: "alta",
      variant: "alta",
      label: t.heavyLift,
      title: "Freefly Alta X",
      copy: t.altaText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: ARRI ALEXA Mini LF on Movi Pro; large-format ALEV III A2X CMOS sensor, up to 4.5K Open Gate.",
        "Dynamic range: 14+ stops across EI 160-3200.",
        "ISO: EI 160-3200 with EI 800 base sensitivity; no dual native ISO system.",
        "Codecs/bitrate: MXF/ARRIRAW and MXF/Apple ProRes 4444 XQ, 4444, 422 HQ; approx. up to 2.4 Gbps ARRIRAW and 1.6 Gbps ProRes 4444 XQ in high-resolution LF modes, depending on resolution and frame rate.",
        "Lens/aperture/ND: lens-dependent with wireless iris possible; internal ARRI FSND filters Clear, ND 0.6, 1.2, 1.8.",
        "Flight time: Freefly quotes up to 50 min with no payload; cinema camera builds are payload/weather dependent, often roughly 8-15 min.",
      ],
    },
    {
      id: "inspire",
      variant: "inspire",
      label: t.cinemaDrone,
      title: "DJI Inspire 3",
      copy: t.inspireText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: Zenmuse X9-8K Air, 35mm full-frame CMOS, 8192x4320 video and 8192x5456 photo.",
        "Dynamic range: 14+ stops up to 30fps; approx. 12+ stops above 30fps depending on recording mode.",
        "ISO: video EI 200-6400 with DJI dual native EI ranges; photo ISO 100-25600.",
        "Codecs/bitrate: MOV, CinemaDNG, Apple ProRes RAW and ProRes 422 HQ depending on license and setup; CinemaDNG reaches approx. 885 MB/s, ProRes RAW approx. 531 MB/s and ProRes 422 HQ approx. 471 MB/s in high-end modes.",
        "Lens/aperture: available Inspire 3 lens set includes 18, 24, 35, 50, 75 and 90 mm lenses; aperture depends on lens, external ND filters used per lens.",
        "Flight time: approx. 28 min gear down or 26 min gear up; real production time may vary.",
      ],
    },
    {
      id: "fpv",
      variant: "fpv",
      label: t.fpvPlatform,
      title: "FPV Cinelifter",
      copy: t.fpvText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: RED KOMODO 6K payload; 19.9MP Super 35 global shutter CMOS sensor, 27.03 x 14.26 mm, 6144 x 3240 max resolution.",
        "Dynamic range: 16+ stops.",
        "ISO: RED KOMODO is not a dual native ISO camera; ISO range 250-12800 with ISO 800 commonly used as the base/reference exposure.",
        "Codecs/bitrate: REDCODE RAW R3D HQ/MQ/LQ; up to 280 MB/s data rate, with 6K 17:9 up to 40fps, 4K 17:9 up to 60fps and 2K 17:9 up to 120fps.",
        "Lens/aperture/ND: integrated Canon RF mount; aperture control depends on lens/adapters and rigging. No internal ND, external ND filters used for shutter and exposure control.",
        "Flight time: RED KOMODO cinelifter setup is build, lens, battery and weather dependent, typically approx. 4-7 min for cinema FPV work.",
      ],
    },
    {
      id: "bmpcc",
      variant: "bmpcc",
      label: t.bmpccPlatform,
      title: "BMPCC 4K FPV Cinewhoop",
      copy: t.bmpccText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: Blackmagic Pocket Cinema Camera 4K; Four Thirds sensor, 4096x2160.",
        "Dynamic range: 13 stops.",
        "ISO: dual native ISO 400 and 3200; ISO range up to 25,600.",
        "Codecs/bitrate: Blackmagic RAW 3:1 to 12:1 and Q0-Q5 plus ProRes 422 HQ/422/LT/Proxy; 4K DCI Blackmagic RAW 3:1 reaches approx. 136 MB/s, with lower data rates available via 5:1, 8:1, 12:1 and ProRes options.",
        "Lens/aperture/ND: active MFT mount with iris/focus/zoom control on supported lenses; no built-in ND on BMPCC 4K, external ND required.",
        "Flight time: cinewhoop setup is payload dependent, typically approx. 3-6 min.",
      ],
    },
    {
      id: "mavic",
      variant: "mavic",
      label: t.cinematicDrone,
      title: "DJI Mavic 4 Pro",
      copy: t.mavicText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: triple camera system: 100MP 4/3 Hasselblad wide, 48MP 1/1.3 medium tele, 50MP 1/1.5 tele.",
        "Dynamic range: up to 15.5 stops on the main Hasselblad camera; tele camera range is lower and mode-dependent.",
        "ISO: Dual Native ISO Fusion; video ranges include Normal up to ISO 12800, D-Log 400-6400, D-Log M 100-6400, HLG 400-3200.",
        "Codecs/bitrate: MP4 H.264/H.265; Creator Combo supports H.264 ALL-I up to 1200 Mbps, H.265 Standard up to 180 Mbps.",
        "Lens/aperture/ND: Hasselblad wide has adjustable f/2-f/11; tele cameras fixed f/2.8; ND filters available/used for shutter control.",
        "Flight time: DJI quotes up to approx. 51 min; real production time may vary.",
      ],
    },
    {
      id: "micro",
      variant: "micro",
      label: t.microDrone,
      title: "DJI Mini 5",
      copy: t.microText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: DJI Mini 5 Pro class camera; 1-inch CMOS, 50MP effective pixels, 24mm equivalent field of view.",
        "Dynamic range: up to 14 stops / 14 EV in HDR-style video modes.",
        "ISO: video Normal 100-12800, D-Log M 100-3200, HLG 100-3200; no interchangeable lens system.",
        "Codecs/bitrate: MP4 H.264/H.265; 4K up to 120fps, max video bitrate up to 130 Mbps in 4K/120 D-Log M.",
        "Lens/aperture/ND: fixed f/1.8 lens; ND filter set available/used externally for motion blur and exposure control.",
        "Flight time: approx. 36 min max, around 21 min typical recording profile with standard battery; may vary.",
      ],
    },
    {
      id: "micro-fpv",
      variant: "microFpv",
      label: t.microFpvLabel,
      title: "Micro FPV Drone",
      copy: t.microFpvText,
      prompt: t.viewCameraSpecs,
      specLabel: t.cameraSpecs,
      specs: [
        "Camera: GoPro 12 / HERO12 Black; 1/1.9-inch sensor, 27MP photo, 5.3K up to 60fps and 4K up to 120fps.",
        "Dynamic range: GoPro does not publish an official stops figure; HERO12 supports HDR video, 10-bit color and GP-Log for improved highlight/shadow handling.",
        "ISO: no dual native ISO; manual video ISO limits available depending on GoPro profile.",
        "Codecs/bitrate: MP4 H.265/HEVC, 8-bit or 10-bit color, high-bitrate mode up to about 120 Mbps.",
        "Lens/aperture/ND: fixed ultra-wide lens, approx. f/2.5 aperture; clip-on/external ND filters used where practical.",
        "Flight time: build and battery dependent, typically approx. 2-5 min indoors or technical FPV.",
      ],
    },
  ];

  useEffect(() => {
    function updatePortfolioRows() {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setInitialPortfolioProjectCount(5);
      } else if (window.matchMedia("(max-width: 1099px)").matches) {
        setInitialPortfolioProjectCount(10);
      } else {
        setInitialPortfolioProjectCount(15);
      }
    }

    function updateScrollControls() {
      setShowScrollControls(window.scrollY > 240);
    }

    updatePortfolioRows();
    updateScrollControls();
    window.addEventListener("resize", updatePortfolioRows);
    window.addEventListener("scroll", updateScrollControls, { passive: true });
    return () => {
      window.removeEventListener("resize", updatePortfolioRows);
      window.removeEventListener("scroll", updateScrollControls);
    };
  }, []);

  const scrollToPageStart = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToPageEnd = useCallback(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  }, []);

  const handleBookingLocationChange = useCallback((location) => {
    setBookingLocation(location);
    setIsBookingLocationMissing(false);
    setBookingSubmitState("idle");
  }, []);
  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!bookingLocation.label) {
      setIsBookingLocationMissing(true);
      setBookingSubmitState("idle");
      document.getElementById("booking-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!form.reportValidity()) return;

    setBookingSubmitState("sending");

    try {
      const formData = new FormData(form);
      formData.set("form-name", "booking-request");
      formData.set("location_label", bookingLocation.label);
      formData.set("location_lat", bookingLocation.lat);
      formData.set("location_lng", bookingLocation.lng);
      formData.set("location_map_url", bookingLocation.mapUrl);
      formData.set("_subject", "New drone booking request");

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) throw new Error("Booking request failed");

      form.reset();
      setBookingLocation({
        label: "",
        lat: "",
        lng: "",
        mapUrl: "",
      });
      setIsBookingLocationMissing(false);
      setBookingSubmitState("success");
    } catch {
      setBookingSubmitState("error");
    }
  };
  const bookingDroneOptions = [
    "Freefly Alta X",
    "FPV Cinelifter",
    "BMPCC 4K FPV Cinewhoop",
    "DJI Inspire 3",
    "DJI Mavic 4 Pro",
    "DJI Mini 5",
    "Micro FPV Drone",
    "Custom drone build",
  ];
  const bookingTimeOptions = Array.from({ length: 96 }, (_, index) => {
    const hours = String(Math.floor(index / 4)).padStart(2, "0");
    const minutes = String((index % 4) * 15).padStart(2, "0");
    return `${hours}:${minutes}`;
  });
  const categoryLabels = {
    en: {
      "Bioscoop films": "Feature films",
      "Tv-series": "TV series",
      Vastgoed: "Real estate",
    },
    nl: {
      "Aerial video": "Luchtbeelden",
      "Event registration": "Event registratie",
      Photography: "Fotografie",
      "Fly-Through": "Fly-through",
      "Prop drones": "Prop-drones",
      Sports: "Sport",
    },
  };
  const portfolioProjects = [
      {
          "title": "Bike Totaal – Vandaag pak je'm",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=03rWXsV2UWQ",
          "thumbnail": "/posters/bike-totaal-vandaag-pak-je-m.svg"
      },
      {
          "title": "Het Gouden Uur – Seizoen 2",
          "categories": [
              "Aerial video",
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=JpfaSsH9KBQ",
          "intro": {
              "en": "For Het Gouden Uur, T.I.M. built a dedicated phone delivery system for a hostage scene. Because current drone regulations do not allow objects to simply be dropped from the air, the drone first landed before the phone could be released, which made the moment even more tense within the story. We also flew the FPV drone footage from the criminals' point of view, and the drone is already shot out of the air in the opening minutes of the series.",
              "nl": "Voor Het Gouden Uur bouwde T.I.M. een speciaal telefoon-delivery systeem voor een gijzelingsscene. Omdat je volgens de huidige regelgeving niet zomaar iets uit de lucht mag droppen, landde de drone eerst voordat de telefoon kon worden afgegeven. Dat maakte het moment in het verhaal juist extra spannend. Daarnaast vlogen we de FPV-beelden vanuit het perspectief van de criminelen, en worden we in de eerste minuten van de serie al uit de lucht gevlogen."
          },
          "extraVideos": [
              {
                  "src": "/videos/het-gouden-uur-phone-delivery-bts-720p.mp4",
                  "title": "Phone delivery scene BTS",
                  "aspect": "compact"
              }
          ],
          "mediaLayout": "paired",
          "extraImages": [
              {
                  "src": "/poster-frames/het-gouden-uur-phone-delivery-final.png",
                  "title": "Drone landing before phone release"
              }
          ],
          "extraLinks": [
              {
                  "title": "Watch on NPO Start",
                  "url": "https://npo.nl/start/serie/het-gouden-uur/afleveringen/seizoen-1"
              }
          ],
          "thumbnail": "/posters/het-gouden-uur-seizoen-2.svg"
      },
      {
          "title": "De Tatta's 3",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=hQWdx6_ynEo",
          "thumbnail": "/posters/de-tatta-s-3.svg"
      },
      {
          "title": "SUGA: RIDE OR DIE",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=kN-ej-drDbY",
          "thumbnail": "/posters/suga-ride-or-die-reviews.jpg"
      },
      {
          "title": "P&O FERRIES \"Sail Your Way\"",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://vimeo.com/1110242300",
          "thumbnail": "/posters/pando-ferries-sail-your-way.svg"
      },
      {
          "title": "Miljoenenrace",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=sgeK3Zr6wu0",
          "thumbnail": "/posters/miljoenenrace.svg"
      },
      {
          "title": "Budget Thuis",
          "categories": [
              "Commercials",
              "Prop drones"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=hws4dHuvAXE",
          "intro": {
              "en": "For Budget Thuis, T.I.M. flew the prop drone used in the commercial. The catch was created in post-production with a bluescreen setup, so the practical drone movement and the final interaction could be combined safely and cleanly for the shot.",
              "nl": "Voor Budget Thuis vloog T.I.M. de prop-drone die in de commercial werd gebruikt. Het vangen is in post-productie gedaan met een bluescreen setup, zodat de praktische dronebeweging en de uiteindelijke interactie veilig en strak konden worden gecombineerd."
          },
          "extraVideos": [
              {
                  "src": "/videos/budget-thuis-propdrone-1080p.mp4",
                  "title": "Prop-drone BTS",
                  "aspect": "portrait"
              }
          ],
          "thumbnail": "/posters/budget-thuis.svg"
      },
      {
          "title": "Alpha 00",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=8diX8YbqLXY",
          "thumbnail": "/posters/alpha-00.svg"
      },
      {
          "title": "De Film van Rutger, Thomas & Paco 2",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=Tvn_LnDKBo0",
          "thumbnail": "/posters/de-film-van-rutger-thomas-and-paco-2.svg"
      },
      {
          "title": "Sphinx",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=r161WfNACpw",
          "thumbnail": "/posters/sphinx.svg"
      },
      {
          "title": "Iris van Herpen Fashion show drone tour",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=xwJb0-20Ad4",
          "extraLinks": [
              {
                  "title": "Instagram BTS",
                  "url": "https://www.instagram.com/p/BuBa6NcnrV4/?igsh=MXE0YnMxdXJnM2ZndA=="
              }
          ],
          "thumbnail": "/posters/iris-van-herpen-fashion-show-drone-tour.svg"
      },
      {
          "title": "BON BINI: BANGKOK NIGHTS",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=rQLWygUhkvc",
          "thumbnail": "/posters/bon-bini-bangkok-nights.svg"
      },
      {
          "title": "Bellezza Restaurant Drone Tour",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=kPL29rAtbNw",
          "thumbnail": "/posters/bellezza-restaurant-drone-tour.svg"
      },
      {
          "title": "Hilton Luminair Opening",
          "categories": [
              "Aerial video",
              "Event registration",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=LUbHEB1Mb7w",
          "thumbnail": "/posters/hilton-luminair-opening.svg"
      },
      {
          "title": "Enexis TVC",
          "categories": [
              "Aerial video",
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=wCIokXlZOf4",
          "thumbnail": "/posters/enexis-tvc.svg"
      },
      {
          "title": "Toffler Festival",
          "categories": [
              "Aerial video",
              "FPV",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=E022q-vozvM",
          "thumbnail": "/posters/toffler-festival.svg"
      },
      {
          "title": "Mocro Maffia 5",
          "categories": [
              "Aerial video",
              "Tv-series",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=vDUZlKnZ29E",
          "thumbnail": "/posters/mocro-maffia-5.svg"
      },
      {
          "title": "Utrecht heeft jou nodig",
          "categories": [
              "Aerial video"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=Cmnd8lzqRzU",
          "thumbnail": "/posters/utrecht-heeft-jou-nodig.svg"
      },
      {
          "title": "Morpheus debut EP",
          "categories": [
              "Aerial video",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=VH7UN-s_mvk",
          "thumbnail": "/posters/morpheus-debut-ep.svg"
      },
      {
          "title": "Spotify drone show Amsterdam Dance Event",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=qyqhP0ylDEk",
          "thumbnail": "/posters/spotify-drone-show-amsterdam-dance-event.svg"
      },
      {
          "title": "Eerlijk is eerlijk",
          "categories": [
              "Aerial video",
              "Commercials",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=WAZE0Z9wyzQ",
          "thumbnail": "/posters/eerlijk-is-eerlijk.svg"
      },
      {
          "title": "Interparking Scheveningen",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=nSv3R5iDoXk",
          "thumbnail": "/posters/interparking-scheveningen.svg"
      },
      {
          "title": "Drone show for Ukraine",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=h5NJZCRylw0",
          "thumbnail": "/posters/drone-show-for-ukraine.svg"
      },
      {
          "title": "Texel op z’n Texels",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=WujheE--ikw",
          "thumbnail": "/posters/texel-op-z-n-texels.svg"
      },
      {
          "title": "Murky Skies",
          "categories": [
              "Aerial video",
              "Tv-series",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=TWG9CNk0NKc",
          "thumbnail": "/posters/murky-skies.svg"
      },
      {
          "title": "This is Nuna 11s",
          "categories": [
              "Aerial video",
              "Sports"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=5FYoibOE5OM",
          "thumbnail": "/posters/this-is-nuna-11s.svg"
      },
      {
          "title": "DRIFT: Breaking Waves",
          "categories": [
              "Aerial video"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=0qVzwoZMX9I",
          "thumbnail": "/posters/drift-breaking-waves.svg"
      },
      {
          "title": "G-Star RAW – Sarah Lezito",
          "categories": [
              "Commercials",
              "FPV",
              "Sports"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=S8pH3hn88l8",
          "thumbnail": "/posters/g-star-raw-sarah-lezito.svg"
      },
      {
          "title": "Zeeman – Skeer",
          "categories": [
              "Commercials",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=nsgtXDqA-9E",
          "thumbnail": "/posters/zeeman-skeer.svg"
      },
      {
          "title": "Sanquin Bloedbank",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=7wRYcI_dx18",
          "thumbnail": "/posters/sanquin-bloedbank.svg"
      },
      {
          "title": "Hyundai IONIQ concept ‘SEVEN’",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=7UXyfPLElhY",
          "thumbnail": "/posters/hyundai-ioniq-concept-seven.svg"
      },
      {
          "title": "Franchise Freedom",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://vimeo.com/589281970",
          "thumbnail": "/posters/franchise-freedom.svg"
      },
      {
          "title": "Van der Valk, Seizoen 2",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=KfaT8tGup5M",
          "thumbnail": "/posters/van-der-valk-seizoen-2.svg"
      },
      {
          "title": "Beekse Bergen",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=MlL-q0BfCiM",
          "thumbnail": "/posters/beekse-bergen.svg"
      },
      {
          "title": "Samsung Droneshow",
          "categories": [
              "Commercials",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=ZfIxBQEKRR4",
          "thumbnail": "/posters/samsung-droneshow.svg"
      },
      {
          "title": "DJ Brennan Heart – In The Fastlane",
          "categories": [
              "FPV",
              "Sports"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=_0uzelh0DOw",
          "thumbnail": "/posters/dj-brennan-heart-in-the-fastlane.svg"
      },
      {
          "title": "RAUWCC Studio Drone Tours",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=WqiOh1qZ8Yk",
          "thumbnail": "/posters/rauwcc-studio-drone-tours.svg"
      },
      {
          "title": "Awakenings presents ADE",
          "categories": [
              "FPV",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=LNzYuxIi40A",
          "thumbnail": "/posters/awakenings-presents-ade.svg"
      },
      {
          "title": "Grolsch 0.0%",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://vimeo.com/539594841",
          "thumbnail": "/posters/grolsch-0-0.svg"
      },
      {
          "title": "McDonald’s – Corona love story",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=-DD53-Mwrkc",
          "thumbnail": "/posters/mcdonald-s-corona-love-story.svg"
      },
      {
          "title": "BeBoulder Fly-Through",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=wldtWrp0J0M",
          "thumbnail": "/posters/beboulder-fly-through.svg"
      },
      {
          "title": "Boogie woogie now",
          "categories": [
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=mZmeyYB3JnU",
          "thumbnail": "/posters/boogie-woogie-now.svg"
      },
      {
          "title": "Oud en nieuw 2021",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=l0qCPryjs-0",
          "thumbnail": "/posters/oud-en-nieuw-2021.svg"
      },
      {
          "title": "David Attenborough: A Life On Our Planet",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=sbUNXyOQr40",
          "thumbnail": "/posters/david-attenborough-a-life-on-our-planet.svg"
      },
      {
          "title": "De Stamhouder",
          "categories": [
              "Aerial video",
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=ViWA_yI2auc",
          "thumbnail": "/posters/de-stamhouder.svg"
      },
      {
          "title": "Upload – De Nationale Opera",
          "categories": [
              "Aerial video"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=QYo5a8Kmt4E",
          "thumbnail": "/posters/upload-de-nationale-opera.svg"
      },
      {
          "title": "Lidl zomer commercial 2020",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=7qOpOMP3A90",
          "thumbnail": "/posters/lidl-zomer-commercial-2020.svg"
      },
      {
          "title": "Drone Show AL ULA Saudi Arabia",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=mdwzQJP2rPA",
          "thumbnail": "/posters/drone-show-al-ula-saudi-arabia.svg"
      },
      {
          "title": "Madurodam Commercials 2019",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=jr4Z9DwYQB8",
          "thumbnail": "/posters/madurodam-commercials-2019.svg"
      },
      {
          "title": "Antea Group commercial 2019",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=4--l8aX1rfA",
          "thumbnail": "/posters/antea-group-commercial-2019.svg"
      },
      {
          "title": "De Patrick",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=iaRdo05OoXg",
          "thumbnail": "/posters/de-patrick.svg"
      },
      {
          "title": "Kruimeltje",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=yT2PAsQabps",
          "thumbnail": "/posters/kruimeltje.svg"
      },
      {
          "title": "Suzuki Katana challenge",
          "categories": [
              "Commercials",
              "FPV"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=K_uN7rnxZvw",
          "thumbnail": "/posters/suzuki-katana-challenge.svg"
      },
      {
          "title": "Iris van Herpen – Shift Souls",
          "categories": [
              "FPV"
          ],
          "videoUrl": "https://vimeo.com/317942975",
          "thumbnail": "/posters/iris-van-herpen-shift-souls.svg"
      },
      {
          "title": "PLUS Kerst reclame 2018",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://vimeo.com/304796817",
          "thumbnail": "/posters/plus-kerst-reclame-2018.svg"
      },
      {
          "title": "Van Moof",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=tlmBgzH6nXk",
          "thumbnail": "/posters/van-moof.svg"
      },
      {
          "title": "#ChallengeAccepted",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=aknbXFsrU9I",
          "thumbnail": "/posters/challengeaccepted.svg"
      },
      {
          "title": "Behind the scenes fly-through",
          "categories": [
              "BTS"
          ],
          "videoUrl": "/hero.mp4",
          "thumbnail": "/poster-frames/bts-hero-video.jpg"
      },
      {
          "title": "BOSS x AMF1 x Apple Vision Pro",
          "categories": [
              "FPV",
              "Sports",
              "Commercials"
          ],
          "intro": {
              "en": "For EmpathyLab's Step Inside The Mind of a BOSS activation, we worked closely with the creative and technical team to translate an ambitious Apple Vision Pro experience into fast, precise FPV shots. The project needed more than a standard FPV setup, so we helped think through the shot design and built two dedicated camera systems on cinelifters for the specific 360 and high-speed perspectives required at Circuit Zandvoort.",
              "nl": "Voor EmpathyLab's Step Inside The Mind of a BOSS activatie dachten we vanaf de technische en creatieve kant mee om een ambitieuze Apple Vision Pro ervaring te vertalen naar snelle, precieze FPV-shots. Dit vroeg om meer dan een standaard FPV-setup: voor de specifieke 360- en high-speed shots op Circuit Zandvoort bouwden we twee dedicated camerasystemen op cinelifters."
          },
          "extraImages": [
              {
                  "title": "Canon 3D cinelifter build",
                  "src": "/poster-frames/boss-amf1-canon-3d-stylish.jpg"
              },
              {
                  "title": "Insta360 12K cinelifter build",
                  "src": "/poster-frames/boss-amf1-insta360-stylish.jpg"
              }
          ],
          "videoUrl": "https://www.youtube.com/watch?v=pd-FxtLuyXI",
          "thumbnail": "/posters/boss-x-amf1-x-apple-vision-pro.svg"
      },
      {
          "title": "Fly-Through logistics center Enexis",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "/videos/enexis-openingsfilm-logistiek-centrum-hoogeveen.mp4",
          "thumbnail": "/posters/fly-through-logistics-center-enexis.svg"
      },
      {
          "title": "Liander logistics location Fly-Through",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "thumbnail": "/posters/liander-logistics-location-fly-through.svg"
      },
      {
          "title": "Flikken Rotterdam",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=Xq8jlXbC5jE",
          "thumbnail": "/posters/flikken-rotterdam.svg"
      },
      {
          "title": "Droneshow Montenegro",
          "categories": [
              "Aerial video",
              "Events"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=hZfLACMiRrM",
          "thumbnail": "/posters/droneshow-montenegro.svg"
      },
      {
          "title": "SAMCITY FPV Drone Fly-Through",
          "categories": [
              "Aerial video",
              "Fly-Through"
          ],
          "videoUrl": "/videos/samcity-fpv-drone-fly-through.mp4",
          "thumbnail": "/posters/samcity-fpv-drone-fly-through.svg"
      },
      {
          "title": "KARGO Case Study 2025",
          "categories": [
              "Event registration",
              "Aerial video"
          ],
          "videoUrl": "https://vimeo.com/1120747780",
          "thumbnail": "/posters/kargo-case-study-2025.svg"
      },
      {
          "title": "KARGO Cannes Case Study",
          "categories": [
              "Event registration",
              "Aerial video"
          ],
          "videoUrl": "https://vimeo.com/1017139438?h=4327ec4d14",
          "thumbnail": "/posters/kargo-cannes-case-study.svg"
      },
      {
          "title": "Witte Flits",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "/videos/witte-flits-trailer.mp4",
          "thumbnail": "/poster-frames/witte-flits-16x9.jpg"
      },
      {
          "title": "Expeditie Robinson 2021",
          "categories": [
              "Tv-series",
              "FPV"
          ],
          "thumbnail": "/posters/expeditie-robinson-2021.svg"
      },
      {
          "title": "Toyota GR Yaris",
          "categories": [
              "Commercials",
              "FPV"
          ],
          "videoUrl": "/videos/toyota-gr-yaris-circuit-assen.mp4",
          "thumbnail": "/posters/toyota-gr-yaris.svg"
      },
      {
          "title": "Opa en oma | McDonald’s",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=KUprsszZLOI",
          "thumbnail": "/posters/opa-en-oma-mcdonald-s.svg"
      },
      {
          "title": "De Volksbank",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=DmUrAH8Wmz0",
          "thumbnail": "/posters/de-volksbank.svg"
      },
      {
          "title": "CS Short: MINERS HAVEN",
          "categories": [
              "Awards",
              "Shorts"
          ],
          "videoUrl": "/videos/cs-short-miners-haven.mp4",
          "thumbnail": "/posters/cs-short-miners-haven.svg"
      },
      {
          "title": "Omgevingsdienst Noordzeekanaal",
          "categories": [
              "Photography"
          ],
          "thumbnail": "/posters/omgevingsdienst-noordzeekanaal.svg"
      },
      {
          "title": "SpaceBoy",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=g21kraN6mDs",
          "thumbnail": "/posters/spaceboy.svg"
      },
      {
          "title": "McDonald’s for You",
          "categories": [
              "Commercials"
          ],
          "thumbnail": "/posters/mcdonald-s-for-you.svg"
      },
      {
          "title": "Netflix – Our planet",
          "categories": [
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=aETNYyrqNYE",
          "thumbnail": "/posters/netflix-our-planet.svg"
      },
      {
          "title": "Facebook intro Postcode Loterij",
          "categories": [
              "Aerial video"
          ],
          "thumbnail": "/posters/facebook-intro-postcode-loterij.svg"
      }
  ];
  const projectReleaseDates = {
    "Bike Totaal – Vandaag pak je'm": "2026-06-04",
    "De Film van Rutger, Thomas & Paco 2": "2026-06-03",
    "Budget Thuis": "2026-05-05",
    "Alpha 00": "2026-01-18",
    "De Tatta's 3": "2025-12-11",
    "Het Gouden Uur – Seizoen 2": "2025-09-18",
    "SUGA: RIDE OR DIE": "2025-09-04",
    "P&O FERRIES \"Sail Your Way\"": "2025-08-15",
    "KARGO Case Study 2025": "2025-09-22",
    "Behind the scenes fly-through": "2025-06-02",
    "BOSS x AMF1 x Apple Vision Pro": "2025-06-01",
    "Miljoenenrace": "2025-01-01",
    "KARGO Cannes Case Study": "2024-10-07",
    "Witte Flits": "2024-09-26",
    "Sphinx": "2024-03-22",
    "Iris van Herpen Fashion show drone tour": "2024-01-01",
    "Fly-Through logistics center Enexis": "2023-12-30",
    "Liander logistics location Fly-Through": "2023-12-28",
    "BON BINI: BANGKOK NIGHTS": "2023-12-21",
    "Bellezza Restaurant Drone Tour": "2023-11-01",
    "Hilton Luminair Opening": "2023-10-01",
    "Enexis TVC": "2023-09-01",
    "Toffler Festival": "2023-08-01",
    "Mocro Maffia 5": "2023-06-02",
    "Utrecht heeft jou nodig": "2023-05-01",
    "Morpheus debut EP": "2023-04-01",
    "De Stamhouder": "2023-01-01",
    "Spotify drone show Amsterdam Dance Event": "2022-10-01",
    "Eerlijk is eerlijk": "2022-09-01",
    "Interparking Scheveningen": "2022-09-01",
    "Drone show for Ukraine": "2022-08-01",
    "Texel op z’n Texels": "2022-07-01",
    "Murky Skies": "2022-06-01",
    "This is Nuna 11s": "2022-05-01",
    "DRIFT: Breaking Waves": "2022-04-01",
    "G-Star RAW – Sarah Lezito": "2022-03-01",
    "Zeeman – Skeer": "2022-02-01",
    "Upload – De Nationale Opera": "2022-01-15",
    "Sanquin Bloedbank": "2021-12-01",
    "Flikken Rotterdam": "2021-11-15",
    "Hyundai IONIQ concept ‘SEVEN’": "2021-11-01",
    "Awakenings presents ADE": "2021-10-01",
    "Franchise Freedom": "2021-09-01",
    "Droneshow Montenegro": "2021-08-15",
    "Van der Valk, Seizoen 2": "2021-08-01",
    "Beekse Bergen": "2021-08-01",
    "SAMCITY FPV Drone Fly-Through": "2021-07-15",
    "Samsung Droneshow": "2021-07-01",
    "DJ Brennan Heart – In The Fastlane": "2021-06-01",
    "RAUWCC Studio Drone Tours": "2021-05-01",
    "Grolsch 0.0%": "2021-04-01",
    "Expeditie Robinson 2021": "2021-03-15",
    "Toyota GR Yaris": "2021-03-05",
    "McDonald’s – Corona love story": "2021-03-01",
    "Opa en oma | McDonald’s": "2021-02-15",
    "BeBoulder Fly-Through": "2021-01-01",
    "Boogie woogie now": "2020-12-15",
    "Oud en nieuw 2021": "2020-12-01",
    "David Attenborough: A Life On Our Planet": "2020-10-04",
    "Lidl zomer commercial 2020": "2020-06-01",
    "Drone Show AL ULA Saudi Arabia": "2020-03-01",
    "De Volksbank": "2020-02-15",
    "Kruimeltje": "2019-12-04",
    "CS Short: MINERS HAVEN": "2019-11-15",
    "Omgevingsdienst Noordzeekanaal": "2019-11-10",
    "SpaceBoy": "2019-11-05",
    "Madurodam Commercials 2019": "2019-11-01",
    "Antea Group commercial 2019": "2019-09-01",
    "De Patrick": "2019-08-28",
    "Suzuki Katana challenge": "2019-05-01",
    "Iris van Herpen – Shift Souls": "2019-01-21",
    "McDonald’s for You": "2019-01-01",
    "PLUS Kerst reclame 2018": "2018-12-01",
    "Netflix – Our planet": "2018-11-01",
    "Facebook intro Postcode Loterij": "2018-10-15",
    "Van Moof": "2018-10-01",
    "#ChallengeAccepted": "2018-09-01",
  };
  const sortedPortfolioProjects = portfolioProjects
    .map((project, index) => ({
      ...project,
      releaseDate: projectReleaseDates[project.title] || "1900-01-01",
      originalOrder: index,
    }))
    .sort((projectA, projectB) => Date.parse(projectB.releaseDate) - Date.parse(projectA.releaseDate) || projectA.originalOrder - projectB.originalOrder);
  const visiblePortfolioProjects = activeFilter === "All"
    ? sortedPortfolioProjects
    : sortedPortfolioProjects.filter((project) => project.categories.includes(activeFilter));
  const displayedPortfolioProjects = portfolioExpanded
    ? visiblePortfolioProjects
    : visiblePortfolioProjects.slice(0, initialPortfolioProjectCount);
  const hasHiddenPortfolioProjects = visiblePortfolioProjects.length > initialPortfolioProjectCount;
  const hasActiveProjectDetails = Boolean(
    activeProject?.intro ||
    activeProject?.extraVideos?.length ||
    activeProject?.extraImages?.length ||
    activeProject?.extraLinks?.length
  );
  const hasPairedActiveProjectMedia = Boolean(
    activeProject?.mediaLayout === "paired" &&
    activeProject?.extraVideos?.length &&
    activeProject?.extraImages?.length
  );
  const portfolioFilterAliases = {
    "Feature films": "Bioscoop films",
    "TV series": "Tv-series",
    "Real estate": "Vastgoed",
    "Event registratie": "Event registration",
    Alles: "All",
    Luchtbeelden: "Aerial video",
    Fotografie: "Photography",
    Bioscoopfilms: "Bioscoop films",
    "Fly-through": "Fly-Through",
    "Prop-drones": "Prop drones",
    Sport: "Sports",
  };

  function getEmbedUrl(url) {
    const youtubeId = url.match(/[?&]v=([A-Za-z0-9_-]+)/)?.[1];
    const vimeoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

    if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`;
    return url;
  }

  function isLocalVideo(url) {
    return url?.startsWith("/videos/");
  }

  if (servicePage) {
    return <ServicePage page={servicePage} language={language} setLanguage={setLanguage} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader language={language} setLanguage={setLanguage} />

      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <div className="hero-logo-frame" aria-label="T.I.M. Drone Company, the incredible machines">
            <span className="hero-logo-corner hero-logo-corner-top-right" />
            <span className="hero-logo-corner hero-logo-corner-bottom-left" />
            <h1 className="hero-logo">
              <span className="hero-logo-main">
                T<span className="hero-logo-dot">.</span>I<span className="hero-logo-dot">.</span>M<span className="hero-logo-dot">.</span>
              </span>
              <span className="hero-logo-tagline">the incredible machines</span>
              <span className="hero-logo-company">Drone Company</span>
            </h1>
          </div>
          <p className="hero-hero-line">{t.heroLine}</p>
          <div className="hero-cta-group">
            <a href="#about" className="hero-cta-btn hero-cta-btn-primary">About</a>
            <a href="#fleet" className="hero-cta-btn hero-cta-btn-secondary">Fleet</a>
            <a href="#booking" className="hero-cta-btn hero-cta-btn-secondary">{t.bookingNav}</a>
            <a href="#work" className="hero-cta-btn hero-cta-btn-secondary">Work</a>
            <a href="#contact" className="hero-cta-btn hero-cta-btn-secondary">{t.contact}</a>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-container">
          <p className="about-label">{t.aboutLabel}</p>
          <h2 className="about-title">{t.aboutTitle}</h2>
          <div className="about-copy">
            <p>{t.aboutLeft1}</p>
            <p>{t.aboutLeft2}</p>
            <p>{t.aboutRight4}</p>
            <p>{t.aboutLeft3}</p>
            <p>{t.aboutLeft4}</p>
            <p>{t.aboutRight1}</p>
            <p>{t.aboutRight2}</p>
            <p>{t.aboutRight3}</p>
            <p>{t.aboutRight5}</p>
            <p>{t.aboutRight6}</p>
            <p>{t.aboutRight7}</p>
          </div>
        </div>
      </section>

      <section id="fleet" className="fleet-section">
        <div className="fleet-container">
          <p className="fleet-label">{t.fleetLabel}</p>
          <h2 className="fleet-title">{t.fleetTitle}</h2>
          <div className="fleet-grid">
            {fleetItems.map((drone) => (
              <FleetCard
                key={drone.id}
                drone={drone}
                isActive={activeFleetDrone === drone.id}
                onToggle={() => setActiveFleetDrone(activeFleetDrone === drone.id ? null : drone.id)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="service-directory-section">
        <div className="service-directory-container">
          <div className="service-directory-header">
            <p className="service-directory-label">Company facts</p>
            <h2 className="service-directory-title">Amsterdam-based drone company for film, TV and commercial productions.</h2>
            <p className="service-directory-intro">
              A compact overview for producers, agencies and directors who need to understand the crew, equipment and production workflow before booking aerial work.
            </p>
          </div>
          <div className="company-facts-grid">
            {companyFactPages.map((factPage) => (
              <a key={factPage.slug} href={factPage.path} className="company-fact-card">
                <span>{factPage.serviceType}</span>
                <h3>{factPage.summaryTitle}</h3>
                <p>{factPage.summaryText}</p>
              </a>
            ))}
          </div>
          <div className="company-capability-links" aria-label="Dedicated service pages">
            <span>Dedicated pages</span>
            {servicePages.map((servicePage) => (
              <a key={servicePage.slug} href={servicePage.path}>
                {servicePage.serviceType}
              </a>
            ))}
          </div>
          <div className="location-check-cta">
            <div>
              <span>Location check</span>
              <p>Not sure if the shoot location is possible? Send us the address or a map pin on WhatsApp and we will help you check the basics before you book.</p>
            </div>
            <a href={locationCheckWhatsAppUrl} target="_blank" rel="noreferrer">
              WhatsApp location
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="work-section">
        <div className="work-container">
          <p className="work-label">{t.portfolioLabel}</p>
          <h2 className="work-title">{t.portfolioTitle}</h2>
          <p className="work-subtitle">{t.portfolioSubtitle}</p>
          <div className="work-filter">
            {t.portfolioFilters.map((filter) => {
              const filterValue = portfolioFilterAliases[filter] || filter;
              return (
                <button
                  key={filter}
                  type="button"
                  className={`work-filter-button ${activeFilter === filterValue ? "work-filter-button-active" : ""}`}
                  onClick={() => {
                    setActiveFilter(filterValue);
                    setPortfolioExpanded(false);
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <div className="portfolio-grid">
            {displayedPortfolioProjects.map((project) => (
              <button
                key={project.title}
                type="button"
                className={`portfolio-card ${project.videoUrl ? "" : "portfolio-card-static"}`}
                onClick={() => {
                  if (project.videoUrl) setActiveProject(project);
                }}
                aria-disabled={!project.videoUrl}
              >
                <div className="portfolio-card-image-wrap">
                  <img src={project.thumbnail} alt={project.title} className="portfolio-card-image" />
                </div>
                <div className="portfolio-card-body">
                  <h3 className="portfolio-card-title">{project.title}</h3>
                </div>
              </button>
            ))}
          </div>
          {hasHiddenPortfolioProjects && (
            <button
              type="button"
              className="portfolio-expand-button"
              onClick={() => setPortfolioExpanded((isExpanded) => !isExpanded)}
            >
              {portfolioExpanded ? t.portfolioShowLess : t.portfolioShowMore}
            </button>
          )}
        </div>
      </section>

      {activeProject && (
        <div className="video-modal" onClick={() => setActiveProject(null)}>
          <div
            className={`video-modal-inner ${hasActiveProjectDetails ? "video-modal-inner-with-copy" : ""}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="video-modal-close" onClick={() => setActiveProject(null)}>Close</button>
            <div className="video-modal-media">
              {isLocalVideo(activeProject.videoUrl) ? (
                <video
                  src={activeProject.videoUrl}
                  title={activeProject.title}
                  className="video-modal-frame"
                  controls
                  playsInline
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activeProject.videoUrl)}
                  title={activeProject.title}
                  className="video-modal-frame"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              )}
            </div>
            {hasActiveProjectDetails && (
              <div className="video-modal-copy">
                <p className="video-modal-copy-label">{categoryLabels[language][activeProject.categories[0]] || activeProject.categories[0]}</p>
                <h3>{activeProject.title}</h3>
                {activeProject.intro && (
                  <p className="video-modal-intro">{activeProject.intro[language] || activeProject.intro.en}</p>
                )}
                {hasPairedActiveProjectMedia && (
                  <div className="video-modal-extra-media-pair">
                    <div className={`video-modal-extra-video ${activeProject.extraVideos[0].aspect === "portrait" ? "video-modal-extra-video-portrait" : ""} ${activeProject.extraVideos[0].aspect === "compact" ? "video-modal-extra-video-compact" : ""}`} key={activeProject.extraVideos[0].src}>
                      <video src={activeProject.extraVideos[0].src} controls playsInline preload="metadata" />
                      <span>{activeProject.extraVideos[0].title}</span>
                    </div>
                    <figure className="video-modal-extra-image" key={activeProject.extraImages[0].src}>
                      <img src={activeProject.extraImages[0].src} alt={activeProject.extraImages[0].title} loading="lazy" />
                      <figcaption>{activeProject.extraImages[0].title}</figcaption>
                    </figure>
                  </div>
                )}
                {!hasPairedActiveProjectMedia && activeProject.extraVideos?.length > 0 && (
                  <div className="video-modal-extra-videos">
                    {activeProject.extraVideos.map((video) => (
                      <div className={`video-modal-extra-video ${video.aspect === "portrait" ? "video-modal-extra-video-portrait" : ""} ${video.aspect === "compact" ? "video-modal-extra-video-compact" : ""}`} key={video.src}>
                        <video src={video.src} controls playsInline preload="metadata" />
                        <span>{video.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                {!hasPairedActiveProjectMedia && activeProject.extraImages?.length > 0 && (
                  <div className="video-modal-extra-images">
                    {activeProject.extraImages.map((image) => (
                      <figure className="video-modal-extra-image" key={image.src}>
                        <img src={image.src} alt={image.title} loading="lazy" />
                        <figcaption>{image.title}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {activeProject.extraLinks?.length > 0 && (
                  <div className="video-modal-extra-links">
                    {activeProject.extraLinks.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                        {link.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <section id="booking" className="booking-section">
        <div className="booking-container">
          <div className="booking-header">
            <div>
              <p className="booking-label">{t.bookingLabel}</p>
              <h2 className="booking-title">{t.bookingTitle}</h2>
            </div>
            <p className="booking-intro">{t.bookingIntro}</p>
          </div>
          <form name="booking-request" method="POST" action="/" data-netlify="true" className="booking-form" onSubmit={handleBookingSubmit}>
            <input type="hidden" name="form-name" value="booking-request" />
            <input type="hidden" name="_subject" value="New drone booking request" />
            <label className="booking-field">
              <span>{t.bookingName}</span>
              <input type="text" name="name" autoComplete="name" required />
            </label>
            <label className="booking-field">
              <span>{t.bookingEmail}</span>
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label className="booking-field">
              <span>{t.bookingPhone}</span>
              <input type="tel" name="phone" autoComplete="tel" required />
            </label>
            <label className="booking-field">
              <span>{t.bookingDate}</span>
              <input type="date" name="date" required />
            </label>
            <label className="booking-field">
              <span>{t.bookingStartTime}</span>
              <select name="start_time" required defaultValue="">
                <option value="" disabled>{t.bookingStartTime}</option>
                {bookingTimeOptions.map((time) => (
                  <option key={`start-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </label>
            <label className="booking-field">
              <span>{t.bookingEndTime}</span>
              <select name="end_time" required defaultValue="">
                <option value="" disabled>{t.bookingEndTime}</option>
                {bookingTimeOptions.map((time) => (
                  <option key={`end-${time}`} value={time}>{time}</option>
                ))}
              </select>
            </label>
            <label className="booking-field">
              <span>{t.bookingDroneType}</span>
              <select name="drone_type" required defaultValue="">
                <option value="" disabled>{t.bookingDroneType}</option>
                {bookingDroneOptions.map((drone) => (
                  <option key={drone} value={drone}>{drone}</option>
                ))}
              </select>
            </label>
            <div id="booking-map" className="booking-field booking-field-wide">
              <span>{t.mapSearchLabel}</span>
              <BookingMap copy={t} selectedLocation={bookingLocation} onLocationChange={handleBookingLocationChange} />
            </div>
            <label className="booking-field booking-field-wide booking-selected-location-field">
              <span>{t.mapSelectedLabel}</span>
              <input type="text" name="location_label" value={bookingLocation.label} placeholder={t.mapNoSelection} readOnly required />
              {isBookingLocationMissing && <small className="booking-location-error">{t.mapRequired}</small>}
            </label>
            <input type="hidden" name="location_lat" value={bookingLocation.lat} readOnly />
            <input type="hidden" name="location_lng" value={bookingLocation.lng} readOnly />
            <input type="hidden" name="location_map_url" value={bookingLocation.mapUrl} readOnly />
            <label className="booking-field booking-field-wide">
              <span>{t.bookingDescription}</span>
              <textarea name="shot_description" rows="6" placeholder={t.bookingDescriptionPlaceholder} required />
              <small>{t.bookingShotSuggestions}</small>
            </label>
            <button type="submit" className="booking-submit" disabled={bookingSubmitState === "sending"}>
              {bookingSubmitState === "sending" ? t.bookingSending : t.bookingSubmit}
            </button>
            {bookingSubmitState === "success" && (
              <p className="booking-form-message booking-form-message-success" role="status">{t.bookingSuccess}</p>
            )}
            {bookingSubmitState === "error" && (
              <p className="booking-form-message booking-form-message-error" role="alert">{t.bookingError}</p>
            )}
          </form>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">{t.contact}</h2>
          <div className="contact-info">
            <p>T.I.M. Drone Company</p>
            <p>
              <button type="button" className="contact-phone-button" onClick={() => setIsWhatsAppOpen(true)}>
                +31 6 25083448
              </button>
            </p>
            <p>
              <a className="contact-link" href="mailto:timdronecompany@gmail.com">
                timdronecompany@gmail.com
              </a>
            </p>
            <p className="contact-kvk">KvK: 51784319</p>
            <div className="contact-socials" aria-label="Social profiles">
              <a href="https://www.linkedin.com/in/tim-van-vliet-26425193/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <span>in</span>
              </a>
              <a href="https://www.instagram.com/tim_dronecompany/" target="_blank" rel="noreferrer" aria-label="Instagram">
                <span>◎</span>
              </a>
              <a href="https://www.facebook.com/timdronecompany/" target="_blank" rel="noreferrer" aria-label="Facebook">
                <span>f</span>
              </a>
              <a href="https://open.spotify.com/track/4e9eGQYsOiBcftrWXwsVco" target="_blank" rel="noreferrer" aria-label="Listen on Spotify">
                <span>♪</span>
              </a>
            </div>
            <p className="contact-subtext">{t.contactLine}</p>
          </div>
        </div>
      </section>

      {isWhatsAppOpen && (
        <div className="whatsapp-modal" onClick={() => setIsWhatsAppOpen(false)}>
          <div className="whatsapp-modal-inner" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="whatsapp-modal-close" onClick={() => setIsWhatsAppOpen(false)} aria-label={t.close}>
              ×
            </button>
            <div className="whatsapp-modal-mark">WA</div>
            <h2 className="whatsapp-modal-title">{t.whatsappTitle}</h2>
            <p className="whatsapp-modal-text">{t.whatsappText}</p>
            <div className="whatsapp-modal-actions">
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="whatsapp-modal-primary">
                {t.whatsappButton}
              </a>
              <a href="tel:+31625083448" className="whatsapp-modal-secondary">
                {t.callButton}
              </a>
            </div>
          </div>
        </div>
      )}

      <div className={`scroll-jump-controls ${showScrollControls ? "scroll-jump-controls-visible" : ""}`} aria-hidden={!showScrollControls}>
        <button type="button" className="scroll-jump-button" onClick={scrollToPageStart} aria-label={language === "nl" ? "Naar boven" : "Scroll to top"}>
          ↑
        </button>
        <button type="button" className="scroll-jump-button" onClick={scrollToPageEnd} aria-label={language === "nl" ? "Naar beneden" : "Scroll to bottom"}>
          ↓
        </button>
      </div>
    </div>
  );
}
