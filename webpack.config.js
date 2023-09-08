// @ts-check
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;


module.exports = {
    cache: false,
    mode: 'development',
    devtool: 'source-map',

    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        uniqueName: 'plugin1',
    },

    optimization: {
        minimize: false,
    },

    resolve: {
        extensions: ['.jsx', '.js', '.json', '.mjs', '.ts', '.tsx'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.jsx?$/,
                loader: require.resolve('babel-loader'),
                exclude: /node_modules/,
                options: {
                    presets: [require.resolve('@babel/preset-react')],
                },
            },
        ],
    },


    plugins: [
        new ModuleFederationPlugin({
            name: 'plugin1',
            filename: 'remoteEntry.js',
            exposes: {
                // './react': 'react',
                // './react-dom': 'react-dom',
                './Module': './src/remote-entry.js',
            },
            shared: {
                ...deps,
                "react": {
                    eager: true,
                    singleton: true,
                },
                "react-dom": {
                    eager: true,
                    singleton: true,
                },
            },

        }),
        new ZipPlugin({
            filename: 'plugin1.zip',
        })
    ],
};
