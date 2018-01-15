import PropTypes from 'prop-types'
import Link from 'next/link'
import Router from 'next/router'
import Progress from 'nprogress'
import { g, animations } from 'next-md'
import Color from 'color'

import theme from '../theme'

// import InlineList from './InlineList'
import Navigation from './_Navigation'

let progress

const stopProgress = () => {
  clearTimeout(progress)
  Progress.done()
}

// Only show progress bar if page transition takes longer than 200 milliseconds
Router.onRouteChangeStart = () => {
  progress = setTimeout(Progress.start, 200)
}
Router.onRouteChangeComplete = stopProgress
Router.onRouteChangeError = stopProgress

const Page = ({ children, pathname, title, me }) => (
  <div className='page'>
    <header>
      <Link href={'/'}>
        <a className='home'>
          <img className='logo' src='/static/logo.png' />
        </a>
      </Link>
      <Navigation pathname={pathname} me={me} />
    </header>
    <main>{children}</main>
    {/*
    <footer className='body1'>
      <InlineList style={{ marginLeft: 'auto' }}>
        <li>
          <a href='https://twitter.com/_iris_sh' target='_blank'>
            <img src='/static/twitter.svg' className='twitter' />
          </a>
        </li>
      </InlineList>
    </footer>
    */}
    <style jsx>
      {`
        /* Page */

        .page {
          display: flex;
          flex-direction: column;
          position: relative;
          min-height: 100%;
          box-sizing: border-box;
        }

        .page > *:not(main) {
          margin: ${g(4)} ${g(4)} ${g(2)};
        }

        main > :global(*) {
          margin: 0 ${g(4)};
        }

        header {
          display: flex;
          align-items: center;

          height: ${g(10)};
          margin-bottom: ${g(6)};
        }

        .home {
          display: flex;
        }

        .logo {
          height: ${g(10)};
        }

        .signIn {
          margin-left: auto;

          color: ${Color(theme.colors.secondary).alpha(0.87).rgb()};
          font-weight: 100;
          text-decoration: none;

          cursor: pointer;

          ${animations.standard('color')} transition-duration: 200ms;
        }

        .signIn:hover {
          color: ${Color(theme.colors.secondary).alpha(1).rgb()};
        }

        main {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;

          width: 100%;
        }

        /* TODO Codify these in theme.js */
        @media (min-width: ${g(180)}) {
          .page {
            align-items: center;
          }

          .page > *:not(main) {
            width: ${g(172)};
          }

          main > :global(*) {
            width: ${g(172)};
          }
        }

        @media (min-width: ${g(280)}) {
          .page > *:not(main) {
            width: ${g(200)};
          }

          main > :global(*) {
            width: ${g(200)};
          }
        }

        @media (min-width: ${g(325)}) {
          .page > *:not(main) {
            width: ${g(220)};
          }

          main > :global(*) {
            width: ${g(220)};
          }
        }

        footer {
          display: flex;
          align-items: center;
          justify-content: center;

          margin-top: ${g(4)};

          font-weight: 100;
          text-align: center;
        }

        .twitter {
          height: 13px;

          vertical-align: middle;
        }
      `}
    </style>
    <style jsx global>
      {`
        #nprogress {
          pointer-events: none;
        }

        #nprogress .bar {
          background: ${theme.colors.secondary};
          position: fixed;
          z-index: 1031;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
        }

        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px ${theme.colors.secondary}, 0 0 5px ${theme.colors.secondary};
          opacity: 1;
          transform: rotate(3deg) translate(0px, -4px);
        }
      `}
    </style>
  </div>
)

Page.propTypes = {
  children: PropTypes.any,
  pathname: PropTypes.string,
  title: PropTypes.string,
  me: PropTypes.object
}

export default Page
