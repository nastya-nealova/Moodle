const withPlugins = require('next-compose-plugins');
const withCss = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./config');

const nextConfig = {
    publicRuntimeConfig: {
        SITE_NAME: config.siteName,
        BASE_URL : process.env.BASE_URL || config.baseUrl,
    },
    webpack(config, { isServer, buildId, dev }) {

        config.module.rules.push({
            test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'raw-loader',
        });

        config.module.rules.push({
            test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                    name: '[name].[ext]'
                }
            }
        })
        
        if (config.mode === 'production') {
            if (Array.isArray(config.optimization.minimizer)) {
                config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
            }
        }

        if (!isServer && !dev) {
            //config.plugins.push();
        }

        return config;
    }
};

module.exports = withPlugins([
    [ withSass, {} ],
    [ withCss, {} ],
],nextConfig);