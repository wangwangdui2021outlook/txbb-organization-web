<template>
  <div class="menu-content">
    <el-menu
      text-color="#E9E9E9"
      class="el-menu-vertical"
      active-text-color="#e9e9e9"
      :collapse="!menuStatus"
      :collapse-transition="false"
      :default-active="$route.path"
      :unique-opened="true"
    >
      <template v-for="(item, index) in asyncRouter">
        <router-link
          class="menu-link"
          :to="item.path + '/' + item.children[0].path"
          v-if="item.children && item.children.length === 1"
          :key="index"
        >
          <el-menu-item :index="item.path + '/' + item.children[0].path">
            <i :class="item.children[0].meta.icon"></i>
            <span slot="title">{{ item.children[0].meta.title }}</span>
          </el-menu-item>
        </router-link>

        <template v-else-if="item.children && item.children.length > 1">
          <el-submenu :index="item.path" :key="index">
            <template slot="title">
              <i :class="item.meta.icon"></i>
              <span>{{ item.meta.title }}</span>
            </template>
            <div>
              <router-link
                class="menu-link"
                v-for="child in item.children"
                :key="child.path"
                :to="item.path + '/' + child.path"
              >
                <el-menu-item
                  v-if="!child.meta.isHidden"
                  :index="item.path + '/' + child.path"
                  class="two-level"
                >
                  {{ child.meta.title }}</el-menu-item
                >
              </router-link>
            </div>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {
    menuStatus: {
      type: Boolean
    },
    asyncRouter: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {
      classs: ''
    }
  },
  watch: {
    menuStatus (val) {
      this.classs = val ? '' : 'q'
    }
  },
  methods: {
    goto (url) {
      this.$router.push(url)
    }
  },
  mounted () {
  }
}
</script>

<style  lang="scss" >
.menu-content {
  .el-menu {
    background-color: #41454b;
    border-right: none;
    .el-menu-item,
    .el-submenu__title {
      height: 80px;
      line-height: 80px;
      font-size: 14px;
      font-weight: 600;
      text-align: left;
    }
    .el-menu-item:hover,
    .el-menu-item:focus {
      @include bg_nav();
      // background-color: #ff9700;
    }
    .el-submenu__title:hover {
      @include bg_nav();
      // background-color: #ff9700;
    }
    .two-level {
      height: 70px;
      font-size: 14px;
      font-weight: 400;
      color: #e9e9e9;
      line-height: 70px;
      @include bg_nav();
      // background-color: #ff9700;
      padding-left: 80px !important;
    }
    .el-menu-item.is-active {
      @include bg_nav();
      // background-color: #ff9700;
      i {
        color: #ffffff;
      }
    }
  }
  .iconfont {
    font-size: 16px;
    margin-right: 21px;
    color: #e9e9e9;
  }
  .menu-link {
    text-decoration: none;
  }
  .menu-link:active {
    text-decoration: none;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 100%;
  }
}
.menu-link {
  text-decoration: none;
}
.menu-link:active {
  text-decoration: none;
}
.el-menu {
  background-color: #ffefef;
}
.el-menu-item:hover,
.el-menu-item:focus {
  background-color: #ffefef;
}
</style>
