import "../styles/styles.scss";
import App from "next/app";
import React from "react";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import makeStore from "../src/redux/store";
import { serialize, deserialize } from "json-immutable";
import { setIdentity } from "src/identity/Identity";


class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    console.log("----------------- Get init props from _app ----------------- ")
    await ctx.store.stopSaga();
    await ctx.store.execSagaTasks(ctx, (dispatch) => {
      if (ctx.req?.ssrData) {
        // dispatch(setSSRData(ctx.req.ssrData))
      }
      if (ctx.req?.session.identity)
        dispatch(setIdentity(ctx.req.session.identity))
    });
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
}

const wRedux = withRedux(makeStore, {
  serializeState: (state) => {
    return state ? serialize(state) : state;
  },
  deserializeState: (state) => {
    return state ? deserialize(state) : state;
  },
})(MyApp);

export default wRedux;
