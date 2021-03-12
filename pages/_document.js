import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import getConfig from "next/config";

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, user-scalable=yes, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0"
          />
          <title>RecipeWorld</title>
          <link rel="shortcut icon" href="/static/cookie-bite-solid.svg" type="image/x-icon"></link>
        </Head>

        <body className="bg-red-100 font-serif text-sm m-0">
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
