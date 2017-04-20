import { observes } from 'ember-addons/ember-computed-decorators';

export default Ember.Component.extend({

  didInsertElement() {
    this._super();
    this.refresh();
  },

  _update() {
    if (this.isDestroying || this.isDestroyed) { return; }
    const category = this.get('category');
    this._remove();
    if (category) {
      this.appEvents.trigger('header:show-category', category);
      $("body").addClass(`category`);
    }
  },

  @observes('category')
  refresh() {
    Ember.run.scheduleOnce('afterRender', this, this._update);
  },

  _remove() {
    this.appEvents.trigger('header:hide-category');
    $("body").removeClass(`category`);
  },

  willDestroyElement() {
    this._super();
    this._remove();
  }

});
