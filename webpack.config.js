const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;

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
        entry: {},
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
                name: `${manifest.name}`,

                filename: 'remoteEntry.js',

                exposes: manifest.modules.filter(mod => mod.type == "ui").reduce((acc, mod) => {
                    acc[mod.module] = mod.file
                    return acc
                }, {}),
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
