<template>
  <li class="menu-item" :class="{active: isActive}">
    <!-- {{ tienePadre }} -->
    <!-- Menu -->
    <router-link v-if="children.length === 0" :to="to" class="link">
      <i class="icon" :class="icon" />
      <span class="flex-grow-1 text-start menu-item-name" v-show="!collapsed">
        <slot />
      </span>
    </router-link>

    <div
      v-else
      @click="toggleSubmenu"
      class="link"
      :class="{'cursor-pointer': !collapsed}"
    >
      <i class="icon" :class="icon" />
      <span class="flex-grow-1 text-start menu-item-name" v-show="!collapsed">
        <slot />
      </span>
      <i
        v-if="showArrow"
        class="bi bi-chevron-right arrow"
        :class="{'rotate-arrow': openSubmenu}"
      />
    </div>

    <!-- Contenedor de Submenu-->
    <ul
      class="submenu"
      :class="{'show-as-floating-submenu': collapsed, 'd-block': openSubmenu}"
    >
      <!-- Muestra el titulo si el item tiene hijos o es del nivel 1 -->
      <li v-if="collapsed && (children.length > 0 || !tienePadre)">
        <span class="fw-bold"><slot /></span>
      </li>
      <!-- Submenu-->
      <sidebar-menu-item
        v-for="child of children"
        :key="child.route"
        :to="child.route"
        icon="bi bi-circle"
        :children="child.children ? child.children : []"
        class="submenu-item"
        :has-parent="true"
        >{{ child.title }}
      </sidebar-menu-item>
    </ul>
  </li>
</template>

<script lang="ts" src="./TheSidebarMenuItem.ts"></script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.rotate-arrow {
  transform: rotate(90deg);
}

.menu-item {
  position: relative;
  border-radius: 4px;
  font-size: 15px;
  white-space: nowrap;
  line-height: 50px;

  &.active {
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
    box-shadow: 0 0 10px 1px rgba(115, 103, 240, 0.7);

    .link > * {
      color: #fff !important;
    }
  }

  .link {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translate(4px);
    }

    .menu-item-name {
      font-size: 14px;
      color: $texto;
      transition: all 0.4s ease;
    }

    i {
      min-width: 66px;
      text-align: center;
      line-height: 50px;
      color: $texto;
      transition: all 0.3s ease;

      &:first-child {
        font-size: 20px;
      }
    }
  }

  /* Submenu */
  .submenu {
    padding-left: 0;
    display: none;
    list-style: none;

    /* Collapsed */
    &.show-as-floating-submenu {
      position: absolute;
      left: 100%;
      top: -10px;
      width: 200px;
      padding: 0 10px;
      border-radius: 6px;
      opacity: 0;
      pointer-events: none;
      display: block;
      background-color: #fff;
      box-shadow: 0px 10px 80px -10px rgba(44, 54, 92, 0.2);

      i {
        display: none;
      }

      .menu-item-name {
        display: block !important;
        padding-left: 10px;
      }
    }

    i:first-child {
      font-size: 10px !important;
    }
  }

  &:hover .submenu {
    top: 0;
    opacity: 1;
    pointer-events: auto;
    transition: all 0.3s ease;
  }
}
</style>
