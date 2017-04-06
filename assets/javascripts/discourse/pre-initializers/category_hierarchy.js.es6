import Category from 'discourse/models/category';

export default {
  name: 'category_hierarchy',
  before: 'inject-discourse-objects',
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

  }
};
