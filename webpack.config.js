// @ts-check
const fs = require('fs');
const { glob } = require('glob');
const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;

const yaml = require('yaml');

// Read manifest
const manifestRaw = fs.readFileSync("manifest.yml", "utf8");
const manifest = yaml.parse(manifestRaw);


// Clear dist folder
const distFolder = path.resolve(__dirname, 'dist');
if (fs.existsSync(distFolder)) {
    fs.rmdirSync(distFolder, { recursive: true });
}
fs.mkdirSync(distFolder);


module.exports = [
    // {
    //     name: "server",
    //     cache: false,
    //     mode: 'development',
    //     devtool: 'source-map',
    //     entry: glob.sync('./src/server/**/*.{js,ts}').map((file) => path.resolve(__dirname, file)),
    //     output: {
    //         filename: 'server.[name].[contenthash].js',
    //         path: path.resolve(__dirname, 'dist'),
    //         uniqueName: 'plugin1.server',
    //     },
    //     optimization: {
    //         minimize: false,
    //     },

    //     resolve: {
    //         extensions: ['.js', '.ts']
    //     },
    //     module: {
    //         rules: [
    //             {
    //                 test: /\.ts?$/,
    //                 use: 'ts-loader',
    //                 exclude: /node_modules/,
    //             },
    //         ],
    //     }
    // },
    {
        name: "client",
        cache: false,
        mode: 'development',
        devtool: 'source-map',
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            uniqueName: `${manifest.bundle}`,
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

            })
        ],
    }
];
