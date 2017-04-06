# name: category_hierarchy
# about: Infinite level sub categories.
# version: 0.0.1
# authors: Vinoth Kannan (vinothkannan@vinkas.com)
# url: https://github.com/VinkasHQ/discourse-category_hierarchy

after_initialize do

  Category.class_eval do

    def url
      url = Category.class_variable_get(:@@url_cache)[self.id]
      unless url
        url = "#{Discourse.base_uri}/c"
        url << "/#{slug}"
        url.freeze

        Category.class_variable_get(:@@url_cache)[self.id] = url
      end

      url
    end

    def self.find_by_slug(category_slug, parent_category_slug=nil)
      self.where(slug: category_slug).first
    end

    def self.query_category(slug_or_id, parent_category_id)
      self.where(slug: slug_or_id).includes(:featured_users).first ||
      self.where(id: slug_or_id.to_i).includes(:featured_users).first
    end

  end

  ListController.class_eval do

    def set_category
      slug_or_id = params.fetch(:category)
      parent_slug_or_id = params[:parent_category]
      id = params[:id].to_i

      parent_category_id = nil

      @category = Category.query_category(slug_or_id, parent_category_id)

      # Redirect if we have `/c/:parent_category/:category/:id`
      if id
        category = Category.find_by_id(id)
        (redirect_to category.url, status: 301) && return if category
      end

      permalink_redirect_or_not_found and return if !@category

      @description_meta = @category.description_text
      raise Discourse::NotFound unless guardian.can_see?(@category)

      if use_crawler_layout?
        @subcategories = @category.subcategories.select { |c| guardian.can_see?(c) }
      end
    end

  end

end
