<template>
<article class="index" :class="[ `index--skin-${computedIndexSkin}` ]">
  <header v-if="computedTitle" class="index__header">
    <h2 class="index__title">{{computedTitle}}</h2>
    <nav v-if="computedCategories && computedCategories.length" class="index__categories">
      <ul>
        <li v-for="(o,k) in computedCategories" :key="k">
          <nuxt-link :to="o.url" exact :class="[ o.active && 'active' ]">
            <span>{{o.name}}</span>
            <em>{{o.count}}</em>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>

  <items-index
    :index="index"
    :loading="loading"
    :error="error"
    :skin="computedIndexSkin"
    class="index__body"/>

  <nav v-if="computedUsePagination && total && total > 0" class="nav-paginate">
    <div class="nav-paginate__mobile">
      <nav-paginate
        v-model="page"
        :total="total"
        :size="size"
        :pageRange="2"
        :firstLastButton="false"
        :hidePrevNext="true"
        @input="onChangePage"/>
    </div>
    <div class="nav-paginate__desktop">
      <nav-paginate
        v-model="page"
        :total="total"
        :size="size"
        :page-range="8"
        :firstLastButton="false"
        :hidePrevNext="true"
        @input="onChangePage"/>
    </div>
  </nav>
</article>
</template>

<script>
import * as util from '~/assets/libs/util';

const defaultParams = {
  field: 'srl,category_srl,title,json,type,`order`,hit,star',
  order: `\`order\` desc, \`srl\` desc`,
};

export default {
  name: 'articles-index',
  components: {
    'items-index': () => import('~/components/contents/index'),
    'nav-paginate': () => import('~/components/navigation/paginate'),
  },
  validate(cox)
  {
    return cox.params.nest && /^[0-9A-Za-z_-]+$/.test(cox.params.nest);
  },
  head()
  {
    let title = `${this.title ? `${this.title} on ` : ''}${this.$store.state.env.app.name}`;
    return {
      title,
      meta: [
        { hid: 'og:title', property: 'og:title', content: title },
      ],
    };
  },
  async asyncData(cox)
  {
    const { state } = cox.store;
    const { query } = cox.route;
    let nest_id = cox.route.params.nest;
    let category_srl = query.category ? parseInt(query.category) : null;
    let page = query.page ? parseInt(query.page) : 1;

    // get data
    try
    {
      // get nest
      let nest = await cox.$axios.$get(`/nests/id/${nest_id}/`);
      if (!nest.success) throw new Error(nest.message);
      nest = nest.data;

      // get categories
      let categories = null;
      if (!!parseInt(nest.json.useCategory))
      {
        try
        {
          categories = await cox.$axios.$get(`/categories/?nest=${nest.srl}&ext_field=count_article,item_all`);
          if (!categories.success) throw new Error(categories.message);
          categories = categories.data.index;
        }
        catch (e) {}
      }

      // get articles
      let params = { ...defaultParams, page, nest: parseInt(nest.srl) };
      if (state.env.app.app_srl) params.app = state.env.app.app_srl;
      if (category_srl) params.category = category_srl;
      if (state.env.app.index.size) params.size = state.env.app.index.size;
      if (state.env.app.index.showMeta.categoryName) params.ext_field = 'category_name';
      let articles = await cox.$axios.$get(`/articles/${util.serialize(params, true)}`);
      if (articles.success)
      {
        articles = articles.data;
        articles.error = null;
      }
      else
      {
        articles.index = [];
        articles.total = 0;
        articles.error = articles.message;
      }

      return {
        nest_id,
        nest_srl: parseInt(nest.srl),
        category_srl,
        data: {
          nest,
          categories,
        },
        index: articles.index,
        title: nest.name,
        total: articles.total,
        page: params.page,
        size: params.size,
        loading: false,
        error: articles.error,
      };
    }
    catch(e)
    {
      return {
        error: e.message || 'Service error',
        index: null,
        total: 0,
        loading: false,
        data: {},
      };
    }
  },
  computed: {
    computedTitle()
    {
      const { state } = this.$store;
      const { nest } = this.data;
      if (nest && nest.name)
      {
        return nest.name;
      }
      else
      {
        let exp = new RegExp(`^${this.$route.path}`);
        let label = null;
        if (state.env.app.header.navigation)
        {
          state.env.app.header.navigation.forEach((o) => {
            if (exp.test(o.url)) label = o.label;
          });
        }
        return label;
      }
    },
    computedCategories()
    {
      const { categories } = this.data;
      if (!(categories && categories.length)) return [];
      return categories.map((o, k) => {
        let srl = o.srl ? parseInt(o.srl) : null;
        return {
          srl,
          name: o.name,
          count: o.count_article || 0,
          url: `/articles/${this.nest_id}/${srl ? `?category=${srl}` : ''}`,
          active: srl === this.category_srl,
        };
      });
    },
    computedUsePagination()
    {
      try
      {
        return !!this.$store.state.env.app.intro.newest.pagination;
      }
      catch(e)
      {
        return false;
      }
    },
    computedIndexSkin()
    {
      return this.$store.state.env.app.index.listStyle;
    },
  },
  watch: {
    '$route': function() {
      this.update().then();
    },
  },
  methods: {
    /**
     * on change page
     *
     * @param {Number} page
     */
    onChangePage(page)
    {
      let params = {};
      if (this.category_srl) params.category = this.category_srl;
      if (page > 1) params.page = page;
      this.$router.push(`${this.$route.path}${util.serialize(params, true)}`);
    },
    /**
     * update
     * update page and category
     *
     * @return {Promise}
     */
    async update()
    {
      const { state } = this.$store;
      this.category_srl = parseInt(this.$route.query.category) || null;
      this.page = parseInt(this.$route.query.page) || 1;
      this.loading = true;
      // get articles
      try
      {
        let params = {
          ...defaultParams,
          nest: parseInt(this.data.nest.srl),
          size: state.env.app.index.size || 20,
          page: this.page,
        };
        if (this.category_srl) params.category = this.category_srl;
        const res = await this.$axios.$get(`/articles/${util.serialize(params, true)}`);
        if (!res.success) throw new Error(res.message);
        this.total = res.data.total;
        this.index = res.data.index;
        this.error = null;
        await util.sleep(100);
        this.loading = false;
      }
      catch(e)
      {
        this.loading = false;
        this.total = 0;
        this.index = null;
        this.error = e.message || 'Service error';
      }
    },
  },
}
</script>

<style src="../index.scss" lang="scss" scoped/>
