module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.optimization.splitChunks = {
                chunks: 'all',
                minSize: 0,
                maxSize: 100000,
            };

            return webpackConfig;
        },
    },
};