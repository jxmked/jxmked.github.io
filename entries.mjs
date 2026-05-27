const pages = [
  // Keep this one for index page
  {
    title: 'index',
    folder: '',
    output_folder: ''
  }
];

const publicPath = 'jxmked.space/';

const appName = 'jxmked';
const shortAppName = 'jxmked';
const GA4_MEASUREMENT_ID = 'G-TFPC622JKX'; // Set to false to disable
const SITE_NAME = 'jxmked page';
const PRODUCT_ICON = {
  href: './product-icon.png',
  width: '1024',
  height: '1024'
};

const PWA = {
  theme_color: '#272738',
  background: '#3a3a3c'
};

const DEV_ADDR = {
  host: 'localhost',
  port: 3000
};

const MISC_CONF = {
  windowResizeable: false,
  enabled_workoffline: false,
  OG_URL: "https://" + publicPath, // false = uses package.json homepage field, string = custom url
}

export default {
  DEV_ADDR,
  pages,
  publicPath,
  appName,
  shortAppName,
  GA4_MEASUREMENT_ID,
  SITE_NAME,
  PRODUCT_ICON,
  PWA,
  MISC_CONF
};
