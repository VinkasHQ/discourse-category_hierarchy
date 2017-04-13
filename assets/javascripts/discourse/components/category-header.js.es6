export default Ember.Component.extend({
  classNameBindings: [':category-header'],

  tagName: 'section',

  categories: function() {
    const list = [];
    var category = this.get('category');
    while (category.parentCategory) {
      category = category.parentCategory;
      list.push(category);
    }
    return list.reverse();
  }.property('category')

});
