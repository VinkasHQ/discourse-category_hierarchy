import { withPluginApi, reopenWidget } from 'discourse/lib/plugin-api'


import { h } from 'virtual-dom';

export default {
  name: 'category-hierarchy',
  initialize() {

    withPluginApi('0.8.6', api => {

      api.reopenWidget('home-logo', {

        href() {
          var href = this.settings.href;
          if (this.attrs.forum) {
            href = this.attrs.forum.get('url');
          }
          return (typeof href === "function") ? href() : href;
        },

        forum_logo() {
          const mobileView = this.site.mobileView;
          const forum = this.attrs.forum;

          if (forum) {
            const title = forum.get('name');
            const logo = forum.get('uploaded_logo');

            if (logo) {
              if (!mobileView && this.attrs.minimized) {
                return h('img#site-logo.logo-small', { key: 'forum-logo-small', attributes: { src: logo.url, width: 33, height: 33, alt: title } });
              } else if (mobileView) {
                return h('img#site-logo.logo-big', { key: 'forum-logo-mobile', attributes: { src: logo.url, alt: title } });
              } else {
                return h('img#site-logo.logo-big', { key: 'forum-logo-big', attributes: { src: logo.url, alt: title } });
              }
            }

            return h('h2#site-text-logo.text-logo', { key: 'forum-logo-text' }, title);
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
          const forumLogo = this.forum_logo();

          if (!mobileView && this.attrs.minimized) {
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

          if (forumLogo) return h('div.logo', [siteLogo, forumLogo]);

          return siteLogo;
        }

      });
    });

  }
}
