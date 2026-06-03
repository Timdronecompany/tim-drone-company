import { useState } from "react";

function DroneVisual({ variant }) {
  const droneImages = {
    alta: "/alta.png",
    inspire: "/inspire.png",
    fpv: "/fpv.png",
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

export default function TimDroneCompanyPortfolio() {
  const [language, setLanguage] = useState("en");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeProject, setActiveProject] = useState(null);

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
      cinematicDrone: "Cinematic Drone",
      altaText: <>Configured for the <span className="text-white">ARRI Alexa Mini LF</span> with anamorphic lens setups and professional cinema workflows.</>,
      inspireText: "High-end aerial cinematography platform designed for demanding productions and cinematic camera movement.",
      fpvText: "Heavy lift dual operator FPV systems for dynamic cinematic movement, precision flying and immersive action sequences.",
      mavicText: "Compact professional aerial platform with advanced stabilization, ideal for fast-paced productions and versatile camera movements.",
      microDrone: "Micro Drone",
      microText: "Ultra-compact professional platform for agile productions, ideal for tight spaces and fast-response aerial coverage.",
      microFpvLabel: "Micro FPV",
      microFpvText: "Compact FPV platform for dynamic, immersive aerial movement and precision flying in confined spaces.",
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
      portfolioFilters: ["All", "Aerial video", "Awards", "Commercials", "Events", "Feature films", "Fly-Through", "FPV", "Prop drones", "Real estate", "Shorts", "Sports", "TV series"],
      contact: "Contact",
      contactLine: "Available for commercials, film, television and international productions.",
      heroLine: "AMSTERDAM · AVAILABLE WORLDWIDE",
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
      cinematicDrone: "Cinematic Drone",
      altaText: <>Geconfigureerd voor de <span className="text-white">ARRI Alexa Mini LF</span> met anamorphic lens setups en professionele cinema-workflows.</>,
      inspireText: "High-end aerial cinematography platform voor veeleisende producties en cinematografische camerabewegingen.",
      fpvText: "Heavy lift dual operator FPV-systemen voor dynamische camerabewegingen, precisievluchten en meeslepende action sequences.",
      mavicText: "Compact professional aerial platform met geavanceerde stabilisatie, ideaal voor snelle producties en veelzijdige camerabewegingen.",
      microDrone: "Micro Drone",
      microText: "Ultracompact professioneel platform voor wendbare producties, ideaal voor krappe ruimtes en snelle camerabewegingen.",
      microFpvLabel: "Micro FPV",
      microFpvText: "Compact FPV platform voor dynamische, meeslepende camerabewegingen en precisievluchten in krappe ruimtes.",
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
      portfolioFilters: ["Alles", "Luchtbeelden", "Awards", "Commercials", "Events", "Bioscoopfilms", "Fly-through", "FPV", "Prop-drones", "Vastgoed", "Shorts", "Sport", "Tv-series"],
      contact: "Contact",
      contactLine: "Beschikbaar voor commercials, film, televisie en internationale producties.",
      heroLine: "AMSTERDAM · WERELDWIJD BESCHIKBAAR",
    },
  };

  const t = copy[language];
  const categoryLabels = {
    en: {
      "Bioscoop films": "Feature films",
      "Tv-series": "TV series",
      Vastgoed: "Real estate",
    },
    nl: {
      "Aerial video": "Luchtbeelden",
      "Fly-Through": "Fly-through",
      "Prop drones": "Prop-drones",
      Sports: "Sport",
    },
  };
  const portfolioProjects = [
      {
          "title": "Het Gouden Uur – Seizoen 2",
          "categories": [
              "Aerial video",
              "Tv-series"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=JpfaSsH9KBQ",
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
          "thumbnail": "/posters/suga-ride-or-die.svg"
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
              "Vastgoed",
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
          "videoUrl": "https://www.youtube.com/watch?v=jIKMPBLFCtU",
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
          "title": "Radio 10",
          "categories": [
              "Commercials"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=2kgPNGe9ExE",
          "thumbnail": "/posters/radio-10.svg"
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
          "title": "Sisyphus at Work",
          "categories": [
              "Bioscoop films"
          ],
          "videoUrl": "https://www.youtube.com/watch?v=d7YhKLlXrXs",
          "thumbnail": "/posters/sisyphus-at-work.svg"
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
          "videoUrl": "https://www.youtube.com/watch?v=67l1__WnwZg",
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
      }
  ];
  const projectReleaseDates = {
    "De Film van Rutger, Thomas & Paco 2": "2026-06-03",
    "Budget Thuis": "2026-05-05",
    "Alpha 00": "2026-01-18",
    "De Tatta's 3": "2025-12-11",
    "Het Gouden Uur – Seizoen 2": "2025-09-18",
    "SUGA: RIDE OR DIE": "2025-09-04",
    "P&O FERRIES \"Sail Your Way\"": "2025-08-15",
    "Miljoenenrace": "2025-01-01",
    "Sphinx": "2024-03-22",
    "Iris van Herpen Fashion show drone tour": "2024-01-01",
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
    "Hyundai IONIQ concept ‘SEVEN’": "2021-11-01",
    "Awakenings presents ADE": "2021-10-01",
    "Franchise Freedom": "2021-09-01",
    "Van der Valk, Seizoen 2": "2021-08-01",
    "Beekse Bergen": "2021-08-01",
    "Samsung Droneshow": "2021-07-01",
    "DJ Brennan Heart – In The Fastlane": "2021-06-01",
    "RAUWCC Studio Drone Tours": "2021-05-01",
    "Grolsch 0.0%": "2021-04-01",
    "McDonald’s – Corona love story": "2021-03-01",
    "Radio 10": "2021-02-01",
    "BeBoulder Fly-Through": "2021-01-01",
    "Boogie woogie now": "2020-12-15",
    "Oud en nieuw 2021": "2020-12-01",
    "David Attenborough: A Life On Our Planet": "2020-10-04",
    "Lidl zomer commercial 2020": "2020-06-01",
    "Drone Show AL ULA Saudi Arabia": "2020-03-01",
    "Sisyphus at Work": "2020-01-01",
    "Kruimeltje": "2019-12-04",
    "Madurodam Commercials 2019": "2019-11-01",
    "Antea Group commercial 2019": "2019-09-01",
    "De Patrick": "2019-08-28",
    "Suzuki Katana challenge": "2019-05-01",
    "Iris van Herpen – Shift Souls": "2019-01-21",
    "PLUS Kerst reclame 2018": "2018-12-01",
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
  const portfolioFilterAliases = {
    "Feature films": "Bioscoop films",
    "TV series": "Tv-series",
    "Real estate": "Vastgoed",
    Alles: "All",
    Luchtbeelden: "Aerial video",
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

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="hero-header">
        <div className="hero-header-inner">
          <div className="hero-header-brand">
            <span className="hero-header-title">T.I.M. Drone Company</span>
            <nav className="hero-nav">
              <a href="#about" className="hero-nav-link">About</a>
              <a href="#fleet" className="hero-nav-link">Fleet</a>
              <a href="#custom-drones" className="hero-nav-link">Custom</a>
              <a href="#work" className="hero-nav-link">Work</a>
              <a href="#contact" className="hero-nav-link">Contact</a>
            </nav>
          </div>
          <div className="language-toggle">
            <button onClick={() => setLanguage("en")} className={`hero-language-button ${language === "en" ? "hero-language-button-active" : ""}`}>EN</button>
            <button onClick={() => setLanguage("nl")} className={`hero-language-button ${language === "nl" ? "hero-language-button-active" : ""}`}>NL</button>
          </div>
        </div>
      </header>

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
            <a href="#work" className="hero-cta-btn hero-cta-btn-secondary">Work</a>
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
            <div className="fleet-card">
              <DroneVisual variant="alta" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.heavyLift}</p>
                <h3 className="fleet-card-title">Freefly Alta X</h3>
                <p className="fleet-card-copy">{t.altaText}</p>
              </div>
            </div>
            <div className="fleet-card">
              <DroneVisual variant="inspire" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.cinemaDrone}</p>
                <h3 className="fleet-card-title">DJI Inspire 3</h3>
                <p className="fleet-card-copy">{t.inspireText}</p>
              </div>
            </div>
            <div className="fleet-card">
              <DroneVisual variant="fpv" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.fpvPlatform}</p>
                <h3 className="fleet-card-title">FPV Cinelifter</h3>
                <p className="fleet-card-copy">{t.fpvText}</p>
              </div>
            </div>
            <div className="fleet-card">
              <DroneVisual variant="mavic" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.cinematicDrone}</p>
                <h3 className="fleet-card-title">DJI Mavic 4 Pro</h3>
                <p className="fleet-card-copy">{t.mavicText}</p>
              </div>
            </div>
            <div className="fleet-card">
              <DroneVisual variant="micro" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.microDrone}</p>
                <h3 className="fleet-card-title">DJI Mini 5</h3>
                <p className="fleet-card-copy">{t.microText}</p>
              </div>
            </div>
            <div className="fleet-card">
              <DroneVisual variant="microFpv" />
              <div className="fleet-card-body">
                <p className="fleet-card-label">{t.microFpvLabel}</p>
                <h3 className="fleet-card-title">Micro FPV Drone</h3>
                <p className="fleet-card-copy">{t.microFpvText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="custom-drones" className="custom-drone-section">
        <div className="custom-drone-container">
          <div className="custom-drone-header">
            <div>
              <p className="custom-drone-label">{t.customDroneLabel}</p>
              <h2 className="custom-drone-title">{t.customDroneTitle}</h2>
            </div>
            <p className="custom-drone-intro">{t.customDroneIntro}</p>
          </div>
          <div className="custom-drone-grid">
            <div className="custom-drone-item">
              <p className="custom-drone-item-label">01</p>
              <h3>{t.customDroneBuilds}</h3>
              <p>{t.customDroneBuildsText}</p>
            </div>
            <div className="custom-drone-item">
              <p className="custom-drone-item-label">02</p>
              <h3>{t.customDronePayloads}</h3>
              <p>{t.customDronePayloadsText}</p>
            </div>
            <div className="custom-drone-item">
              <p className="custom-drone-item-label">03</p>
              <h3>{t.customDroneWorkflow}</h3>
              <p>{t.customDroneWorkflowText}</p>
            </div>
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
                  onClick={() => setActiveFilter(filterValue)}
                >
                  {filter}
                </button>
              );
            })}
          </div>
          <div className="portfolio-grid">
            {visiblePortfolioProjects.map((project) => (
              <button key={project.title} type="button" className="portfolio-card" onClick={() => setActiveProject(project)}>
                <img src={project.thumbnail} alt={project.title} className="portfolio-card-image" />
                <div className="portfolio-card-body">
                  <div className="portfolio-card-badge">Project</div>
                  <h3 className="portfolio-card-title">{project.title}</h3>
                  <div className="portfolio-card-categories">
                    {project.categories.map((category) => (
                      <span key={category} className="portfolio-card-category">{categoryLabels[language][category] || category}</span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeProject && (
        <div className="video-modal" onClick={() => setActiveProject(null)}>
          <div className="video-modal-inner" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="video-modal-close" onClick={() => setActiveProject(null)}>Close</button>
            <iframe
              src={getEmbedUrl(activeProject.videoUrl)}
              title={activeProject.title}
              className="video-modal-frame"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <section id="contact" className="contact-section">
        <div className="contact-container">
          <h2 className="contact-title">{t.contact}</h2>
          <div className="contact-info">
            <p>T.I.M. Drone Company</p>
            <p>
              <a href="https://wa.me/31625083448" target="_blank" rel="noreferrer">
                +31 6 25083448
              </a>
            </p>
            <p>timdronecompany@gmail.com</p>
            <p className="contact-subtext">{t.contactLine}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
