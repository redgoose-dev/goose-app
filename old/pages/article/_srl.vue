<template>
<article v-if="!error" class="article">
  <div class="article__wrap">
    <header class="article__header">
      <h1>{{fields.title}}</h1>
      <p>
        <span>{{fields.nest}}{{fields.category && ` / ${fields.category}`}}</span>
        <span>Hit:{{fields.hit}}</span>
        <span>{{fields.regdate}}</span>
      </p>
    </header>
    <div v-html="fields.body" class="redgoose-body article__content"></div>
    <nav class="article__nav">
      <button
        type="button"
        class="like"
        @click="onClickStar"
        :class="[ !!fields.selectedStar && 'on' ]"
        :disabled="!!fields.selectedStar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="129.184 102.606 25.632 23.517">
          <path d="M13,24.123l-1.858-1.692C4.542,16.446.184,12.5.184,7.655A6.981,6.981,0,0,1,7.233.606,7.673,7.673,0,0,1,13,3.285,7.676,7.676,0,0,1,18.767.606a6.981,6.981,0,0,1,7.049,7.049c0,4.844-4.358,8.791-10.958,14.789Z" transform="translate(129 102)"></path>
        </svg>
        <em>{{fields.star}}</em>
      </button>
    </nav>
  </div>
</article>
<div v-else>
	<error-body :message="error"/>
</div>
</template>

<script>
import marked from 'marked';
import * as util from '~/assets/libs/util';
import * as datasets from '~/assets/libs/datasets';

export default {
  name: 'page-article',
  components: {
    'error-body': () => import('~/components/error/body'),
  },
  validate(cox)
  {
    return cox.params.srl && /^\d+$/.test(cox.params.srl);
  },
  head()
  {
    const { fields, $store } = this;
    let title = `${fields.title} on ${$store.state.env.app.name}`;
    let meta = [
      { hid: 'og:title', property: 'og:title', content: title },
    ];
    if (fields.coverImage)
    {
      meta.push({
        hid: 'og:image',
        property: 'og:image',
        content: fields.coverImage
      });
    }
    return {
      title: title,
      meta,
    };
  },
  async asyncData(cox)
  {
    const { req, res, store } = cox;
    let srl = cox.params.srl;
    let checkStar = util.getCookie(req || null, `redgoose-like-${srl}`);
    let checkHit = util.getCookie(req || null, `redgoose-hit-${srl}`);

    // if cookie has hit, hit +1
    if (!checkHit)
    {
      util.setCookie(res || null, `redgoose-hit-${srl}`, 1);
    }

    let params = {
      app: store.state.env.app.app_srl,
      hit: checkHit ? 0 : 1,
      ext_field: 'category_name,nest_name',
    };
    try
    {
      let res = await cox.$axios.$get(`/articles/${srl}/${util.serialize(params, true)}`);
      if (!(res.success && res.data)) throw res.message;
      return {
        data: {
          ...res.data,
          content: marked(res.data.content),
          selectedStar: !!checkStar,
        },
        error: null,
      };
    }
    catch(e)
    {
      return {
        error: (typeof e === 'string') ? e : 'no item',
      };
    }
  },
  computed: {
    fields()
    {
      const { $store, data } = this;
      return data ? {
        title: data.title,
        nest: data.nest_name,
        category: data.category_name,
        regdate: datasets.getFormatDate(data.regdate, false),
        body: data.content,
        hit: parseInt(data.hit || 0),
        star: parseInt(data.star || 0),
        selectedStar: !!data.selectedStar,
        coverImage: (data.json && data.json.thumbnail && data.json.thumbnail.path) ? $store.state.env.api.url + '/' + data.json.thumbnail.path : null,
      } : {};
    },
  },
  methods: {
    async onClickStar(e)
    {
      this.data.selectedStar = true;
      try
      {
        let srl = parseInt(this.data.srl);
        let res = await this.$axios.$get(`/articles/${srl}/update/?type=star`);
        if (!res.success) throw 'Failed update';
        this.data.star = res.data.star;
        util.setCookie(res || null, `redgoose-like-${srl}`, 1);
      }
      catch(e)
      {
        alert('Failed update like');
        this.data.selectedStar = false;
      }
    },
  },
}
</script>

<style src="./_srl.scss" lang="scss"></style>
