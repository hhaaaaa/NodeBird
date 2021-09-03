import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  // getInitialProps는 app과 document에서만 사용됨 - deprecated될 가능성이 매우 높음??
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try { 
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* 
            ie에서 실행하면 버전이 높아서 안돌아가는 문제 해결 방법 
            - polyfill.io 접속
            -> create a polyfill bundle
            -> deafult, es2015~2019 정도 체크해서 복사
            -> <NextScript> 태그보다 상위에 작성
          */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2Cdefault%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
