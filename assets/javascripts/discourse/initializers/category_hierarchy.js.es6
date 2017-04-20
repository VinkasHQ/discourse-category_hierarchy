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

        category_logo() {
          const mobileView = this.site.mobileView;
          const category = this.attrs.category;

          if (category) {
            const title = category.get('name');
            const logo = category.get('uploaded_logo');

            if (logo) {
              if (!mobileView && this.attrs.minimized) {
                return h('img#site-logo.logo-small', { key: 'category-logo-small', attributes: { src: logo.url, width: 33, height: 33, alt: title } });
              } else if (mobileView) {
                return h('img#site-logo.logo-big', { key: 'category-logo-mobile', attributes: { src: logo.url, alt: title } });
              } else {
                return h('img#site-logo.logo-big', { key: 'category-logo-big', attributes: { src: logo.url, alt: title } });
              }
            }

            return h('h2#site-text-logo.text-logo', { key: 'category-logo-text' }, title);
          }
        },

        logo() {
          const { siteSettings } = this;
          const mobileView = this.site.mobileView;

          const mobileLogoUrl = siteSettings.mobile_logo_url || "";
          const showMobileLogo = mobileView && (mobileLogoUrl.length > 0);

          const logoUrl = siteSettings.logo_url || '';
          const title = siteSettings.title;

          var siteLogo = null;
          const categoryLogo = this.category_logo();

          if (!mobileView && this.attrs.minimized) {
            if (categoryLogo) return categoryLogo;

            const logoSmallUrl = siteSettings.logo_small_url || '';

            if (logoSmallUrl.length) {
              siteLogo =  h('img#site-logo.logo-small', { key: 'site-logo-small', attributes: { src: logoSmallUrl, width: 33, height: 33, alt: title } });
            } else {
              siteLogo = iconNode('home');
            }
          } else if (showMobileLogo) {
            siteLogo = h('img#site-logo.logo-big', { key: 'site-logo-mobile', attributes: { src: mobileLogoUrl, alt: title } });
          } else if (logoUrl.length) {
            siteLogo = h('img#site-logo.logo-big', { key: 'site-logo-big', attributes: { src: logoUrl, alt: title } });
          } else {
            siteLogo = h('h2#site-text-logo.text-logo', { key: 'site-logo-text' }, title);
          }

          if (categoryLogo) return h('div.logo', [siteLogo, categoryLogo]);

          return siteLogo;
        }

      });

      api.decorateWidget('header-icons:before', helper => {
        return helper.h('li', [
            helper.h('a.icon', {
                href: '/',
                title: 'Home'
            }, helper.h('i.fa.fa-home')),
        ]);
      });
    });

  }
}
