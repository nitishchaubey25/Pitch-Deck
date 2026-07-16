import { PitchDeck, Slide } from './types';

function extractStartupDetails(prompt: string) {
  const cleaned = prompt.trim();
  const words = cleaned.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, "")).filter(w => w.length > 2);
  const stopWords = new Set(["the", "and", "for", "with", "platform", "powered", "using", "your", "that", "this", "from", "software", "solution", "service", "automated", "application", "system", "generator", "builder"]);
  const keywords = words.filter(w => !stopWords.has(w.toLowerCase()));
  
  let companyName = "NovaLaunch";
  if (keywords.length > 0) {
    const mainNoun = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1).toLowerCase();
    const secondNoun = keywords[1] ? keywords[1].charAt(0).toUpperCase() + keywords[1].slice(1).toLowerCase() : "";
    
    if (secondNoun && secondNoun.length > 2) {
      companyName = `${mainNoun}${secondNoun}`;
    } else {
      const suffixes = ["Flow", "ly", "Grid", "Hub", "Sync", "AI", "Lab", "Core", "Nest", "Scale"];
      const hash = mainNoun.length % suffixes.length;
      companyName = `${mainNoun}${suffixes[hash]}`;
    }
  }
  
  if (companyName.length < 3) {
    companyName = "ApexAI";
  }

  const lowerPrompt = cleaned.toLowerCase();
  let category: 'saas' | 'mobile' | 'hardware' | 'social' | 'generic' = 'generic';
  
  if (lowerPrompt.includes("hardware") || lowerPrompt.includes("device") || lowerPrompt.includes("physical") || lowerPrompt.includes("iot") || lowerPrompt.includes("sensor") || lowerPrompt.includes("robot") || lowerPrompt.includes("wearable")) {
    category = 'hardware';
  } else if (lowerPrompt.includes("mobile") || lowerPrompt.includes("app") || lowerPrompt.includes("ios") || lowerPrompt.includes("android") || lowerPrompt.includes("phone") || lowerPrompt.includes("appstore")) {
    category = 'mobile';
  } else if (lowerPrompt.includes("social") || lowerPrompt.includes("community") || lowerPrompt.includes("dating") || lowerPrompt.includes("network") || lowerPrompt.includes("creators") || lowerPrompt.includes("friend") || lowerPrompt.includes("chat")) {
    category = 'social';
  } else if (lowerPrompt.includes("saas") || lowerPrompt.includes("platform") || lowerPrompt.includes("b2b") || lowerPrompt.includes("cloud") || lowerPrompt.includes("enterprise") || lowerPrompt.includes("analytics") || lowerPrompt.includes("automation")) {
    category = 'saas';
  }
  
  return { companyName, category, keywords };
}

export function generateHeuristicDeck(prompt: string): PitchDeck {
  const { companyName, category } = extractStartupDetails(prompt);
  const slides: Slide[] = [];

  if (category === 'saas') {
    slides.push(
      {
        id: '1',
        title: companyName,
        subtitle: `Next-generation enterprise automation for ${prompt}`,
        bullets: [
          `Designed specifically to streamline complex professional operations.`,
          `Powered by hyper-efficient adaptive cloud computing architectures.`,
          `Accelerating project cycle speeds up to 10x while maintaining top-tier security standards.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '2',
        title: "The Problem",
        subtitle: "Inefficient pipelines and fragmented tools result in severe operational loss.",
        bullets: [
          `Legacy solutions lack cross-system real-time updates, leading to manual error.`,
          `Deployments take weeks of technical consultation and code implementation.`,
          `Average organizations bleed substantial revenue annually due to operational dead-ends.`
        ],
        layoutType: 'metrics_grid',
        metrics: [
          { label: "Lost Revenue Margin", value: "24%" },
          { label: "Avg Deployment Time", value: "45 Days" },
          { label: "Tool Fragmentation", value: "Severe" }
        ]
      },
      {
        id: '3',
        title: "The Solution",
        subtitle: "A unified cloud control center operating at the speed of thought.",
        bullets: [
          `Plug-and-play integrations with 100+ standard business toolsuites.`,
          `Intelligent analytics engine flagging bottlenecks before they impact deliveries.`,
          `Zero-code workflow designer enabling any operator to automate within minutes.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '4',
        title: "Market Size & Opportunity",
        subtitle: "Massive Tailwinds in Global Enterprise Digital Integration.",
        bullets: [
          `Total Addressable Market (TAM) is growing at a compounding rate of 15% YoY.`,
          `Initial focus is on high-growth mid-market segments (SAM) needing rapid agility.`,
          `Our 3-year plan captures a significant portion of this underserved demographic.`
        ],
        layoutType: 'chart_bar',
        metrics: [
          { label: "TAM (Global)", value: "320" }, // standardizing as integers for charts
          { label: "SAM (SaaS Mid-market)", value: "85" },
          { label: "SOM (Our Q3 Target)", value: "12" }
        ]
      },
      {
        id: '5',
        title: "Core Product Capabilities",
        subtitle: "Enterprise stability engineered with consumer-grade simplicity.",
        bullets: [
          `Dynamic Dashboard: Real-time telemetry monitoring.`,
          `FlowBuilder: Interactive drag-and-drop rule configurations.`,
          `Secure Sync: Fully SOC2 compliant data encryption standard.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '6',
        title: "Business Model",
        subtitle: "Predictable, high-retention software recurring models.",
        bullets: [
          `Professional Tier: $79/user/month for standard operations.`,
          `Enterprise Tier: Tiered annual contracts with custom SLA guarantees.`,
          `Expansion Loop: Usage-based metered billing for data pipelines.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '7',
        title: "Traction & Growth projections",
        subtitle: "Rapid compounding growth since launch.",
        bullets: [
          `Over 60 corporate pilots initiated in the first quarter alone.`,
          `Net Revenue Retention (NRR) at an outstanding 116%.`,
          `Positioned to exceed $2M Annual Recurring Revenue (ARR) by year-end.`
        ],
        layoutType: 'chart_line',
        metrics: [
          { label: "Jan", value: "5" },
          { label: "Feb", value: "12" },
          { label: "Mar", value: "28" },
          { label: "Apr", value: "54" },
          { label: "May", value: "98" },
          { label: "Jun", value: "165" }
        ]
      },
      {
        id: '8',
        title: "Competitive Landscape",
        subtitle: "We offer unprecedented ease of setup compared to legacy rigidity.",
        bullets: [
          `Unmatched setup speeds (hours vs. months).`,
          `Dynamic automation rules rather than static conditional scripts.`,
          `Lower total cost of ownership (TCO) with transparent SaaS pricing.`
        ],
        layoutType: 'competitor_matrix',
        competitors: [
          { name: companyName, us: true, features: ["Instant Setup", "AI Auto-Optimize", "SOC2 Compliant"] },
          { name: "Legacy ERP Inc.", us: false, features: ["SOC2 Compliant"] },
          { name: "No-Code Script Tool", us: false, features: ["Instant Setup"] }
        ]
      },
      {
        id: '9',
        title: "Executive Team",
        subtitle: "Deep technical expertise and startup scale track records.",
        bullets: [
          `Co-founders have previously built platforms scaled to millions of users.`,
          `Broad background covering deep systems engineering, B2B sales, and cloud compliance.`
        ],
        layoutType: 'team_grid',
        teamMembers: [
          { name: "Aria Thorne", role: "CEO & Co-Founder", bio: "Former Lead Product at Stripe. Stanford MBA." },
          { name: "Devon Vance", role: "CTO & Co-Founder", bio: "Former Principal Engineer at AWS Cloud. MIT CS." }
        ]
      },
      {
        id: '10',
        title: "The Capital Ask",
        subtitle: "Raising $1.8M Seed round to expand engineering & accelerate GTM.",
        bullets: [
          `65% Product development & system integrations scalability.`,
          `25% Direct enterprise sales hire and digital outbound marketing.`,
          `10% Administrative, operations, and security standard audits.`
        ],
        layoutType: 'timeline',
        metrics: [
          { label: "Phase 1: Seed Close", value: "Month 1" },
          { label: "Phase 2: Hire 4 Devs", value: "Month 3" },
          { label: "Phase 3: Public Launch", value: "Month 6" },
          { label: "Phase 4: $1.5M ARR", value: "Month 12" }
        ]
      }
    );
  } else if (category === 'mobile') {
    slides.push(
      {
        id: '1',
        title: companyName,
        subtitle: `A revolution in mobile accessibility for ${prompt}`,
        bullets: [
          `Fast, lightweight, and engaging consumer experience at your fingertips.`,
          `Bridging physical desires with seamless digital execution instantly.`,
          `Creating habits through custom-curated notification and rewarding micro-interactions.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '2',
        title: "The Market Pain Point",
        subtitle: "Users suffer from friction, poor mobile interfaces, and slow local fulfillment.",
        bullets: [
          `Standard services require 7+ taps to complete a single standard request.`,
          `Mobile apps suffer from bloated downloads and high local battery drainage.`,
          `Customer drop-offs occur before checkout due to cluttered payment steps.`
        ],
        layoutType: 'metrics_grid',
        metrics: [
          { label: "Average Drop-off", value: "68%" },
          { label: "Time-to-Checkout", value: "4.2 Min" },
          { label: "Customer NPS", value: "Poor" }
        ]
      },
      {
        id: '3',
        title: "The Mobile Solution",
        subtitle: "A 2-tap native interface engineered for fluid performance.",
        bullets: [
          `Stellar gesture-driven UI minimizing cognitive load and input fatigue.`,
          `Instant local matching or generation engine running serverless under 100ms.`,
          `Integrated biometric payments (Apple/Google Pay) for effortless completion.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '4',
        title: "Target Market Potential",
        subtitle: "Expanding global smartphone penetration creates a massive audience.",
        bullets: [
          `Focusing initially on early-adopter Gen-Z and Millennial demographics.`,
          `Mobile-first consumption cycles indicate high average order frequencies.`,
          `Strong organic virality loops embedded directly in the sharing features.`
        ],
        layoutType: 'chart_bar',
        metrics: [
          { label: "TAM (Mobile Consumers)", value: "180" },
          { label: "SAM (Target Users)", value: "45" },
          { label: "SOM (Year 1 Capturable)", value: "5" }
        ]
      },
      {
        id: '5',
        title: "How it Works",
        subtitle: "Simple, beautiful, and deeply personal native layout.",
        bullets: [
          `Smart Discovery: Adaptive machine learning tailoring your content feed.`,
          `Frictionless Actions: Double-tap custom workflows triggering order logs.`,
          `Community Hub: Connect, coordinate, and share achievements natively.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '6',
        title: "Monetization Strategy",
        subtitle: "Diversified, high-velocity consumer monetization loops.",
        bullets: [
          `Premium Pass: $4.99/mo for ad-free experience & custom theme features.`,
          `Marketplace Fee: 8% fee on all completed local transaction matches.`,
          `Sponsor Highlights: Native ad placements matching user search intent.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '7',
        title: "Initial Traction",
        subtitle: "Outstanding organic adoption metrics during beta testing.",
        bullets: [
          `Achieved over 15k pre-registrations via a simple viral landing page.`,
          `Day-30 retention rates surpass standard consumer app benchmarks by 2x.`,
          `Viral coefficient (K-factor) sits strong at 1.45.`
        ],
        layoutType: 'chart_line',
        metrics: [
          { label: "Week 1", value: "1200" },
          { label: "Week 2", value: "3400" },
          { label: "Week 3", value: "6700" },
          { label: "Week 4", value: "12200" }
        ]
      },
      {
        id: '8',
        title: "Competitors",
        subtitle: "We offer true user simplicity where others pile on visual clutter.",
        bullets: [
          `Designed specifically for fast, on-the-go touch-target executions.`,
          `Adaptive offline storage ensuring smooth functionality under sparse network grids.`,
          `Direct community sharing integrations giving us lower CAC costs.`
        ],
        layoutType: 'competitor_matrix',
        competitors: [
          { name: companyName, us: true, features: ["2-Tap Checkout", "Biometric Pay", "Offline Sync"] },
          { name: "Legacy Web Portal", us: false, features: [] },
          { name: "Generic BloatApp", us: false, features: ["Biometric Pay"] }
        ]
      },
      {
        id: '9',
        title: "Leadership Team",
        subtitle: "Experienced mobile product designers and growth engineers.",
        bullets: [
          `Our engineers have built apps ranked in the App Store Top-10.`,
          `Deep focus on visual aesthetic craft, retention heuristics, and mobile performance.`
        ],
        layoutType: 'team_grid',
        teamMembers: [
          { name: "Kaelen Moss", role: "CEO & Co-Founder", bio: "Former Product Designer at Airbnb Mobile. Rhode Island School of Design." },
          { name: "Elena Rostova", role: "CTO & Co-Founder", bio: "Ex-Lead Mobile Infra at Uber. Scaled systems to 10M+ DAU. CS PhD." }
        ]
      },
      {
        id: '10',
        title: "The Funding Ask",
        subtitle: "Raising $1.2M seed to scale user acquisition & finalize native apps.",
        bullets: [
          `50% Performance marketing, creator partnerships, and direct user acquisition.`,
          `40% Advanced native Android & iOS development hires.`,
          `10% Core server scaling and compliance audits.`
        ],
        layoutType: 'timeline',
        metrics: [
          { label: "App Store Launch", value: "Month 1" },
          { label: "100k Active Users", value: "Month 4" },
          { label: "Monetization Go-Live", value: "Month 7" },
          { label: "Series A Round", value: "Month 12" }
        ]
      }
    );
  } else if (category === 'hardware') {
    slides.push(
      {
        id: '1',
        title: companyName,
        subtitle: `Smart physical hardware ecosystem for ${prompt}`,
        bullets: [
          `Bridging the gap between software intelligence and tactile hardware utility.`,
          `Crafted with beautiful sustainable materials designed to fit modern spaces seamlessly.`,
          `IoT connected, giving users real-time feedback loops and remote control capabilities.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '2',
        title: "The Hardware Challenge",
        subtitle: "Existing physical devices are dumb, clunky, and completely isolated.",
        bullets: [
          `Incumbent options use ancient microcontroller architectures with zero over-the-air (OTA) support.`,
          `Hardware integration with consumer smartphones remains brittle and unreliable.`,
          `Low-grade materials suffer from quick structural degradation and wear.`
        ],
        layoutType: 'metrics_grid',
        metrics: [
          { label: "Average Device Lifespan", value: "1.2 Years" },
          { label: "Firmware Failures", value: "Common" },
          { label: "Customer Return Rates", value: "14%" }
        ]
      },
      {
        id: '3',
        title: "Our Hardware Innovation",
        subtitle: "A highly resilient, elegant, and connected IoT device.",
        bullets: [
          `Built with medical-grade recycled aluminum and composite components.`,
          `Wi-Fi & Bluetooth mesh enabled with secure over-the-air automatic updates.`,
          `Local offline ML compute, enabling smart execution even without an active internet grid.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '4',
        title: "Market Size & Growth Potential",
        subtitle: "The rapid expansion of connected physical spaces is driving massive value.",
        bullets: [
          `Demand for elegant consumer connected devices is at an all-time high.`,
          `Direct-to-consumer delivery models allow high gross margin recovery.`,
          `B2B partnerships for commercial scaling offer stable recurring contracts.`
        ],
        layoutType: 'chart_bar',
        metrics: [
          { label: "TAM (Connected Devices)", value: "480" },
          { label: "SAM (Modern Smart Homes)", value: "110" },
          { label: "SOM (Our Initial Focus)", value: "15" }
        ]
      },
      {
        id: '5',
        title: "Core Features & Specs",
        subtitle: "Industrial design engineered to last a lifetime.",
        bullets: [
          `Micro-sensor grid: Tracking environmental telemetry variables with high accuracy.`,
          `Adaptive LED strip: Gentle glowing indicator arrays conveying system health.`,
          `Rechargeable Power: Core battery pack supporting up to 90 days on a single charge.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '6',
        title: "Business Model",
        subtitle: "Durable hardware sales paired with predictable software recurring subscription.",
        bullets: [
          `Device Retail Price: $199 upfront cost (yielding a strong 62% hardware gross margin).`,
          `Premium SaaS Subscription: Optional $9.99/mo subscription for automated data trends.`,
          `Business Bulk: Wholesale commercial pricing structures for corporate environments.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '7',
        title: "Manufacturing Roadmap",
        subtitle: "Fully validated design with active manufacturing pipelines.",
        bullets: [
          `Working prototype fully tested in over 150 pilot environments.`,
          `Tier-1 assembly contract signed, ready for tooling and plastic injection mold setup.`,
          `DTC shipping channels established with global fulfillment networks.`
        ],
        layoutType: 'chart_line',
        metrics: [
          { label: "Pilot Phase", value: "150" },
          { label: "Pre-Orders", value: "2400" },
          { label: "Tooling Prep", value: "1" },
          { label: "First Batch Target", value: "10000" }
        ]
      },
      {
        id: '8',
        title: "Competitor Comparison",
        subtitle: "We lead in connectivity, aesthetic design, and firmware longevity.",
        bullets: [
          `Beautiful minimalist industrial layout suited for display rather than hidden.`,
          `Local sensor intelligence processing actions on-device without data delays.`,
          `Secure cloud backups keeping all telemetry historical charts intact.`
        ],
        layoutType: 'competitor_matrix',
        competitors: [
          { name: companyName, us: true, features: ["Sustainable Materials", "OTA Updates", "On-Device ML"] },
          { name: "Legacy Utility Corp", us: false, features: [] },
          { name: "Cheap Import Copy", us: false, features: ["On-Device ML"] }
        ]
      },
      {
        id: '9',
        title: "Founding Engineers",
        subtitle: "Combining elite industrial design with deep systems firmware expertise.",
        bullets: [
          `Our team has built and shipped consumer hardware sold in Apple Stores globally.`,
          `Experience covering plastics, supply-chain logistics, and firmware safety protocols.`
        ],
        layoutType: 'team_grid',
        teamMembers: [
          { name: "Jasper Croft", role: "CEO & Co-Founder", bio: "Former Senior Industrial Designer at Apple. Pratt Institute." },
          { name: "Dr. Kenji Sato", role: "CTO & Co-Founder", bio: "Former Embedded Robotics Lead at Tesla. PhD in Electrical Engineering." }
        ]
      },
      {
        id: '10',
        title: "Investment Ask",
        subtitle: "Raising $2.5M Seed round for tooling and initial volume production run.",
        bullets: [
          `55% Factory tooling, manufacturing setups, and quality insurance runs.`,
          `30% Core firmware and cloud server platform engineering expansion.`,
          `15% DTC launch marketing, inventory reserves, and compliance tests.`
        ],
        layoutType: 'timeline',
        metrics: [
          { label: "Mold Tooling Complete", value: "Month 2" },
          { label: "Beta Shipment", value: "Month 5" },
          { label: "Commercial Shipping", value: "Month 8" },
          { label: "BEP Achieved", value: "Month 14" }
        ]
      }
    );
  } else if (category === 'social') {
    slides.push(
      {
        id: '1',
        title: companyName,
        subtitle: `A fresh digital neighborhood for ${prompt}`,
        bullets: [
          `Uniting creators, curators, and friends in a high-trust digital space.`,
          `Escaping the algorithm-fueled outrage model to embrace slow, intentional connection.`,
          `Deep customization features letting you shape your visual profile aesthetic precisely.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '2',
        title: "The Social Exhaustion",
        subtitle: "Monopolized ad-driven social apps harvest attention, causing severe fatigue.",
        bullets: [
          `Standard networks prioritize viral controversy over genuine supportive engagement.`,
          `Creators capture less than 3% of the direct financial value they generate.`,
          `Algorithmic bias blocks organic sharing, forcing users to buy promotional views.`
        ],
        layoutType: 'metrics_grid',
        metrics: [
          { label: "Daily Social Fatigue", value: "82%" },
          { label: "Creator Pay-out Rate", value: "<3%" },
          { label: "Organic Reach Rate", value: "1.4%" }
        ]
      },
      {
        id: '3',
        title: "A Better Connection",
        subtitle: "An ad-free, high-fidelity platform putting human engagement first.",
        bullets: [
          `Private digital circles giving you safe, ad-free environments to share.`,
          `Built-in monetization loops supporting creators directly with 90% payout splits.`,
          `Chronological feeds ensuring you see exactly what your friends share, unfiltered.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '4',
        title: "Market Size & Creator Boom",
        subtitle: "The Creator Economy is expanding into a massive global force.",
        bullets: [
          `Users are increasingly willing to pay micro-subscriptions for ad-free safe havens.`,
          `Initial target demographic is high-value tech and design creators.`,
          `Strong network effects: each active creator draws in average of 14 new community members.`
        ],
        layoutType: 'chart_bar',
        metrics: [
          { label: "TAM (Global Creator Econ)", value: "250" },
          { label: "SAM (Underserved Creators)", value: "65" },
          { label: "SOM (Our Initial Niche)", value: "8" }
        ]
      },
      {
        id: '5',
        title: "Core Platform Features",
        subtitle: "Unmatched social performance built with stunning layout control.",
        bullets: [
          `The Living Wall: Fully customizable micro-blog layout supporting diverse media.`,
          `Huddle Circles: Real-time text & speech spaces centered around direct common goals.`,
          `Vault Subscription: Exclusive high-value content subscription tools.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '6',
        title: "Revenue Model",
        subtitle: "Value-aligned monetization, avoiding manipulative attention harvesting.",
        bullets: [
          `Premium Profile: $5/mo unlock customizable visual layouts & custom badge slots.`,
          `Creator Sales: Simple 10% commission fee on creator subscription channels.`,
          `Interactive Collectibles: Premium digital decor elements for custom huddles.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '7',
        title: "Compounding Growth Metrics",
        subtitle: "High retention, showing outstanding user engagement levels.",
        bullets: [
          `Weekly average session times surpass industry averages by 35 minutes.`,
          `94% creator retention rate month-over-month.`,
          `Steady exponential growth curve purely driven by organic word of mouth.`
        ],
        layoutType: 'chart_line',
        metrics: [
          { label: "Week 1", value: "250" },
          { label: "Week 2", value: "800" },
          { label: "Week 3", value: "2300" },
          { label: "Week 4", value: "5400" },
          { label: "Week 5", value: "11200" }
        ]
      },
      {
        id: '8',
        title: "Competitive Edge",
        subtitle: "We prioritize user sanity and direct monetization over clickbait loops.",
        bullets: [
          `Beautiful aesthetic layouts with zero intrusive promotional banners.`,
          `Chronological feeds with absolutely no algorithmic intervention or outrage sorting.`,
          `Safe space policies, putting community trust above all else.`
        ],
        layoutType: 'competitor_matrix',
        competitors: [
          { name: companyName, us: true, features: ["Ad-Free Feed", "90% Creator Split", "Custom Themes"] },
          { name: "Big Tech Outrage", us: false, features: [] },
          { name: "Legacy Chat App", us: false, features: ["Ad-Free Feed"] }
        ]
      },
      {
        id: '9',
        title: "Founding Team",
        subtitle: "Experienced community product designers and scale engineers.",
        bullets: [
          `Prior experience building communication apps that scaled globally.`,
          `Passionate about humane technology design, privacy security, and digital aesthetics.`
        ],
        layoutType: 'team_grid',
        teamMembers: [
          { name: "Soren Wade", role: "CEO & Co-Founder", bio: "Former Community Product Designer at Discord. RISD Graphic Design." },
          { name: "Malik Vance", role: "CTO & Co-Founder", bio: "Ex-Staff Engineer at Twitter Core Infra. Scaled feeds to millions. UCLA CS." }
        ]
      },
      {
        id: '10',
        title: "Our Capital Ask",
        subtitle: "Raising $1.5M Seed round to expand engineering team and scale onboarding.",
        bullets: [
          `50% Advanced real-time collaborative media engineering & systems scaling.`,
          `35% Targeted creator onboarding campaigns & community events.`,
          `15% Legal compliance, administrative operations, and security tests.`
        ],
        layoutType: 'timeline',
        metrics: [
          { label: "Beta Onboarding Launch", value: "Month 1" },
          { label: "20 Creator Hubs Live", value: "Month 3" },
          { label: "General Public Open", value: "Month 6" },
          { label: "Positive Unit Economics", value: "Month 10" }
        ]
      }
    );
  } else {
    // Generic / Custom Pitch Deck
    slides.push(
      {
        id: '1',
        title: companyName,
        subtitle: `A bold new paradigm in ${prompt}`,
        bullets: [
          `Disrupting an established industry with streamlined intelligent workflows.`,
          `Providing modern, highly customizable tools suited for the modern professional.`,
          `Engineered to eliminate administrative busywork and focus human effort on high-leverage outputs.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '2',
        title: "The Market Challenge",
        subtitle: "Fragmented tools and obsolete manual practices hold teams back.",
        bullets: [
          `Existing workflow solutions require complex technical consulting and custom coding.`,
          `Teams lose hours daily jumping between disconnected systems and spreadsheets.`,
          `Inefficiencies cost typical operators substantial potential margin annually.`
        ],
        layoutType: 'metrics_grid',
        metrics: [
          { label: "Avg Lost Efficiency", value: "30%" },
          { label: "Manual Setup Cost", value: "High" },
          { label: "Operator Fatigue", value: "78%" }
        ]
      },
      {
        id: '3',
        title: "The Intelligent Solution",
        subtitle: "A beautiful, unified digital workspace optimized for maximum focus.",
        bullets: [
          `Unifies critical data pathways into a single highly responsive command center.`,
          `Provides clean visual tools allowing non-technical operators to build custom automations.`,
          `Guarantees top-tier security standards so company secrets remain strictly confidential.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '4',
        title: "Market Size & Growth Potential",
        subtitle: "Tapping into a rapidly growing global software ecosystem.",
        bullets: [
          `The global market for modern operations software is expanding at 18% CAGR.`,
          `Our initial target segment focuses on flexible, fast-growing mid-market operators.`,
          `Expanding globally will open access to a massive corporate client base.`
        ],
        layoutType: 'chart_bar',
        metrics: [
          { label: "TAM (Global)", value: "145" },
          { label: "SAM (Modern Operators)", value: "38" },
          { label: "SOM (Our Q3 Target)", value: "5.5" }
        ]
      },
      {
        id: '5',
        title: "Key Product Offerings",
        subtitle: "Engineered for maximum stability and speed.",
        bullets: [
          `Unified Interface: Seamless coordination across all active project channels.`,
          `Adaptive Recommendations: Automated suggestions optimizing daily resource allocation.`,
          `Enterprise Security: Multi-tenant database architecture with end-to-end encryption.`
        ],
        layoutType: 'text_only'
      },
      {
        id: '6',
        title: "Business Model & Monetization",
        subtitle: "Clear, predictable recurring SaaS subscription tiers.",
        bullets: [
          `Standard Seat: $39/user/month for fundamental automation tools.`,
          `Professional Suite: $99/user/month adding deep analytics & team integrations.`,
          `Custom Enterprise: Dedicated database instances with premium security SLAs.`
        ],
        layoutType: 'two_column'
      },
      {
        id: '7',
        title: "Traction & Milestones",
        subtitle: "Consistent month-over-month compounding adoption rates.",
        bullets: [
          `Initiated active commercial pilots with over 30 leading industry agencies.`,
          `User retention stands at a high 92% after 90 days of onboarding.`,
          `Compound monthly active growth rate exceeds 14%.`
        ],
        layoutType: 'chart_line',
        metrics: [
          { label: "Month 1", value: "12" },
          { label: "Month 2", value: "35" },
          { label: "Month 3", value: "78" },
          { label: "Month 4", value: "154" },
          { label: "Month 5", value: "290" }
        ]
      },
      {
        id: '8',
        title: "Competitive Landscape",
        subtitle: "We offer immediate setup, unmatched flexibility, and clear pricing.",
        bullets: [
          `No long consulting setups - launch in minutes rather than quarters.`,
          `High visual customization, adapting completely to your custom daily tasks.`,
          `Predictable transparent pricing models scaling strictly with your active seat count.`
        ],
        layoutType: 'competitor_matrix',
        competitors: [
          { name: companyName, us: true, features: ["Instant Setup", "Visual Automations", "Transparent Pricing"] },
          { name: "Consultant Rigidity", us: false, features: [] },
          { name: "DIY Spreadsheet Chaos", us: false, features: ["Instant Setup"] }
        ]
      },
      {
        id: '9',
        title: "Executive Founders",
        subtitle: "Proven track records in scaling technical software solutions.",
        bullets: [
          `Our engineering and sales leads have built multiple successful B2B products.`,
          `Strong backgrounds in cloud database design, product UI aesthetics, and enterprise growth.`
        ],
        layoutType: 'team_grid',
        teamMembers: [
          { name: "Elena Gray", role: "CEO & Co-Founder", bio: "Former VP of Sales at Segment. Columbia MBA." },
          { name: "Kiran Patel", role: "CTO & Co-Founder", bio: "Former Lead Infrastructure Architect at HashiCorp. CS Master." }
        ]
      },
      {
        id: '10',
        title: "Investment Request",
        subtitle: "Raising $1.5M Seed round to expand engineering & secure early partnerships.",
        bullets: [
          `60% Core platform engineering, feature development, and security certifications.`,
          `30% Targeted mid-market sales hires, content marketing, and partner programs.`,
          `10% Legal compliance, administrative overhead, and cloud workspace operations.`
        ],
        layoutType: 'timeline',
        metrics: [
          { label: "Seed Launch", value: "Month 1" },
          { label: "10 Key Enterprise Pilots", value: "Month 4" },
          { label: "Scale SaaS Sales", value: "Month 7" },
          { label: "Break-Even Run", value: "Month 12" }
        ]
      }
    );
  }

  return {
    companyName,
    tagline: `Unlocking the true potential of ${prompt}`,
    slides
  };
}
