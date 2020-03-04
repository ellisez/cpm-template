const webpack = require('webpack');

module.exports={
  chainWebpack: config => {debugger;
    const path=require('path');
    const nativePath=process.env.CPM_NATIVE_PATH;
    let entry=path.join(nativePath, '../..', './src/App.vue?entry=#root');

    config.entryPoints.clear();
    config.entry("app").add(entry);

    //
    config.module.rule('vue').uses.clear();
    config.module.rule('vue').test(/\.vue$/).use('weex-loader').loader('@cpm/weex-loader');

    //
    config.plugins.clear();
    config.plugins.delete('vue-loader');
    config.plugin('bundleType').use(webpack.BannerPlugin, [{
      raw: true ,
      banner: '// { "framework": "Vue" }\n'
    }]);
    //
    config.optimization.minimize(false);
  }
}
