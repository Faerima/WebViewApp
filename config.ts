/**
 * APP-KONFIGURATION
 *
 * EINFACH NUR DIE URL HIER ÄNDERN!
 * Alles andere wird automatisch konfiguriert.
 */

export interface RestaurantConfig {
  url: string;
  allowedHosts: string[];
  name: string;
}

// ==========================================
// HIER NUR DIE URL ÄNDERN FÜR ANDERES RESTAURANT:
// ==========================================
const RESTAURANT_URL = 'https://pizzamadeinitaly.kuriersoft.ch/';

// ==========================================
// NICHTS UNTEN ÄNDERN - WIRD AUTOMATISCH GENERIERT:
// ==========================================

// Automatische Host-Generierung aus der URL
const getAllowedHosts = (url: string): string[] => {
  try {
    const urlObj = new URL(url);
    const baseHost = urlObj.hostname;

    // Basis-Hosts
    const hosts = [baseHost];

    // Mit www hinzufügen falls nicht vorhanden
    if (!baseHost.startsWith('www.')) {
      hosts.push(`www.${baseHost}`);
    }

    // Kuriersoft/Kurier Domains automatisch hinzufügen
    // WICHTIG: Diese Domains bleiben in der App (WebView) und öffnen NICHT den externen Browser!
    // Warum? Viele Restaurant-Websites haben Links zu:
    // - Support-Seiten auf kuriersoft.ch (z.B. "Hilfe", "AGB", "Impressum")
    // - Legacy-Links zu kurier.ch (ältere Kuriersoft-Domain)
    // - API-Calls oder Redirects zu diesen Domains
    // Ohne diese Zeilen würden solche Links den externen Browser öffnen!
    hosts.push('kuriersoft.ch', 'www.kuriersoft.ch');
    hosts.push('kurier.ch', 'www.kurier.ch');

    // Payment-Provider automatisch hinzufügen
    const paymentHosts = [
      'checkout.stripe.com',
      'js.stripe.com',
      'api.stripe.com',
      'paypal.com',
      'www.paypal.com',
      'checkout.paypal.com',
      'twint.ch',
      'pay.twint.ch',
      'postfinance.ch',
      'e-payment.postfinance.ch',
      'datatrans.com',
      'pay.datatrans.com',
      'saferpay.com',
      'www.saferpay.com'
    ];

    return [...hosts, ...paymentHosts];
  } catch {
    return ['kuriersoft.ch', 'www.kuriersoft.ch'];
  }
};

// Automatische Restaurant-Name-Generierung
const getRestaurantName = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Versuche Restaurant-Name aus Domain zu extrahieren
    if (hostname.includes('pizzafulmine')) return 'Pizzafulmine';
    if (hostname.includes('roemerhof') || hostname.includes('römerhof')) return 'Römerhof';
    if (hostname.includes('pizzamadeinitaly')) return 'Pizza Made in Italy';

    // Fallback: Domain als Name verwenden
    return hostname.split('.')[0];
  } catch {
    return 'Restaurant';
  }
};

// Automatische Konfiguration
const CURRENT_RESTAURANT: RestaurantConfig = {
  url: RESTAURANT_URL,
  allowedHosts: getAllowedHosts(RESTAURANT_URL),
  name: getRestaurantName(RESTAURANT_URL)
};

export default CURRENT_RESTAURANT;
