const path = require('path')
const fs = require('fs')


const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const htmlWebpackPluginPath = resolveApp('node_modules/html-webpack-plugin')

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            
            // Make more but smaler chunks when building
            webpackConfig.optimization.splitChunks = {
                chunks: 'all',
                minSize: 0,
                maxSize: 100000,
            }

            // Do not "auto import" javascript bundles to the index html file
            const HtmlWebpackPlugin = require(htmlWebpackPluginPath)
            
            const htmlWebpackPluginIndex = webpackConfig.plugins.findIndex(
                (plugin) => plugin instanceof HtmlWebpackPlugin
            )

            if (htmlWebpackPluginIndex >= 0) {
                webpackConfig.plugins[htmlWebpackPluginIndex] = new HtmlWebpackPlugin({
                    ...webpackConfig.plugins[htmlWebpackPluginIndex].options,
                    inject: false,              // This disables the auto-injection of script tags
                    template: paths.appHtml,    // Ensure the custom template is used
                })
            }

            return webpackConfig

        },
    },
};