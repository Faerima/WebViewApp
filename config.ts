/**
 * ZENTRALE APP-KONFIGURATION
 * 
 * Hier müssen Sie nur die URL und allowedHosts ändern, um die App 
 * für ein anderes Restaurant zu verwenden.
 * 
 * Beispiele:
 * - Pizzafulmine: https://pizzafulmine.kurier.ch/
 */

export interface RestaurantConfig {
  // Die Haupt-URL des Restaurants
  url: string;
  // Erlaubte Hosts für sichere Navigation (ohne https://)
  allowedHosts: string[];
  // Name des Restaurants (für zukünftige Features)
  name: string;
}

// ============================================================================
// HIER NUR DIESE ZEILE ÄNDERN FÜR ANDERE RESTAURANTS:
// ============================================================================
const CURRENT_RESTAURANT: RestaurantConfig = {
  url: 'https://roemerhof.kuriersoft.ch/',
  allowedHosts: [
    'pizzafulmine.kuriersoft.ch',
    'www.pizzafulmine.kuriersoft.ch',
    'kuriersoft.ch',
    'www.kuriersoft.ch',
    'kurier.ch',
    'www.kurier.ch'
  ],
  name: 'Pizzafulmine'
};

// Vordefinierte Restaurant-Konfigurationen für schnellen Wechsel
export const RESTAURANT_CONFIGS = {
  pizzafulmine: {
    url: 'https://pizzafulmine.kuriersoft.ch/',
    allowedHosts: [
      'pizzafulmine.kuriersoft.ch',
      'www.pizzafulmine.kuriersoft.ch',
      'kuriersoft.ch',
      'www.kuriersoft.ch',
      'kurier.ch',
      'www.kurier.ch'
    ],
    name: 'Pizzafulmine'
  },
  roemerhof: {
    url: 'https://der-roemerhof.kuriersoft.ch/',
    allowedHosts: [
      'der-roemerhof.kuriersoft.ch',
      'www.der-roemerhof.kuriersoft.ch',
      'kuriersoft.ch',
      'www.kuriersoft.ch',
      'kurier.ch',
      'www.kurier.ch'
    ],
    name: 'Der Römerhof'
  }
  // Weitere Restaurants können hier einfach hinzugefügt werden
} as const;

// Export der aktuellen Konfiguration
export default CURRENT_RESTAURANT;
