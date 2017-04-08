import Category from 'discourse/models/category';
import CategoryList from 'discourse/models/category-list';
import EditCategoryGeneral from 'discourse/components/edit-category-general';
import EditCategorySettings from 'discourse/components/edit-category-settings';
import NavigationCategoryController from 'discourse/controllers/navigation/category';

export default {
  name: 'category_hierarchy',
  after: 'inject-discourse-objects',
  initialize() {

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

    NavigationCategoryController.reopen({

      showingParentCategory: true

    });

    Discourse.DiscoveryCategoryRoute.reopen({

      _createSubcategoryList(category) {
        this._categoryList = null;
        if (category.get('show_subcategory_list')) {
          return CategoryList.listForParent(this.store, category).then(list => this._categoryList = list);
        }

        // If we're not loading a subcategory list just resolve
        return Em.RSVP.resolve();
      }

    });

    Discourse.DiscoveryParentCategoryRoute.reopen({

      _createSubcategoryList(category) {
        this._categoryList = null;
        if (category.get('show_subcategory_list')) {
          return CategoryList.listForParent(this.store, category).then(list => this._categoryList = list);
        }

        // If we're not loading a subcategory list just resolve
        return Em.RSVP.resolve();
      }

    });

  }
};
