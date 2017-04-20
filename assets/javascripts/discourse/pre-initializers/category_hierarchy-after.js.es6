import CategoryList from 'discourse/models/category-list';

export default {
  name: 'category_hierarchy-after',
  after: 'inject-discourse-objects',
  initialize() {

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
