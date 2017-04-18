import computed from "ember-addons/ember-computed-decorators";
import Site from 'discourse/models/site';
import Category from 'discourse/models/category';
import CategoryList from 'discourse/models/category-list';
import EditCategoryGeneral from 'discourse/components/edit-category-general';
import EditCategorySettings from 'discourse/components/edit-category-settings';
import SiteHeaderComponent from 'discourse/components/site-header';
import NavigationCategoryController from 'discourse/controllers/navigation/category';

export default {
  name: 'category_hierarchy-before',
  before: 'inject-discourse-objects',
  initialize() {

    Site.reopen({

      // Sort subcategories under parents
      @computed("categoriesByCount", "categories.[]")
      sortedCategories(cats) {
        const result = [];
        var remaining = {};

        cats.forEach(c => {
          const parentCategoryId = parseInt(c.get('parent_category_id'), 10);
          if (!parentCategoryId) {
            result.pushObject(c);
          } else {
            remaining[parentCategoryId] = remaining[parentCategoryId] || [];
            remaining[parentCategoryId].pushObject(c);
          }
        });

        while (!jQuery.isEmptyObject(remaining)) {
          const list = remaining;

          remaining = {};
          Object.keys(list).forEach(parentCategoryId => {
            const category = result.findBy('id', parseInt(parentCategoryId, 10)),
                  index = result.indexOf(category);

            if (index !== -1) {
              result.replace(index + 1, 0, list[parentCategoryId]);
            } else {
              remaining[parentCategoryId] = list[parentCategoryId];
            }
          });
        }

        return result;
      }

    });

    Category.reopenClass({

      slugFor(category, separator = "/") {
        if (!category) return "";

        const parentCategory = Em.get(category, 'parentCategory');
        let result = "";

        const id = Em.get(category, 'id'),
              slug = Em.get(category, 'slug');

        return !slug || slug.trim().length === 0 ? `${result}${id}-category` : result + slug;
      },

      findBySlug(slug, parentSlug) {
        const categories = Category.list();
        let category;

        category = Category.findSingleBySlug(slug);

        // In case the slug didn't work, try to find it by id instead.
        if (!category) {
          category = categories.findBy('id', parseInt(slug, 10));
        }

        return category;
      }

    });

    EditCategoryGeneral.reopen({

      parentCategories: function() {
        return Discourse.Category.list();
      }.property()

    });

    EditCategorySettings.reopen({

      isParentCategory: true,

    });

    SiteHeaderComponent.reopen({
      _category: null,

      setCategory(category) {
        this._category = category;
        this.queueRerender();
      },

      willDestroyElement() {
        this._super();
        $('body').off('keydown.header');
        $(window).off('resize.discourse-menu-panel');

        this.appEvents.off('header:show-category');
        this.appEvents.off('header:hide-category');
        this.appEvents.off('header:show-topic');
        this.appEvents.off('header:hide-topic');
        this.appEvents.off('dom:clean');
      },

      buildArgs() {
        return {
          flagCount: 0, // TODO: fix it
          topic: this._topic,
          category: this._category,
          canSignUp: this.get('canSignUp')
        };
      },

      didInsertElement() {
        this._super();
        $(window).on('resize.discourse-menu-panel', () => this.afterRender());

        this.appEvents.on('header:show-topic', topic => this.setTopic(topic));
        this.appEvents.on('header:hide-topic', () => this.setTopic(null));

        this.appEvents.on('header:show-category', category => this.setCategory(category));
        this.appEvents.on('header:hide-category', () => this.setCategory(null));

        this.dispatch('notifications:changed', 'user-notifications');
        this.dispatch('header:keyboard-trigger', 'header');

        this.appEvents.on('dom:clean', () => {
          // For performance, only trigger a re-render if any menu panels are visible
          if (this.$('.menu-panel').length) {
            this.eventDispatched('dom:clean', 'header');
          }
        });
      }

    });

    NavigationCategoryController.reopen({

      showingParentCategory: true

    });

  }
};
