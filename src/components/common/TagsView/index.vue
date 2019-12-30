<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="(tag,index) in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag,index)"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.name }}
        <span  class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag,index)" v-if="visitedViews.length>1"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)">{{ $t('tagsView.refresh') }}</li> -->
      <!-- <li v-if="!(selectedTag.meta&&selectedTag.meta.affix)" @click="closeSelectedTag(selectedTag,index)">
       关闭
      </li> -->
      <li @click="closeOthersTags">关闭其他</li>
      <!-- <li @click="closeAllTags(selectedTag)">{{ $t('tagsView.closeAll') }}</li> -->
    </ul>
  </div>
</template>

<script>
import ScrollPane from './ScrollPane'
// import { generateTitle } from '@/utils/i18n'
// import path from 'path'

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      // affixTags: []
    }
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView
    },
    // routes() {
    //   return this.$store.state.permission.routes
    // }
  },
  watch: {
    $route() {
      this.addTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    // this.initTags()
    this.addTags()
  },
  methods: {
    // generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.name === this.$route.name
    },
    // filterAffixTags(routes, basePath = '/') {
    //   let tags = []
    //   routes.forEach(route => {
    //     if (route.meta && route.meta.affix) {
    //       const tagPath = path.resolve(basePath, route.path)
    //       tags.push({
    //         fullPath: tagPath,
    //         path: tagPath,
    //         name: route.name,
    //         meta: { ...route.meta }
    //       })
    //     }
    //     if (route.children) {
    //       const tempTags = this.filterAffixTags(route.children, route.path)
    //       if (tempTags.length >= 1) {
    //         tags = [...tags, ...tempTags]
    //       }
    //     }
    //   })
    //   return tags
    // },
    // initTags() {
    //   const affixTags = this.affixTags = this.filterAffixTags(this.routes)
    //   for (const tag of affixTags) {
    //     // Must have tag name
    //     if (tag.name) {
    //       this.$store.dispatch('addVisitedView', tag)
    //     }
    //   }
    // },
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.commit('addView', this.$route)
      }
      // console.log(this.$store.state.tagsView)
      return false
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            // if (tag.to.fullPath !== this.$route.fullPath) {
            //   this.$store.dispatch('updateVisitedView', this.$route)
            // }
            break
          }
        }
      })
    },
    // refreshSelectedTag(view) {
    //   this.$store.dispatch('delCachedView', view).then(() => {
    //     const { fullPath } = view
    //     this.$nextTick(() => {
    //       this.$router.replace({
    //         path: '/redirect' + fullPath
    //       })
    //     })
    //   })
    // },
    closeSelectedTag(view,index) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews,index)
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag.fullPath)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    // closeAllTags(view) {
    //   this.$store.dispatch('delAllViews').then(({ visitedViews }) => {
    //     if (this.affixTags.some(tag => tag.path === view.path)) {
    //       return
    //     }
    //     this.toLastView(visitedViews)
    //   })
    // },
    toLastView(visitedViews,type) {
        // console.log(visitedViews)
         let latestView
        if(type!==0){
            latestView = visitedViews[type-1]
        }else{
           latestView = visitedViews[0]
        }
      if (latestView) {
        this.$router.push(latestView.fullPath)
      } else {
        // You can set another route
        this.$router.push('/')
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY+10
      this.visible = true
      this.selectedTag = tag
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  height: 36px;
  width: 96%;
  margin-top: 13px;
//   height: 50px;
  line-height: 36px;
//   background: #fff;
//   border-bottom: 1px solid #d8dce5;
//   box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      border: 1px solid #d8dce5;
      background-color: rgba(243,243,243,1);
      color: #495060;
    //   background: #fff;
      padding: 0 10px 0 15px;
    width: 143px;
      font-size: 14px;
      margin-left: -5px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    //   margin-top: 6px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
          color: #fff;
        // background-color: #347ea2;
        // border-color: #347ea2;
        // padding-top:3px;
        z-index: 1;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 0 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 20px;
      height: 20px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
    //   margin-left: 70px;
    margin-top:9px;
    float: right;
      &:before {
        transform: scale(1);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
