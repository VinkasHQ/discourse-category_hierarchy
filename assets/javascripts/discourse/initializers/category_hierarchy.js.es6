import { withPluginApi, reopenWidget } from 'discourse/lib/plugin-api'


import { h } from 'virtual-dom';

export default {
  name: 'category-hierarchy',
  initialize() {

    withPluginApi('0.8.6', api => {

      api.reopenWidget('home-logo', {

        href() {
          var href = this.settings.href;
          if (this.attrs.category) {
            href = this.attrs.category.get('url');
          }
          return (typeof href === "function") ? href() : href;
        },

        logo() {
          const { siteSettings } = this;
          const mobileView = this.site.mobileView;

          const mobileLogoUrl = siteSettings.mobile_logo_url || "";
          const showMobileLogo = mobileView && (mobileLogoUrl.length > 0);

          const logoUrl = siteSettings.logo_url || '';
          const title = siteSettings.title;

          if (!mobileView && this.attrs.minimized) {
            const logoSmallUrl = siteSettings.logo_small_url || '';
            if (logoSmallUrl.length) {
              return h('img#site-logo.logo-small', { key: 'logo-small', attributes: { src: logoSmallUrl, width: 33, height: 33, alt: title } });
            } else {
              return iconNode('home');
            }
          } else if (showMobileLogo) {
            return h('img#site-logo.logo-big', { key: 'logo-mobile', attributes: { src: mobileLogoUrl, alt: title } });
          } else if (logoUrl.length) {
            return h('img#site-logo.logo-big', { key: 'logo-big', attributes: { src: logoUrl, alt: title } });
          } else {
            return h('h2#site-text-logo.text-logo', { key: 'logo-text' }, title);
          }
        }

      });
    });

  }
}
