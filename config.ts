/**
 * ZENTRALE APP-KONFIGURATION
 * ============================
 * 
 * Diese Datei ist das Herzstück der App-Konfiguration. Hier wird festgelegt,
 * welche Restaurant-Website geladen wird und welche Domains erlaubt sind.
 * 
 * WICHTIG: Für jeden Restaurant-Wechsel muss nur CURRENT_RESTAURANT geändert werden!
 */
export interface RestaurantConfig {
  /** 
   * Die Haupt-URL des Restaurants (vollständige HTTPS-URL)
   * Beispiel: 'https://pizzafulmine.kuriersoft.ch/'
   */
  url: string;
  
  /** 
   * Erlaubte Hosts für sichere Navigation (ohne https://)
   * Alle URLs mit diesen Hostnamen bleiben in der App,
   * andere öffnen den externen Browser
   * 
   * WICHTIG: Immer sowohl mit als auch ohne 'www.' angeben!
   */
  allowedHosts: string[];
  
  /** 
   * Name des Restaurants (für Logging und zukünftige Features)
   */
  name: string;
}

// ============================================================================
// HAUPTKONFIGURATION - HIER NUR DIESE ZEILE ÄNDERN FÜR ANDERE RESTAURANTS:
// ============================================================================

/**
 * Aktuell konfiguriertes Restaurant
 * 
 * Um zu einem anderen Restaurant zu wechseln:
 * 1. Option: Eine der vordefinierten Konfigurationen verwenden:
 *    const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.pizzafulmine;
 * 
 * 2. Option: Manuell konfigurieren (siehe unten)
 */
const CURRENT_RESTAURANT: RestaurantConfig = {
  // Restaurant-URL - MUSS vollständige HTTPS-URL sein
  url: 'https://roemerhof.kuriersoft.ch/',
  
  /**
   * Erlaubte Hosts - WICHTIG für Sicherheit!
   * 
   * Alle URLs mit diesen Hostnamen bleiben in der App.
   * URLs mit anderen Hostnamen öffnen den externen Browser.
   * 
   * Automatisch erlaubt:
   * - Payment-Provider (Stripe, PayPal, TWINT, PostFinance, etc.)
   * - Alle *.kuriersoft.ch und *.kurier.ch Subdomains
   * 
   * Manuell hinzufügen:
   * - Restaurant-spezifische Domains
   * - Immer sowohl mit als auch ohne 'www.' angeben
   */
  allowedHosts: [
    'roemerhof.kuriersoft.ch',          // Römerhof Hauptdomain
    'www.roemerhof.kuriersoft.ch',      // Mit www
    'der-roemerhof.kuriersoft.ch',      // Alternative Domain
    'www.der-roemerhof.kuriersoft.ch',  // Alternative mit www
    'kuriersoft.ch',                    // Kuriersoft Hauptdomain
    'www.kuriersoft.ch',                // Kuriersoft mit www
    'kurier.ch',                        // Legacy Domain
    'www.kurier.ch'                     // Legacy mit www
  ],
  
  // Restaurant-Name für Logging und Debugging
  name: 'Römerhof'
};

/**
 * Vordefinierte Restaurant-Konfigurationen
 * ==========================================
 * 
 * Für häufig verwendete Restaurants können diese vordefinierten
 * Konfigurationen verwendet werden. Einfach CURRENT_RESTAURANT
 * auf eine dieser Konfigurationen setzen:
 * 
 * Beispiel:
 * const CURRENT_RESTAURANT = RESTAURANT_CONFIGS.pizzafulmine;
 */
export const RESTAURANT_CONFIGS = {
  /**
   * Pizzafulmine Restaurant-Konfiguration
   * Domain: pizzafulmine.kuriersoft.ch
   */
  pizzafulmine: {
    url: 'https://pizzafulmine.kuriersoft.ch/',
    allowedHosts: [
      'pizzafulmine.kuriersoft.ch',       // Hauptdomain
      'www.pizzafulmine.kuriersoft.ch',   // Mit www
      'kuriersoft.ch',                    // Kuriersoft allgemein
      'www.kuriersoft.ch',                // Kuriersoft mit www
      'kurier.ch',                        // Legacy
      'www.kurier.ch'                     // Legacy mit www
    ],
    name: 'Pizzafulmine'
  },
  
  /**
   * Der Römerhof Restaurant-Konfiguration
   * Domains: roemerhof.kuriersoft.ch, der-roemerhof.kuriersoft.ch
   */
  roemerhof: {
    url: 'https://der-roemerhof.kuriersoft.ch/',
    allowedHosts: [
      'der-roemerhof.kuriersoft.ch',      // Hauptdomain
      'www.der-roemerhof.kuriersoft.ch',  // Mit www
      'roemerhof.kuriersoft.ch',          // Alternative Domain
      'www.roemerhof.kuriersoft.ch',      // Alternative mit www
      'kuriersoft.ch',                    // Kuriersoft allgemein
      'www.kuriersoft.ch',                // Kuriersoft mit www
      'kurier.ch',                        // Legacy
      'www.kurier.ch'                     // Legacy mit www
    ],
    name: 'Der Römerhof'
  }
  
  /**
   * Weitere Restaurants können hier hinzugefügt werden:
   * 
   * neues_restaurant: {
   *   url: 'https://restaurant.kuriersoft.ch/',
   *   allowedHosts: [
   *     'restaurant.kuriersoft.ch',
   *     'www.restaurant.kuriersoft.ch',
   *     'kuriersoft.ch',
   *     'www.kuriersoft.ch',
   *     'kurier.ch',
   *     'www.kurier.ch'
   *   ],
   *   name: 'Restaurant Name'
   * }
   */
} as const;

/**
 * Export der aktuellen Restaurant-Konfiguration
 * ==============================================
 * 
 * Diese Konfiguration wird automatisch von der App geladen.
 * App.tsx und OrderWebView.tsx verwenden diese Konfiguration
 * automatisch - keine weiteren Änderungen nötig!
 */
export default CURRENT_RESTAURANT;
