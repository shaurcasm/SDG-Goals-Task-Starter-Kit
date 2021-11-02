/**
 * Need to reconfigure Babel to allow jest to process d3.
 */
module.exports = {
    presets: [
      '@babel/preset-react',
      [ 
        '@babel/preset-env',
        {
            targets: {
                node: 'current',
            },
        },
      ],
    ],
};