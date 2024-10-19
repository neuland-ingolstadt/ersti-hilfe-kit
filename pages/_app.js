import React from 'react'
import PropTypes from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.css'

// workaround for this iOS 14.6 bug
// https://bugs.webkit.org/show_bug.cgi?id=226547
// eslint-disable-next-line no-unused-expressions
typeof window !== 'undefined' && window.indexedDB

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
MyApp.propTypes = {
  Component: PropTypes.elementType,
  pageProps: PropTypes.any,
}

export default MyApp
