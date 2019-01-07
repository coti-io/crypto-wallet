import { injectGlobal } from 'styled-components';
import MediumFont from './ClanOT-News.woff'
import ClanOTBook from './ClanOT-Book.woff'
import NewsFont from './ClanOT-News.woff'
import ClanOTBold from './ClanOT-Bold.woff'

injectGlobal`
  @font-face {
     font-family: 'ClanOT-News';
     src: url(${NewsFont});
  }
`

injectGlobal`
  @font-face {
     font-family: 'ClanOT-Medium';
     src: url(${MediumFont});
  }
`
injectGlobal`
  @font-face {
     font-family: 'ClanOT-Bold';
     src: url(${ClanOTBold});
  }
`
injectGlobal`
  @font-face {
     font-family: 'ClanOT-Book';
     src: url(${ClanOTBook});
  }
`
injectGlobal`
  @font-face {
    font-family: 'TitilliumWeb-bold';
    font-style: normal;
    font-weight: 700;
    src: local('Titillium Web Bold'), local('TitilliumWeb-Bold'), url(https://fonts.gstatic.com/s/titilliumweb/v6/anMUvcNT0H1YN4FII8wpr8hG3LOB74UqS1hPmWaAxzQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
}
`