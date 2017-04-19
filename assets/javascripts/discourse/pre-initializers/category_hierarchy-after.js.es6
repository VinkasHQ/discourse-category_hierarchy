import computed from "ember-addons/ember-computed-decorators";
import Site from 'discourse/models/site';
import Category from 'discourse/models/category';
import CategoryList from 'discourse/models/category-list';
import EditCategoryGeneral from 'discourse/components/edit-category-general';
import EditCategorySettings from 'discourse/components/edit-category-settings';
import NavigationCategoryController from 'discourse/controllers/navigation/category';

export default {
  name: 'category_hierarchy-after',
  after: 'inject-discourse-objects',
  initialize() {

    Discourse.DiscoveryCategoryRoute.reopen({

      _createSubcategoryList(category) {
        this.appEvents.trigger('header:show-forum', category.get('forum'));

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
        this.appEvents.trigger('header:show-forum', category.get('forum'));

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
