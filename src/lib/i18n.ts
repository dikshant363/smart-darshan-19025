import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.book': 'Book',
      'nav.crowd': 'Crowd',
      'nav.traffic': 'Traffic',
      'nav.profile': 'Profile',
      
      // Common
      'common.emergency': 'Emergency',
      'common.select': 'Select',
      'common.continue': 'Continue',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      
      // Login
      'login.title': 'Welcome to Smart Darshan',
      'login.subtitle': 'Your spiritual journey starts here',
      'login.phone': 'Phone Number',
      'login.otp': 'Enter OTP',
      'login.language': 'Select Language',
      'login.temple': 'Select Temple',
      'login.guest': 'Continue as Guest',
      
      // Dashboard
      'dashboard.greeting': 'Namaste',
      'dashboard.book_darshan': 'Book Darshan',
      'dashboard.crowd_status': 'Crowd Status',
      'dashboard.weather': 'Weather',
      'dashboard.live_darshan': 'Live Darshan',
      
      // Temples
      'temple.somnath': 'Somnath',
      'temple.dwarka': 'Dwarka',
      'temple.ambaji': 'Ambaji',
      'temple.pavagadh': 'Pavagadh',
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.home': 'होम',
      'nav.book': 'बुक करें',
      'nav.crowd': 'भीड़',
      'nav.traffic': 'यातायात',
      'nav.profile': 'प्रोफाइल',
      
      // Common
      'common.emergency': 'आपातकाल',
      'common.select': 'चुनें',
      'common.continue': 'जारी रखें',
      'common.cancel': 'रद्द करें',
      'common.save': 'सेव करें',
      
      // Login
      'login.title': 'स्मार्ट दर्शन में आपका स्वागत है',
      'login.subtitle': 'आपकी आध्यात्मिक यात्रा यहाँ से शुरू होती है',
      'login.phone': 'फोन नंबर',
      'login.otp': 'OTP दर्ज करें',
      'login.language': 'भाषा चुनें',
      'login.temple': 'मंदिर चुनें',
      'login.guest': 'अतिथि के रूप में जारी रखें',
      
      // Dashboard
      'dashboard.greeting': 'नमस्ते',
      'dashboard.book_darshan': 'दर्शन बुक करें',
      'dashboard.crowd_status': 'भीड़ की स्थिति',
      'dashboard.weather': 'मौसम',
      'dashboard.live_darshan': 'लाइव दर्शन',
      
      // Temples
      'temple.somnath': 'सोमनाथ',
      'temple.dwarka': 'द्वारका',
      'temple.ambaji': 'अंबाजी',
      'temple.pavagadh': 'पावागढ़',
    }
  },
  gu: {
    translation: {
      // Navigation
      'nav.home': 'હોમ',
      'nav.book': 'બુક કરો',
      'nav.crowd': 'ભીડ',
      'nav.traffic': 'ટ્રાફિક',
      'nav.profile': 'પ્રોફાઇલ',
      
      // Common
      'common.emergency': 'કટોકટી',
      'common.select': 'પસંદ કરો',
      'common.continue': 'ચાલુ રાખો',
      'common.cancel': 'રદ કરો',
      'common.save': 'સેવ કરો',
      
      // Login
      'login.title': 'સ્માર્ટ દર્શનમાં આપનું સ્વાગત છે',
      'login.subtitle': 'આપની આધ્યાત્મિક યાત્રા અહીંથી શરૂ થાય છે',
      'login.phone': 'ફોન નંબર',
      'login.otp': 'OTP દાખલ કરો',
      'login.language': 'ભાષા પસંદ કરો',
      'login.temple': 'મંદિર પસંદ કરો',
      'login.guest': 'મહેમાન તરીકે ચાલુ રાખો',
      
      // Dashboard
      'dashboard.greeting': 'નમસ્તે',
      'dashboard.book_darshan': 'દર્શન બુક કરો',
      'dashboard.crowd_status': 'ભીડની સ્થિતિ',
      'dashboard.weather': 'હવામાન',
      'dashboard.live_darshan': 'લાઇવ દર્શન',
      
      // Temples
      'temple.somnath': 'સોમનાથ',
      'temple.dwarka': 'દ્વારકા',
      'temple.ambaji': 'અંબાજી',
      'temple.pavagadh': 'પાવાગઢ',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already escapes values
    },
  });

export default i18n;