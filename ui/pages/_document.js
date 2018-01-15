import Document, {Head, Main, NextScript} from 'next/document'
import flush from 'styled-jsx/server'
import {themeLight, animations, g, type} from 'next-md'
import Color from 'color'

import theme from '../theme'

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const {html, head, errorHtml, chunks} = renderPage()
    const styles = flush()
    return {html, head, errorHtml, chunks, styles}
  }

  render () {
    return (
      <html>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,700,700i,900,900i' rel='stylesheet' />
          <link
            href='https://fonts.googleapis.com/icon?family=Material+Icons'
            rel='stylesheet'
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              ${themeLight(theme)}

              html {
                background-color: ${theme.colors.primary};
              }

              [data-reactroot] {
                height: 100%;
                color: ${theme.colors.secondary};
                font-family: 'Lato', sans-serif;
              }

              ::selection {
                background-color: ${Color(theme.colors.secondary).alpha(0.5).rgb()};
              }

              .display4 { font-weight: 200; }
              .display3 { font-weight: 400; }
              .display2 { font-weight: 400; }
              .display1 { font-weight: 400; }
              .headline { font-weight: 400; }
              .title { font-weight: 500; }
              .subheading: { font-weight: 400; }
              .body2 { font-weight: 500; }
              .body1 { font-weight: 400; }
              .caption { font-weight: 400; }
              .button { font-weight: 500; }

              .dataTable th { font-weight: 500; }

              a.noStyle {
                text-decoration: none;
              }

              a:not(.noStyle) {
                ${type.body1}
                color: ${theme.colors.secondary};
                font-weight: 300;
                text-decoration: none;

                opacity: 0.8;

                ${animations.standard('opacity')}
              }

              a:not(.noStyle):not(.active):hover {
                opacity: 0.9;
              }

              a.active:not(.noStyle) {
                opacity: 1;
              }

              html [data-reactroot] .switch .thumb {
                top: -2px;

                width: ${g(3)};
                height: ${g(3)};
              }

              html [data-reactroot] .switch .track {
                width: ${g(7)};
                height: ${g(2)};

                background-color: rgba(255, 255, 255, 0.26);
              }

              html [data-reactroot] .switch.checked .thumb {
                left: calc(100% - 12px);

                background-color: ${theme.colors.secondary};
              }

              html [data-reactroot] .switch.checked .track {
                background-color: ${Color(theme.colors.secondary).alpha(0.26).rgb().string()};
              }

              html [data-reactroot] .switch.disabled .thumb {
                background-color: rgba(255, 255, 255, 0.50);
              }

              html [data-reactroot] .switch.disabled .track {
                background-color: rgba(255, 255, 255, 0.12);
              }

              p {
                margin: ${g(2)} 0;
              }

              code {
                color: rgba(255, 255, 255, 0.87);
                font-family: 'Roboto Mono';
              }

              code::before {
                color: rgba(255, 255, 255, 0.87);
                font-family: 'Roboto Mono';

                content: '\`';
              }

              code::after {
                color: rgba(255, 255, 255, 0.87);
                font-family: 'Roboto Mono';

                content: '\`';
              }
            `
            }}
          />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no'
          />
          <meta name='apple-mobile-web-app-capable' content='yes' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
